"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var onLoad = function () {
    var getCurrentPath = function () {
        var currentPath = window.location.pathname;

        if (currentPath == "/index.html" || currentPath == "/" || currentPath == "/#") {
            setListeners();
            getReadingList();
        }

        if (currentPath == "/html/search-results.html") createRequest();
    }();

    /* Create DOM listeners for the search form and the show-all button*/
    function setListeners() {
        document.getElementById("search-form").addEventListener("submit", function (e) {
            e.preventDefault();

            var input = document.getElementById("search-for-title").value;

            this.reset();
            route(input);
        });

        document.getElementById("show-all-stories").addEventListener("click", function () {
            return route("allStories");
        });
    };

    /* Route the listeners to the results page */
    function route(value) {
        localStorage.setItem("input", value);
        window.location.href = "/html/search-results.html";
    }

    /* Get the items which are inside of the readling list on the local storage and do something with it */
    function getReadingList() {
        var ls = localStorage.getItem("readingList");

        if (ls === null || ls.length == 0) {
            hideSortButton();
            readingListNotFound();
        } else {
            var articlesClassList = document.getElementsByClassName("article-wrapper")[0].classList;
            if (articlesClassList.contains("no-results")) {
                articlesClassList.remove("no-results");
            }
            // Create a request for the reading list.
        }
    }

    /* Error handling */
    function readingListNotFound() {
        var articleList = document.getElementsByClassName("article-wrapper")[0],
            iTag = document.createElement("i"),
            spanTag = document.createElement("span");

        iTag.setAttribute("aria-label", "Leeslijst icon");
        spanTag.innerHTML = "Er zijn geen verhalen gevonden in uw leeslijst.<br><a href='#search-form'>Ga op zoek naar nieuwe ervaringen!</a>";

        articleList.classList.add("no-results");
        articleList.appendChild(iTag);
        articleList.appendChild(spanTag);
    }
}();

function createRequest() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.myjson.com/bins/uneyp", true);

    var processing = void 0;

    xhr.onprogress = function () {
        if (processing == undefined) {
            createLoader();
            processing = true;
        }

        function createLoader() {
            var ul = document.createElement("ul");
            for (var i = 0; i < 12; i++) {
                var li = document.createElement("li");
                ul.appendChild(li);
            }
            ul.id = "story-loader";
            document.getElementsByClassName("article-wrapper")[0].appendChild(ul);
        }
    };
    xhr.onload = function () {
        if (this.status == 200) {
            document.getElementsByClassName("article-wrapper")[0].removeChild(document.getElementById("story-loader"));
            var data = JSON.parse(this.responseText);
            createArticles(data);
        }
    };
    xhr.onerror = function (err) {
        alertError(err);
    };
    xhr.send();

    function alertError(error) {
        alert("Oeps, er ging iets fout, met de foutmelding: " + error + ". Probeer de pagina opnieuw te laden om de fout op te lossen!");
    }
};

function createArticles(data) {
    var input = localStorage.getItem("input");
    var articleWrapper = document.getElementsByClassName("article-wrapper")[0];

    function mapData() {
        var resultArray = [];

        data.stories.forEach(function (story) {
            if (input === "allStories") {
                resultArray.push(story.title);
            } else {
                if (story.title.toLowerCase().includes(input.toLowerCase())) {
                    resultArray.push(story.title);
                }
            }
        });
        return resultArray;
    }

    (function getResults() {
        var matches = mapData();
        if (matches.length == 0 || matches == undefined) {
            hideSortButton();
            var span = document.createElement("span");
            span.innerHTML = "Helaas, er zijn geen matches gevonden met de opgegeven (deel)titel.<br>Probeer een andere titel, <a href=\"#\">laat alle verhalen zien</a> of gebruik de filters om te zoeken.";

            articleWrapper.appendChild(span);
        } else if (matches.length > 25) {
            var toShow = matches.slice(0, 25);
            var toHide = matches.slice(25);

            mapMatches(toShow);

            var button = document.createElement("button");
            button.setAttribute("type", "button");
            button.setAttribute("aria-label", "Toon nog 25 verhalen");
            button.classList.add("btn", "btn-main");
            button.innerText = "Toon meer verhalen";
            articleWrapper.appendChild(button);
        } else {
            mapMatches(matches);
        }

        [].concat(_toConsumableArray(document.getElementsByClassName("section-title"))).forEach(function (title) {
            if (title.innerHTML == "Resultaten" || title.innerHTML == "Leeslijst") {
                title.innerHTML += " - " + matches.length;
            }
        });
    })();

    function mapMatches(array) {
        array.forEach(function (match, i) {
            data.stories.map(function (story) {
                return matchStorageToRequest(match, story, i, articleWrapper);
            });
        });
    }
}

