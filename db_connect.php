<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "webproject";
$port = 3307;

$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    error_log("DB Error: " . $conn->connect_error); 
    die("Oops! Something went wrong with the database.");
}

// echo "Connected successfully!";  
?>
