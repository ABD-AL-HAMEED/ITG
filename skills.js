function SkillsList() {
    let softSkillsList = document.getElementById("soft-skills-list");
    let techSkillsList = document.getElementById("tech-skills-list");

    if (!softSkillsList || !techSkillsList) return;

    softSkillsList.innerHTML = "";
    techSkillsList.innerHTML = "";

    let selectedPosition = document.getElementById("position").value;
    if (!selectedPosition) return;
    if (typeof positionSkills === "undefined" || !positionSkills[selectedPosition]) {
        console.error("Position skills data missing or incorrect");
        return;
    }

    let softSkills = positionSkills[selectedPosition]?.soft || [];
    let technicalSkills = positionSkills[selectedPosition]?.technical || [];

    softSkillsList.innerHTML = softSkills
        .map(skill => `<li><label><input type="checkbox" class="skill-checkbox" onchange="updateResults()" value="${skill}"> ${skill}</label></li>`)
        .join('');

    techSkillsList.innerHTML = technicalSkills
        .map(skill => `<li><label><input type="checkbox" class="skill-checkbox" onchange="updateResults()" value="${skill}"> ${skill}</label></li>`)
        .join('');
}
