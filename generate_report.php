<?php
// Include database connection
include('db.php');

// Set header to return JSON
header('Content-Type: application/json');

// Start timer
$start_time = microtime(true);

// Query total CVs
$total_cvs_query = "SELECT COUNT(*) AS total FROM candidates";
$total_cvs_result = $conn->query($total_cvs_query);
$total_cvs = $total_cvs_result->fetch_assoc()['total'];

// Query shortlisted candidates
$favorite_query = "SELECT COUNT(*) AS favorite FROM candidates WHERE is_favorite = 1";
$favorite_result = $conn->query($favorite_query);
$favorite = $favorite_result->fetch_assoc()['favorite'];

// Calculate rejected candidates
$standby = $total_cvs - $favorite;

// Query total positions
$positions_query = "SELECT COUNT(*) AS total FROM positions";
$positions_result = $conn->query($positions_query);
$total_positions = $positions_result->fetch_assoc()['total'];

// Query total employees
$employees_query = "SELECT COUNT(*) AS total FROM employees";
$employees_result = $conn->query($employees_query);
$total_employees = $employees_result->fetch_assoc()['total'];

// Query total users
$users_query = "SELECT COUNT(*) AS total FROM users";
$users_result = $conn->query($users_query);
$total_users = $users_result->fetch_assoc()['total'];

// Query total skills
$skills_query = "SELECT COUNT(*) AS total FROM skills";
$skills_result = $conn->query($skills_query);
$total_skills = $skills_result->fetch_assoc()['total'];

// End timer
$end_time = microtime(true);
$execution_time = $end_time - $start_time;

// Return JSON response
if ($execution_time <= 2) {
    echo json_encode([
        'success' => true,
        'report' => [
            'total_cvs' => $total_cvs,
            'favorite' => $favorite,
            'standby' => $standby,
            'total_positions' => $total_positions,
            'total_employees' => $total_employees,
            'total_users' => $total_users,
            'total_skills' => $total_skills
        ],
        'execution_time' => round($execution_time, 2)
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Report generation exceeded the time limit.'
    ]);
}

// Close the connection
$conn->close();
?>
