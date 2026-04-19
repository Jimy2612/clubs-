<?php
require_once '../config/db.php';
$conn = getDB();
$data = json_decode(file_get_contents('php://input'), true);

$phone = trim($data['phone'] ?? '');
$pin   = trim($data['pin'] ?? '');

if (!$phone || !$pin)
    die(json_encode(['success'=>false,'message'=>'Phone and PIN required']));

$stmt = $conn->prepare("SELECT * FROM users WHERE phone = ? AND status = 'active'");
$stmt->bind_param('s', $phone);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user || !password_verify($pin, $user['pin']))
    die(json_encode(['success'=>false,'message'=>'Wrong phone or PIN']));

// Delete old sessions, create new
$stmt = $conn->prepare("DELETE FROM sessions WHERE user_id = ?");
$stmt->bind_param('i', $user['id']);
$stmt->execute();

$token = bin2hex(random_bytes(32));
$expires = date('Y-m-d H:i:s', strtotime('+30 days'));
$stmt = $conn->prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)");
$stmt->bind_param('iss', $user['id'], $token, $expires);
$stmt->execute();

echo json_encode([
    'success' => true,
    'token'   => $token,
    'user'    => ['id'=>$user['id'], 'name'=>$user['name'], 'phone'=>$user['phone']],
    'balance' => (float)$user['balance']
]);
?>