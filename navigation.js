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

    let originalSkillsOrder = [];
    fetchData().then(data => {
        let htmlContent = '';
        originalSkillsOrder = [...data.skills];

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
                        <input type="text" id="skillSearchInput" placeholder="Search skills..." oninput="filterSkills()" class="modal-input"/>
                        <table class="skills-table">
                            <thead>
                                <tr>
                                    <th>Skill Name</th>
                                    <th id="sort-type-header" style="cursor: pointer;">Type 🔽</th>
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
                                            <button class="delete-skill-btn" onclick="deleteSkill(${skill.id}, '${skill.skill_name}')">Delete</button>
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
                        <button class="new-pos-btn" onclick="openCreatePositionModal()">New Position</button>
                        <input type="text" id="positionSearchInput" placeholder="Search positions..." " oninput="filterPositions()" />
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

                        <!-- Create Position Modal -->
                        <div id="createPositionModal" class="modal-overlay">
                            <div class="modal-card">
                                <h2>Create New Position</h2>
                                <input type="hidden" id="createPositionId" />

                                <div class="form-group">
                                    <label for="createPositionName">Position Name</label>
                                    <input type="text" id="createPositionName" class="modal-input" />
                                </div>

                                <div class="form-group">
                                    <label for="createPositionDescription">Description</label>
                                    <textarea id="createPositionDescription" class="modal-input" rows="3"></textarea>
                                </div>

                                <div class="form-group">
                                    <label for="createPositionExperience">Required Experience (Years)</label>
                                    <input type="number" id="createPositionExperience" class="modal-input" min="0" />
                                </div>

                                <div class="form-group">
                                    <label>Skills</label>
                                    <div class="dropdown-checkbox">
                                        <button type="button" class="dropdown-toggle" onclick="toggleSkillDropdown('create')">Select Skills</button>
                                        <div class="dropdown-menu" id="dropdown-menu-create">
                                            <!-- Skill checkboxes will be injected here -->
                                        </div>
                                    </div>
                                </div>

                                <div class="modal-actions">
                                    <button class="edit-pos-btn" onclick="saveCreatePosition()">Create</button>
                                    <button class="delete-pos-btn" onclick="closeCreatePositionModal()">Cancel</button>
                                </div>
                            </div>
                        </div>

                        
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
        attachSkillSortingHandler(data, originalSkillsOrder);
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////Positions/////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function filterPositions() {
    const filter = document
        .getElementById('positionSearchInput')
        .value.trim()
        .toLowerCase();

    document
        .querySelectorAll('.skills-table tbody tr')
        .forEach(row => {
            const positionName = row.querySelector('.position-name').textContent.trim().toLowerCase();
            const positionDesc = row.querySelector('.position-desc').textContent.trim().toLowerCase();
            const positionExp = row.querySelector('.position-exp').textContent.trim().toLowerCase();

            // Check if any of the fields contain the filter term
            if (positionName.includes(filter) || positionDesc.includes(filter) || positionExp.includes(filter)) {
                row.style.display = ''; // Show the row
            } else {
                row.style.display = 'none'; // Hide the row
            }
        });
}


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
        if (!data) return;

        // Clear previous values
        document.getElementById('editPositionId').value = '';
        document.getElementById('editPositionName').value = '';
        document.getElementById('editPositionDescription').value = '';
        document.getElementById('editPositionExperience').value = '';

        // Generate skills checkboxes
        const skillsHTML = (data.skills || []).map(skill => `
            <label style="display: block; margin-bottom: 6px;">
                <input type="checkbox" name="edit-skill-checkbox" value="${skill.id}">
                ${skill.skill_name}
            </label>
        `).join('');

        document.getElementById('dropdown-menu-edit').innerHTML = skillsHTML;
        document.getElementById('editPositionModal').style.display = 'flex';

        // Attach special "save" behavior for creating
        document.getElementById('saveEditPositionButton').onclick = saveCreatePosition;
    });
}

function saveCreatePosition() {
    const name = document.getElementById("editPositionName").value;
    const desc = document.getElementById("editPositionDescription").value;
    const exp = document.getElementById("editPositionExperience").value;

    const selectedSkills = Array.from(document.querySelectorAll('input[name="edit-skill-checkbox"]:checked'))
        .map(cb => cb.value)
        .join(',');

    fetch('manage_pos.php?action=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `position_name=${encodeURIComponent(name)}&description=${encodeURIComponent(desc)}&Required_Experience=${encodeURIComponent(exp)}&skills=${encodeURIComponent(selectedSkills)}`
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Position created successfully!");
                closeEditPositionModal();
                clearCache();
                navigate('positions');
            } else {
                alert("Error creating position: " + (data.error || "Unknown error"));
            }
        })
        .catch(err => console.error("Error creating position:", err));
}

