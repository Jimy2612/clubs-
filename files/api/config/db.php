<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');          // XAMPP default is empty
define('DB_NAME', 'betmaster_db');

function getDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        die(json_encode(['success' => false, 'message' => 'DB connection failed']));
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}

function getToken() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? '';
    return str_replace('Bearer ', '', $auth);
}

function getUserByToken($conn) {
    $token = getDB_token();  
    if (!$token) return null;
    $token = getToken();
    $stmt = $conn->prepare("SELECT u.* FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > NOW()");
    $stmt->bind_param('s', $token);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function requireAuth($conn) {
    $token = getToken();
    if (!$token) { http_response_code(401); die(json_encode(['success'=>false,'message'=>'Unauthorized'])); }
    $stmt = $conn->prepare("SELECT u.* FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.token = ? AND s.expires_at > NOW()");
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $user = $stmt->get_result()->fetch_assoc();
    if (!$user) { http_response_code(401); die(json_encode(['success'=>false,'message'=>'Session expired. Login again.'])); }
    return $user;
}
?>