function navigate(section, event = null) {
    if (event) event.preventDefault();
    let content = document.getElementById('content-area');
    if (!content) {
        console.error("Content area not found.");
        return;
    }
    let htmlContent = '';
    switch (section) {
        case 'dashboard':
            // Fetch data from the server
            fetch('data.php')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
                    }
                    return response.json(); // Parse the JSON response
                })
                .then(data => {
                    if (data.error) {
                        // Handle backend-reported errors
                        content.innerHTML = `<p>Error: ${data.error}</p>`;
                        return;
                    }
                    // Generate the dashboard HTML content dynamically
                    htmlContent = `
    <h2>Manage candidates and applications easily from this panel.</h2>
    <table class="dashboard-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>CV</th>
            </tr>
        </thead>
        <tbody>
            ${data.candidates.map(candidate => `
                <tr>
                    <td>${candidate.id}</td>
                    <td>${candidate.first_name}</td>
                    <td>${candidate.last_name}</td>
                    <td>${candidate.email}</td>
                    <td>${candidate.phone || 'N/A'}</td>
                    <td><a href="${candidate.resume_path}" target="_blank">View CV</a></td>
                </tr>`).join('')}
        </tbody>
    </table>`;
content.innerHTML = htmlContent;

                })
                .catch(error => {
                    content.innerHTML = `<p>An unexpected error occurred: ${error.message}</p>`;
                });
            break;



        case 'candidates':
            htmlContent = `
                <h2>Candidates</h2>
                <label for="position">Select Position:</label>
                <select id="position" name="position" onchange="SkillsList()">
                    <option value="">Choose Position</option>
                    ${typeof positionSkills !== "undefined" 
                        ? Object.keys(positionSkills).map(pos => `<option value="${pos}">${pos}</option>`).join('')
                        : '<option disabled>Data not available</option>'}
                </select>
                <div class="skills-container">
                    <div class="skills-column">
                        <h3>Soft Skills</h3>
                        <ul id="soft-skills-list"></ul>
                    </div>
                    <div class="skills-column">
                        <h3>Technical Skills</h3>
                        <ul id="tech-skills-list"></ul>
                    </div>
                </div>
                <h3>Matching Candidates:</h3>
                <ul id="candidates-list"></ul>
            `;
            break;

        case 'skills':
    fetch('data.php?action=getSkills')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                content.innerHTML = `<p>Error: ${data.error}</p>`;
                return;
            }

            // Generate Skills Table
            htmlContent = `
                <h2>Manage Skills</h2>
                <button class="new-skill-btn" onclick="openNewSkillPrompt()">New Skill</button>
                <table class="skills-table">
                    <thead>
                        <tr>
                            <th>Skill Name</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.skills.map(skill => `
                            <tr>
                                <td>${skill.skill_name}</td>
                                <td><span class="skill-type ${skill.type.toLowerCase()}">${skill.type}</span></td>
                                <td>${skill.description || 'N/A'}</td>
                                <td>
                                    <button class="edit-skill-btn" onclick="openEditSkillModal(${skill.id})">Edit</button>
                                    <button class="delete-skill-btn" onclick="deleteSkill(${skill.id})">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            content.innerHTML = htmlContent;
        })
        .catch(error => {
            content.innerHTML = `<p>An unexpected error occurred: ${error.message}</p>`;
        });
    break;






        case 'positions':
            htmlContent = `<h2>Available Positions</h2>
                           <ul>${typeof positionSkills !== "undefined" 
                                ? Object.keys(positionSkills).map(pos => `<li>${pos}</li>`).join('')
                                : '<li>Data not available</li>'}</ul>`;
            break;

        default:
            htmlContent = `<h2>Overview</h2><p>Manage candidates and applications from this panel.</p>`;
            break;
    }

    content.innerHTML = htmlContent;
}

function setupNavigation() {
    document.querySelectorAll(".sidebar a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            let section = this.getAttribute("data-section");
            if (section) {
                navigate(section, event);
            } else {
                console.error("Invalid navigation link: Missing 'data-section' attribute.");
            }
        });
    });
}


function deleteSkill(skillId) {
    if (confirm(`Are you sure you want to delete skill ID "${skillId}"?`)) {
        console.log("Deleting skill with ID:", skillId); // Debugging

        fetch(`data.php?action=deleteSkill&id=${skillId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Server Response:", data); // Debugging
            if (data.success) {
                alert("Skill deleted successfully.");
                navigate('skills'); // Refresh the skills section
            } else {
                alert("Error deleting skill: " + data.error);
            }
        })
        .catch(error => {
            alert("An unexpected error occurred: " + error.message);
        });
    }
}




function openNewSkillPrompt() {
    let skillName = prompt("Enter Skill Name:");
    if (!skillName) return;

    let skillType = prompt("Enter Skill Type (Technical or Soft):");
    if (!skillType || (skillType.toLowerCase() !== "technical" && skillType.toLowerCase() !== "soft")) {
        alert("Invalid skill type. Choose 'Technical' or 'Soft'.");
        return;
    }

    let skillDesc = prompt("Enter Skill Description:");
    if (!skillDesc) return;

    // Send Data to Backend (data.php)
    fetch('data.php?action=addSkill', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `skillName=${encodeURIComponent(skillName)}&skillType=${encodeURIComponent(skillType)}&skillDesc=${encodeURIComponent(skillDesc)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            navigate('skills'); // Refresh the skills table
        } else {
            alert('Error: ' + data.error);
        }
    });
}
