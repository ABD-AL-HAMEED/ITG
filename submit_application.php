<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Escape and get POST data
    $first_name = $conn->real_escape_string(trim($_POST['first_name']));
    $last_name = $conn->real_escape_string(trim($_POST['last_name']));
    $email = $conn->real_escape_string(trim($_POST['email']));
    $phone = $conn->real_escape_string(trim($_POST['phone']));
    $position = $conn->real_escape_string(trim($_POST['position'])); // assuming ID
    $cover_letter = $conn->real_escape_string(trim($_POST['cover_letter'] ?? ''));

    // Handle resume upload
    $resume_dir = "uploads/resumes/";
    $resume_path = NULL;
    if (isset($_FILES['resume']) && $_FILES['resume']['error'] == 0) {
        $resume_name = basename($_FILES['resume']['name']);
        $resume_tmp = $_FILES['resume']['tmp_name'];
        $resume_path = $resume_dir . $resume_name;
        move_uploaded_file($resume_tmp, $resume_path);
    }

    // Handle other documents upload (optional)
    $other_dir = "uploads/other_docs/";
    $other_path = NULL;
    if (isset($_FILES['other_documents']) && $_FILES['other_documents']['error'] == 0) {
        $other_name = basename($_FILES['other_documents']['name']);
        $other_tmp = $_FILES['other_documents']['tmp_name'];
        $other_path = $other_dir . $other_name;
        move_uploaded_file($other_tmp, $other_path);
    }

    // Insert into database
    $sql = "INSERT INTO candidates (
        first_name, 
        last_name, 
        email, 
        phone, 
        is_favorite, 
        applied_position_id, 
        skills, 
        resume_path, 
        application_date
    ) VALUES (
                '$first_name', '$last_name', '$email', '$phone', NULL,
                '$position', NULL , '$resume_path', NOW()
            )";

    if ($conn->query($sql) === TRUE) {
        echo "Application submitted successfully!";
    } else {
        echo "Error: " . $conn->error;
    }

    $conn->close();
}
?>
