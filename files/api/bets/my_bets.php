<?php
require_once '../config/db.php';
$conn = getDB();
$user = requireAuth($conn);

$stmt = $conn->prepare("SELECT b.*, GROUP_CONCAT(bs.pick_label, ' @ ', bs.odd SEPARATOR ' | ') as picks, GROUP_CONCAT(bs.match_name SEPARATOR ' | ') as matches FROM bets b LEFT JOIN bet_selections bs ON b.id = bs.bet_id WHERE b.user_id = ? GROUP BY b.id ORDER BY b.placed_at DESC LIMIT 50");
$stmt->bind_param('i', $user['id']);
$stmt->execute();
$bets = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

echo json_encode(['success'=>true, 'bets'=>$bets]);
?>