<?php
include 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $rating = isset($_POST['rating']) ? intval($_POST['rating']) : 0;
    $text = isset($_POST['reviewtext']) ? trim($_POST['reviewtext']) : '';

    if (empty($name) || empty($email) || empty($rating) || empty($text)) {
        http_response_code(400);
        echo "Error: All fields are required.";
        exit;
    }

    // Check if email exists in contacts
    $checkStmt = $conn->prepare("SELECT email FROM contacts WHERE email = ?");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows === 0) {
        http_response_code(403);
        echo "Error: Your email is not registered in contacts. Cannot submit review.";
        $checkStmt->close();
        $conn->close();
        exit;
    }
    $checkStmt->close();

    // Insert review with contact_email
    $stmt = $conn->prepare("INSERT INTO reviews (name, contact_email, rating, review_text) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $name, $email, $rating, $text);

    if ($stmt->execute()) {
        echo "Success: Review saved successfully.";
    } else {
        http_response_code(500);
        echo "Error: Could not save review. " . $stmt->error;
    }

    $stmt->close();
    $conn->close();

} else {
    http_response_code(403);
    echo "Access Denied";
}
?>
