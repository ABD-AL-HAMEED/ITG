function loadSkillsTable() {
    fetch("data.php")
        .then(response => response.json())
        .then(data => {
            let positions = Object.values(data.positions); // Extract position names
            let positionSkills = data.positionSkills;

            let tableHeader = document.getElementById("tableHeader");
            let tableBody = document.getElementById("tableBody");

            // Ensure table elements exist
            if (!tableHeader || !tableBody) {
                console.error("Table elements not found.");
                return;
            }

            // Clear table before updating
            tableHeader.innerHTML = "<th>Skills</th>"; 
            tableBody.innerHTML = "";

            // Add position names as column headers
            positions.forEach(position => {
                let th = document.createElement("th");
                th.textContent = position;
                tableHeader.appendChild(th);
            });

            // Collect all unique skills across all positions
            let allSkills = {};
            Object.entries(positionSkills).forEach(([position, skills]) => {
                skills.forEach(skill => {
                    if (!allSkills[skill.name]) {
                        allSkills[skill.name] = {}; // Initialize skill object
                    }
                    allSkills[skill.name][position] = skill.type; // Store skill type
                });
            });

            // Create table rows for each skill
            Object.keys(allSkills).forEach(skill => {
                let row = document.createElement("tr");
                let skillCell = document.createElement("td");
                skillCell.textContent = skill;
                row.appendChild(skillCell);

                // Add checkmarks for positions that have this skill
                positions.forEach(position => {
                    let cell = document.createElement("td");
                    if (allSkills[skill][position]) {
                        cell.innerHTML = "✔️"; // Checkmark for skill match
                    }
                    row.appendChild(cell);
                });

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error loading data:", error));
}

// Ensure the table is loaded when the "Modify Skills" section is accessed
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("skillsTable")) {
        loadSkillsTable();
    }
});
