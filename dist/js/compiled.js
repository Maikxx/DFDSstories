"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Component which contains most of the DOM elements.
var DOMTraverse = {
    /* Multiple Pages */
    articleWrapper: document.querySelector(".article-wrapper"),
    mainMenu: document.getElementById("main-menu"),
    mainTag: document.querySelector("main"),
    sectionTitles: document.getElementsByClassName("section-title"),

    /* Index Page */
    allStoriesButton: document.getElementById("show-all-stories"),
    searchform: document.getElementById("search-form"),
    searchInput: document.getElementById("search-for-title"),

    /* Results Page */
    topSpan: document.getElementsByClassName("top-span")[0],
    storyLoader: document.getElementsByClassName("story-loader"),

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
        if (this.currentPath == "/index.html" || this.currentPath == "/") return "index";else if (this.currentPath == "/html/search-results.html") return "searchResults";else if (this.currentPath == "/html/signup.html") return "signUp";else if (this.currentPath == "/html/stories/kater.html") return "kater";else if (this.currentPath == "/html/stories/paranoia.html") return "paranoia";else if (this.currentPath == "/html/stories/vrijdag-de-dertiende.html") return "vrijdag";
    },
    getCurrentScreenHeight: window.innerHeight,
    getCurrentScreenWidth: window.innerWidth,
    route: function route(key, value) {
        localStorage.setItem(key, value);
        window.location.href = "/html/search-results.html";
    },
    storyStorage: "https://api.myjson.com/bins/zbwpn",
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
            return resultArray;
        }

        (function getResults() {
            var matches = loopOverStories();
            if (matches.length == 0 || matches == undefined) {
                LoadStories.hideSortButton();
                var span = document.createElement("span");
                span.innerHTML = "Helaas, er zijn geen matches gevonden met de opgegeven input: " + ls + ".<br>Probeer een ander zoekwoord, of gebruik de filters om te zoeken.";

                DOMTraverse.articleWrapper.style.backgroundColor = "white";
                DOMTraverse.articleWrapper.appendChild(span);
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
                    if (Utility.getCurrentScreenWidth > 1039) {
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
            } else {
                if (storageItem == "readingList") {
                    DOMTraverse.articleWrapper.parentElement.classList.add("reading-list-js-results");
                }
                mapMatches(matches);
            }

            [].concat(_toConsumableArray(DOMTraverse.sectionTitles)).forEach(function (title) {
                if (title.innerHTML == "Resultaten" || title.innerHTML == "Leeslijst") {
                    title.innerHTML += " - " + matches.length;
                }
            });
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
                    console.log(iterator);
                    data.stories.forEach(function (story) {
                        return LoadStories.matchStorageToRequest(match, story, iterator);
                    });
                });
                loopCount++;
            } else if (loopCount == 2) {
                var _iterator = 50;
                matches.forEach(function (match) {
                    _iterator++;
                    console.log(_iterator);
                    data.stories.forEach(function (story) {
                        return LoadStories.matchStorageToRequest(match, story, _iterator);
                    });
                });
                loopCount++;
            } else if (loopCount == 3) {
                var _iterator2 = 75;
                matches.forEach(function (match) {
                    _iterator2++;
                    console.log(_iterator2);
                    data.stories.forEach(function (story) {
                        return LoadStories.matchStorageToRequest(match, story, _iterator2);
                    });
                });
            }
        }

        DOMTraverse.articleWrapper.removeChild(DOMTraverse.storyLoader[0]);
    },
    hideSortButton: function hideSortButton() {
        var sortButton = document.getElementById("toggle-button-group-sort");
        sortButton.style.display = "none";
    },
    matchStorageToRequest: function matchStorageToRequest(match, story, i) {
        if (match == story.title.toLowerCase() || match == story.title) {
            var img = void 0;
            if (story.image != null || story.image != undefined) {
                img = "/dist/img/storyImages/" + story.image;
            } else if (story.image == undefined) {
                img = "http://lorempixel.com/400/200/";
            }

            var title = story.title.toLowerCase();
            var number = story.nr;
            var by = story.by;

            var maxLength = 150;

            // NT3RP @StackOverflow - Splits the text up to a preview length
            var trimmedString = story.text.substr(0, maxLength);
            trimmedString = story.text.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));

            var preview = trimmedString;
            var fullText = story.text.substring(Math.max(trimmedString.length, trimmedString.lastIndexOf(" ")));

            DOMTraverse.articleWrapper.innerHTML += CreateArticle.Article(img, by, title, number, preview, fullText, i);
        }
    }
};