function openCreatePositionModal() {
    fetchData().then(data => {
        if (!data) return;

        // Prepare skills checkboxes
        const skillsHTML = (data.skills || []).map(skill => `
            <label style="display: block; margin-bottom: 6px;">
                <input type="checkbox" name="create-skill-checkbox" value="${skill.id}">
                ${skill.skill_name}
            </label>
        `).join('');

        document.getElementById('createPositionName').value = '';
        document.getElementById('createPositionDescription').value = '';
        document.getElementById('createPositionExperience').value = '';
        document.getElementById('dropdown-menu-create').innerHTML = skillsHTML;

        document.getElementById('createPositionModal').style.display = 'flex';
    });
}

function closeCreatePositionModal() {
    document.getElementById('createPositionModal').style.display = 'none';
}

function saveCreatePosition() {
    const name = document.getElementById("createPositionName").value.trim();
    const desc = document.getElementById("createPositionDescription").value.trim();
    const exp = document.getElementById("createPositionExperience").value.trim();

    const selectedSkills = Array.from(document.querySelectorAll('input[name="create-skill-checkbox"]:checked'))
        .map(cb => cb.value)
        .join(',');

    if (!name) {
        alert("Please enter a position name.");
        return;
    }

    fetch('manage_pos.php?action=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `position_name=${encodeURIComponent(name)}&description=${encodeURIComponent(desc)}&Required_Experience=${encodeURIComponent(exp)}&skills=${encodeURIComponent(selectedSkills)}`
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Position created successfully!");
                closeCreatePositionModal();
                clearCache();
                navigate('positions');
            } else {
                alert("Error creating position: " + (data.error || "Unknown error"));
            }
        })
        .catch(err => console.error("Error creating position:", err));
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
                <table id="dashboard-table" class="dashboard-table">
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
                <button onclick="exportTableToExcel('dashboard-table', 'candidates-data')" class="export-btn">
                Export to Excel
                </button>
            `
            : '<p>No candidates found for this position</p>';
    });
}
function exportTableToExcel(tableID, filename = 'exported_data') {
    const table = document.getElementById(tableID);
    const workbook = XLSX.utils.book_new();

    // Convert table to SheetJS worksheet
    const worksheet = XLSX.utils.table_to_sheet(table, {
        raw: false // enables proper formatting like date and text
    });

    // Format specific columns (like phone and date)
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
        // Column E (Phone) = 4th index
        const phoneCell = worksheet[XLSX.utils.encode_cell({ r: row, c: 4 })];
        if (phoneCell) {
            phoneCell.z = '@'; // force text format
            phoneCell.t = 's'; // force type string
        }

        // Column F (Date) = 5th index
        const dateCell = worksheet[XLSX.utils.encode_cell({ r: row, c: 5 })];
        if (dateCell) {
            dateCell.z = 'dd/mm/yyyy hh:mm'; // format date
        }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

    XLSX.writeFile(workbook, `${filename}.xlsx`);
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////skills////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let sortDirection = 'asc'; // Global toggle variable

function renderSkillsTable(data) {
    const tbody = document.querySelector('.skills-table tbody');
    tbody.innerHTML = data.skills.map(skill => `
        <tr>
            <td>${skill.skill_name}</td>
            <td><span class="skill-type ${skill.type.toLowerCase()}">${skill.type}</span></td>
            <td>${skill.Description || 'N/A'}</td>
            <td>
                <button class="edit-skill-btn" onclick="openEditSkillModal(${skill.id})">Edit</button>
                <button class="delete-skill-btn" onclick="deleteSkill(${skill.id}, '${skill.skill_name}')">Delete</button>
            </td>
        </tr>
    `).join('');
}


function attachSkillSortingHandler(data, originalSkillsOrder) {
    let sortState = 'unsorted'; // Can be: 'unsorted', 'asc', 'desc'

    const sortHeader = document.getElementById('sort-type-header');
    if (!sortHeader) return;

    sortHeader.addEventListener('click', () => {
        if (sortState === 'unsorted') {
            // Sort ascending
            sortState = 'asc';
            sortHeader.innerText = 'Type 🔽';

            data.skills.sort((a, b) => {
                const typeA = a.type.toUpperCase();
                const typeB = b.type.toUpperCase();
                return typeA.localeCompare(typeB);
            });

        } else if (sortState === 'asc') {
            // Sort descending
            sortState = 'desc';
            sortHeader.innerText = 'Type 🔼';

            data.skills.sort((a, b) => {
                const typeA = a.type.toUpperCase();
                const typeB = b.type.toUpperCase();
                return typeB.localeCompare(typeA);
            });

        } else {
            // Restore original order
            sortState = 'unsorted';
            sortHeader.innerText = 'Type ⏹️';

            data.skills = [...originalSkillsOrder]; // Restore original
        }

        // Re-render table after each state
        renderSkillsTable(data);
    });
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

function deleteSkill(skillId, skillName) {
    // Show confirmation dialog with skill name
    if (confirm(`Are you sure you want to delete the skill "${skillName}"?`)) {
        // If confirmed, call the deleteSkill function with skillId
        fetch('manage_skills.php?action=delete', {
            method: 'POST',
            body: new URLSearchParams({ 'skill_id': skillId })
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    clearCache();
                    navigate('skills');
                } else {
                    alert('Failed to delete skill: ' + (result.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting the skill.');
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
    // Create modal background (overlay)
    const modalBackground = document.createElement('div');
    modalBackground.className = 'modal-overlay';
    modalBackground.style.display = 'flex'; // Make it visible immediately

    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'modal-card';
    modal.innerHTML = `
        <h2>Add New Skill</h2>

        <label for="skillNameInput">Skill Name:</label>
        <input type="text" id="skillNameInput" class="modal-input" style="margin-bottom: 15px;"/>

        <label>Skill Type:</label>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button id="technicalBtn" style="flex: 1; padding: 8px;">Technical</button>
            <button id="softBtn" style="flex: 1; padding: 8px;">Soft</button>
        </div>

        <label for="skillDescInput">Skill Description:</label>
        <textarea id="skillDescInput" class="modal-input" style="height: 80px; margin-bottom: 15px;"></textarea>

        <div class="modal-actions">
            <button id="saveSkillBtn" class="modal-input" style="width: auto; padding: 8px 16px;">Save</button>
            <button id="cancelSkillBtn" class="modal-input" style="width: auto; padding: 8px 16px;">Cancel</button>
        </div>
    `;

    // Add modal to the overlay
    modalBackground.appendChild(modal);
    document.body.appendChild(modalBackground);

    // Handle Cancel Button
    modal.querySelector('#cancelSkillBtn').addEventListener('click', function () {
        document.body.removeChild(modalBackground);
    });

    let selectedSkillType = '';

    modal.querySelector('#technicalBtn').addEventListener('click', function () {
        selectedSkillType = 'Technical';
        updateSkillTypeButtons();
    });

    modal.querySelector('#softBtn').addEventListener('click', function () {
        selectedSkillType = 'Soft';
        updateSkillTypeButtons();
    });

    function updateSkillTypeButtons() {
        const buttons = [modal.querySelector('#technicalBtn'), modal.querySelector('#softBtn')];

        // Remove background color and reset styles for all buttons
        buttons.forEach(button => {
            button.style.backgroundColor = ''; // Reset background color
            button.style.color = ''; // Reset text color
            button.classList.remove('active'); // Remove 'active' class
        });

        // Set styles for the selected button
        if (selectedSkillType === 'Technical') {
            modal.querySelector('#technicalBtn').style.backgroundColor = '#00a0dc'; // Active background for Technical
            modal.querySelector('#technicalBtn').style.color = '#fff'; // Text color white
            modal.querySelector('#technicalBtn').classList.add('active'); // Add active class to Technical button
        } else if (selectedSkillType === 'Soft') {
            modal.querySelector('#softBtn').style.backgroundColor = '#00a0dc'; // Active background for Soft (light pink)
            modal.querySelector('#softBtn').style.color = '#fff'; // Text color white
            modal.querySelector('#softBtn').classList.add('active'); // Add active class to Soft button
        }
    }


    modal.querySelector('#saveSkillBtn').addEventListener('click', function () {
        const skillName = modal.querySelector('#skillNameInput').value.trim();
        const skillDesc = modal.querySelector('#skillDescInput').value.trim();

        if (!skillName || !selectedSkillType || !skillDesc) {
            alert('Please fill out all fields.');
            return;
        }

        // Create the correct FormData keys
        const formData = new FormData();
        formData.append('skill_name', skillName);         // <-- must match PHP
        formData.append('skill_type', selectedSkillType);          // <-- must match PHP
        formData.append('skill_description', skillDesc);   // <-- must match PHP

        // Send the data
        fetch('manage_skills.php?action=create', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json()) // Expecting JSON now
            .then(result => {

                if (result.success) {
                    // Close modal after success
                    document.body.removeChild(modalBackground);

                    // Clear input fields
                    modal.querySelector('#skillNameInput').value = '';
                    modal.querySelector('#skillDescInput').value = '';
                    selectedSkillType = '';

                    clearCache();
                    navigate('skills');
                } else {
                    alert('Failed to save skill: ' + (result.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while saving the skill.');
            });
    });
}

function filterSkills() {
    const filter = document
        .getElementById('skillSearchInput')
        .value
        .trim()
        .toLowerCase();

    document
        .querySelectorAll('.skills-table tbody tr')
        .forEach(row => {
            const cells = row.getElementsByTagName('td');
            const name = (cells[0]?.textContent || '').trim().toLowerCase();
            const desc = (cells[2]?.textContent || '').trim().toLowerCase();

            row.style.display =
                name.includes(filter) || desc.includes(filter)
                    ? ''
                    : 'none';
        });
}



