<?php
require_once '../config/db.php';
$conn = getDB();
$data = json_decode(file_get_contents('php://input'), true);

$name  = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$pin   = trim($data['pin'] ?? '');

// Validate
if (!$name || !$phone || !$pin)
    die(json_encode(['success'=>false,'message'=>'All fields required']));
if (!preg_match('/^07\d{8}$/', $phone))
    die(json_encode(['success'=>false,'message'=>'Invalid phone number']));
if (strlen($pin) !== 4 || !ctype_digit($pin))
    die(json_encode(['success'=>false,'message'=>'PIN must be 4 digits']));

// Check if phone exists
$stmt = $conn->prepare("SELECT id FROM users WHERE phone = ?");
$stmt->bind_param('s', $phone);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0)
    die(json_encode(['success'=>false,'message'=>'Phone number already registered']));

// Create user with welcome bonus
$hashedPin = password_hash($pin, PASSWORD_BCRYPT);
$bonus = 50.00;
$stmt = $conn->prepare("INSERT INTO users (name, phone, pin, balance) VALUES (?, ?, ?, ?)");
$stmt->bind_param('sssd', $name, $phone, $hashedPin, $bonus);
$stmt->execute();
$userId = $conn->insert_id;

// Log welcome bonus transaction
$stmt = $conn->prepare("INSERT INTO transactions (user_id, type, amount, direction, method, reference) VALUES (?, 'bonus', ?, 'credit', 'system', 'WELCOME_BONUS')");
$stmt->bind_param('id', $userId, $bonus);
$stmt->execute();

// Create session token
$token = bin2hex(random_bytes(32));
$expires = date('Y-m-d H:i:s', strtotime('+30 days'));
$stmt = $conn->prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)");
$stmt->bind_param('iss', $userId, $token, $expires);
$stmt->execute();

echo json_encode([
    'success' => true,
    'token'   => $token,
    'user'    => ['id' => $userId, 'name' => $name, 'phone' => $phone],
    'message' => 'Account created! KES 50 welcome bonus added.'
]);
?>