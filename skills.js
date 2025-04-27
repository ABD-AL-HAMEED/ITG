// Main Application Controller
const API_BASE_URL = 'http://localhost:5000';
const EVALUATION_API_URL = 'http://localhost:5001';
/*
document.addEventListener("DOMContentLoaded", function () {
    // Initialize the application
    initPositionDropdown();
    setupEvaluationResultsDisplay();
});*/

// Position and Skills Selection Functions
function initPositionDropdown() {
    let positionSelect = document.getElementById("position");
    if (positionSelect) {
        console.log("Position dropdown found");
        positionSelect.addEventListener("change", SkillsList);

        // Initialize skills list if position is already selected
        if (positionSelect.value) {
            SkillsList();
        }
    } else {
        console.error("Position dropdown not found, retrying...");
        setTimeout(() => {
            let retrySelect = document.getElementById("position");
            if (retrySelect) {
                console.log("Position dropdown found on retry.");
                retrySelect.addEventListener("change", SkillsList);
            } else {
                console.error("Position dropdown still not found. Check HTML.");
            }
        }, 1000);
    }
}

function SkillsList() {
    // Add style only once
    if (!document.getElementById("skills-style")) {
        let style = document.createElement("style");
        style.id = "skills-style";
        style.textContent = `
            .skills-submit-button {
                background-color: #2d6f84;
                color: white;
                padding: 8px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                margin-top: 10px;
                margin-bottom: 10px;
            }
        `;
        document.head.appendChild(style);
    }

    // Now your existing logic
    let positionSelect = document.getElementById("position");
    let softSkillsList = document.getElementById("soft-skills-list");
    let techSkillsList = document.getElementById("tech-skills-list");

    if (!positionSelect || !softSkillsList || !techSkillsList) {
        console.error("Missing elements for fetching skills.");
        return;
    }

    let selectedPosition = positionSelect.value;
    if (!selectedPosition) {
        console.warn("No position selected.");
        return;
    }

    if (typeof positionSkills === "undefined") {
        console.error("Position skills data missing.");
        return;
    }

    let existingButton = document.getElementById("skills-submit-button");
    if (existingButton) {
        existingButton.remove();
    }

    let selectedSkills = positionSkills.filter(skill => skill.position_id === selectedPosition);

    let softSkills = selectedSkills
        .map(skill => skills.find(s => s.id === skill.skill_id && s.type === "Soft"))
        .filter(Boolean);

    let technicalSkills = selectedSkills
        .map(skill => skills.find(s => s.id === skill.skill_id && s.type === "Technical"))
        .filter(Boolean);
    softSkillsList.innerHTML = "";
    techSkillsList.innerHTML = "";

    softSkills.forEach(skill => {
        let li = document.createElement("li");
        li.innerHTML = `<label><input type="checkbox" class="skill-checkbox" name="skills" value="${skill.id}"> ${skill.skill_name}</label>`;
        softSkillsList.appendChild(li);
    });

    technicalSkills.forEach(skill => {
        let li = document.createElement("li");
        li.innerHTML = `<label><input type="checkbox" class="skill-checkbox" name="skills" value="${skill.id}"> ${skill.skill_name}</label>`;
        techSkillsList.appendChild(li);
    });
    let submitButton = document.createElement("button");
    submitButton.textContent = "Retrieve";
    submitButton.id = "skills-submit-button";
    submitButton.className = "skills-submit-button";
    submitButton.onclick = sendSkillsData;

    techSkillsList.parentNode.appendChild(submitButton);
}


