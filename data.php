<?php
include 'db.php'; // Ensure database connection is established

$response = ["positions" => [], "positionSkills" => [], "candidates" => [], "skills" => []];

header('Content-Type: application/json'); // Set response type

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'getSkills':
        $skillsQuery = "SELECT id, skill_name, type, description FROM skills";
        $skillsResult = mysqli_query($conn, $skillsQuery);

        if ($skillsResult) {
            while ($row = mysqli_fetch_assoc($skillsResult)) {
                $response["skills"][] = [
                    "id" => $row["id"],
                    "skill_name" => $row["skill_name"],
                    "type" => $row["type"],
                    "description" => $row["description"]
                ];
            }
        } else {
            $response["error"] = "Failed to fetch skills: " . mysqli_error($conn);
        }
        break;

    // Fetch a single skill by ID
    case 'getSkill':
        $skillId = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $skillQuery = "SELECT id, skill_name, type, description FROM skills WHERE id = $skillId";
        $skillResult = mysqli_query($conn, $skillQuery);

        if ($skillResult && $row = mysqli_fetch_assoc($skillResult)) {
            echo json_encode($row);
            exit;
        } else {
            echo json_encode(["error" => "Skill not found"]);
            exit;
        }
        break;

    // Add a new skill (Now Includes Description)
    case 'addSkill':
        $skillName = isset($_POST['skillName']) ? $_POST['skillName'] : '';
        $skillType = isset($_POST['skillType']) ? $_POST['skillType'] : '';
        $skillDesc = isset($_POST['skillDesc']) ? $_POST['skillDesc'] : '';

        // Escape strings to prevent SQL injection
        $skillName = mysqli_real_escape_string($conn, $skillName);
        $skillType = mysqli_real_escape_string($conn, $skillType);
        $skillDesc = mysqli_real_escape_string($conn, $skillDesc);

        $addSkillQuery = "INSERT INTO skills (skill_name, type, description) VALUES ('$skillName', '$skillType', '$skillDesc')";
        if (mysqli_query($conn, $addSkillQuery)) {
            $response["success"] = true;
        } else {
            $response["error"] = "Failed to add skill: " . mysqli_error($conn);
        }
        break;

    // Update an existing skill (Now Includes Description)
    case 'updateSkill':
        $skillId = isset($_GET['id']) ? intval($_GET['id']) : 0;
        $skillName = isset($_POST['skillName']) ? $_POST['skillName'] : '';
        $skillType = isset($_POST['skillType']) ? $_POST['skillType'] : '';
        $skillDesc = isset($_POST['skillDesc']) ? $_POST['skillDesc'] : '';

        // Escape strings
        $skillName = mysqli_real_escape_string($conn, $skillName);
        $skillType = mysqli_real_escape_string($conn, $skillType);
        $skillDesc = mysqli_real_escape_string($conn, $skillDesc);

        $updateSkillQuery = "UPDATE skills SET skill_name = '$skillName', type = '$skillType', description = '$skillDesc' WHERE id = $skillId";
        if (mysqli_query($conn, $updateSkillQuery)) {
            $response["success"] = true;
        } else {
            $response["error"] = "Failed to update skill: " . mysqli_error($conn);
        }
        break;

    // Delete a skill
    case 'deleteSkill':
        $skillId = isset($_GET['id']) ? intval($_GET['id']) : 0;    
            if ($skillId > 0) {
                $stmt = $conn->prepare("DELETE FROM skills WHERE id = ?");
                $stmt->bind_param("id", $skillId);
    
                if ($stmt->execute()) {
                    $response["success"] = true;
                } else {
                    $response["error"] = "Failed to delete skill: " . $stmt->error;
                }
    
                $stmt->close();
            } else {
                $response["error"] = "Invalid skill ID.";
            }
        
        break;
    

    default:
        // Fetch other data if no action is specified (e.g., dashboard data)
        $positionsQuery = "SELECT id, position_name FROM positions";
        $positionsResult = mysqli_query($conn, $positionsQuery);

        if ($positionsResult) {
            while ($row = mysqli_fetch_assoc($positionsResult)) {
                $response["positions"][$row["id"]] = $row["position_name"];
            }
        } else {
            $response["error"] = "Failed to fetch positions: " . mysqli_error($conn);
        }

        $candidatesQuery = "SELECT id, first_name, last_name, email, phone, resume_path FROM candidates";
        $candidatesResult = mysqli_query($conn, $candidatesQuery);

        if ($candidatesResult) {
            while ($row = mysqli_fetch_assoc($candidatesResult)) {
                $response["candidates"][] = [
                    "id" => $row["id"],
                    "first_name" => $row["first_name"],
                    "last_name" => $row["last_name"],
                    "email" => $row["email"],
                    "phone" => $row["phone"],
                    "resume_path" => $row["resume_path"]
                ];
            }
        } else {
            $response["error"] = "Failed to fetch candidates: " . mysqli_error($conn);
        }
        break;
}

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>