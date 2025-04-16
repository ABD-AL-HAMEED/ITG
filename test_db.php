<?php
include 'db.php';

if ($conn) {
    echo "✅ Database connected successfully!";
} else {
    echo "❌ Database connection failed!";
}
?>
