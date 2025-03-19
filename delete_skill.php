<?php
require 'db.php'; // Ensure this connects to the database

header('Content-Type: application/json');

// Debugging: Check if POST data exists
$input_data = file_get_contents("php://input");
parse_str($input_data, $_POST);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['id']) || empty($_POST['id'])) {
        echo json_encode([
            "success" => false,
            "error" => "Missing skill ID",
            "received_data" => $_POST, // Debugging info
            "raw_input" => $input_data  // Debugging raw input
        ]);
        exit;
    }

    $skillId = intval($_POST['id']); // Sanitize input

    // Prepare the delete query
    $stmt = $conn->prepare("DELETE FROM skills WHERE id = ?");
    $stmt->bind_param("i", $skillId);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to delete skill"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid request method"]);
}
?>
