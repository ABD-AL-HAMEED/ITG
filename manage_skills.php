<?php
require 'db.php'; // Adjust path to your DB connection

header('Content-Type: application/json');

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// 🛠 Helper: Validate basic inputs
function validateSkillInput($name, $type, $desc) {
    return !(empty($name) || empty($type) || empty($desc));
}

switch ($action) {
    // ✅ CREATE SKILL
    case 'create':
        $name = trim($_POST['skill_name'] ?? '');
        $type = trim($_POST['skill_type'] ?? '');
        $desc = trim($_POST['skill_description'] ?? '');

        if (!validateSkillInput($name, $type, $desc)) {
            echo json_encode(['success' => false, 'error' => 'All fields are required']);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO skills (skill_name, type, Description) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $name, $type, $desc);

        echo json_encode($stmt->execute()
            ? ['success' => true, 'id' => $stmt->insert_id]
            : ['success' => false, 'error' => 'Failed to add skill']);
        break;

    // ✅ GET SKILL BY ID
    case 'get':
        $id = intval($_GET['skillId'] ?? 0);
        $stmt = $conn->prepare("SELECT * FROM skills WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        echo $result->num_rows > 0
            ? json_encode(['success' => true, 'skill' => $result->fetch_assoc()])
            : json_encode(['success' => false, 'error' => 'Skill not found']);
        break;

    // ✅ UPDATE SKILL
    case 'update':
        $id = intval($_POST['skill_id'] ?? 0);
        $name = trim($_POST['skill_name'] ?? '');
        $type = trim($_POST['skill_type'] ?? '');
        $desc = trim($_POST['skill_description'] ?? '');

        if (!$id || !validateSkillInput($name, $type, $desc)) {
            echo json_encode(['success' => false, 'error' => 'Missing or invalid fields']);
            exit;
        }

        $stmt = $conn->prepare("UPDATE skills SET skill_name = ?, type = ?, Description = ? WHERE id = ?");
        $stmt->bind_param("sssi", $name, $type, $desc, $id);

        echo json_encode($stmt->execute()
            ? ['success' => true]
            : ['success' => false, 'error' => 'Failed to update skill']);
        break;

    // ✅ DELETE SKILL
    case 'delete':
        $id = intval($_POST['skill_id'] ?? 0);
        if (!$id) {
            echo json_encode(['success' => false, 'error' => 'Missing skill ID']);
            exit;
        }

        $stmt = $conn->prepare("DELETE FROM skills WHERE id = ?");
        $stmt->bind_param("i", $id);

        echo json_encode($stmt->execute()
            ? ['success' => true]
            : ['success' => false, 'error' => 'Failed to delete skill']);
        break;

    default:
        echo json_encode(['success' => false, 'error' => 'Invalid or missing action']);
        break;
}
