// Cached data store
let cachedData = null;

function fetchData(forceRefresh = false) {
    if (cachedData && !forceRefresh) {
        return Promise.resolve(cachedData);
    }
    return fetch('data.php')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.error) throw new Error(data.error);
            cachedData = data;
            return data;
        });
}

function clearCache() {
    cachedData = null;
}

function navigate(section, event = null) {
    if (event) event.preventDefault();
    let content = document.getElementById('content-area');
    if (!content) {
        console.error("Content area not found.");
        return;
    }

    fetchData().then(data => {
        let htmlContent = '';

        switch (section) {
            case 'dashboard':
                htmlContent = `
                
                    <button onclick="loadCVReport()" class="report-btn">Generate Report</button>
            
                    <!-- report place -->
                    <div id="cv-report">
                    </div>      

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
                break;

            case 'candidates':
                htmlContent = `
                        <h2>Candidates</h2>
                        <label for="position">Select Position:</label>
                        <select id="position" name="position" onchange="handlePositionChange()">
                            <option value="">Choose Position</option>
                            ${data.positions?.map(pos => `<option value="${pos.id}">${pos.position_name}</option>`).join('') || '<option disabled>Data not available</option>'}
                        </select>
                        <div class="skills-container">
                            <div class="skills-column">
                                <h3>Soft Skills</h3>
                                <ul id="soft-skills-list"><li>No skills loaded</li></ul>
                            </div>
                            <div class="skills-column">
                                <h3>Technical Skills</h3>
                                <ul id="tech-skills-list"><li>No skills loaded</li></ul>
                            </div>
                        </div>
                        <h3>Matching Candidates:</h3>
                        <div id="candidates-table-container">
                            <p>No candidates to display</p>
                        </div>
                    `;
                break;

            case 'skills':
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
                                    <td>${skill.Description || 'N/A'}</td>
                                    <td>
                                        <button class="edit-skill-btn" onclick="openEditSkillModal(${skill.id})">Edit</button>
                                        <button class="delete-skill-btn" onclick="deleteSkill(${skill.id})">Delete</button>
                                    </td>
                                </tr>`).join('')}
                        </tbody>
                    </table>
                `;
                break;

            case 'positions':
                htmlContent = `
                        <h2>Available Positions</h2>
                        <button class="new-pos-btn" onclick="createPosition()">New Position</button>
                        <table class="skills-table">
                            <thead>
                                <tr>
                                    <th>Position Name</th>
                                    <th>Description</th>
                                    <th>Required Experience</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.positions?.map(pos => `
                                    <tr>
                                        <td>${pos.position_name}</td>
                                        <td>${pos.description || 'N/A'}</td>
                                        <td>${pos.Required_Experience ? pos.Required_Experience + ' Years' : 'N/A'}</td>
                                        <td>
                                        <button class="edit-pos-btn" onclick="editPosition(${pos.id})">Edit</button>
                                        <button class="delete-pos-btn" onclick="deletePosition(${pos.id})">Delete</button>
                                        </td>
                                    </tr>
                                `).join('') || '<tr><td colspan="3">No positions available</td></tr>'}
                            </tbody>
                        </table>
                    `;
                break;


            default:
                htmlContent = `<h2>Overview</h2><p>Manage candidates and applications from this panel.</p>`;
                break;
        }

        content.innerHTML = htmlContent;
    }).catch(error => {
        content.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

function deletePosition(id) {
    if (!confirm("Are you sure you want to delete this position?")) return;

    fetch('manage_pos.php?action=delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${encodeURIComponent(id)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Position deleted successfully!");
            clearCache();
            navigate('positions');
        } else {
            alert("Error deleting position: " + (data.error || "Unknown error"));
        }
    })
    .catch(error => alert("Unexpected error: " + error.message));
}

function editPosition(id) {
    fetchData().then(data => {
        const pos = data.positions.find(p => parseInt(p.id) === id);
        if (!pos) {
            alert("Position not found.");
            return;
        }

        const name = prompt("Edit Position Name:", pos.position_name);
        if (!name) return;

        const desc = prompt("Edit Description:", pos.description || '');
        const exp = prompt("Edit Required Experience (in years):", pos.Required_Experience || '');

        fetch('manage_pos.php?action=update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${id}&position_name=${encodeURIComponent(name)}&description=${encodeURIComponent(desc)}&Required_Experience=${encodeURIComponent(exp)}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Position updated successfully!");
                clearCache();
                navigate('positions');
            } else {
                alert("Error updating position: " + (data.error || "Unknown error"));
            }
        })
        .catch(error => alert("Unexpected error: " + error.message));
    });
}

function createPosition() {
    const name = prompt("Enter Position Name:");
    if (!name) return;

    const desc = prompt("Enter Description:", '');
    const exp = prompt("Enter Required Experience (in years):", '');

    fetch('manage_pos.php?action=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `position_name=${encodeURIComponent(name)}&description=${encodeURIComponent(desc)}&Required_Experience=${encodeURIComponent(exp)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Position created successfully!");
            clearCache();
            navigate('positions');
        } else {
            alert("Error creating position: " + (data.error || "Unknown error"));
        }
    })
    .catch(error => alert("Unexpected error: " + error.message));
}


