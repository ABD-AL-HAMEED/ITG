<?php
require 'db.php'; // adjust path as needed

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $candidateId = $_POST['candidateId'] ?? null;
    $isFavorite = $_POST['is_favorite'] ?? null;

    if (!$candidateId || !isset($isFavorite)) {
        echo json_encode(['error' => 'Missing required data']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE candidates SET is_favorite = ? WHERE id = ?");
    $stmt->bind_param("ii", $isFavorite, $candidateId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Database update failed']);
    }
}
