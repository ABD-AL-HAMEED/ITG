<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['skillId'])) {
    $skillId = intval($_GET['skillId']);
    $stmt = $conn->prepare("SELECT * FROM skills WHERE id = ?");
    $stmt->bind_param("i", $skillId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $skill = $result->fetch_assoc();
        echo json_encode(["success" => true, "skill" => $skill]);
    } else {
        echo json_encode(["success" => false, "error" => "Skill not found"]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['skillId'])) {
    $skillId = intval($_POST['skillId']);
    $skillName = $_POST['skillName'] ?? '';
    $skillType = $_POST['skillType'] ?? '';
    $skillDescription = $_POST['skillDescription'] ?? '';

    if (empty($skillName) || empty($skillType) || empty($skillDescription)) {
        echo json_encode(["success" => false, "error" => "All fields are required"]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE skills SET name = ?, type = ?, description = ? WHERE id = ?");
    $stmt->bind_param("sssi", $skillName, $skillType, $skillDescription, $skillId);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to update skill"]);
    }
    exit;
}

echo json_encode(["success" => false, "error" => "Invalid request"]);
?>
