<?php
include 'db_connect.php';

// Get the 'email' parameter from the URL query string (GET request) and trim whitespace
$email = isset($_GET['email']) ? trim($_GET['email']) : '';

// Initialize the response array; default is 'exists' = false
$response = ['exists' => false];

if ($email) {
    $stmt = $conn->prepare("SELECT email FROM contacts WHERE email = ?"); //Prepares a SQL query to check if email exists
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    
    //Checks if any email is found
    if ($stmt->num_rows > 0) {
        $response['exists'] = true;
    }
    $stmt->close();
}

// Return the response as JSON (so JS can read it easily)
echo json_encode($response);
$conn->close();
?>
