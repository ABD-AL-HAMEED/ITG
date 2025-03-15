function SkillsList() {
    let softSkillsList = document.getElementById("soft-skills-list");
    let techSkillsList = document.getElementById("tech-skills-list");

    if (!softSkillsList || !techSkillsList) return;

    softSkillsList.innerHTML = "";
    techSkillsList.innerHTML = "";

    let selectedPosition = document.getElementById("position").value;
    if (!selectedPosition || !positionSkills[selectedPosition]) return;

    if (positionSkills[selectedPosition]['soft']) {
        softSkillsList.innerHTML = positionSkills[selectedPosition]['soft']
            .map(skill => `<li><label><input type="checkbox" class="skill-checkbox" onchange="updateResults()"> ${skill}</label></li>`)
            .join('');
    }

    if (positionSkills[selectedPosition]['technical']) {
        techSkillsList.innerHTML = positionSkills[selectedPosition].technical
            .map(skill => `<li><label><input type="checkbox" class="skill-checkbox" onchange="updateResults()"> ${skill}</label></li>`)
            .join('');
    }
}
