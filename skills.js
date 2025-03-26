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

  if (typeof positionSkills === "undefined") {
      console.error("Position skills data missing.");
      return;
  }

  // Filter positionSkills based on position_id
  let selectedSkills = positionSkills.filter(skill => skill.position_id === selectedPosition);
  
  let softSkills = selectedSkills
      .map(skill => skills.find(s => s.id === skill.skill_id && s.type === "Soft"))
      .filter(Boolean);

  let technicalSkills = selectedSkills
      .map(skill => skills.find(s => s.id === skill.skill_id && s.type === "Technical"))
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


document.addEventListener("DOMContentLoaded", function () {
    let positionSelect = document.getElementById("position");
    if (positionSelect) {
        console.log("Position dropdown found");
        positionSelect.addEventListener("change", SkillsList);
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
        }, 1000); // Retry after 1 second
    }
});

