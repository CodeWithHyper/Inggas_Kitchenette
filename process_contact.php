<?php
include 'db_connect.php';
require __DIR__ . '/vendor/autoload.php'; // make sure vendor/ is in project root

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load environment variables from .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Retrieve SMTP credentials from .env
$smtpUser = $_ENV['SMTP_USER'];
$smtpPass = $_ENV['SMTP_PASS'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Retrieve all POST fields
    $name = $_POST['name'];
    $email = $_POST['email'];

    // Build email body automatically
    $message = "<h2>Booking Request Details</h2>";
    foreach ($_POST as $key => $value) {
        $label = ucwords(str_replace("_", " ", $key));
        $message .= "<b>{$label}:</b> {$value}<br>";
    }

    // Insert into database
    $stmt = $conn->prepare("INSERT INTO contacts (client_name, email, PhoneNumber, Services, event_date, Request) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $_POST['name'], $_POST['email'], $_POST['phone'], $_POST['service'], $_POST['date'], $_POST['requests']);

    if ($stmt->execute()) {

        // -------------------------
        // SEND EMAIL via PHPMailer
        // -------------------------
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = $smtpUser; // From .env
            $mail->Password = $smtpPass; // From .env
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            // Recipient
            $mail->setFrom($smtpUser, 'Booking Notification');
            $mail->addAddress($email, $name);

            // Email content
            $mail->isHTML(true);
            $mail->Subject = 'Your Booking Request Confirmation';
            $mail->Body = $message;

            $mail->send();

            echo "<script>alert('Booking saved and email sent successfully!'); window.location.href='index.html';</script>";

        } catch (Exception $e) {
            echo "<script>alert('Booking saved, but email failed: {$mail->ErrorInfo}'); window.location.href='index.html';</script>";
        }

    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
