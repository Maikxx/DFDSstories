"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Component which contains most of the DOM elements.
var DOMTraverse = {
    /* Multiple Pages */
    articleWrapper: document.querySelector(".article-wrapper"),
    articleSection: document.getElementsByClassName("article-section")[0],
    mainMenu: document.getElementById("main-menu"),
    mainMenuToggle: document.getElementById("toggle-main-menu"),
    mainTag: document.querySelector("main"),
    sectionTitles: document.getElementsByClassName("section-title"),

    /* Index Page */
    allStoriesButton: document.getElementById("show-all-stories"),
    downloadInformationModal: document.getElementById("download-modal-small-screen"),
    downloadLoader: document.getElementById("download-loader"),
    filterForm: document.getElementById("filter-form"),
    searchform: document.getElementById("search-form"),
    searchInput: document.getElementById("search-for-title"),

    /* Download Page */
    downloadWrapper: document.getElementsByClassName("download-wrapper")[0],
    downloadModal: document.getElementsByClassName("download-modal")[0],
    downloadStoryButton: document.getElementById("download-story-button"),
    downloadAllButton: document.getElementById("download-all-button"),

    /* Results Page */
    storyLoader: document.getElementsByClassName("story-loader"),
    topSpanDownloads: document.getElementsByClassName("top-span downloads")[0],
    topSpanReadingList: document.getElementsByClassName("top-span reading-list")[0],
    topSpans: [].concat(_toConsumableArray(document.getElementsByClassName("top-span"))),

    /* Signup Page */
    // Forms
    loginForm: document.getElementById("login-form"),
    resetForm: document.getElementById("reset-form"),
    signUpForm: document.getElementById("sign-up-form"),
    // Inputs
    signUpBirthday: document.getElementById("sign-up-birthday"),
    // Constraint
    tovalidate: [].concat(_toConsumableArray(document.getElementsByClassName("validateJS")))
};

// Component which contains mostly reusable logic.
var Utility = {
    currentPath: window.location.pathname,
    getCurrentPath: function getCurrentPath() {
        if (this.currentPath == "/index.html" || this.currentPath == "/" || this.currentPath == "/projects/dfds_seaways/" || this.currentPath == "/projects/dfds_seaways/index.html") {
            return "index";
        } else if (this.currentPath == "/projects/dfds_seaways/html/search-results.html" || this.currentPath == "/html/search-results.html") return "searchResults";else if (this.currentPath == "/html/download-list.html" || this.currentPath == "/projects/dfds_seaways/html/download-list.html") return "downloads";else if (this.currentPath == "/html/signup.html" || this.currentPath == "/projects/dfds_seaways/html/signup.html") return "signUp";else if (this.currentPath == "/html/stories/kater.html" || this.currentPath == "/projects/dfds_seaways/html/stories/kater.html") return "kater";else if (this.currentPath == "/html/stories/paranoia.html" || this.currentPath == "/projects/dfds_seaways/html/stories/paranoia.html") return "paranoia";else if (this.currentPath == "/html/stories/vrijdag-de-dertiende.html" || this.currentPath == "/projects/dfds_seaways/html/stories/vrijdag-de-dertiende.html") return "vrijdag";
    },
    getCurrentScreenHeight: window.innerHeight,
    getCurrentScreenWidth: window.innerWidth,
    getImagePath: function getImagePath(image) {
        var path = void 0;
        if (this.currentPath.includes("dfds_seaways")) {
            if (this.currentPath == "/" || this.currentPath.includes("/index.html")) {
                path = "/projects/dfds_seaways/dist/img/icons/" + image + ".svg";
            } else if (!this.currentPath.includes("stories")) {
                path = "../dist/img/icons/" + image + ".svg";
            } else {
                path = "../../dist/img/icons/" + image + ".svg";
            }
        } else {
            if (this.currentPath == "/" || this.currentPath == "/index.html") {
                path = "./dist/img/icons/" + image + ".svg";
            } else if (!this.currentPath.includes("stories")) {
                path = "../dist/img/icons/" + image + ".svg";
            } else {
                path = "../../dist/img/icons/" + image + ".svg";
            }
        }
        return path;
    },
    MajorBreakPointTwo: 1039,
    route: function route(key, value) {
        localStorage.setItem(key, value);
        if (this.currentPath == "/" || this.currentPath == "/index.html") {
            window.location.href = "/html/search-results.html";
        } else {
            window.location.href = "/projects/dfds_seaways/html/search-results.html";
        }
    },
    storyStorage: "https://api.myjson.com/bins/qvlgr",
    xhr: new XMLHttpRequest()
};

