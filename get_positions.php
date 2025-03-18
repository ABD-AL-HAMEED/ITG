<?php
include 'db.php';

// If a specific position is requested, return its description
if (isset($_GET['position_name'])) {
    $position_name = $conn->real_escape_string($_GET['position_name']);
    $query = "SELECT description FROM positions WHERE position_name = '$position_name' LIMIT 1";
    $result = $conn->query($query);

    if ($result && $row = $result->fetch_assoc()) {
        echo json_encode(["description" => $row['description']]);
    } else {
        echo json_encode(["description" => "No description available."]);
    }
    exit; // Stop execution here
}

// Otherwise, return the list of positions
$result = $conn->query("SELECT DISTINCT position_name FROM positions");

$options = "";
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $options .= "<option value='" . htmlspecialchars($row['position_name'], ENT_QUOTES, 'UTF-8') . "'>" . htmlspecialchars($row['position_name'], ENT_QUOTES, 'UTF-8') . "</option>";
    }
} else {
    $options = "<option value=''>No positions available</option>";
}

echo $options;
?>