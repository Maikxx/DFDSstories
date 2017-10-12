let onLoad = function () {
    let getCurrentPath = function () {
        let currentPath = window.location.pathname;

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

            let input = document.getElementById("search-for-title").value;

            this.reset();
            route(input);
        });

        document.getElementById("show-all-stories").addEventListener("click", () => route("allStories"));
    };

    /* Route the listeners to the results page */
    function route(value) {
        localStorage.setItem("input", value);
        window.location.href = "/html/search-results.html";
    }

    /* Get the items which are inside of the readling list on the local storage and do something with it */
    function getReadingList() {
        let ls = localStorage.getItem("readingList");

        if (ls === null || ls.length == 0) {
            hideSortButton();
            readingListNotFound();
        } else {
            let articlesClassList = document.getElementsByClassName("article-wrapper")[0].classList;
            if (articlesClassList.contains("no-results")) {
                articlesClassList.remove("no-results");
            }
            // Create a request for the reading list.
        }
    }

    /* Error handling */
    function readingListNotFound() {
        let articleList = document.getElementsByClassName("article-wrapper")[0],
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
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.myjson.com/bins/uneyp", true);

    let processing;

    xhr.onprogress = function () {
        if (processing == undefined) {
            createLoader();
            processing = true;
        }

        function createLoader() {
            let ul = document.createElement("ul");
            for (var i = 0; i < 12; i++) {
                let li = document.createElement("li");
                ul.appendChild(li);
            }
            ul.id = "story-loader";
            document.getElementsByClassName("article-wrapper")[0].appendChild(ul);
        }
    }
    xhr.onload = function () {
        if (this.status == 200) {
            document.getElementsByClassName("article-wrapper")[0].removeChild(document.getElementById("story-loader"));
            let data = JSON.parse(this.responseText);
            createArticles(data);
        }
    }
    xhr.onerror = function (err) {
        alertError(err);
    }
    xhr.send();

    function alertError(error) {
        alert(`Oeps, er ging iets fout, met de foutmelding: ${error}. Probeer de pagina opnieuw te laden om de fout op te lossen!`);
    }
};

function createArticles(data) {
    let input = localStorage.getItem("input");
    const articleWrapper = document.getElementsByClassName("article-wrapper")[0];

    function mapData() {
        let resultArray = [];

        data.stories.forEach(story => {
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
        let matches = mapData();
        if (matches.length == 0 || matches == undefined) {
            hideSortButton();
            let span = document.createElement("span");
            span.innerHTML = `Helaas, er zijn geen matches gevonden met de opgegeven (deel)titel.<br>Probeer een andere titel, <a href="#">laat alle verhalen zien</a> of gebruik de filters om te zoeken.`;

            articleWrapper.appendChild(span);
        } else if (matches.length > 25) {
            let toShow = matches.slice(0, 25);
            let toHide = matches.slice(25);

            mapMatches(toShow);

            let button = document.createElement("button");
            button.setAttribute("type", "button");
            button.setAttribute("aria-label", "Toon nog 25 verhalen");
            button.classList.add("btn", "btn-main");
            button.innerText = "Toon meer verhalen";
            articleWrapper.appendChild(button);
        } else {
            mapMatches(matches);
        }

        [...document.getElementsByClassName("section-title")].forEach((title) => {
            if (title.innerHTML == "Resultaten" || title.innerHTML == "Leeslijst") {
                title.innerHTML += ` - ${matches.length}`;
            }
        });
    })();

    function mapMatches(array) {
        array.forEach((match, i) => {
            data.stories.map(story => matchStorageToRequest(match, story, i, articleWrapper));
        });
    }
}

function hideSortButton() {
    let sortButton = document.getElementById("toggle-button-group-sort");
    sortButton.style.display = "none";
}

function matchStorageToRequest(match, story, i, resultList) {
    if (match == story.title) {
        let img = "http://lorempixel.com/400/200/";
        let title = story.title.toLowerCase();
        let number = story.nr;
        let by = story.by;

        let maxLength = 220;

        // NT3RP @StackOverflow
        let trimmedString = story.text.substr(0, maxLength);
        trimmedString = story.text.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));

        let preview = trimmedString;
        let fullText = story.text.substring(Math.max(trimmedString.length, trimmedString.lastIndexOf(" ")));

        resultList.innerHTML += CreateArticleStructure(img, by, title, number, preview, fullText, i);
    }
}

function CreateArticleStructure(img, by, title, number, preview, fullText, i) {
    let article = `
        <article>
            <header class="article-header">
                <img src=${img} alt="search-result-image" onclick="toggleJavascript.call(this)" data-target="rest-text-${i}">
                <span>Door: ${by}</span>
                <div><h3>${title} (${number})</h3></div>
                <button type="button" aria-label="Open optie venster" onclick="toggleJavascript.call(this)" data-target="modal-story-${i}"></button>
                <ul type="menubar" class="modal" id="modal-story-${i}">
                    <li type="menuitem">Downloaden naar device</li>
                    <li type="menuitem">Niet geïnteresseerd</li>
                    <li type="menuitem">Toevoegen aan leeslijst</li>
                    <li type="menuitem">Verhaal lezen</li>
                </ul>
            </header>
            <p onclick="toggleJavascript.call(this)" aria-label="Open volledig verhaal" data-target="rest-text-${i}">
                ${preview}
                <span id="rest-text-${i}">${fullText}</span>
            </p>
         </article>
        `;

    return article;
}

// Microinteractions
function toggleJavascript() {
    document.getElementById(`${this.dataset.target}`).classList.toggle("js-active");
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

[...document.querySelectorAll("[data-target]")].map(toggle => {
    toggle.addEventListener("click", function () {
        toggleJavascript.call(this);
        determineElClicked.call(this);
    });
});