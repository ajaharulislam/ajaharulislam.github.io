
/* ==========================================================
   Ajaharul Islam - Academic Website
   Main JavaScript
   ========================================================== */


/* ==========================================================
   BEGIN: DOCUMENT INITIALIZATION
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll("nav a");
    const sections = document.querySelectorAll("main section");

    const defaultTab = "about";

    const validTabs = new Set(
        Array.from(sections, section => section.id)
    );

    const loadedTabs = new Set();


    /* ======================================================
       BEGIN: DYNAMIC TAB CONTENT LOADING
       ====================================================== */

    async function loadTab(tabId) {

        const section = document.getElementById(tabId);

        if (!section || !validTabs.has(tabId)) {
            return false;
        }

        // Do not fetch a tab that has already been loaded.
        if (loadedTabs.has(tabId)) {
            return true;
        }

        const filePath = section.dataset.page;

        if (!filePath) {
            section.textContent = "Page configuration missing.";
            return false;
        }

        section.innerHTML = "<p>Loading content...</p>";

        try {

            const response = await fetch(filePath);

            if (!response.ok) {
                throw new Error(
                    "Unable to load " + filePath +
                    " (HTTP " + response.status + ")"
                );
            }

            const html = await response.text();

            // Parse the HTML before inserting its content.
            const template = document.createElement("template");
            template.innerHTML = html;

            // Support either an HTML fragment or a full HTML file.
            const content = template.content.querySelector("body");

            if (content) {
                section.replaceChildren(...Array.from(content.childNodes));
            } else {
                section.replaceChildren(
                    ...Array.from(template.content.childNodes)
                );
            }

            loadedTabs.add(tabId);

            return true;

        } catch (error) {

            console.error("Tab loading error:", error);

            section.innerHTML =
                "<p>Unable to load this page. Please try again later.</p>";

            return false;
        }

    }

    /* ======================================================
       END: DYNAMIC TAB CONTENT LOADING
       ====================================================== */


    /* ======================================================
       BEGIN: TAB DISPLAY AND ACTIVE NAVIGATION
       ====================================================== */

    async function showTab(tabId) {

        if (!validTabs.has(tabId)) {
            tabId = defaultTab;
        }

        // Hide all tabs before showing the selected one.
        sections.forEach(section => {
            section.style.display = "none";
        });

        const target = document.getElementById(tabId);

        // Display the selected tab.
        target.style.display = "block";

        // Update the active navigation link.
        navLinks.forEach(link => {

            const linkTab = link.getAttribute("href").substring(1);

            link.classList.toggle(
                "active",
                linkTab === tabId
            );

        });

        // Load the tab's content when needed.
        await loadTab(tabId);

    }

    /* ======================================================
       END: TAB DISPLAY AND ACTIVE NAVIGATION
       ====================================================== */


    /* ======================================================
       BEGIN: NAVIGATION CLICK HANDLING
       ====================================================== */

    navLinks.forEach(link => {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const tabId = this.getAttribute("href").substring(1);

            if (!validTabs.has(tabId)) {
                return;
            }

            // Update the URL without reloading the website.
            history.pushState(null, "", "#" + tabId);

            showTab(tabId);

        });

    });

    /* ======================================================
       END: NAVIGATION CLICK HANDLING
       ====================================================== */


    /* ======================================================
       BEGIN: BROWSER HISTORY NAVIGATION
       ====================================================== */

    window.addEventListener("popstate", function () {

        const tabId = window.location.hash.substring(1);

        showTab(tabId || defaultTab);

    });

    /* ======================================================
       END: BROWSER HISTORY NAVIGATION
       ====================================================== */


    /* ======================================================
       BEGIN: INITIAL TAB DISPLAY
       ====================================================== */

    const initialTab = window.location.hash.substring(1);

    showTab(
        validTabs.has(initialTab) ? initialTab : defaultTab
    );

    /* ======================================================
       END: INITIAL TAB DISPLAY
       ====================================================== */

});

/* ==========================================================
   END: DOCUMENT INITIALIZATION
   ========================================================== */