let filteredCandidates = [];

function handlePositionChange() {
    SkillsList();

    const selectedPositionId = parseInt(document.getElementById('position').value);
    const container = document.getElementById('candidates-table-container');

    if (isNaN(selectedPositionId)) {
        container.innerHTML = '<p>No candidates to display</p>';
        return;
    }

    fetchData().then(data => {
        filteredCandidates = data.candidates.filter(candidate =>
            parseInt(candidate.applied_position_id) === selectedPositionId
        );

        // Check if any candidate is a favorite
        const hasFavorite = filteredCandidates.some(c => c.is_favorite === "1");

        container.innerHTML = filteredCandidates.length
            ? `
                <table class="dashboard-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Application Date</th>
                            ${hasFavorite ? '<th>Favorite</th>' : ''}
                            <th>CV</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredCandidates.map(candidate => `
                            <tr>
                                <td>${candidate.id}</td>
                                <td>${candidate.first_name.trim()}</td>
                                <td>${candidate.last_name.trim()}</td>
                                <td>${candidate.email.trim()}</td>
                                <td>${candidate.phone || 'N/A'}</td>
                                <td>${candidate.application_date}</td>
                                ${hasFavorite ? `<td>${candidate.is_favorite === "1" ? 'Yes 🌟' : ''}</td>` : ''}
                                <td><a href="${candidate.resume_path}" target="_blank">View CV</a></td>
                                <td>
    <button class="fav-btn" onclick="toggleFavorite(${candidate.id}, ${candidate.is_favorite === "1" ? 'false' : 'true'})">
        ${candidate.is_favorite === "1" ? 'Unmark Favorite' : 'Mark Favorite'}
    </button>
</td>

                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `
            : '<p>No candidates found for this position</p>';
    });
}

function toggleFavorite(candidateId, makeFavorite) {
    fetch("mark_favorite.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `candidateId=${encodeURIComponent(candidateId)}&is_favorite=${makeFavorite ? 1 : 0}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Candidate has been ${makeFavorite ? 'marked' : 'unmarked'} as favorite.`);
                clearCache();
                handlePositionChange(); // Re-render updated table
            } else {
                alert("Error: " + (data.error || "Failed to update favorite status."));
            }
        })
        .catch(error => {
            alert("An unexpected error occurred: " + error.message);
        });
}



function renderCandidateList(list) {
    const candidatesList = document.getElementById('candidates-list');

    candidatesList.innerHTML = list.length
        ? list.map(c => `
            <li class="candidate-item" onclick="openCandidateModal(${c.id})">
                <strong>
                    ${c.first_name.trim()} ${c.last_name.trim()}
                    ${c.is_favorite === "1" ? '⭐' : ''}
                </strong><br>
                Email: ${c.email.trim()}<br>
                Phone: ${c.phone || 'N/A'}<br>
                Skills: ${c.skills || 'N/A'}<br>
                Applied: ${new Date(c.application_date).toLocaleDateString()}<br>
                <a href="${c.resume_path}" target="_blank">View CV</a>
            </li>
        `).join('')
        : '<li>No candidates found for this position</li>';
}

function filterCandidates() {
    const query = document.getElementById('candidate-search').value.toLowerCase();

    const filtered = filteredCandidates.filter(c =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
    );

    renderCandidateList(filtered);
}



function SkillsList() {
    const selectedPositionId = parseInt(document.getElementById('position').value);
    const softSkillsList = document.getElementById('soft-skills-list');
    const techSkillsList = document.getElementById('tech-skills-list');

    // Clear current skill lists
    softSkillsList.innerHTML = '';
    techSkillsList.innerHTML = '';

    if (isNaN(selectedPositionId)) {
        softSkillsList.innerHTML = '<li>No skills loaded</li>';
        techSkillsList.innerHTML = '<li>No skills loaded</li>';
        return;
    }

    fetchData().then(data => {
        const { skills, position_skills } = data;

        // Get skill IDs for this position (as numbers)
        const relatedSkillIds = position_skills
            .filter(ps => ps.position_id === selectedPositionId)
            .map(ps => ps.skill_id);

        // Filter skills using numeric comparison
        const relatedSkills = skills.filter(skill =>
            relatedSkillIds.includes(parseInt(skill.id))
        );

        const softSkills = relatedSkills.filter(skill => skill.type.toLowerCase() === 'soft');
        const techSkills = relatedSkills.filter(skill => skill.type.toLowerCase() === 'technical');

        softSkillsList.innerHTML = softSkills.length
            ? softSkills.map(skill => `<li>${skill.skill_name}</li>`).join('')
            : '<li>No soft skills found</li>';

        techSkillsList.innerHTML = techSkills.length
            ? techSkills.map(skill => `<li>${skill.skill_name}</li>`).join('')
            : '<li>No technical skills found</li>';
    }).catch(err => {
        console.error("Error loading skills:", err);
        softSkillsList.innerHTML = techSkillsList.innerHTML = '<li>Error loading skills</li>';
    });
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
        console.log("Deleting skill with ID:", skillId);

        fetch("delete_skill.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `skillId=${encodeURIComponent(skillId)}`,
        })
            .then(response => response.json())
            .then(data => {
                console.log("Server Response:", data); // Debugging

                if (data.success) {
                    alert("Skill deleted successfully.");
                    navigate('skills'); // Refresh the skills section
                } else {
                    alert("Error: " + (data.error || "Failed to delete skill."));
                }
            })
            .catch(error => {
                alert("An unexpected error occurred: " + error.message);
            });
    }
}

function openEditSkillModal(skillId) {
    // Fetch skill details using AJAX
    fetch(`edit_skill.php?skillId=${skillId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Populate modal fields
                document.getElementById("editSkillId").value = data.skill.id;
                document.getElementById("editSkillName").value = data.skill.name;
                document.getElementById("editSkillType").value = data.skill.type;
                document.getElementById("editSkillDescription").value = data.skill.description;

                // Show the modal
                document.getElementById("editSkillModal").style.display = "block";
            } else {
                alert("Error fetching skill details: " + data.error);
            }
        })
        .catch(error => console.error("Error:", error));
}

