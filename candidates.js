function updateResults() {
    let selectedSkills = [...document.querySelectorAll(".skill-checkbox:checked")]
        .map(checkbox => checkbox.parentElement.textContent.trim());

    let candidatesList = document.getElementById("candidates-list");
    if (!candidatesList) return;

    let matchingCandidates = candidates.filter(candidate =>
        selectedSkills.some(skill => candidate.skills.includes(skill))
    );

    candidatesList.innerHTML = matchingCandidates.length
        ? matchingCandidates.map(c => `<li>${c.name}</li>`).join('')
        : "<li>No matching candidates found</li>";
}