// Component that loads and matches the stories that need to be created.
var LoadStories = {
    createRequest: function createRequest(storageItem) {
        var xhr = Utility.xhr;
        xhr.open("GET", Utility.storyStorage, true);

        var processing = void 0;

        xhr.onprogress = function () {
            if (processing == undefined) {
                LoadStories.createLoader(DOMTraverse.articleWrapper);
                processing = true;
            }
        };
        xhr.onload = function () {
            if (this.status == 200) {
                var data = JSON.parse(this.responseText);
                LoadStories.createArticles(data, storageItem);
            }
        };
        xhr.onerror = function (err) {
            alertError(err);
        };
        xhr.send();

        function alertError(error) {
            var span = document.createElement("span");
            span.innerText = "Oeps, er ging iets fout. Probeer de pagina opnieuw te laden om de fout op te lossen!";
            DOMTraverse.articleWrapper.appendChild(span);
        }
    },
    createLoader: function createLoader(appendTo) {
        var ul = document.createElement("ul");

        for (var i = 0; i < 12; i++) {
            var li = document.createElement("li");
            ul.appendChild(li);
        }

        ul.classList.add("story-loader");
        appendTo.appendChild(ul);
    },
    createArticles: function createArticles(data, storageItem) {
        var ls = void 0,
            loopCount = 0;

        function loopOverStories() {
            var resultArray = [];

            if (localStorage.getItem("filters") === undefined || localStorage.getItem("filters") === null) {
                if (storageItem == "input") {
                    ls = localStorage.getItem(storageItem);
                    data.stories.forEach(function (story) {
                        if (ls === "allStories") {
                            resultArray.push(story.title);
                        } else {
                            if (story.title.toLowerCase().includes(ls.toLowerCase()) || story.text.indexOf(ls.toLowerCase()) != -1) {
                                resultArray.push(story.title);
                            }
                        }
                    });
                } else if (storageItem == "readingList") {
                    ls = [].concat(_toConsumableArray(localStorage.getItem(storageItem).split(",")));
                    ls.forEach(function (item) {
                        resultArray.push(item);
                    });
                }
            } else {
                ls = JSON.parse(localStorage.getItem("filters"));
                for (var filter in ls) {
                    if (ls.hasOwnProperty(filter)) {
                        resultArray.push({
                            filter: ls[filter]
                        });
                    }
                }
            }
            return resultArray;
        }

        (function getResults() {
            var matches = void 0;

            function theUserIsFiltering() {
                var filters = loopOverStories();
                var filtersArray = [];
                var resultArray = [];

                (function getFilters() {
                    filters.forEach(function (filter) {
                        for (var filterValue in filter) {
                            if (filter.hasOwnProperty(filterValue)) {
                                filter[filterValue].forEach(function (value) {
                                    filtersArray.push(value);
                                });
                            }
                        }
                    });
                })();

                data.stories.forEach(function (story) {
                    filtersArray.forEach(function (filter) {
                        if (story.readTime === filter || story.storyLength === filter || story.ageSuggested === filter) {
                            resultArray.push(story.title);
                        }
                    });
                });

                return resultArray;
            }

            if (localStorage.getItem("filters") === undefined || localStorage.getItem("filters") === null) {
                matches = loopOverStories();
            } else {
                matches = theUserIsFiltering();
            }

            if (matches.length == 0 || matches == undefined) {
                LoadStories.hideSortButton();
                var span = document.createElement("span");
                span.innerHTML = "Helaas, er zijn geen matches gevonden met de opgegeven input: " + ls + ".<br>Probeer een ander zoekwoord, of gebruik de filters om te zoeken.";

                DOMTraverse.articleWrapper.style.backgroundColor = "white";
                DOMTraverse.articleWrapper.appendChild(span);
                setStoryAmount();
            } else if (matches.length > 25) {
                var currentCount = 0;
                if (currentCount == 0) {
                    var toShow = matches.slice(0, 25);
                    mapMatches(toShow);
                }

                if (storageItem == "readingList") {
                    DOMTraverse.articleWrapper.classList.add("reading-list-js-results");
                }
                // Create a function that handles the button click, to load in more stories.
                (function showNextStories() {
                    if (Utility.getCurrentScreenWidth > Utility.MajorBreakPointTwo) {
                        var elHeight = DOMTraverse.articleWrapper.clientHeight;

                        window.addEventListener("scroll", function () {
                            if (window.pageYOffset > elHeight - 1500) {
                                if (currentCount == 0) {
                                    var _toShow = matches.slice(25, 50);
                                    elHeight += elHeight;
                                    currentCount++;
                                    mapMatches(_toShow);
                                } else if (currentCount == 1) {
                                    var _toShow2 = matches.slice(50, 75);
                                    elHeight += 6000;
                                    currentCount++;
                                    mapMatches(_toShow2);
                                } else if (currentCount == 2) {
                                    var _toShow3 = matches.slice(75, 100);
                                    elHeight += elHeight;
                                    currentCount++;
                                    mapMatches(_toShow3);
                                }
                            }
                        });
                    } else {
                        var elWidth = DOMTraverse.articleWrapper.scrollWidth;

                        DOMTraverse.articleWrapper.addEventListener("scroll", function () {
                            if (DOMTraverse.articleWrapper.scrollLeft > elWidth - 1500) {
                                if (currentCount == 0) {
                                    var _toShow4 = matches.slice(25, 50);
                                    elWidth += elWidth;
                                    currentCount++;
                                    mapMatches(_toShow4);
                                } else if (currentCount == 1) {
                                    var _toShow5 = matches.slice(50, 75);
                                    elWidth += 6000;
                                    currentCount++;
                                    mapMatches(_toShow5);
                                } else if (currentCount == 2) {
                                    var _toShow6 = matches.slice(75, 100);
                                    elWidth += elWidth;
                                    currentCount++;
                                    mapMatches(_toShow6);
                                }
                            }
                        });
                    }
                })();

                setStoryAmount();
                setChevron();
            } else {
                if (storageItem == "readingList") {
                    DOMTraverse.articleWrapper.parentElement.classList.add("reading-list-js-results");
                }
                mapMatches(matches);
                setStoryAmount();
                setChevron();
            }

            function setStoryAmount() {
                [].concat(_toConsumableArray(DOMTraverse.sectionTitles)).forEach(function (title) {
                    if (title.innerHTML == "Resultaten" || title.innerHTML == "Leeslijst") {
                        title.innerHTML += " - " + matches.length;
                    }
                });
            }
        })();

        function mapMatches(matches) {
            if (loopCount == 0) {
                matches.forEach(function (match, i) {
                    data.stories.forEach(function (story) {
                        return LoadStories.matchStorageToRequest(match, story, i);
                    });
                });
                loopCount++;
            } else if (loopCount == 1) {
                var iterator = 25;
                matches.forEach(function (match) {
                    iterator++;
                    data.stories.forEach(function (story) {
                        return LoadStories.matchStorageToRequest(match, story, iterator);
                    });
                });
                loopCount++;
            } else if (loopCount == 2) {
                var _iterator = 50;
                matches.forEach(function (match) {
                    _iterator++;
                    data.stories.forEach(function (story) {
                        return LoadStories.matchStorageToRequest(match, story, _iterator);
                    });
                });
                loopCount++;
            } else if (loopCount == 3) {
                var _iterator2 = 75;
                matches.forEach(function (match) {
                    _iterator2++;
                    data.stories.forEach(function (story) {
                        return LoadStories.matchStorageToRequest(match, story, _iterator2);
                    });
                });
            }
        }

        function setChevron() {
            if (Utility.getCurrentScreenWidth < Utility.MajorBreakPointTwo) {
                DOMTraverse.articleSection.querySelector(".right-chevron").classList.add("js-active");
                console.log(true);
            } else {
                DOMTraverse.articleSection.removeChild(DOMTraverse.articleSection.querySelector(".right-chevron"));
            }
        }

        DOMTraverse.articleWrapper.removeChild(DOMTraverse.storyLoader[0]);
        this.loadingFininished = true;
    },
    hideSortButton: function hideSortButton() {
        var sortButton = document.getElementById("toggle-button-group-sort");
        sortButton.style.display = "none";
    },
    loadingFininished: false,
    matchStorageToRequest: function matchStorageToRequest(match, story, i) {
        if (match == story.title.toLowerCase() || match == story.title) {
            var img = void 0;
            if (story.image != null || story.image != undefined) {
                if (!Utility.currentPath.includes("dfds_seaways")) {
                    img = "/dist/img/storyImages/" + story.image;
                } else if (Utility.currentPath.includes("search-results")) {
                    img = "../dist/img/storyImages/" + story.image;
                } else {
                    img = "dist/img/storyImages/" + story.image;
                }
            } else return;

            var title = story.title.toLowerCase(),
                number = story.nr,
                by = story.by;

            var filters = {
                readTime: story.readTime,
                storyLength: story.storyLength,
                ageSuggested: story.ageSuggested
            };

            var maxLength = 150;

            // NT3RP @StackOverflow - Splits the text up to a preview length
            var trimmedString = story.text.substr(0, maxLength);
            trimmedString = story.text.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));

            var preview = trimmedString,
                fullText = story.text.substring(Math.max(trimmedString.length, trimmedString.lastIndexOf(" ")));

            DOMTraverse.articleWrapper.innerHTML += CreateArticle.Article(img, by, title, number, preview, fullText, i, filters);
        }
    }
};

