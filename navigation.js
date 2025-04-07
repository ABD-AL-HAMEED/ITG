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

                    <h2>Favorites candidates</h2>
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
                        ${data.candidates
                        .filter(candidate => candidate.is_favorite === "1") // Only include favorite candidates
                        .map(candidate => `
                                <tr>
                                    <td>${candidate.id}</td>
                                    <td>${candidate.first_name}</td>
                                    <td>${candidate.last_name}</td>
                                    <td><a href="mailto:${candidate.email}" target="_blank">${candidate.email || 'N/A'}</a></td>
                                    <td><a href="tel:${candidate.phone}" target="_blank">${candidate.phone || 'N/A'}</a></td>
                                    <td><a href="${candidate.resume_path}" target="_blank">View CV</a></td>
                                </tr>
                            `).join('')}
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
                        <div class="skills-container" id="skills-container" style="display: none;">
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
                        <!-- Edit Skill Modal -->
                        <div id="editSkillModal" class="modal-overlay">
                        <div class="modal-card">
                            <h2>Edit Skill</h2>
                            <input type="hidden" id="editSkillId" />

                            <div class="form-group">
                            <label for="editSkillName">Skill Name</label>
                            <input type="text" id="editSkillName" class="modal-input" />
                            </div>

                            <div class="form-group">
                            <label for="editSkillType">Skill Type</label>
                            <select id="editSkillType" class="modal-input">
                                <option value="Technical">Technical</option>
                                <option value="Soft">Soft</option>
                            </select>
                            </div>

                            <div class="form-group">
                            <label for="editSkillDescription">Description</label>
                            <textarea id="editSkillDescription" class="modal-input" rows="4"></textarea>
                            </div>

                            <div class="modal-actions">
                            <button class="edit-skill-btn" onclick="updateSkill()">Save</button>
                            <button class="delete-skill-btn" onclick="closeSkillModal()">Cancel</button>
                            </div>
                        </div>
                        </div>
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
                                    <th>Skills</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.positions?.map(pos => {
                    const skillIds = data.position_skills
                        .filter(ps => parseInt(ps.position_id) === parseInt(pos.id))
                        .map(ps => parseInt(ps.skill_id));

                    return `
                                        <tr id="position-row-${pos.id}">
                                            <td class="position-name">${pos.position_name}</td>
                                            <td class="position-desc">${pos.description || 'N/A'}</td>
                                            <td class="position-exp">${pos.Required_Experience ? pos.Required_Experience + ' Years' : 'N/A'}</td>
                                            <td class="position-skills">${skillIds.length ? data.skills.filter(skill => skillIds.includes(parseInt(skill.id))).map(s => s.skill_name).join(', ') : 'No skills linked'}</td>
                                            <td class="position-actions">
                                                <button class="edit-pos-btn" onclick="editPosition(${pos.id})">Edit</button>
                                                <button class="delete-pos-btn" onclick="deletePosition(${pos.id})">Delete</button>
                                            </td>
                                        </tr>
                                    `;
                }).join('')}
                            </tbody>
                        </table>
                        
                        <!-- Edit Position Modal -->
                        <div id="editPositionModal" class="modal-overlay">
                            <div class="modal-card">
                                <h2>Edit Position</h2>
                                <input type="hidden" id="editPositionId" />
                
                                <div class="form-group">
                                    <label for="editPositionName">Position Name</label>
                                    <input type="text" id="editPositionName" class="modal-input" />
                                </div>
                
                                <div class="form-group">
                                    <label for="editPositionDescription">Description</label>
                                    <textarea id="editPositionDescription" class="modal-input" rows="3"></textarea>
                                </div>
                
                                <div class="form-group">
                                    <label for="editPositionExperience">Required Experience (Years)</label>
                                    <input type="number" id="editPositionExperience" class="modal-input" min="0" />
                                </div>
                
                                <div class="form-group">
                                    <label>Skills</label>
                                    <div class="dropdown-checkbox">
                                        <button type="button" class="dropdown-toggle" onclick="toggleSkillDropdown('edit')">Select Skills</button>
                                        <div class="dropdown-menu" id="dropdown-menu-edit">
                                            <!-- Skill checkboxes will be injected here -->
                                        </div>
                                    </div>
                                </div>
                
                                <div class="modal-actions">
                                    <button class="edit-pos-btn" onclick="saveEditPosition()">Save</button>
                                    <button class="delete-pos-btn" onclick="closeEditPositionModal()">Cancel</button>
                                </div>
                            </div>
                        </div>
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

//////////////////////////////////////////////////////Navigation////////////////////////////////////////////////

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

///////////////////////////////////////////////////// Positions ///////////////////////////////////////////////////

async function fetchData() {
    try {
        const response = await fetch('data.php');
        const data = await response.json();

        if (!data.positions || !data.skills || !data.position_skills) {
            throw new Error("Missing required tables in the response.");
        }

        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return { positions: [], skills: [], position_skills: [] }; // Prevent errors
    }
}

function editPosition(id) {
    fetchData().then(data => {
        if (!data) return;

        const pos = data.positions?.find(p => parseInt(p.id) === id);
        if (!pos) {
            alert("Position not found.");
            return;
        }

        const skillIds = (data.position_skills || [])
            .filter(ps => parseInt(ps.position_id) === id)
            .map(ps => parseInt(ps.skill_id));

        const skillsHTML = (data.skills || []).map(skill => `
            <label style="display: block; margin-bottom: 6px;">
                <input type="checkbox" name="edit-skill-checkbox" value="${skill.id}"
                ${skillIds.includes(parseInt(skill.id)) ? 'checked' : ''}>
                ${skill.skill_name}
            </label>
        `).join('');

        document.getElementById('editPositionId').value = pos.id;
        document.getElementById('editPositionName').value = pos.position_name;
        document.getElementById('editPositionDescription').value = pos.description || '';
        document.getElementById('editPositionExperience').value = pos.Required_Experience || '';
        document.getElementById('dropdown-menu-edit').innerHTML = skillsHTML;
        document.getElementById('editPositionModal').style.display = 'flex';
    });
}