// Component which holds the structure of each article.
var CreateArticle = {
    Article: function Article(img, by, title, number, preview, fullText, i) {
        var article = "\n        <article id=\"" + title + "\">\n            " + this.ArticleHeader(img, by, title, number, i) + "\n            " + this.Paragraph(i, preview, fullText) + "\n            " + this.Footer(title) + "\n         </article>\n        ";
        return article;
    },
    ArticleHeader: function ArticleHeader(img, by, title, number, i) {
        var header = "\n            <header class=\"article-header\">\n                <img src=" + img + " alt=\"search-result-image\" onclick=\"Microinteractions.toggleJavascript.call(this)\" class=\"toggleFullStory\" data-target=\"rest-text-" + i + "\">\n                <span>Door: " + by + "</span>\n                <div><h3 onclick=\"Microinteractions.toggleJavascript.call(this)\" class=\"toggleFullStory\" data-target=\"rest-text-" + i + "\">" + title + " (" + number + ")</h3></div>\n            </header>\n        ";
        return header;
    },
    Paragraph: function Paragraph(i, preview, fullText) {
        var p = "\n            <p onclick=\"Microinteractions.toggleJavascript.call(this)\" aria-label=\"Open volledig verhaal\" id=\"article-text-" + i + "\" data-target=\"rest-text-" + i + "\">\n                " + preview + "\n                <span id=\"rest-text-" + i + "\">" + fullText + "</span>\n            </p>\n        ";
        return p;
    },
    Footer: function Footer(title) {
        var footer = void 0;
        if (Utility.currentPath == "/") {
            footer = "\n                <footer>\n                    <button type=\"button\" class=\"btn btn-main\" onClick=\"IndexPage.removeFromList.call(this)\" id=read-later-" + title + ">Verwijderen uit leeslijst</button>\n                    <button type=\"button\" class=\"btn btn-main\">Downloaden</button>\n                </footer>\n            ";
        } else {
            footer = "\n                <footer>\n                    <button type=\"button\" class=\"btn btn-main\" onClick=\"ResultPage.addActiveClass.call(this)\" id=read-later-" + title + ">Toevoegen aan leeslijst</button>\n                    <button type=\"button\" class=\"btn btn-main\">Downloaden</button>\n                </footer>\n            ";
        }
        return footer;
    }
};

