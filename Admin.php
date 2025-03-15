<?php
include 'db.php'; // Database connection

// Fetch positions
$positionsQuery = "SELECT id, Name FROM Positions";
$positionsResult = mysqli_query($conn, $positionsQuery);
$positions = [];
while ($row = mysqli_fetch_assoc($positionsResult)) {
    $positions[$row['id']] = $row['position_name'];
}
// test 1

// Fetch skills related to positions
$skillsQuery = "SELECT s.Name as skill_name, p.Name as position_name, s.Category 
                FROM Skills s
                JOIN Position_Skills ps ON s.id = ps.skill_id
                JOIN Positions p ON ps.position_id = p.id";
$skillsResult = mysqli_query($conn, $skillsQuery);
$positionSkills = [];

while ($row = mysqli_fetch_assoc($skillsResult)) {
    $category = strtolower($row['Category']); // Ensure lowercase
    $positionSkills[$row['position_name']][$category][] = $row['skill_name'];
}
?>

<script>
    // Make sure positionSkills is defined globally in JavaScript
    let positionSkills = <?php echo json_encode($positionSkills); ?>;
    console.log("Loaded positionSkills:", positionSkills);
</script>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="sidebar">
        <div class="logo-container">
            <img src="ITG_logo_2x.png" alt="Company Logo">
        </div>
        <h2 style="text-align:center;">Admin Panel</h2>
        <a href="#" onclick="navigate('dashboard')"><i class="fa fa-home"></i> Dashboard</a>
        <a href="#" onclick="navigate('candidates')"><i class="fa fa-users"></i> Candidates</a>
        <a href="#" onclick="navigate('skills')"><i class="fa fa-tools"></i> Modify Skills</a>
        <a href="#" onclick="navigate('positions')"><i class="fa fa-briefcase"></i> Available Positions</a>
    </div>
    <div class="content">
        <h1>Admin Dashboard</h1>
        <div class="card" id="content-area">
            <h2>Overview</h2>
            <p>Manage candidates and applications easily from this panel.</p>
        </div>
    </div>
    <script src="main.js"></script>
    <script src="navigation.js"></script>
    <script src="setup.js"></script>
    <script src="skills.js"></script>
    <script src="candidates.js"></script>
    <script src="addSkill.js"></script>

</body>

</html>