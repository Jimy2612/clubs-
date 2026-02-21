<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "clubs_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['email'] ?? '';
    $pass = $_POST['password'] ?? '';

    if ($email && $pass) {
        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if ($pass === $row['password']) {
                $message = "Login successful!";
            } else {
                $message = "Incorrect password!";
            }
        } else {
            $message = "User not found in database!";
        }

        $stmt->close();
    } else {
        $message = "Please enter email and password.";
    }
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WEBPHANTOM</title>  
        <link rel="stylesheet" href="style.css">
        </head>
<body>
<section>
   <div class="login-box">
     <form method="post">
        <h2>Login</h2>
             <?php if($message !== "") echo "<p style='color:white;'>$message</p>"; ?>
   <div class="input-box">
     <span class="icon">
       <ion-icon name="mail-outline"></ion-icon>
         </span>
        <input type="email" name="email" required>
      <label>Email</label>
    </div>
        <div class="input-box">
            <span class="icon">
         <ion-icon name="lock-closed-outline"></ion-icon>
          </span>
    <input type="password" name="password" required>
      <label>Password</label>
    </div>
         <div class="remember-forgot">
            <label><input type="checkbox">Remember me</label>
              <a href="#">Forgot Password?</a>
    </div>
       <button type="submit">Login</button>
<div class="register-link">
   <p>Don't have an account <a href="#">Register</a></p>
</div> 
  </form>
  </div>
</section>
<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
</body>
</html>