<?php
require 'db.php'; // Update this path as needed

header('Content-Type: application/json');

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// Helper: Add/remove only changed skill links
function syncPositionSkills($conn, $positionId, $newSkillIds) {
    // Get current skills for this position
    $existing = [];
    $res = $conn->prepare("SELECT skill_id FROM position_skills WHERE position_id = ?");
    $res->bind_param("i", $positionId);
    $res->execute();
    $result = $res->get_result();
    while ($row = $result->fetch_assoc()) {
        $existing[] = (int)$row['skill_id'];
    }

    $newSkillIds = array_map('intval', $newSkillIds);

    // Skills to add and remove
    $toAdd = array_diff($newSkillIds, $existing);
    $toRemove = array_diff($existing, $newSkillIds);

    // Insert new ones
    if (!empty($toAdd)) {
        $stmt = $conn->prepare("INSERT INTO position_skills (position_id, skill_id) VALUES (?, ?)");
        foreach ($toAdd as $skillId) {
            $stmt->bind_param("ii", $positionId, $skillId);
            $stmt->execute();
        }
    }

    // Remove unselected ones
    if (!empty($toRemove)) {
        $stmt = $conn->prepare("DELETE FROM position_skills WHERE position_id = ? AND skill_id = ?");
        foreach ($toRemove as $skillId) {
            $stmt->bind_param("ii", $positionId, $skillId);
            $stmt->execute();
        }
    }
}

// Main router
switch ($action) {
    // CREATE POSITION
    case 'create':
        $name = trim($_POST['position_name'] ?? '');
        $desc = trim($_POST['description'] ?? '');
        $exp = trim($_POST['Required_Experience'] ?? '');
        $skills = explode(',', $_POST['skills'] ?? '');

        if (!$name) {
            echo json_encode(['error' => 'Position name is required']);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO positions (position_name, description, Required_Experience) VALUES (?, ?, ?)");
        $stmt->bind_param("ssi", $name, $desc, $exp);
        if ($stmt->execute()) {
            $newId = $stmt->insert_id;
            syncPositionSkills($conn, $newId, $skills);
            echo json_encode(['success' => true, 'id' => $newId]);
        } else {
            echo json_encode(['error' => 'Failed to create position']);
        }
        break;

    // UPDATE POSITION
    case 'update':
        $id = intval($_POST['id'] ?? 0);
        $name = trim($_POST['position_name'] ?? '');
        $desc = trim($_POST['description'] ?? '');
        $exp = trim($_POST['Required_Experience'] ?? '');
        $skills = explode(',', $_POST['skills'] ?? '');

        if (!$id || !$name) {
            echo json_encode(['error' => 'Missing position ID or name']);
            exit;
        }

        $stmt = $conn->prepare("UPDATE positions SET position_name = ?, description = ?, Required_Experience = ? WHERE id = ?");
        $stmt->bind_param("ssii", $name, $desc, $exp, $id);
        if ($stmt->execute()) {
            syncPositionSkills($conn, $id, $skills);
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Failed to update position']);
        }
        break;

    // DELETE POSITION
    case 'delete':
        $id = intval($_POST['id'] ?? 0);
        if (!$id) {
            echo json_encode(['error' => 'Missing position ID']);
            exit;
        }

        // Delete from position_skills first to avoid FK constraint issues
        $delSkills = $conn->prepare("DELETE FROM position_skills WHERE position_id = ?");
        $delSkills->bind_param("i", $id);
        $delSkills->execute();

        $stmt = $conn->prepare("DELETE FROM positions WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Failed to delete position']);
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid or missing action']);
        break;
}
