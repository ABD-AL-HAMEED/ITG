fetch("add_skill.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `skill=${encodeURIComponent(newSkill)}`
})
.then(response => response.json().catch(() => { throw new Error("Invalid JSON response") }))
.then(data => {
    if (data.success) {
        let skillsList = document.getElementById("skills-list");
        if (!skillsList) throw new Error("Skills list not found");
        let li = document.createElement('li');
        li.textContent = newSkill;
        skillsList.appendChild(li);
        alert("Skill added successfully!");
    } else {
        throw new Error(data.error || "Unknown error occurred");
    }
})
.catch(error => console.error("Error:", error));