// Function to submit the updated skill
function updateSkill() {
    let skillId = document.getElementById("editSkillId").value;
    let skillName = document.getElementById("editSkillName").value;
    let skillType = document.getElementById("editSkillType").value;
    let skillDescription = document.getElementById("editSkillDescription").value;

    let formData = new FormData();
    formData.append("skillId", skillId);
    formData.append("skillName", skillName);
    formData.append("skillType", skillType);
    formData.append("skillDescription", skillDescription);

    fetch("edit_skill.php", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Skill updated successfully!");
                location.reload(); // Refresh page or update UI dynamically
            } else {
                alert("Error updating skill: " + data.error);
            }
        })
        .catch(error => console.error("Error:", error));
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

function loadCVReport() {
    let reportContainer = document.getElementById('cv-report');
    //Check if the report is already displayed
    if (reportContainer.style.display === 'block') {
        reportContainer.style.display = 'none'; //Hide report if visible
        return;
    }

    // Fetch data from`navegation_report.php`
    fetch('generate_report.php')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                throw new Error(data.error || "Failed to generate report.");
            }

            let report = data.report;

            let reportHTML = `
               <h3>Report Summary</h3>
                    <table class="dashboard-table">
                        <thead>
                           <tr>
                                 <th>Total CVs</th>
                                 <th>Favorite Candidates</th>
                                 <th>Stand By Candidates</th>
                                 <th>Total Positions</th>
                                 <th>Total Employees</th>
                                 <th>Total Users</th>
                                 <th>Total Skills</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                               
                                <td>${data.report.total_cvs}</td>
                                <td>${data.report.favorite}</td>
                                <td>${data.report.standby}</td>
                                <td>${data.report.total_positions}</td>
                                <td>${data.report.total_employees}</td>
                                <td>${data.report.total_users}</td>
                                <td>${data.report.total_skills}</td>
                               
                            </tr>
                           
                        </tbody>
                    </table>
            `;

            //Update report content
            reportContainer.innerHTML = reportHTML;
            reportContainer.style.display = 'block'; // Show report
        })
        .catch(error => {
            reportContainer.innerHTML = `<p>An error occurred: ${error.message}</p>`;
            reportContainer.style.display = 'block'; // Show error message also
        });
}