function hideSortButton() {
    var sortButton = document.getElementById("toggle-button-group-sort");
    sortButton.style.display = "none";
}

function matchStorageToRequest(match, story, i, resultList) {
    if (match == story.title) {
        var img = "http://lorempixel.com/400/200/";
        var title = story.title.toLowerCase();
        var number = story.nr;
        var by = story.by;

        var maxLength = 220;

        // NT3RP @StackOverflow
        var trimmedString = story.text.substr(0, maxLength);
        trimmedString = story.text.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));

        var preview = trimmedString;
        var fullText = story.text.substring(Math.max(trimmedString.length, trimmedString.lastIndexOf(" ")));

        resultList.innerHTML += CreateArticleStructure(img, by, title, number, preview, fullText, i);
    }
}

function CreateArticleStructure(img, by, title, number, preview, fullText, i) {
    var article = "\n        <article>\n            <header class=\"article-header\">\n                <img src=" + img + " alt=\"search-result-image\" onclick=\"toggleJavascript.call(this)\" data-target=\"rest-text-" + i + "\">\n                <span>Door: " + by + "</span>\n                <div><h3>" + title + " (" + number + ")</h3></div>\n                <button type=\"button\" aria-label=\"Open optie venster\" onclick=\"toggleJavascript.call(this)\" data-target=\"modal-story-" + i + "\"></button>\n                <ul type=\"menubar\" class=\"modal\" id=\"modal-story-" + i + "\">\n                    <li type=\"menuitem\">Downloaden naar device</li>\n                    <li type=\"menuitem\">Niet ge\xEFnteresseerd</li>\n                    <li type=\"menuitem\">Toevoegen aan leeslijst</li>\n                    <li type=\"menuitem\">Verhaal lezen</li>\n                </ul>\n            </header>\n            <p onclick=\"toggleJavascript.call(this)\" aria-label=\"Open volledig verhaal\" data-target=\"rest-text-" + i + "\">\n                " + preview + "\n                <span id=\"rest-text-" + i + "\">" + fullText + "</span>\n            </p>\n         </article>\n        ";

    return article;
}

// Microinteractions
function toggleJavascript() {
    document.getElementById("" + this.dataset.target).classList.toggle("js-active");
    if (this.dataset.target.includes("modal-story")) {
        this.setAttribute("aria-label", "Sluit optie venster");
    }

    if (this.dataset.target.includes("rest-text") && !this.classList.contains("js-active")) {
        this.setAttribute("aria-label", "Sluit volledig verhaal");
        this.classList.add("js-active");
    } else if (this.dataset.target.includes("rest-text") && this.classList.contains("js-active")) {
        this.setAttribute("aria-label", "Open volledig verhaal");
        this.classList.remove("js-active");
    }
}

function determineElClicked() {
    if (this.dataset.target === "main-menu" && this.textContent == "☰") {
        this.textContent = "✕";
        this.setAttribute("aria-label", "Sluit hoofdmenu");
    } else if (this.dataset.target === "main-menu" && this.textContent == "✕") {
        this.textContent = "☰";
        this.setAttribute("aria-label", "Open hoofdmenu");
    } else {
        this.classList.toggle("js-active");
    }
}

[].concat(_toConsumableArray(document.querySelectorAll("[data-target]"))).map(function (toggle) {
    toggle.addEventListener("click", function () {
        toggleJavascript.call(this);
        determineElClicked.call(this);
    });
});