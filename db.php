<?php
/*
$servername = "sql305.infinityfree.com"; // MySQL Hostname
$username = "if0_38732996"; // MySQL Username
$password = "AB00d562631F"; // MySQL Password
$dbname = "if0_38732996_test1"; // Database name
*/
$servername = "localhost";
$username = "root";
$password = ""; // XAMPP's default is an empty password
$dbname = "itg"; // Name of your database

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, 3306);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
