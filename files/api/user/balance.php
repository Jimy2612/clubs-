<?php
require_once '../config/db.php';
$conn = getDB();
$user = requireAuth($conn);
echo json_encode(['success'=>true, 'balance'=>(float)$user['balance']]);
?>