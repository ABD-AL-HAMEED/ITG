<?php
include 'db.php'; 

header('Content-Type: application/json'); 

$response = ["positions" => [], "positionSkills" => []];


$positionsQuery = "SELECT id, position_name FROM positions";
$positionsResult = mysqli_query($conn, $positionsQuery);

if ($positionsResult) {
    while ($row = mysqli_fetch_assoc($positionsResult)) {
        $response["positions"][$row["id"]] = $row["position_name"];
    }
} else {
    echo json_encode(["error" => "Failed to fetch positions"]);
    exit;
}


$skillsQuery = "SELECT s.skill_name, s.type, p.position_name 
                FROM skills s
                JOIN position_skills ps ON s.id = ps.skill_id
                JOIN positions p ON ps.position_id = p.id";

$skillsResult = mysqli_query($conn, $skillsQuery);

if ($skillsResult) {
    while ($row = mysqli_fetch_assoc($skillsResult)) {
        $response["positionSkills"][$row["position_name"]][] = [
            "name" => $row["skill_name"],
            "type" => $row["type"]
        ];
    }
} else {
    echo json_encode(["error" => "Failed to fetch skills"]);
    exit;
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>

