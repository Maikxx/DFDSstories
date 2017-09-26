const toggles = [document.getElementById("toggle-main-menu"), document.getElementById("toggle-login-form"), document.getElementById("toggle-button-group-sort")];

const buttonGroups = [...document.getElementsByClassName("button-group")];

function toggleJavascript() {
    document.getElementById(`${this.dataset.target}`).classList.toggle("js-active");
}

function determineElClicked() {
    if (this.id === "toggle-main-menu" && this.textContent == "☰") {
        this.textContent = "✕";
        this.setAttribute("aria-label", "Sluit hoofdmenu");
    } else if (this.id === "toggle-main-menu") {
        this.textContent = "☰";
        this.setAttribute("aria-label", "Open hoofdmenu");
    }

    if (this.id == "toggle-login-form") {
        this.classList.toggle("js-active");
    }
}

function handleFilterClick() {
    this.classList.toggle("js-active");
}

toggles.map(function (toggle) {
    toggle.addEventListener("click", function () {
        toggleJavascript.call(this);
        determineElClicked.call(this);
    });
});

buttonGroups.map(function (group) {
    [...group.getElementsByTagName("button"), ...group.getElementsByTagName("li")].map(function (item) {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            handleFilterClick.call(this);
        });
    });

});