<?php
include 'db.php'; // Ensure database connection is established

header('Content-Type: application/json'); // Set response type

$response = [];

// Fetch all table names in the database
$tablesQuery = "SHOW TABLES";
$tablesResult = mysqli_query($conn, $tablesQuery);

if ($tablesResult) {
    while ($tableRow = mysqli_fetch_array($tablesResult)) {
        $tableName = $tableRow[0];
        $response[$tableName] = [];

        // Fetch all data from each table
        $dataQuery = "SELECT * FROM `$tableName`";
        $dataResult = mysqli_query($conn, $dataQuery);

        if ($dataResult) {
            while ($row = mysqli_fetch_assoc($dataResult)) {
                $response[$tableName][] = $row;
            }
        } else {
            $response["error"]["$tableName"] = mysqli_error($conn);
        }
    }
} else {
    $response["error"]["database"] = mysqli_error($conn);
}

// Output JSON response
echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>