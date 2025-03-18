function updateResults() {
    let selectedSkills = [...document.querySelectorAll(".skill-checkbox:checked")]
        .map(checkbox => checkbox.value.trim());

    let candidatesList = document.getElementById("candidates-list");
    if (!candidatesList) return;

    if (typeof candidates === "undefined" || !Array.isArray(candidates)) {
        console.error("Candidates data is missing or incorrect");
        return;
    }

    let matchingCandidates = candidates.filter(candidate =>
        Array.isArray(candidate.skills) && selectedSkills.some(skill => candidate.skills.includes(skill))
    );

    candidatesList.innerHTML = matchingCandidates.length
        ? matchingCandidates.map(c => `<li>${c.name}</li>`).join('')
        : "<li>No matching candidates found</li>";
}
