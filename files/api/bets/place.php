<?php
require_once '../config/db.php';
$conn = getDB();
$user = requireAuth($conn);
$data = json_decode(file_get_contents('php://input'), true);

$stake      = (float)($data['stake'] ?? 0);
$totalOdds  = (float)($data['totalOdds'] ?? 0);
$potential  = (float)($data['potential'] ?? 0);
$selections = $data['selections'] ?? [];

if ($stake < 10)   die(json_encode(['success'=>false,'message'=>'Minimum stake is KES 10']));
if (empty($selections)) die(json_encode(['success'=>false,'message'=>'No selections']));
if ($user['balance'] < $stake) die(json_encode(['success'=>false,'message'=>'Insufficient balance']));

$betCode = 'BET' . strtoupper(bin2hex(random_bytes(4)));

$conn->begin_transaction();
try {
    // Insert bet
    $stmt = $conn->prepare("INSERT INTO bets (user_id, bet_code, stake, total_odds, potential_win) VALUES (?,?,?,?,?)");
    $stmt->bind_param('isddd', $user['id'], $betCode, $stake, $totalOdds, $potential);
    $stmt->execute();
    $betId = $conn->insert_id;

    // Insert selections
    foreach ($selections as $sel) {
        $stmt = $conn->prepare("INSERT INTO bet_selections (bet_id, match_id, match_name, league, pick, pick_label, odd) VALUES (?,?,?,?,?,?,?)");
        $stmt->bind_param('isssssd', $betId, $sel['matchId'], $sel['matchName'], $sel['league'], $sel['pick'], $sel['label'], $sel['odd']);
        $stmt->execute();
    }

    // Deduct balance
    $stmt = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
    $stmt->bind_param('di', $stake, $user['id']);
    $stmt->execute();

    // Log transaction
    $stmt = $conn->prepare("INSERT INTO transactions (user_id, type, amount, direction, method, reference) VALUES (?,'bet',?,'debit','betting',?)");
    $stmt->bind_param('ids', $user['id'], $stake, $betCode);
    $stmt->execute();

    $conn->commit();
    echo json_encode(['success'=>true,'betId'=>$betCode,'message'=>'Bet placed!']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success'=>false,'message'=>'Bet failed: '.$e->getMessage()]);
}
?>