// Component that holds most dynamica of the sorting process.
var SortStories = {
    getElements: function getElements() {
        var sortForm = document.getElementById("button-group-sort"),
            inputs = sortForm.querySelectorAll("input"),
            labels = sortForm.querySelectorAll("label");

        return {
            sortForm: sortForm,
            inputs: inputs,
            labels: labels
        };
    },
    determineActiveSorter: function determineActiveSorter() {
        var _getElements = this.getElements(),
            sortForm = _getElements.sortForm,
            inputs = _getElements.inputs,
            labels = _getElements.labels;

        var previousCheckedInput = [],
            prev = void 0,
            currentActive = void 0;

        inputs.forEach(function (input) {
            function pushActives(inp) {
                previousCheckedInput.push(inp);
            }

            if (input.checked) {
                pushActives(input);
            }

            input.addEventListener("click", function () {
                if (this.checked === true) {
                    pushActives(this);

                    prev = previousCheckedInput.shift();
                    prev.checked = false;
                } else {
                    prev = this;
                }

                prev.addEventListener("change", function () {
                    setTimeout(function () {
                        if (this.checked === false) {
                            this.checked = true;
                        }
                    }, 500);
                });
                currentActive = previousCheckedInput[0];
                SortStories.sortPerActive(currentActive);
            });
        });

        currentActive = previousCheckedInput[0];
        SortStories.sortPerActive(currentActive);
    },
    getStoriesArray: function getStoriesArray() {
        var articles = document.querySelectorAll(".article-wrapper article");
        return articles;
    },
    sortPerActive: function sortPerActive(currentActive) {
        var stories = [].concat(_toConsumableArray(this.getStoriesArray())),
            storyTitles = [],
            storyNumbers = [];

        // Laurens Holst @Stackoverflow - Fisher Yates Algorithm.
        function shuffle(array) {
            var currentIndex = array.length,
                temporaryValue = void 0,
                randomIndex = void 0;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }

        if (currentActive.name.includes("numeric")) {
            var getStoryNum = function getStoryNum(story) {
                var storyNumString = story.firstElementChild.firstElementChild.dataset.target,
                    storyNum = storyNumString.slice(storyNumString.lastIndexOf("-" + 1));

                return storyNum;
            };

            var num = stories.sort(function (a, b) {
                return getStoryNum(a) == getStoryNum(b) ? 0 : getStoryNum(a) > getStoryNum(b) ? 1 : -1;
            });
            this.updateHTML(num);
        } else if (currentActive.name.includes("alphabetically")) {
            var alpha = stories.sort(function (a, b) {
                return a.id == b.id ? 0 : a.id > b.id ? 1 : -1;
            });
            this.updateHTML(alpha);
        } else if (currentActive.name.includes("popularity")) {
            var pop = shuffle(stories);
            this.updateHTML(pop);
        } else if (currentActive.name.includes("relevance")) {
            var rel = shuffle(stories);
            this.updateHTML(rel);
        }
    },
    updateHTML: function updateHTML(typeSort) {
        DOMTraverse.articleWrapper.innerHTML = "";
        typeSort.forEach(function (story) {
            DOMTraverse.articleWrapper.appendChild(story);
        });
    }
};

