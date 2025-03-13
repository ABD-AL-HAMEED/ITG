<?php
$servername = "localhost";
$username = "root";
$password = ""; // XAMPP's default is an empty password
$dbname = "cv-analysis-sys"; // Name of your database

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