function sendSkillsData() {
    // Get selected position
    let positionSelect = document.getElementById("position");
    let selectedPosition = positionSelect.value;

    // Get checked skills and collect just their names
    let softSkillNames = Array.from(
        document.querySelectorAll('#soft-skills-list input.skill-checkbox:checked')
    ).map(cb => cb.parentNode.textContent.trim());

    let techSkillNames = Array.from(
        document.querySelectorAll('#tech-skills-list input.skill-checkbox:checked')
    ).map(cb => cb.parentNode.textContent.trim());

    if (!selectedPosition) {
        alert("Please select a position");
        return;
    }

    if (softSkillNames.length === 0 && techSkillNames.length === 0) {
        alert("Please select at least one skill");
        return;
    }

    // Prepare data to send
    let dataToSend = {
        position: selectedPosition,
        soft_skills: softSkillNames,
        technical_skills: techSkillNames
    };

    showLoadingIndicator();

    fetch(`${API_BASE_URL}/receive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Success:", data);
            hideLoadingIndicator();
            alert(`Successfully submitted skills for position!\nServer response: ${data.message}`);
            // After submitting skills, fetch and display the evaluation results
            fetchAndDisplayEvaluationResults();
        })
        .catch(error => {
            console.error("Error:", error);
            hideLoadingIndicator();
            alert("Error submitting skills. Please check console for details.");
        });
}

// Evaluation Results Display Functions
function setupEvaluationResultsDisplay() {
    const resultsContainer = document.getElementById('results-container') || document.body;
    resultsContainer.innerHTML = `
        <div id="evaluation-results">
            <h2>CV Evaluation Results</h2>
            <button id="refresh-results">Refresh Results</button>
            <div id="results-content"></div>
        </div>
    `;

    document.getElementById('refresh-results').addEventListener('click', fetchAndDisplayEvaluationResults);
}

async function fetchAndDisplayEvaluationResults() {
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML = '<p>Loading evaluation results...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/get-evaluation-results`);

        if (!response.ok) {
            throw new Error(`Network error: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.error || "Unknown server error");
        }

        displayEvaluationResults(result.data, resultsContent);

    } catch (error) {
        console.error("Failed to fetch evaluation results:", error);
        resultsContent.innerHTML = `<p class="error">Error loading results: ${error.message}</p>`;
    }
}

function displayEvaluationResults(evaluations, container) {
    // Handle both array and single object formats
    const evaluationsList = Array.isArray(evaluations) ? evaluations : [evaluations];

    if (evaluationsList.length === 0) {
        container.innerHTML = '<p>No evaluation results available</p>';
        return;
    }

    let html = `
        <div class="summary">
            <p>Showing ${evaluationsList.length} evaluation(s)</p>
        </div>
    `;

    evaluationsList.forEach((evaluation, index) => {
        html += `
            <div class="evaluation">
                <h3>Evaluation #${index + 1}</h3>
                <div class="meta">
                    <p><strong>Position:</strong> ${evaluation.position || 'Not specified'}</p>
                    <p><strong>Evaluated on:</strong> ${formatDate(evaluation.timestamp)}</p>
                </div>
                <div class="cvs-list">
                    ${renderCVsList(evaluation.evaluations)}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Add event listeners to CV items for detailed view
    document.querySelectorAll('.cv-item').forEach(item => {
        item.addEventListener('click', function () {
            const cvData = JSON.parse(this.dataset.cv);
            showCVDetails(cvData);
        });
    });
}

function renderCVsList(cvs) {
    if (!cvs || cvs.length === 0) {
        return '<p>No CVs in this evaluation</p>';
    }

    return `
        <h4>CVs Evaluated (${cvs.length}):</h4>
        <ul class="cv-list">
            ${cvs.map((cv, i) => `
                <li class="cv-item" data-cv='${JSON.stringify(cv)}'>
                    <span class="filename">${cv.filename}</span>
                    <span class="score">${cv.score?.toFixed(2) || 'N/A'}/100</span>
                </li>
            `).join('')}
        </ul>
    `;
}

function showCVDetails(cv) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h3>${cv.filename}</h3>
            <div class="score">Score: ${cv.score?.toFixed(2) || 'N/A'}/100</div>
            
            <div class="skills-section">
                <div class="matched">
                    <h4>Matched Skills</h4>
                    <div class="technical">
                        <h5>Technical</h5>
                        <ul>${createSkillItems(cv.matched_technical_skills)}</ul>
                    </div>
                    <div class="soft">
                        <h5>Soft</h5>
                        <ul>${createSkillItems(cv.matched_soft_skills)}</ul>
                    </div>
                </div>
                
                <div class="missing">
                    <h4>Missing Skills</h4>
                    <div class="technical">
                        <h5>Technical</h5>
                        <ul>${createSkillItems(cv.missing_technical_skills)}</ul>
                    </div>
                    <div class="soft">
                        <h5>Soft</h5>
                        <ul>${createSkillItems(cv.missing_soft_skills)}</ul>
                    </div>
                </div>
            </div>
            
            <div class="report">
                <h4>Evaluation Report</h4>
                <p>${cv.report || 'No report available'}</p>
            </div>
        </div>
    `;

    modal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    document.body.appendChild(modal);
}

// Utility Functions
function createSkillItems(skills) {
    if (!skills || skills.length === 0) {
        return '<li>None</li>';
    }
    return skills.map(skill => `<li>${skill}</li>`).join('');
}

function formatDate(timestamp) {
    if (!timestamp) return 'Unknown date';
    try {
        const date = new Date(timestamp);
        return date.toLocaleString();
    } catch {
        return timestamp;
    }
}

function showLoadingIndicator() {
    let loader = document.getElementById('loading-indicator');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loading-indicator';
        loader.className = 'loading';
        loader.textContent = 'Processing...';
        document.body.appendChild(loader);
    }
    loader.style.display = 'block';
}

function hideLoadingIndicator() {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
        loader.style.display = 'none';
    }
}