<?php
include 'db.php'; // Database connection

header('Content-Type: application/json'); // Return JSON format

// Fetch positions
$positionsQuery = "SELECT id, position_name FROM positions";
$positionsResult = mysqli_query($conn, $positionsQuery);
$positions = [];
while ($row = mysqli_fetch_assoc($positionsResult)) {
    $positions[$row['id']] = $row['position_name'];
}

// Fetch skills related to positions
$skillsQuery = "SELECT s.skill_name, p.position_name 
                FROM skills s
                JOIN position_skills ps ON s.id = ps.skill_id
                JOIN positions p ON ps.position_id = p.id";
$skillsResult = mysqli_query($conn, $skillsQuery);
$positionSkills = [];

while ($row = mysqli_fetch_assoc($skillsResult)) {
    $positionSkills[$row['position_name']][] = $row['skill_name'];
}

// Prepare response
$response = [
    "positions" => $positions,
    "positionSkills" => $positionSkills
];


echo json_encode($response, JSON_PRETTY_PRINT);
?>
