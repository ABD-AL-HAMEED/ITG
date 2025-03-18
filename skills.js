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

  if (
    typeof positionSkills === "undefined" ||
    !positionSkills[selectedPosition]
  ) {
    console.error("Position skills data missing or incorrect");
    return;
  }

  let softSkills = positionSkills[selectedPosition].filter(
    (skill) => skill.type === "Soft"
  );
  let technicalSkills = positionSkills[selectedPosition].filter(
    (skill) => skill.type === "Technical"
  );

  console.log("Soft Skills:", softSkills);
  console.log("Technical Skills:", technicalSkills);

  if (selectedPosition === "") {
    return;
}

  softSkillsList.innerHTML = "";
  techSkillsList.innerHTML = "";

  softSkills.forEach((skill) => {
    let li = document.createElement("li");
    li.innerHTML = `
        <label>
          <input type="checkbox" class="skill-checkbox" onchange="updateResults()" value="${skill.name}">
          ${skill.name}
        </label>
      `;
    softSkillsList.appendChild(li);
  });

  technicalSkills.forEach((skill) => {
    let li = document.createElement("li");
    li.innerHTML = `
        <label>
          <input type="checkbox" class="skill-checkbox" onchange="updateResults()" value="${skill.name}">
          ${skill.name}
        </label>
      `;
    techSkillsList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  let positionSelect = document.getElementById("position");
  if (positionSelect) {
    console.log("Position dropdown found");
    positionSelect.addEventListener("change", SkillsList);
  } else {
    console.error("Position dropdown not found");
  }
});