// Component which holds the structure of each article.
var CreateArticle = {
    Article: function Article(img, by, title, number, preview, fullText, i, filters) {
        var article = "\n        <article id=\"" + title + "\" data-filter-readTime=" + filters.readTime + " data-filter-storyLength=" + filters.storyLength + " data-filter-ageSuggested=" + filters.ageSuggested + ">\n            " + this.ArticleHeader(img, by, title, number, i) + "\n            " + this.Paragraph(i, preview, fullText) + "\n            " + this.Footer(title, this.UploadSection(i, by), this.ErrorModalDownloads(i), this.ErrorModalUploads(i), this.errorModalLogin(i), i) + "\n         </article>\n        ";
        return article;
    },
    ArticleHeader: function ArticleHeader(img, by, title, number, i) {
        var header = "\n            <header class=\"article-header\">\n                <img src=" + img + " alt=\"search-result-image\" onclick=\"Microinteractions.toggleJavascript.call(this)\" class=\"toggleFullStory\" data-target=\"rest-text-" + i + "\" data-open=\"upload-photo-section-" + i + "\">\n                <span>Door: " + by + "</span>\n                <div onclick=\"Microinteractions.toggleJavascript.call(this)\" class=\"toggleFullStory\" data-target=\"rest-text-" + i + "\" data-open=\"upload-photo-section-" + i + "\"><h3>" + title + " (" + number + ")</h3></div>\n            </header>\n        ";
        return header;
    },
    Paragraph: function Paragraph(i, preview, fullText) {
        var p = "\n            <p onclick=\"Microinteractions.toggleJavascript.call(this)\" aria-label=\"Open volledig verhaal\" id=\"article-text-" + i + "\" data-target=\"rest-text-" + i + "\" data-open=\"upload-photo-section-" + i + "\">\n                " + preview + "\n                <span id=\"rest-text-" + i + "\">" + fullText + "</span>\n            </p>\n        ";
        return p;
    },
    Footer: function Footer(title, UploadSection, errorModalDownloads, errorModalUploads, errorModalLogin, i) {
        var footer = void 0;
        if (Utility.currentPath == "/") {
            footer = "\n                <footer>\n                    " + UploadSection + "\n                    <button type=\"button\" class=\"btn btn-main\" onClick=\"IndexPage.removeFromList.call(this)\" id=read-later-" + title + ">Verwijderen uit leeslijst</button>\n                    <button type=\"button\" class=\"btn btn-main\" id=\"toggle-download-modal-" + i + "\">Toevoegen aan downloadlijst</button>\n                    " + errorModalDownloads + "\n                    " + errorModalUploads + "\n                    " + errorModalLogin + "\n                </footer>\n            ";
        } else {
            footer = "\n                <footer>\n                    " + UploadSection + "\n                    <button type=\"button\" class=\"btn btn-main\" onClick=\"ResultPage.addActiveClass.call(this)\" id=read-later-" + title + ">Toevoegen aan leeslijst</button>\n                    <button type=\"button\" class=\"btn btn-main\" id=\"toggle-download-modal-" + i + "\" onClick=\"Downloading.handlePopup.call(this)\">Toevoegen aan downloadlijst</button>\n                    " + errorModalDownloads + "\n                    " + errorModalUploads + "\n                    " + errorModalLogin + "\n                </footer>\n            ";
        }
        return footer;
    },
    UploadSection: function UploadSection(i, by) {
        var section = "\n            <section class=\"upload-photo-section\" id=\"upload-photo-section-" + i + "\">\n                <p>\n                    De foto geuploaded bij dit verhaal was van:\n                    " + by + ". Hij heeft al <span>" + (Math.floor(Math.random() * 400) + 10) + " volgers</span>\n                    verkregen door regelmatig foto\u2019s te plaatsen\n                    bij verhalen die hij passend vindt bij zijn reis-\n                    foto\u2019s. Denk je dat je het beter kunt?\n                </p>\n                <form id=\"upload-image-form-" + i + "\">\n                    <fieldset>\n                        <div>\n                            <label for=\"select-image-" + i + "\">Upload je foto</label>\n                            <input type=\"file\" accept=\".jpg, .png\" id=\"select-image-" + i + "\">\n                            <button type=\"button\" class=\"btn btn-main\" onclick=\"UploadPhoto.submitActions.call(this)\">Upload</button>\n                        </div>\n                    </fieldset>\n                </form>\n                <p>\n                    dan hier je foto en wie weet ontdekken\n                    toekomstige reizigers nog mooie locaties\n                    door jouw foto\u2019s! Je weet nooit wat voor\n                    bedankje ze je hiervoor kunnen geven.\n                </p>\n            </section>\n        ";

        return section;
    },
    ErrorModalUploads: function ErrorModalUploads(i) {
        var src = void 0;
        if (Utility.currentPath.includes("dfds_seaways")) {
            src = "/projects/dfds_seaways/dist/img/icons/multiply_white.svg";
        } else {
            src = "/dist/img/icons/multiply_white.svg";
        }
        var errorModal = "\n            <section id=\"uploads-modal-" + i + "\" class=\"uploads-modal\">\n                <header>\n                    <h4>Uploadfout - Formaat</h4>\n                    <img src=" + src + " class=\"remove-uploads-modal\">\n                </header>\n                <p>\n                    Zo te zien is er iets fout gegaan bij het\n                    uploaden van de door u zo zeer\n                    gewaardeerde foto. Zorg ervoor dat de\n                    afbeelding niet groter is dan 20mb en het\n                    een .jp(e)g of .png formaat heeft.\n                </p>\n            </section>\n        ";

        return errorModal;
    },
    errorModalLogin: function errorModalLogin(i) {
        var src = void 0;
        if (Utility.currentPath.includes("dfds_seaways")) {
            src = "/projects/dfds_seaways/dist/img/icons/multiply_white.svg";
        } else {
            src = "/dist/img/icons/multiply_white.svg";
        }
        var errorModal = "\n            <section id=\"login-modal-" + i + "\" class=\"login-modal\">\n                <header>\n                    <h4>Inloggen Vereist!</h4>\n                    <img src=" + src + " class=\"remove-login-modal\">\n                </header>\n                <p>\n                    Om verhalen toe te voegen aan de\n                    leeslijst dient u ingelogd te zijn. U\n                    kunt snel naar de inlogpagina navigeren\n                    door op dit venster te klikken of door\n                    in het menu rechtsboven op \u201CInloggen /\n                    aanmelden\u201D te drukken.\n                </p>\n            </section>\n        ";

        return errorModal;
    },
    ErrorModalDownloads: function ErrorModalDownloads(i) {
        var src = void 0;
        if (Utility.currentPath.includes("dfds_seaways")) {
            src = "/projects/dfds_seaways/dist/img/icons/multiply_white.svg";
        } else {
            src = "/dist/img/icons/multiply_white.svg";
        }
        var errorModal = "\n            <section id=\"download-modal-" + i + "\" class=\"download-modal\">\n                <header>\n                    <h4>Inloggen Vereist!</h4>\n                    <img src=" + src + " id=\"remove-modal-" + i + "\"/>\n                </header>\n                <p>\n                    Om verhalen toe te voegen aan de\n                    downloadlijst dient u ingelogd te zijn. U\n                    kunt snel naar de inlogpagina navigeren\n                    door op dit venster te klikken of door\n                    in het menu rechtsboven op \u201CInloggen /\n                    aanmelden\u201D te drukken.\n                </p>\n            </section>\n        ";

        return errorModal;
    }
};

// Component that contains microinteractions.
var Microinteractions = {
    toggleJavascript: function toggleJavascript() {
        document.getElementById("" + this.dataset.target).classList.toggle("js-active");
        if (this.dataset.open !== undefined && this.dataset.open !== null) {
            document.getElementById("" + this.dataset.open).classList.toggle("js-active");
        }
        Microinteractions.determineElClicked.call(this);
    },
    determineElClicked: function determineElClicked() {
        var dataTar = this.dataset.target;

        if (dataTar.includes("main-menu")) {
            this.firstElementChild.alt == "Account icon" ? (DOMTraverse.mainMenu.classList.add("js-active"), DOMTraverse.mainTag.classList.add("js-active"), this.firstElementChild.alt = "Sluit icon", this.firstElementChild.src = Utility.getImagePath("multiply"), this.setAttribute("aria-label", "Sluit hoofdmenu")) : (DOMTraverse.mainTag.classList.remove("js-active"), this.firstElementChild.alt = "Account icon", this.firstElementChild.src = Utility.getImagePath("account"), this.setAttribute("aria-label", "Open hoofdmenu"));
        } else if (dataTar.includes("result-page-search-form")) {
            // this.ariaLabel.includes("Open zoekbalk") ? console.log(true) : console.log(false);
        } else if (dataTar.includes("rest-text") && this.classList.contains("toggleFullStory")) {
            var getParagraph = function getParagraph() {
                var dt = this.getAttribute("data-target"),
                    pNum = dt.slice(dt.lastIndexOf("-") + 1),
                    paragraph = document.getElementById("article-text-" + pNum);

                return paragraph;
            };

            var p = getParagraph.call(this);
            !p.classList.contains("js-active") ? (p.setAttribute("aria-label", "Sluit volledig verhaal"), p.classList.add("js-active")) : (p.setAttribute("aria-label", "Open volledig verhaal"), p.classList.remove("js-active"));
        } else if (dataTar.includes("rest-text")) {
            !this.classList.contains("js-active") ? (this.setAttribute("aria-label", "Sluit volledig verhaal"), this.classList.add("js-active")) : (this.setAttribute("aria-label", "Open volledig verhaal"), this.classList.remove("js-active"));
        } else if (dataTar.includes("button-group-sort")) {
            this.parentElement.classList.toggle("js-active");
        } else {
            this.classList.toggle("js-active");
        }
    },
    loopOverDataTargets: function () {
        [].concat(_toConsumableArray(document.querySelectorAll("[data-target]"))).forEach(function (toggle) {
            toggle.addEventListener("click", function (e) {
                e.preventDefault();
                Microinteractions.toggleJavascript.call(this);
            });
        });
    }()
};

