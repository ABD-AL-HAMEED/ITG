document.addEventListener("change", function (event) {
    if (event.target && event.target.id === "position") {
        console.log("Position dropdown detected and changed.");
        SkillsList();
    }
});



function SkillsList() {
    let positionSelect = document.getElementById("position");
    let softSkillsList = document.getElementById("soft-skills-list");
    let techSkillsList = document.getElementById("tech-skills-list");

    if (!positionSelect || !softSkillsList || !techSkillsList) {
        console.error("Missing elements for fetching skills.");
        return;
    }

    if (!window.positionSkills || !window.skills) {
        console.error("Position skills data or skills list is missing.");
        return;
    }

    let selectedPosition = positionSelect.value;
    if (!selectedPosition) {
        console.warn("No position selected.");
        return;
    }

    // Ensure the value type matches position_id
    let selectedSkills = positionSkills.filter(skill => skill.position_id == selectedPosition);

    let softSkills = selectedSkills
        .map(skill => skills.find(s => s.id == skill.skill_id && s.type === "Soft"))
        .filter(Boolean);

    let technicalSkills = selectedSkills
        .map(skill => skills.find(s => s.id == skill.skill_id && s.type === "Technical"))
        .filter(Boolean);

    console.log("Soft Skills:", softSkills);
    console.log("Technical Skills:", technicalSkills);

    softSkillsList.innerHTML = "";
    techSkillsList.innerHTML = "";

    softSkills.forEach(skill => {
        let li = document.createElement("li");
        li.innerHTML = `<label><input type="checkbox" class="skill-checkbox" value="${skill.skill_name}"> ${skill.skill_name}</label>`;
        softSkillsList.appendChild(li);
    });

    technicalSkills.forEach(skill => {
        let li = document.createElement("li");
        li.innerHTML = `<label><input type="checkbox" class="skill-checkbox" value="${skill.skill_name}"> ${skill.skill_name}</label>`;
        techSkillsList.appendChild(li);
    });
}