function closeEditPositionModal() {
    document.getElementById('editPositionModal').style.display = 'none';
}

function saveEditPosition() {
    const id = document.getElementById("editPositionId").value;
    const name = document.getElementById("editPositionName").value;
    const desc = document.getElementById("editPositionDescription").value;
    const exp = document.getElementById("editPositionExperience").value;

    const selectedSkills = Array.from(document.querySelectorAll('input[name="edit-skill-checkbox"]:checked'))
        .map(cb => cb.value)
        .join(',');

    fetch('manage_pos.php?action=update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${id}&position_name=${encodeURIComponent(name)}&description=${encodeURIComponent(desc)}&Required_Experience=${encodeURIComponent(exp)}&skills=${encodeURIComponent(selectedSkills)}`
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Position updated successfully!");
                closeEditPositionModal();
                clearCache();
                navigate('positions');
            } else {
                alert("Error: " + (data.error || "Update failed"));
            }
        })
        .catch(err => console.error("Error updating position:", err));
}

function deletePosition(id) {
    if (!confirm("Are you sure you want to delete this position?")) return;

    fetch('manage_pos.php?action=delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

function createPosition() {
    fetchData().then(data => {
        const name = prompt("Enter Position Name:");
        if (!name) return;

        const desc = prompt("Enter Description:", '');
        const exp = prompt("Enter Required Experience (in years):", '');

        const skillOptions = data.skills.map(skill => `${skill.id}: ${skill.skill_name}`).join('\n');
        const selected = prompt("Enter Skill IDs separated by commas:\n" + skillOptions, '');
        const selectedSkills = selected?.split(',').map(s => s.trim()).filter(Boolean).join(',');

        fetch('manage_pos.php?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `position_name=${encodeURIComponent(name)}&description=${encodeURIComponent(desc)}&Required_Experience=${encodeURIComponent(exp)}&skills=${encodeURIComponent(selectedSkills)}`
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
            });
    });
}

// Toggle dropdown menu
function toggleSkillDropdown(id) {
    document.getElementById(`dropdown-menu-${id}`).classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    if (!event.target.closest('.dropdown-checkbox')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('show'));
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////Candidates/////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let filteredCandidates = [];

function handlePositionChange() {
    SkillsList();

    const selectedPositionId = parseInt(document.getElementById('position').value);
    const container = document.getElementById('candidates-table-container');
    const skillsContainer = document.getElementById('skills-container'); // 👈 Get the skills container

    // Show or hide the skills container
    if (isNaN(selectedPositionId)) {
        skillsContainer.style.display = 'none'; // 👈 Hide if no position selected
        container.innerHTML = '<p>No candidates to display</p>';
        return;
    } else {
        skillsContainer.style.display = 'grid'; // 👈 Show when position is selected (use 'block' or 'flex' if needed)
    }

    fetchData().then(data => {
        filteredCandidates = data.candidates.filter(candidate =>
            parseInt(candidate.applied_position_id) === selectedPositionId
        );

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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////Dashboard Report///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////skills////////////////////////////////////////////////////

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

function deleteSkill(skillId) {
    if (confirm(`Are you sure you want to delete skill ID "${skillId}"?`)) {
        fetch("manage_skills.php?action=delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `skill_id=${encodeURIComponent(skillId)}`,
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Skill deleted successfully.");
                    clearCache();
                    navigate('skills');
                } else {
                    alert("Error: " + (data.error || "Failed to delete skill."));
                }
            })
            .catch(error => {
                alert("An unexpected error occurred: " + error.message);
            });
    }
}

function closeSkillModal() {
    document.getElementById("editSkillModal").style.display = "none";
}

function openEditSkillModal(skillId) {
    fetch(`manage_skills.php?action=get&skillId=${skillId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("editSkillId").value = data.skill.id;
                document.getElementById("editSkillName").value = data.skill.skill_name;
                document.getElementById("editSkillType").value = data.skill.type;
                document.getElementById("editSkillDescription").value = data.skill.Description;

                document.getElementById("editSkillModal").style.display = "flex"; // show as flex to center it
            } else {
                alert("Error fetching skill details: " + data.error);
            }
        })
        .catch(error => console.error("Error:", error));
}


function updateSkill() {
    let skillId = document.getElementById("editSkillId").value;
    let skillName = document.getElementById("editSkillName").value;
    let skillType = document.getElementById("editSkillType").value;
    let skillDescription = document.getElementById("editSkillDescription").value;

    const body = `skill_id=${encodeURIComponent(skillId)}&skill_name=${encodeURIComponent(skillName)}&skill_type=${encodeURIComponent(skillType)}&skill_description=${encodeURIComponent(skillDescription)}`;

    fetch("manage_skills.php?action=update", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Skill updated successfully!");
                clearCache();
                navigate('skills');
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

    const body = `skill_name=${encodeURIComponent(skillName)}&skill_type=${encodeURIComponent(skillType)}&skill_description=${encodeURIComponent(skillDesc)}`;

    fetch('manage_skills.php?action=create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Skill added successfully!");
                clearCache();
                navigate('skills');
            } else {
                alert('Error: ' + data.error);
            }
        });
}
