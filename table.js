function loadSkillsTable() {
    fetch("data.php")
        .then(response => response.json())
        .then(data => {
            let positions = Object.values(data.positions);
            let positionSkills = data.positionSkills;

            let tableHeader = document.getElementById("tableHeader");
            let tableBody = document.getElementById("tableBody");

            if (!tableHeader || !tableBody) {
                console.error("Table elements not found.");
                return;
            }

            tableHeader.innerHTML = "<th>Skills</th><th>Actions</th>";
            tableBody.innerHTML = "";

            let allSkills = new Set();
            Object.values(positionSkills).forEach(skills => {
                skills.forEach(skill => allSkills.add(skill.name));
            });

            allSkills.forEach(skill => {
                let row = document.createElement("tr");
                
                // Skill name cell
                let skillCell = document.createElement("td");
                skillCell.textContent = skill;
                row.appendChild(skillCell);

                // Actions cell
                let actionsCell = document.createElement("td");
                actionsCell.innerHTML = `
                    <button onclick="editSkill('${skill}')">Edit</button>
                    <button onclick="deleteSkill('${skill}')">Delete</button>
                `;
                row.appendChild(actionsCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error loading data:", error));
}
