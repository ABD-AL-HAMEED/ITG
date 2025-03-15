function addSkill() {
    let newSkill = document.getElementById("new-skill").value.trim();
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
            let skillsList = document.getElementById("skills-list");
            let li = document.createElement('li');
            li.textContent = newSkill;
            skillsList.appendChild(li);
            alert("Skill added successfully!");
        } else {
            alert("Error adding skill: " + data.error);
        }
    })
    .catch(error => console.error("Error:", error));
}