var UploadPhoto = {
    submitActions: function submitActions() {
        var input = this.previousElementSibling,
            inputValue = input.value,
            section = this.parentElement.parentElement.parentElement.parentElement,
            paragraphs = section.querySelectorAll("p");

        if (window.localStorage.getItem("login") !== null || window.localStorage.getItem("signUp") !== null) {}
        if (inputValue !== null && inputValue !== undefined && inputValue.length !== 0 && inputValue.includes(".jpg") || inputValue.includes(".png")) {
            this.classList.add("js-success");
            this.innerHTML = "Geuploaded";

            // Loading State ontbreekt, maar is hetzelfde als de andere loading states.

            paragraphs.forEach(function (p) {
                section.removeChild(p);
            });

            section.innerHTML += "\n                <p>\n                    Je hebt voor dit verhaal op ${datum} al een\n                    foto geuploaded, deze foto is te zien voor\n                    alle mensen die zich in de buurt bevinden van\n                    locatie, waar de foto vandaan is genomen.\n                    Als u vindt dat u, op dezelfde OF een andere\n                    locatie een betere foto hebt gemaakt, schroom\n                    dan niet om die ook te uploaden.\n                </p>\n            ";
        } else {
            // Show error modal
            var footer = this.parentElement.parentElement.parentElement.parentElement.parentElement,
                uploadErrorModal = footer.querySelector(".uploads-modal");

            this.classList.add("js-error");
            uploadErrorModal.classList.add("js-active");

            setTimeout(function () {
                this.classList.remove("js-error");
                uploadErrorModal.classList.remove("js-active");
            }, 5000);

            uploadErrorModal.querySelector(".remove-uploads-modal").addEventListener("click", function () {
                uploadErrorModal.classList.remove("js-active");
            });
        }
    }

    // Component that holds most dynamica of the download process.
};var Downloading = {
    isUserLoggedIn: Boolean,
    downloading: false,
    getElements: function getElements() {
        var downloadButton = this;

        var storyNumber = downloadButton.id.slice(downloadButton.id.lastIndexOf("-") + 1),
            modal = document.getElementById("download-modal-" + storyNumber),
            closeModalButton = modal.firstElementChild.firstElementChild.nextElementSibling;

        return {
            downloadButton: downloadButton,
            storyNumber: storyNumber,
            modal: modal,
            closeModalButton: closeModalButton
        };
    },
    handlePopup: function handlePopup() {
        var _Downloading$getEleme = Downloading.getElements.call(this),
            downloadButton = _Downloading$getEleme.downloadButton,
            storyNumber = _Downloading$getEleme.storyNumber,
            modal = _Downloading$getEleme.modal,
            closeModalButton = _Downloading$getEleme.closeModalButton;

        var loading = true;
        determineIfLoading();

        if (Downloading.isUserLoggedIn) {
            modal.classList.remove("js-active");

            var mappableDownloadList = undefined;
            var stringified = void 0;

            var storyToAdd = this.parentElement.parentElement.id;

            if (window.localStorage.getItem("downloadList") !== null) {
                if (window.localStorage.getItem("downloadList").length !== 0) {
                    mappableDownloadList = window.localStorage.getItem("downloadList").split(",");
                    var isItemInCurrentDownloadList = false;

                    mappableDownloadList.forEach(function (listItem) {
                        if (storyToAdd === listItem) {
                            isItemInCurrentDownloadList = true;
                        }
                    });

                    if (isItemInCurrentDownloadList === false) {
                        stringified = mappableDownloadList.toString();
                        stringified += "," + storyToAdd;

                        setLocalStorage(stringified);
                        addSuccessResponses();
                    } else {
                        addSuccessResponses(true);
                    }
                } else {
                    addInitialItems(stringified, storyToAdd);
                    setLocalStorage(stringified);
                    addSuccessResponses();
                }
            } else {
                addInitialItems(stringified, storyToAdd);
                setLocalStorage(stringified);
                addSuccessResponses();
            }
        } else {
            modal.classList.add("js-active");
            closeModalButton.addEventListener("click", function () {
                modal.classList.remove("js-active");
            });

            setTimeout(function () {
                modal.classList.remove("js-active");
            }, 10000);

            // Create a function that handles with the onclick of the text in the modal
        }

        function addInitialItems(stringified, storyToAdd) {
            stringified = "";
            stringified += "" + storyToAdd;
        }

        function setLocalStorage(stringified) {
            window.localStorage.setItem("downloadList", stringified);
        }

        function addSuccessResponses() {
            var isAddedAllready = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var downloadSpan = DOMTraverse.topSpanDownloads;

            loading = false;
            determineIfLoading();

            if (!isAddedAllready) {
                downloadButton.classList.add("js-loading");

                setTimeout(function () {
                    downloadSpan.classList.add("js-active");
                    downloadButton.classList.remove("js-loading");
                    downloadButton.classList.add("js-success");
                    downloadButton.innertText = "Toegevoegd aan downloadlijst";
                }, 4000);

                setTimeout(function () {
                    downloadSpan.classList.remove("js-active");
                }, 8000);
            } else {
                downloadButton.classList.add("js-success");
                downloadButton.innerText = "Al toegevoegd aan downloadlijst";
            }
        }

        function determineIfLoading() {
            if (loading === true) {
                downloadButton.classList.add("js-loading");

                setTimeout(function () {
                    downloadButton.classList.remove("js-loading");
                }, 4000);
            } else {
                downloadButton.classList.remove("js-loading");
            }
        }
    },
    handleButtonClick: function handleButtonClick() {
        var button = DOMTraverse.downloadStoryButton,
            modal = DOMTraverse.downloadModal,
            downloadAllButon = DOMTraverse.downloadAllButton;

        var buttons = [button, downloadAllButon];
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                modal.classList.add("js-active");
            });
        });
    },
    handleModalClick: function handleModalClick() {
        var modal = DOMTraverse.downloadModal,
            allForms = modal.querySelectorAll("form"),
            allButtons = modal.querySelectorAll(".btn-main"),
            closeButton = modal.querySelector("#close-modal-button");

        closeButton.addEventListener("click", function () {
            modal.classList.remove("js-active");
        });

        allForms.forEach(function (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
            });

            form.addEventListener("keyup", function (e) {
                if (e.target.getAttribute("type") === "email") {
                    SignUpPage.Constraint.matchConstraintToInputField("email", e.target);
                }
            });
        });

        allButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                handleButtonClicks.call(this);
            });
        });

        function handleButtonClicks() {
            var _this = this;

            if (this.getAttribute("name").includes("sms") || this.getAttribute("name").includes("mail")) {
                Downloading.downloading = true;
                this.classList.add("js-loading");
                this.innerText = "Versturen...";
                setTimeout(function () {
                    _this.classList.remove("js-loading");
                    _this.innerText = "Verstuur opnieuw";
                    _this.classList.add("js-success");
                }, 4000);
            } else {
                Downloading.downloading = true;
            }
        }
    },
    SmallScreenDownload: function SmallScreenDownload() {
        var modal = DOMTraverse.downloadInformationModal,
            loader = DOMTraverse.downloadLoader,
            paragraph = modal.querySelector("p");

        modal.classList.add("js-active");

        paragraph.addEventListener("click", function () {
            loader.classList.add("js-active");

            setTimeout(function () {
                loader.classList.remove("js-active");
                loader.firstElementChild.setAttribute("src", "dist/img/icons/verify_sign.svg");
            }, 4000);
        });

        setTimeout(function () {
            modal.classList.remove("js-active");
        }, 4000);
    }
};

