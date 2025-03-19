<<<<<<< HEAD
<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["oldSkill"], $_POST["newSkill"])) {
    $oldSkill = trim($_POST["oldSkill"]);
    $newSkill = trim($_POST["newSkill"]);

    if (!empty($oldSkill) && !empty($newSkill)) {
        $stmt = $conn->prepare("UPDATE skills SET name = ? WHERE name = ?");
        $stmt->bind_param("ss", $newSkill, $oldSkill);
        $success = $stmt->execute();
        $stmt->close();

        echo json_encode(["success" => $success]);
    } else {
        echo json_encode(["success" => false, "error" => "Skill names cannot be empty."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request."]);
}
?>
=======
<?php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["oldSkill"], $_POST["newSkill"])) {
    $oldSkill = trim($_POST["oldSkill"]);
    $newSkill = trim($_POST["newSkill"]);

    if (!empty($oldSkill) && !empty($newSkill)) {
        $stmt = $conn->prepare("UPDATE skills SET name = ? WHERE name = ?");
        $stmt->bind_param("ss", $newSkill, $oldSkill);
        $success = $stmt->execute();
        $stmt->close();

        echo json_encode(["success" => $success]);
    } else {
        echo json_encode(["success" => false, "error" => "Skill names cannot be empty."]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request."]);
}
?>
>>>>>>> 3d46757b58c0490967102afb2936026d8590b8d5
