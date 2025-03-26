<?php
include 'db.php';
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get raw input for debugging
    $raw_input = file_get_contents("php://input");
    parse_str($raw_input, $received_data); // Convert raw input into an associative array

    // Extract skillId safely
    $skillId = isset($_POST['skillId']) ? $_POST['skillId'] : (isset($received_data['skillId']) ? $received_data['skillId'] : null);

    if (!$skillId) {
        echo json_encode([
            "success" => false,
            "error" => "Missing skill ID",
            "received_data" => $received_data,
            "raw_input" => $raw_input
        ]);
        exit;
    }

    // Database connection (Assume db.php is included)
    require_once "db.php";

    $stmt = $conn->prepare("DELETE FROM skills WHERE id = ?");
    $stmt->bind_param("i", $skillId);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Database error"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid request"]);
}
?>
