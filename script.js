
document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll("nav a");
    const sections = document.querySelectorAll("main section");

    function showSection(sectionId) {

        const target = document.getElementById(sectionId);

        if (!target) return;

        sections.forEach(section => {
            section.style.display = "none";
        });

        // Keep research interests and news on About page
        if (sectionId === "about") {
            ["about", "interests", "news"].forEach(id => {
                const element = document.getElementById(id);
                if (element) element.style.display = "block";
            });
        } else {
            target.style.display = "block";
        }

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + sectionId
            );
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const sectionId = this.getAttribute("href").substring(1);

            showSection(sectionId);
            history.replaceState(null, "", "#" + sectionId);
        });
    });

    const initialSection = window.location.hash.substring(1);

    showSection(
        document.getElementById(initialSection)
            ? initialSection
            : "about"
    );

});
