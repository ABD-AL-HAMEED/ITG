function SkillsList() {
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

    if (typeof positionSkills === "undefined" || !positionSkills[selectedPosition]) {
        console.error("Position skills data missing or incorrect");
        return;
    }

    let softSkills = positionSkills[selectedPosition]?.soft || [];
    let techSkills = positionSkills[selectedPosition]?.technical || [];

    softSkillsList.innerHTML = softSkills
        .map(skill => `<li><label><input type="checkbox" class="skill-checkbox" onchange="updateResults()" value="${skill}"> ${skill}</label></li>`)
        .join('');

    techSkillsList.innerHTML = techSkills
        .map(skill => `<li><label><input type="checkbox" class="skill-checkbox" onchange="updateResults()" value="${skill}"> ${skill}</label></li>`)
        .join('');
}

// Attach event listener when the page loads
document.addEventListener("DOMContentLoaded", function () {
    let positionSelect = document.getElementById("position");
    if (positionSelect) {
        positionSelect.addEventListener("change", SkillsList);
    }
});
