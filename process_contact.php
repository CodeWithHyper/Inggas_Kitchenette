<?php
include 'db_connect.php';
require __DIR__ . '/vendor/autoload.php'; 

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load environment variables from .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Retrieve SMTP credentials from .env
$smtpUser = $_ENV['SMTP_USER'];
$smtpPass = $_ENV['SMTP_PASS'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Retrieve fields
    $name = $_POST['name'];
    $email = $_POST['email'];

    // --- 1. PREPARE EMAIL CONTENT ---
    $emailBody = "
    <!DOCTYPE html>
    <html>
    <head>
    <style>
        body { margin: 0; padding: 0; background-color: #FDF7E4; font-family: 'Arial', sans-serif; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #eee; }
        .header { background-color: #d51500; color: #ffffff; padding: 25px; text-align: center; }
        .header h1 { margin: 0; font-family: 'Georgia', serif; font-size: 24px; letter-spacing: 1px; }
        .content { padding: 30px; color: #333333; line-height: 1.6; }
        .content h2 { color: #d51500; font-family: 'Georgia', serif; border-bottom: 2px solid #FDF7E4; padding-bottom: 10px; margin-top: 0; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .details-table td { padding: 12px; border-bottom: 1px solid #f0f0f0; }
        .label-col { font-weight: bold; color: #555; width: 35%; background-color: #fafafa; }
        .footer { background-color: #1a1a1a; color: #cccccc; padding: 20px; text-align: center; font-size: 12px; }
        .btn { display: inline-block; background-color: #d51500; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }
    </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Ingga's Kitchenette</h1>
                <p style='margin: 5px 0 0; font-size: 14px; opacity: 0.9;'>Celebrate Life with Exquisite Flavors</p>
            </div>

            <div class='content'>
                <h2>Booking Request Received</h2>
                <p>Hello <b>{$name}</b>,</p>
                <p>Thank you for reaching out to us! We have received your request for a personalized quote. Here are the details you submitted:</p>

                <table class='details-table'>";

    // Loop through POST data to build table rows
    foreach ($_POST as $key => $value) {
        // Skip empty fields or technical keys if necessary
        if ($value == "") continue;
        
        $label = ucwords(str_replace("_", " ", $key));
        $emailBody .= "
        <tr>
            <td class='label-col'>{$label}</td>
            <td>{$value}</td>
        </tr>";
    }

    $emailBody .= "
                </table>
                <p>We will review your request and contact you shortly at <a href='mailto:{$email}' style='color: #d51500;'>{$email}</a>.</p>
                <br>
                <div style='text-align: center;'>
                    <a href='#' class='btn'>Visit Our Website</a>
                </div>
            </div>

            <div class='footer'>
                <p>&copy; " . date("Y") . " Ingga's Kitchenette. All Rights Reserved.</p>
                <p>Angel Linao Street, Paco Manila, Metro Manila</p>
            </div>
        </div>
    </body>
    </html>";


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
            $mail->setFrom($smtpUser, 'Ingga\'s Kitchenette'); // Updated Sender Name
            $mail->addAddress($email, $name);

            // Email content
            $mail->isHTML(true);
            $mail->Subject = 'Booking Confirmation - Ingga\'s Kitchenette';
            $mail->Body = $emailBody; // Use the designed variable

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