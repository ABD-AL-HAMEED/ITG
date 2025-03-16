document.addEventListener("DOMContentLoaded", function () {
    setupNavigation();
    if (typeof positionSkills === "undefined") {
        console.error("position Skills is not defined");
    } else {
        console.log("Loaded positionSkills:", positionSkills);
    }
    navigate('dashboard'); // Load default section
});
