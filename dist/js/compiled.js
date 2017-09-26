"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var toggles = [document.getElementById("toggle-main-menu"), document.getElementById("toggle-login-form"), document.getElementById("toggle-button-group-sort")];

var buttonGroups = [].concat(_toConsumableArray(document.getElementsByClassName("button-group")));

function toggleJavascript() {
    document.getElementById("" + this.dataset.target).classList.toggle("js-active");
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
    [].concat(_toConsumableArray(group.getElementsByTagName("button")), _toConsumableArray(group.getElementsByTagName("li"))).map(function (item) {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            handleFilterClick.call(this);
        });
    });
});