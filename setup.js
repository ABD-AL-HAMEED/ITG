function setupNavigation() {
    document.querySelectorAll(".sidebar a").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            let section = this.getAttribute("onclick").match(/'([^']+)'/)[1]; // Extract section name
            navigate(section, event);
        });
    });
}
