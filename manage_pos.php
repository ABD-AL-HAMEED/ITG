<?php
require 'db.php'; // Adjust to your actual DB connection file

header('Content-Type: application/json');

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {

    // CREATE
    case 'create':
        $name = trim($_POST['position_name'] ?? '');
        $desc = trim($_POST['description'] ?? '');
        $exp = trim($_POST['Required_Experience'] ?? '');

        if (!$name) {
            echo json_encode(['error' => 'Position name is required']);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO positions (position_name, description, Required_Experience) VALUES (?, ?, ?)");
        $stmt->bind_param("ssi", $name, $desc, $exp);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
        } else {
            echo json_encode(['error' => 'Failed to create position']);
        }
        break;

    // UPDATE
    case 'update':
        $id = intval($_POST['id'] ?? 0);
        $name = trim($_POST['position_name'] ?? '');
        $desc = trim($_POST['description'] ?? '');
        $exp = trim($_POST['Required_Experience'] ?? '');

        if (!$id || !$name) {
            echo json_encode(['error' => 'Missing ID or name']);
            exit;
        }

        $stmt = $conn->prepare("UPDATE positions SET position_name = ?, description = ?, Required_Experience = ? WHERE id = ?");
        $stmt->bind_param("ssii", $name, $desc, $exp, $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Failed to update position']);
        }
        break;

    // DELETE
    case 'delete':
        $id = intval($_POST['id'] ?? 0);
        if (!$id) {
            echo json_encode(['error' => 'Missing position ID']);
            exit;
        }

        $stmt = $conn->prepare("DELETE FROM positions WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Failed to delete position']);
        }
        break;

    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}
