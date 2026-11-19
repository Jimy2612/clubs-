<?php
require_once '../config/db.php';

$conn = getDB();
if (!$conn) {
    http_response_code(500);
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    $conn->close();
    die(json_encode(['success' => false, 'message' => 'Invalid JSON payload']));
}

$name  = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$pin   = trim($data['pin'] ?? '');

// Validate inputs
if (!$name || !$phone || !$pin) {
    $conn->close();
    die(json_encode(['success' => false, 'message' => 'All fields required']));
}
if (!preg_match('/^07\d{8}$/', $phone)) {
    $conn->close();
    die(json_encode(['success' => false, 'message' => 'Invalid phone number']));
}
if (strlen($pin) !== 4 || !ctype_digit($pin)) {
    $conn->close();
    die(json_encode(['success' => false, 'message' => 'PIN must be 4 digits']));
}

// Check if phone exists
$stmt = $conn->prepare("SELECT id FROM users WHERE phone = ?");
$stmt->bind_param('s', $phone);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    $stmt->close();
    $conn->close();
    die(json_encode(['success' => false, 'message' => 'Phone number already registered']));
}
$stmt->close();

// Use a database transaction so user, bonus, and session succeed or fail together
$conn->begin_transaction();

try {
    // 1. Create user with welcome bonus
    $hashedPin = password_hash($pin, PASSWORD_BCRYPT);
    $bonus = 50.00;
    $stmt = $conn->prepare("INSERT INTO users (name, phone, pin, balance) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('sssd', $name, $phone, $hashedPin, $bonus);
    if (!$stmt->execute()) {
        throw new Exception('Failed to create user');
    }
    $userId = $conn->insert_id;
    $stmt->close();

    // 2. Log welcome bonus transaction
    $stmt = $conn->prepare("INSERT INTO transactions (user_id, type, amount, direction, method, reference) VALUES (?, 'bonus', ?, 'credit', 'system', 'WELCOME_BONUS')");
    $stmt->bind_param('id', $userId, $bonus);
    if (!$stmt->execute()) {
        throw new Exception('Failed to log welcome bonus');
    }
    $stmt->close();

    // 3. Create session token
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+30 days'));
    $stmt = $conn->prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)");
    $stmt->bind_param('iss', $userId, $token, $expires);
    if (!$stmt->execute()) {
        throw new Exception('Failed to create session');
    }
    $stmt->close();

    $conn->commit();
    $conn->close();

    echo json_encode([
        'success' => true,
        'token'   => $token,
        'user'    => ['id' => $userId, 'name' => $name, 'phone' => $phone],
        'message' => 'Account created! KES 50 welcome bonus added.'
    ]);
} catch (Exception $e) {
    $conn->rollback();
    $conn->close();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Registration failed, please try again']);
}
?>
