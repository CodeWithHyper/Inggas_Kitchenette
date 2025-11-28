<?php
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $service = $_POST['service'];
    $date = $_POST['date'];
    $requests = $_POST['requests'];

    // Adjusted column names to match your table
    $stmt = $conn->prepare("INSERT INTO contacts (client_name, email, PhoneNumber, Services, event_date, Request) VALUES (?, ?, ?, ?, ?, ?)");

    
    $stmt->bind_param("ssssss", $name, $email, $phone, $service, $date, $requests);

    if ($stmt->execute()) {
        echo "<script>alert('Thank you! Your booking request has been saved.'); window.location.href='index.html';</script>";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
