function addSkill() {
    let skillInput = document.getElementById("new-skill");
    let newSkill = skillInput.value.trim();

    if (!newSkill) {
        alert("Please enter a skill name.");
        return;
    }

    fetch("add_skill.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `skill=${encodeURIComponent(newSkill)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Skill added successfully!");
            loadSkillsTable(); // Reload table to show new skill
            skillInput.value = ""; // Clear input
        } else {
            alert("Error adding skill: " + data.error);
        }
    })
    .catch(error => console.error("Error:", error));
}

function editSkill(skillName) {
    let newSkill = prompt("Edit skill name:", skillName);
    if (!newSkill || newSkill.trim() === "") return;

    fetch("edit_skill.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `oldSkill=${encodeURIComponent(skillName)}&newSkill=${encodeURIComponent(newSkill)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Skill updated successfully!");
            loadSkillsTable(); // Reload table
        } else {
            alert("Error updating skill: " + data.error);
        }
    })
    .catch(error => console.error("Error:", error));
}

function deleteSkill(skillName) {
    if (!confirm(`Are you sure you want to delete "${skillName}"?`)) return;

    fetch("delete_skill.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `skill=${encodeURIComponent(skillName)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Skill deleted successfully!");
            loadSkillsTable(); // Reload table
        } else {
            alert("Error deleting skill: " + data.error);
        }
    })
    .catch(error => console.error("Error:", error));
}