// Pages
var Navigation = {
    getLoginOrSignup: function getLoginOrSignup(path) {
        if (window.localStorage.getItem("login") != null || window.localStorage.getItem("signUp") != null) {
            if (path == "index") {
                this.changeLoginNode("Uitloggen", true, true, false);
                Downloading.isUserLoggedIn = true;
            } else if (path == "searchResults") {
                this.changeLoginNode("Uitloggen", true, false, false);
                Downloading.isUserLoggedIn = true;
            } else if (path == "stories") {
                this.changeLoginNode("Uitloggen", true, false, true);
                Downloading.isUserLoggedIn = true;
            }
        } else {
            this.changeLoginNode("Inloggen");
            Downloading.isUserLoggedIn = false;
        }
    },
    getNodes: function getNodes() {
        var loginNode = DOMTraverse.mainMenu.querySelector("#login-node"),
            menuList = loginNode.parentElement,
            loginNodeAnchor = loginNode.firstElementChild,
            firstLoginSibling = loginNode.nextElementSibling;

        return {
            loginNode: loginNode,
            menuList: menuList,
            loginNodeAnchor: loginNodeAnchor,
            firstLoginSibling: firstLoginSibling
        };
    },
    changeLoginNode: function changeLoginNode(linkText, loggedIn, indexPath, storyPath) {
        var nodes = this.getNodes();
        nodes.loginNodeAnchor.innerText = linkText;

        if (loggedIn && indexPath === false && storyPath === false) {
            // Change the link prefixes to the base of the html folder.
            nodes.firstLoginSibling.insertAdjacentHTML("beforebegin", "\n                <li class=\"dynamic-js\">\n                    <a href=\"download-list.html\" role=\"menuitem\">Downloadlijst</a>\n                </li>\n                <li class= \"dynamic-js\">\n                    <a href=\"../index.html#reading-list\" role=\"menuitem\">Leeslijst</a>\n                </li>\n            ");
        } else if (loggedIn && indexPath && storyPath === false) {
            nodes.firstLoginSibling.insertAdjacentHTML("beforebegin", "\n                <li class=\"dynamic-js\">\n                    <a href=\"html/download-list.html\" role=\"menuitem\">Downloadlijst</a>\n                </li>\n                <li class= \"dynamic-js\">\n                    <a href=\"#reading-list\" role=\"menuitem\">Leeslijst</a>\n                </li>\n            ");
        } else if (loggedIn && storyPath) {
            nodes.loginNode.insertAdjacentHTML("afterend", "\n                <li class=\"dynamic-js\">\n                    <a href=\"../download-list.html\" role=\"menuitem\">Downloadlijst</a>\n                </li>\n                <li class= \"dynamic-js\">\n                    <a href=\"../../index.html#reading-list\" role=\"menuitem\">Leeslijst</a>\n                </li>\n            ");
        } else {
            this.removeAddedMenuItems();
        }
    },
    removeAddedMenuItems: function removeAddedMenuItems() {
        var nodes = this.getNodes();
        var dynamics = [].concat(_toConsumableArray(nodes.menuList.querySelectorAll(".dynamic-js")));
        dynamics.forEach(function (li, i) {
            dynamics.splice(i, 1);
        });
    }
};

var IndexPage = {
    setFormListeners: function setFormListeners() {
        DOMTraverse.searchform.addEventListener("submit", function (e) {
            e.preventDefault();

            var input = DOMTraverse.searchInput.value;

            this.reset();

            if (window.localStorage.getItem("filters") !== undefined) {
                window.localStorage.removeItem("filters");
            }
            Utility.route("input", input);
        });

        DOMTraverse.allStoriesButton.addEventListener("click", function () {
            if (window.localStorage.getItem("filters") !== undefined) {
                window.localStorage.removeItem("filters");
            }
            Utility.route("input", "allStories");
        });

        DOMTraverse.filterForm.addEventListener("submit", function (e) {
            e.preventDefault();

            IndexPage.Filtering.handleFilterForm();

            this.reset();
        });
    },
    removeFromList: function removeFromList() {
        var readingList = [].concat(_toConsumableArray(window.localStorage.readingList.split(",")));
    },
    getReadingList: function getReadingList(storageItem) {
        if (window.localStorage.getItem("login") != null || window.localStorage.getItem("signUp") != null) {
            var ls = localStorage.getItem("readingList");

            if (ls === null || ls.length == 0) {
                LoadStories.hideSortButton();
                this.readingListNotFound();
            } else {
                var wrapperClassList = DOMTraverse.articleWrapper.classList;
                if (wrapperClassList.contains("no-results")) {
                    wrapperClassList.remove("no-results");
                }
                LoadStories.createRequest(storageItem);
            }
        } else {
            var span = document.createElement("span");
            span.innerHTML = "Om je leeslijst te zien, moet je ingelogd zijn. <a href='/html/signup.html'>U kunt zich hier inloggen</a>.";
            LoadStories.hideSortButton();
            DOMTraverse.articleWrapper.parentElement.classList.add("reading-list-js-no-login");
            DOMTraverse.articleWrapper.appendChild(span);
        }
    },
    readingListNotFound: function readingListNotFound() {
        var articleWrapper = DOMTraverse.articleWrapper,
            iTag = document.createElement("i"),
            spanTag = document.createElement("span");

        iTag.setAttribute("aria-label", "Leeslijst icon");
        spanTag.innerHTML = "Er zijn geen verhalen gevonden in uw leeslijst.<br><a href='#search-form'>Ga op zoek naar nieuwe ervaringen!</a>";

        articleWrapper.classList.add("no-results");
        articleWrapper.appendChild(iTag);
        articleWrapper.appendChild(spanTag);
    },
    Filtering: {
        getElements: function getElements() {
            var filterFormFieldsets = DOMTraverse.filterForm.querySelectorAll("fieldset");
            var filterFormInputs = DOMTraverse.filterForm.querySelectorAll("input");

            return {
                filterFormFieldsets: filterFormFieldsets,
                filterFormInputs: filterFormInputs
            };
        },
        getActiveInputs: function getActiveInputs() {
            var _getElements2 = this.getElements(),
                filterFormFieldsets = _getElements2.filterFormFieldsets,
                filterFormInputs = _getElements2.filterFormInputs;

            var checkedArray = [];

            filterFormInputs.forEach(function (input) {
                if (input.checked) {
                    checkedArray.push(input);
                }
            });
            return checkedArray;
        },
        handleFilterForm: function handleFilterForm() {
            var activeInputs = this.getActiveInputs();

            if (activeInputs.length === 0 || activeInputs === undefined) {
                // Tell the user to select some filters
            } else {
                // Move forward to matching the filters to the stories.
                if (window.localStorage.getItem("input") != undefined) {
                    window.localStorage.removeItem("input");
                }

                var filterFor = {
                    readTime: [],
                    ageSuggested: [],
                    storyLength: []
                };

                activeInputs.forEach(function (activeInput) {
                    if (activeInput.id.includes("readTime")) {
                        filterFor.readTime.push(activeInput.id.substr(16));
                    } else if (activeInput.id.includes("ageSuggested")) {
                        filterFor.ageSuggested.push(activeInput.id.substr(20));
                    } else if (activeInput.id.includes("storyLength")) {
                        filterFor.storyLength.push(activeInput.id.substr(19));
                    }
                });

                // Create something in the request module so that the filters are matched with the stories.
                Utility.route("filters", JSON.stringify(filterFor));
            }
        }
    }
};

