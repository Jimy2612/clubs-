<?php
require_once '../config/db.php';
$conn = getDB();
$user = requireAuth($conn);
$data = json_decode(file_get_contents('php://input'), true);

$amount = (float)($data['amount'] ?? 0);
$phone  = trim($data['phone'] ?? '');

if ($amount < 100)            die(json_encode(['success'=>false,'message'=>'Minimum withdrawal KES 100']));
if ($user['balance'] < $amount) die(json_encode(['success'=>false,'message'=>'Insufficient balance']));

$ref = 'WD' . strtoupper(bin2hex(random_bytes(4)));

$stmt = $conn->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
$stmt->bind_param('di', $amount, $user['id']);
$stmt->execute();

$stmt = $conn->prepare("INSERT INTO transactions (user_id, type, amount, direction, method, reference) VALUES (?,'withdrawal',?,'debit','mpesa',?)");
$stmt->bind_param('ids', $user['id'], $amount, $ref);
$stmt->execute();

echo json_encode(['success'=>true,'message'=>"KES $amount will be sent to $phone",'reference'=>$ref]);
?>