// Component that contains microinteractions
var Microinteractions = {
    toggleJavascript: function toggleJavascript() {
        document.getElementById("" + this.dataset.target).classList.toggle("js-active");
        Microinteractions.determineElClicked.call(this);
    },
    determineElClicked: function determineElClicked() {
        var dataTar = this.dataset.target;

        function getImagePath(image) {
            var path = void 0;
            if (Utility.currentPath == "/") {
                path = "./dist/img/icons/" + image + ".svg";
            } else if (!Utility.currentPath.includes("stories")) {
                path = "../dist/img/icons/" + image + ".svg";
            } else {
                path = "../../dist/img/icons/" + image + ".svg";
            }
            return path;
        }

        if (dataTar.includes("main-menu")) {
            this.firstElementChild.alt == "Account icon" ? (DOMTraverse.mainTag.classList.add("js-active"), this.firstElementChild.alt = "Sluit icon", this.firstElementChild.src = getImagePath("multiply"), this.setAttribute("aria-label", "Sluit hoofdmenu")) : (DOMTraverse.mainTag.classList.remove("js-active"), this.firstElementChild.alt = "Account icon", this.firstElementChild.src = getImagePath("account"), this.setAttribute("aria-label", "Open hoofdmenu"));
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

// Pages
var Navigation = {
    getLoginOrSignup: function getLoginOrSignup(path) {
        if (window.localStorage.getItem("login") != null || window.localStorage.getItem("signUp") != null) {
            if (path == "index") {
                this.changeLoginNode("Uitloggen", true, true);
            } else if (path == "searchResults") {
                this.changeLoginNode("Uitloggen", true, false);
            }
        } else {
            this.changeLoginNode("Inloggen");
        }
    },
    changeLoginNode: function changeLoginNode(linkText, loggedIn, indexPath) {
        var nodes = this.getNodes();
        nodes.loginNodeAnchor.innerText = linkText;

        if (loggedIn === true && indexPath === true) {
            // Link prefixes based from index.html
            nodes.firstLoginSibling.insertAdjacentHTML("beforeBegin", "\n                    <li class=\"dynamic-js\">\n                        <a href=\"./html/settings.html\" role=\"menuitem\">Accountinstellingen</a>\n                    </li>\n                    <li class=\"dynamic-js\">\n                        <a href=\"./html/reading-history.html\" role=\"menuitem\">Leesgeschiedenis</a>\n                    </li>\n                    <li class=\"dynamic-js\">\n                        <a href=\"#reading-list\" role=\"menuitem\">Leeslijst</a>\n                    </li>\n                    <li class=\"dynamic-js\">\n                        <a href=\"./html/notifications.html\" role=\"menuitem\">Notificaties</a>\n                    </li>\n                ");
        } else if (loggedIn === true && indexPath !== true) {
            // Change the link prefixes to the base of the html folder.
            nodes.firstLoginSibling.insertAdjacentHTML("beforeBegin", "\n                    <li class=\"dynamic-js\">\n                        <a href=\"settings.html\" role=\"menuitem\">Accountinstellingen</a>\n                    </li>\n                    <li class=\"dynamic-js\">\n                        <a href=\"reading-history.html\" role=\"menuitem\">Leesgeschiedenis</a>\n                    </li>\n                    <li class=\"dynamic-js\">\n                        <a href=\"../index.html#reading-list\" role=\"menuitem\">Leeslijst</a>\n                    </li>\n                    <li class=\"dynamic-js\">\n                        <a href=\"notifications.html\" role=\"menuitem\">Notificaties</a>\n                    </li>\n                ");
        } else {
            // Remove the added children from above.
            this.removeAddedMenuItems();
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
            Utility.route("input", input);
        });

        DOMTraverse.allStoriesButton.addEventListener("click", function () {
            return Utility.route("input", "allStories");
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
            var _this = this;

            DOMTraverse.tovalidate.forEach(function (input) {
                input.addEventListener("keyup", function () {
                    if (input.classList.contains("password")) {
                        _this.matchConstraintToInputField("password", input);
                    } else if (input.classList.contains("email")) {
                        _this.matchConstraintToInputField("email", input);
                    } else if (input.classList.contains("name")) {
                        _this.matchConstraintToInputField("name", input);
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
                window.location.href = "/index.html";
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
        var _this2 = this;

        this.classList.toggle("js-active");
        setTimeout(function () {
            ResultPage.addToReadingList.call(_this2);
            ResultPage.showTopMessage.call(_this2);
        }, 1500);
    },
    addToReadingList: function addToReadingList() {
        // Get current reading list.
        var title = this.id.slice(this.id.lastIndexOf("-") + 1);

        var readingListStorage = window.localStorage.getItem("readingList");

        ResultPage.readingListArray.push(title);

        window.localStorage.setItem("readingList", ResultPage.readingListArray);
    },
    showTopMessage: function showTopMessage() {
        var _this3 = this;

        DOMTraverse.topSpan.classList.add("js-active");
        setTimeout(function () {
            _this3.classList.remove("js-active");
            DOMTraverse.topSpan.classList.remove("js-active");
        }, 3000);
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
            var _getElements = this.getElements(),
                allSections = _getElements.allSections,
                kater = _getElements.kater,
                paragraph = _getElements.paragraph,
                titleSection = _getElements.titleSection;

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
                followLeft = document.querySelectorAll(".follow-left"),
                followRight = document.querySelectorAll(".follow-right");

            return {
                article: article,
                followLeft: followLeft,
                followRight: followRight
            };
        },
        getScrollTop: function getScrollTop() {
            var _getElements2 = this.getElements(),
                article = _getElements2.article,
                followLeft = _getElements2.followLeft,
                followRight = _getElements2.followRight;

            var scrollTop = void 0;

            window.addEventListener("load", function () {
                followRight.forEach(function (frEl) {
                    frEl.classList.add("js-hide");
                });
            });
            article.addEventListener("scroll", function () {
                scrollTop = article.scrollTop;
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
    }

    // Fires immediately, which triggers all the JavaScript in the pages.
};var onLoad = function () {
    var cp = Utility.getCurrentPath();

    if (cp == "index") {
        IndexPage.getReadingList("readingList");
        IndexPage.setFormListeners();
        Navigation.getLoginOrSignup("index");
    } else if (cp == "searchResults") {
        LoadStories.createRequest("input");
        Navigation.getLoginOrSignup("searchResults");
    } else if (cp == "signUp") {
        SignUpPage.Constraint.checkElements();
        SignUpPage.Constraint.setCurrentDate();
        SignUpPage.UserActions.init();
    } else if (cp == "kater") {
        StoryPage.Kater.handleScroll();
    } else if (cp == "paranoia") {
        StoryPage.Paranoia.getScrollTop();
    }
}();