var SignUpPage = {
    Constraint: {
        getDate: function getDate() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();

            function addZeroIfLessThanTen(unit) {
                if (unit < 10) {
                    unit = '0' + unit;
                    return unit;
                } else {
                    return unit;
                }
            }

            today = addZeroIfLessThanTen(dd) + "/" + addZeroIfLessThanTen(mm) + "/" + yyyy;
            return today;
        },
        setCurrentDate: function setCurrentDate() {
            var cd = this.getDate();
            DOMTraverse.signUpBirthday.setAttribute("max", cd);
        },
        getConstraints: function getConstraints() {
            var email = ["[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$", "Een email bestaat uit letters en nummers, een @ en minstens één punt"];
            var name = ["^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$", "Een volledige naam bestaat uit enkel woorden en spaties."];
            var password = ["^([a-zA-Z0-9@*#]{8,15})$", "Een goed wachtwoord bestaat uit minimaal 8 tekens, waarvan minstens één hoofd- en kleine letter en een nummer."];
            return {
                email: email,
                name: name,
                password: password
            };
        },
        matchConstraintToInputField: function matchConstraintToInputField(constraint, input) {
            var constraints = this.getConstraints();
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator3 = Object.keys(constraints)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator3.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    if (constraint.includes(key)) {
                        this.createConstraint(constraints, key, input);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        },
        createConstraint: function createConstraint(obj, key, input) {
            var newConstraint = new RegExp(obj[key][0]);

            if (input.value.length === 0) {
                input.classList.remove("js-active");
            } else {
                input.classList.add("js-active");
            }
            if (newConstraint.test(input.value)) {
                input.setCustomValidity("");
            } else {
                input.setCustomValidity(obj[key][1]);
            }
        },
        checkElements: function checkElements() {
            var _this2 = this;

            DOMTraverse.tovalidate.forEach(function (input) {
                input.addEventListener("keyup", function () {
                    if (input.classList.contains("password")) {
                        _this2.matchConstraintToInputField("password", input);
                    } else if (input.classList.contains("email")) {
                        _this2.matchConstraintToInputField("email", input);
                    } else if (input.classList.contains("name")) {
                        _this2.matchConstraintToInputField("name", input);
                    }
                });
            });
        }
    },
    UserActions: {
        userLogin: function userLogin() {
            DOMTraverse.loginForm.addEventListener("submit", function (e) {
                e.preventDefault();
                var email = this.querySelector("#login-email").value;
                var password = this.querySelector("#login-password").value;

                var login = {
                    email: email,
                    password: password
                };
                setStorage(login);
            });

            function setStorage(login) {
                localStorage.setItem("login", JSON.stringify(login));
                if (Utility.currentPath.includes("dfds_seaways")) {
                    window.location.href = "../index.html";
                } else {
                    window.location.href = "/index.html";
                }
            }
        },
        userPasswordReset: function userPasswordReset() {
            DOMTraverse.resetForm.addEventListener("submit", function (e) {
                e.preventDefault();
                var email = this.querySelector("#reset-password").value;
                setStorage(email);
            });

            function setStorage(email) {
                localStorage.setItem("reset", email);
            }
        },
        userSignUp: function userSignUp() {
            DOMTraverse.signUpForm.addEventListener("submit", function (e) {
                e.preventDefault();
                var birthday = this.querySelector("#sign-up-birthday").value,
                    email = this.querySelector("#sign-up-email").value,
                    name = this.querySelector("#sign-up-name").value,
                    nationality = this.querySelector("#sign-up-nationality").value,
                    password = this.querySelector("#sign-up-password").value;

                var signUp = {
                    birthday: birthday,
                    email: email,
                    name: name,
                    nationality: nationality,
                    password: password
                };
                setStorage(signUp);
            });

            function setStorage(signUp) {
                localStorage.setItem("signUp", JSON.stringify(signUp));
                window.location.href = "/index.html";
            }
        },
        init: function init() {
            this.userLogin();
            this.userPasswordReset();
            this.userSignUp();
        }
    }
};

var ResultPage = {
    readingListArray: [],
    addActiveClass: function addActiveClass() {
        var _this3 = this;

        if (window.localStorage.getItem("login") !== null || window.localStorage.getItem("signUp") !== null) {
            this.classList.toggle("js-loading");

            setTimeout(function () {
                ResultPage.addToReadingList.call(_this3);
                ResultPage.showTopMessage.call(_this3);
            }, 1500);
        } else {}
    },
    addToReadingList: function addToReadingList() {
        // Get current reading list.
        var title = this.id.slice(this.id.lastIndexOf("-") + 1);

        var readingListArray = window.localStorage.getItem("readingList");

        ResultPage.readingListArray.push(title);

        window.localStorage.setItem("readingList", ResultPage.readingListArray);
    },
    showTopMessage: function showTopMessage() {
        var _this4 = this;

        DOMTraverse.topSpanReadingList.classList.add("js-active");
        setTimeout(function () {
            _this4.classList.remove("js-loading");
            _this4.classList.add("js-active");
            _this4.innerText = "Toegevoegd aan leeslijst";
            DOMTraverse.topSpanReadingList.classList.remove("js-active");
        }, 4000);

        setTimeout(function () {
            _this4.classList.remove("js-active");
            _this4.classList.add("js-remove");
            _this4.innerText = "Verwijderen uit leeslijst";
        }, 8000);
    }
};

