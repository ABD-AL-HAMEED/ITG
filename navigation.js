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
            htmlContent = `<h2>Overview</h2><p>Manage everything from here.</p>`;
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
            htmlContent = `
                <h2>Skills Management</h2>
                <input type="text" id="new-skill" placeholder="Enter skill name">
                <button onclick="addSkill()">Add Skill</button>
                <ul id="skills-list"></ul>
            `;
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
