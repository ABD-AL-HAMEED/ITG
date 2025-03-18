<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["skill"])) {
    $skill = trim($_POST["skill"]);

    if (!empty($skill)) {
        $stmt = $conn->prepare("INSERT INTO skills (name) VALUES (?)");
        $stmt->bind_param("s", $skill);
        $success = $stmt->execute();
        $stmt->close();

        echo json_encode(["success" => $success]);
    } else {
        echo json_encode(["success" => false, "error" => "Skill name cannot be empty."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request."]);
}
?>