var StoryPage = {
    Kater: {
        getElements: function getElements() {
            var kater = document.getElementsByClassName("story-1")[0],
                article = kater.firstElementChild,
                allSections = article.querySelectorAll("section"),
                titleSection = article.querySelector(".title"),
                paragraph = article.querySelector("p");

            return {
                allSections: allSections,
                article: article,
                kater: kater,
                paragraph: paragraph,
                titleSection: titleSection
            };
        },
        getTranslateValue: function getTranslateValue(translateString) {
            var n = translateString.indexOf("("),
                n1 = translateString.indexOf("%");

            var res = parseInt(translateString.slice(n + 1, n1 - 1));
            return res;
        },
        handleScroll: function handleScroll() {
            var _getElements3 = this.getElements(),
                allSections = _getElements3.allSections,
                kater = _getElements3.kater,
                paragraph = _getElements3.paragraph,
                titleSection = _getElements3.titleSection;

            var pActive = void 0;

            if (Utility.getCurrentScreenHeight >= 1000) {
                // Scroll events for higher screens.
                kater.addEventListener("scroll", function () {
                    scrollEvents(7);
                });
            } else {
                // Scroll events for less high screens.
                kater.addEventListener("scroll", function () {
                    scrollEvents(4);
                });
            }

            function scrollEvents(centerPage) {
                // Check if the user scrolled more than halfway of the story.
                if (kater.scrollTop >= kater.scrollHeight / centerPage) {
                    // Check if the user has allready scrolled down to the paragraph once.
                    if (pActive === true) {
                        titleSection.style.transform = "translateY(700%)";
                        // Check if the parapgrah has got a transform that is less than 5% of the center. If that is not the case, set the value of translateX to 0% by default.
                        if (StoryPage.Kater.getTranslateValue(paragraph.style.transform) <= 5) {
                            paragraph.style.transform = "translateX(0%)";
                        }
                    } else {
                        paragraph.style.transform = "translateX(" + (kater.scrollHeight / (centerPage - 1) - kater.scrollTop) + "%)";
                        setTimeout(function () {
                            pActive = true;
                        }, 500);
                    }
                } else {
                    allSections.forEach(function (section, i) {
                        section.style.transform = "skew(" + (Math.floor(Math.random() * 10) + 5) + "deg, " + (Math.floor(Math.random() * 10) + 5) + "deg) rotate(" + (Math.floor(Math.random() * 10) + 5) + "deg) scale(" + (Math.random() + 0.5) + ") translateY(-" + kater.scrollTop * centerPage + "px) translateX(" + kater.scrollTop * centerPage + "px)";
                    });
                }
            }
        }
    },
    Paranoia: {
        getElements: function getElements() {
            var article = document.querySelector(".story-2>article"),
                followLeft = article.querySelectorAll(".follow-left"),
                followRight = article.querySelectorAll(".follow-right"),
                paragraph = article.querySelector("p");

            return {
                article: article,
                followLeft: followLeft,
                followRight: followRight,
                paragraph: paragraph
            };
        },
        getScrollTop: function getScrollTop() {
            var _getElements4 = this.getElements(),
                article = _getElements4.article,
                followLeft = _getElements4.followLeft,
                followRight = _getElements4.followRight,
                paragraph = _getElements4.paragraph;

            var scrollTop = void 0;

            window.addEventListener("load", function () {
                followRight.forEach(function (frEl) {
                    frEl.classList.add("js-hide");
                });
            });
            paragraph.addEventListener("scroll", function () {
                scrollTop = paragraph.scrollTop;
                if (scrollTop < 300 || scrollTop > 1800 && scrollTop < 2499 || scrollTop > 3200) {
                    followLeft.forEach(function (flEl) {
                        flEl.classList.remove("js-hide");
                    });
                    followRight.forEach(function (frEl) {
                        frEl.classList.add("js-hide");
                    });
                } else if (scrollTop > 300 && scrollTop < 1799 || scrollTop > 2500 && scrollTop < 3199) {
                    followLeft.forEach(function (flEl) {
                        flEl.classList.add("js-hide");
                    });
                    followRight.forEach(function (frEl) {
                        frEl.classList.remove("js-hide");
                    });
                }
            });
        }
    },
    VrijdagDeDertiende: {
        getElements: function getElements() {
            var verticalDrop = document.querySelector(".vertical-drop"),
                dividerRight = document.querySelector(".divider__right");

            return {
                verticalDrop: verticalDrop,
                dividerRight: dividerRight
            };
        },
        handleScroll: function handleScroll() {
            var _getElements5 = this.getElements(),
                verticalDrop = _getElements5.verticalDrop,
                dividerRight = _getElements5.dividerRight;

            var lastScrollTop = dividerRight.scrollTop;

            dividerRight.addEventListener("scroll", function () {
                var st = dividerRight.scrollTop,
                    randomPositiveOrNegative = Math.floor(Math.random() * 1.2) + .5;

                randomPositiveOrNegative *= Math.floor(Math.random() * 2 == 1 ? 1 : -1);

                var verticalDropTransform = verticalDrop.style.transform,
                    translateProp = verticalDropTransform.substr(0, verticalDropTransform.indexOf(" ")),
                    translateValue = translateProp.slice(translateProp.indexOf("(") + 1, translateProp.indexOf("%"));

                if (st > lastScrollTop) {
                    verticalDrop.style.transform = "translateY(" + dividerRight.scrollTop + "%) rotateZ(90deg) scale(" + (Math.random() * (1.2 - .5) + .5) + ") translateX(" + randomPositiveOrNegative + "%)";
                } else {
                    verticalDrop.style.transform = "translateY(" + (translateValue - dividerRight.scrollTop / 50) + "%) rotateZ(90deg) scale(" + (Math.random() * (1.2 - .5) + .5) + ") translateX(" + randomPositiveOrNegative + "%)";
                }
                lastScrollTop = st;
            }, false);
        }
    }

    // Fires immediately, which triggers all the JavaScript in the pages.
};var onLoad = function () {
    var cp = Utility.getCurrentPath();

    DOMTraverse.topSpans.forEach(function (span) {
        window.addEventListener("scroll", function () {
            if (window.pageYOffset === 0) {
                span.style.top = "4em";
            } else {
                span.style.top = "0";
            }
        });
    });

    if (cp == "index") {
        if (Utility.getCurrentScreenWidth < Utility.MajorBreakPointTwo && Downloading.downloading) {
            Downloading.SmallScreenDownload();
        }
        IndexPage.getReadingList("readingList");
        IndexPage.setFormListeners();
        Navigation.getLoginOrSignup("index");
    } else if (cp == "searchResults") {
        if (window.localStorage.getItem("input") !== undefined) {
            LoadStories.createRequest("input");
        } else if (window.localStorage.getItem("filters") !== undefined) {
            LoadStories.createRequest("filters");
        }
        if (LoadStories.loadingFininished === true) {
            SortStories.determineActiveSorter();
        } else {
            var checkForLoaded = setInterval(function () {
                if (LoadStories.loadingFininished === true) {
                    SortStories.determineActiveSorter();
                    clearInterval(checkForLoaded);
                }
            }, 500);
        }
        Navigation.getLoginOrSignup("searchResults");
    } else if (cp == "downloads") {
        Downloading.handleButtonClick();
        Downloading.handleModalClick();
    } else if (cp == "signUp") {
        SignUpPage.Constraint.checkElements();
        SignUpPage.Constraint.setCurrentDate();
        SignUpPage.UserActions.init();
    } else if (cp == "kater") {
        StoryPage.Kater.handleScroll();
        Navigation.getLoginOrSignup("stories");
    } else if (cp == "paranoia") {
        StoryPage.Paranoia.getScrollTop();
        Navigation.getLoginOrSignup("stories");
    } else if (cp == "vrijdag") {
        StoryPage.VrijdagDeDertiende.handleScroll();
        Navigation.getLoginOrSignup("stories");
    }
}();