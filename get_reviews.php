<?php
include 'db_connect.php';

// Set header to return JSON (so JavaScript understands it)
header('Content-Type: application/json');

// Select reviews, newest first
$sql = "SELECT name, rating, review_text, created_at FROM reviews ORDER BY created_at DESC";
$result = $conn->query($sql);

$reviews = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }
}

// Output the data as JSON
echo json_encode($reviews);

$conn->close();
?>