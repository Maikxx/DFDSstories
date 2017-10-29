// Component which contains most of the DOM elements.
const DOMTraverse = {
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
    tovalidate: [...document.getElementsByClassName("validateJS")],
};

// Component which contains mostly reusable logic.
const Utility = {
    currentPath: window.location.pathname,
    getCurrentPath: function () {
        if (this.currentPath == "/index.html" || this.currentPath == "/") return "index";
        else if (this.currentPath == "/html/search-results.html") return "searchResults";
        else if (this.currentPath == "/html/signup.html") return "signUp";
        else if (this.currentPath == "/html/stories/kater.html") return "kater";
        else if (this.currentPath == "/html/stories/paranoia.html") return "paranoia";
        else if (this.currentPath == "/html/stories/vrijdag-de-dertiende.html") return "vrijdag";
    },
    getCurrentScreenHeight: window.innerHeight,
    getCurrentScreenWidth: window.innerWidth,
    route: function (key, value) {
        localStorage.setItem(key, value);
        window.location.href = "/html/search-results.html";
    },
    storyStorage: "https://api.myjson.com/bins/zbwpn",
    xhr: new XMLHttpRequest()
};

// Component that loads and matches the stories that need to be created.
const LoadStories = {
    createRequest: function (storageItem) {
        let xhr = Utility.xhr;
        xhr.open("GET", Utility.storyStorage, true);

        let processing;

        xhr.onprogress = function () {
            if (processing == undefined) {
                LoadStories.createLoader(DOMTraverse.articleWrapper);
                processing = true;
            }
        }
        xhr.onload = function () {
            if (this.status == 200) {
                let data = JSON.parse(this.responseText);
                LoadStories.createArticles(data, storageItem);
            }
        }
        xhr.onerror = function (err) {
            alertError(err);
        }
        xhr.send();

        function alertError(error) {
            const span = document.createElement("span");
            span.innerText = `Oeps, er ging iets fout. Probeer de pagina opnieuw te laden om de fout op te lossen!`;
            DOMTraverse.articleWrapper.appendChild(span);
        }
    },
    createLoader: function (appendTo) {
        let ul = document.createElement("ul");

        for (var i = 0; i < 12; i++) {
            let li = document.createElement("li");
            ul.appendChild(li);
        }

        ul.classList.add("story-loader");
        appendTo.appendChild(ul);
    },
    createArticles: function (data, storageItem) {
        let ls,
            loopCount = 0;

        function loopOverStories() {
            let resultArray = [];

            if (storageItem == "input") {
                ls = localStorage.getItem(storageItem);
                data.stories.forEach(story => {
                    if (ls === "allStories") {
                        resultArray.push(story.title);
                    } else {
                        if (story.title.toLowerCase().includes(ls.toLowerCase()) || (story.text.indexOf(ls.toLowerCase()) != -1)) {
                            resultArray.push(story.title);
                        }
                    }
                });
            } else if (storageItem == "readingList") {
                ls = [...localStorage.getItem(storageItem).split(",")];
                ls.forEach((item) => {
                    resultArray.push(item);
                });
            }
            return resultArray;
        }

        (function getResults() {
            let matches = loopOverStories();
            if (matches.length == 0 || matches == undefined) {
                LoadStories.hideSortButton();
                let span = document.createElement("span");
                span.innerHTML = `Helaas, er zijn geen matches gevonden met de opgegeven input: ${ls}.<br>Probeer een ander zoekwoord, of gebruik de filters om te zoeken.`;

                DOMTraverse.articleWrapper.style.backgroundColor = "white";
                DOMTraverse.articleWrapper.appendChild(span);
            } else if (matches.length > 25) {
                let currentCount = 0;
                if (currentCount == 0) {
                    let toShow = matches.slice(0, 25);
                    mapMatches(toShow);
                }

                if (storageItem == "readingList") {
                    DOMTraverse.articleWrapper.classList.add("reading-list-js-results");
                }
                // Create a function that handles the button click, to load in more stories.
                (function showNextStories() {
                    if (Utility.getCurrentScreenWidth > 1039) {
                        let elHeight = DOMTraverse.articleWrapper.clientHeight;

                        window.addEventListener("scroll", function () {
                            if (window.pageYOffset > (elHeight - 1500)) {
                                if (currentCount == 0) {
                                    let toShow = matches.slice(25, 50);
                                    elHeight += elHeight;
                                    currentCount++;
                                    mapMatches(toShow);
                                } else if (currentCount == 1) {
                                    let toShow = matches.slice(50, 75);
                                    elHeight += 6000;
                                    currentCount++
                                    mapMatches(toShow);
                                } else if (currentCount == 2) {
                                    let toShow = matches.slice(75, 100);
                                    elHeight += elHeight;
                                    currentCount++;
                                    mapMatches(toShow);
                                }
                            }
                        });
                    } else {
                        let elWidth = DOMTraverse.articleWrapper.scrollWidth;

                        DOMTraverse.articleWrapper.addEventListener("scroll", function () {
                            if (DOMTraverse.articleWrapper.scrollLeft > (elWidth - 1500)) {
                                if (currentCount == 0) {
                                    let toShow = matches.slice(25, 50);
                                    elWidth += elWidth;
                                    currentCount++;
                                    mapMatches(toShow);
                                } else if (currentCount == 1) {
                                    let toShow = matches.slice(50, 75);
                                    elWidth += 6000;
                                    currentCount++
                                    mapMatches(toShow);
                                } else if (currentCount == 2) {
                                    let toShow = matches.slice(75, 100);
                                    elWidth += elWidth;
                                    currentCount++;
                                    mapMatches(toShow);
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

            [...DOMTraverse.sectionTitles].forEach((title) => {
                if (title.innerHTML == "Resultaten" || title.innerHTML == "Leeslijst") {
                    title.innerHTML += ` - ${matches.length}`;
                }
            });
        })();

        function mapMatches(matches) {
            if (loopCount == 0) {
                matches.forEach((match, i) => {
                    data.stories.forEach(story => LoadStories.matchStorageToRequest(match, story, i));
                });
                loopCount++;
            } else if (loopCount == 1) {
                let iterator = 25;
                matches.forEach((match) => {
                    iterator++;
                    console.log(iterator);
                    data.stories.forEach(story => LoadStories.matchStorageToRequest(match, story, iterator));
                });
                loopCount++;
            } else if (loopCount == 2) {
                let iterator = 50;
                matches.forEach((match) => {
                    iterator++;
                    console.log(iterator);
                    data.stories.forEach(story => LoadStories.matchStorageToRequest(match, story, iterator));
                });
                loopCount++;
            } else if (loopCount == 3) {
                let iterator = 75;
                matches.forEach((match) => {
                    iterator++;
                    console.log(iterator);
                    data.stories.forEach(story => LoadStories.matchStorageToRequest(match, story, iterator));
                });
            }
        }

        DOMTraverse.articleWrapper.removeChild(DOMTraverse.storyLoader[0]);
    },
    hideSortButton: function () {
        let sortButton = document.getElementById("toggle-button-group-sort");
        sortButton.style.display = "none";
    },
    matchStorageToRequest: function (match, story, i) {
        if (match == story.title.toLowerCase() || match == story.title) {
            let img;
            if (story.image != null || story.image != undefined) {
                img = `/dist/img/storyImages/${story.image}`;
            } else if (story.image == undefined) {
                img = "http://lorempixel.com/400/200/";
            }

            let title = story.title.toLowerCase();
            let number = story.nr;
            let by = story.by;

            let maxLength = 150;

            // NT3RP @StackOverflow - Splits the text up to a preview length
            let trimmedString = story.text.substr(0, maxLength);
            trimmedString = story.text.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));

            let preview = trimmedString;
            let fullText = story.text.substring(Math.max(trimmedString.length, trimmedString.lastIndexOf(" ")));

            DOMTraverse.articleWrapper.innerHTML += CreateArticle.Article(img, by, title, number, preview, fullText, i);
        }
    }
};

// Component which holds the structure of each article.
const CreateArticle = {
    Article: function (img, by, title, number, preview, fullText, i) {
        let article = `
        <article id="${title}">
            ${this.ArticleHeader(img, by, title, number, i)}
            ${this.Paragraph(i, preview, fullText)}
            ${this.Footer(title)}
         </article>
        `;
        return article;
    },
    ArticleHeader: function (img, by, title, number, i) {
        let header = `
            <header class="article-header">
                <img src=${img} alt="search-result-image" onclick="Microinteractions.toggleJavascript.call(this)" class="toggleFullStory" data-target="rest-text-${i}">
                <span>Door: ${by}</span>
                <div><h3 onclick="Microinteractions.toggleJavascript.call(this)" class="toggleFullStory" data-target="rest-text-${i}">${title} (${number})</h3></div>
            </header>
        `;
        return header;
    },
    Paragraph: function (i, preview, fullText) {
        let p = `
            <p onclick="Microinteractions.toggleJavascript.call(this)" aria-label="Open volledig verhaal" id="article-text-${i}" data-target="rest-text-${i}">
                ${preview}
                <span id="rest-text-${i}">${fullText}</span>
            </p>
        `;
        return p;
    },
    Footer: function (title) {
        let footer;
        if (Utility.currentPath == "/") {
            footer = `
                <footer>
                    <button type="button" class="btn btn-main" onClick="IndexPage.removeFromList.call(this)" id=read-later-${title}>Verwijderen uit leeslijst</button>
                    <button type="button" class="btn btn-main">Downloaden</button>
                </footer>
            `;
        } else {
            footer = `
                <footer>
                    <button type="button" class="btn btn-main" onClick="ResultPage.addActiveClass.call(this)" id=read-later-${title}>Toevoegen aan leeslijst</button>
                    <button type="button" class="btn btn-main">Downloaden</button>
                </footer>
            `;
        }
        return footer;
    }
};

// Component that contains microinteractions
const Microinteractions = {
    toggleJavascript: function () {
        document.getElementById(`${this.dataset.target}`).classList.toggle("js-active");
        Microinteractions.determineElClicked.call(this);
    },
    determineElClicked: function () {
        let dataTar = this.dataset.target;

        function getImagePath(image) {
            let path;
            if (Utility.currentPath == "/") {
                path = `./dist/img/icons/${image}.svg`;
            } else if (!Utility.currentPath.includes("stories")) {
                path = `../dist/img/icons/${image}.svg`;
            } else {
                path = `../../dist/img/icons/${image}.svg`;
            }
            return path;
        }

        if (dataTar.includes("main-menu")) {
            this.firstElementChild.alt == "Account icon" ? (
                DOMTraverse.mainTag.classList.add("js-active"),
                this.firstElementChild.alt = "Sluit icon",
                this.firstElementChild.src = getImagePath("multiply"),
                this.setAttribute("aria-label", "Sluit hoofdmenu")
            ) : (
                DOMTraverse.mainTag.classList.remove("js-active"),
                this.firstElementChild.alt = "Account icon",
                this.firstElementChild.src = getImagePath("account"),
                this.setAttribute("aria-label", "Open hoofdmenu")
            );
        } else if (dataTar.includes("result-page-search-form")) {
            // this.ariaLabel.includes("Open zoekbalk") ? console.log(true) : console.log(false);
        } else if (dataTar.includes("rest-text") && this.classList.contains("toggleFullStory")) {
            function getParagraph() {
                let dt = this.getAttribute("data-target"),
                    pNum = dt.slice(dt.lastIndexOf("-") + 1),
                    paragraph = document.getElementById(`article-text-${pNum}`);

                return paragraph;
            }
            let p = getParagraph.call(this);
            !p.classList.contains("js-active") ? (
                p.setAttribute("aria-label", "Sluit volledig verhaal"),
                p.classList.add("js-active")
            ) : (
                p.setAttribute("aria-label", "Open volledig verhaal"),
                p.classList.remove("js-active")
            );
        } else if (dataTar.includes("rest-text")) {
            !this.classList.contains("js-active") ? (
                this.setAttribute("aria-label", "Sluit volledig verhaal"),
                this.classList.add("js-active")
            ) : (
                this.setAttribute("aria-label", "Open volledig verhaal"),
                this.classList.remove("js-active")
            );
        } else if (dataTar.includes("button-group-sort")) {
            this.parentElement.classList.toggle("js-active");
        } else {
            this.classList.toggle("js-active");
        }
    },
    loopOverDataTargets: function () {
        [...document.querySelectorAll("[data-target]")].forEach(toggle => {
            toggle.addEventListener("click", function (e) {
                e.preventDefault();
                Microinteractions.toggleJavascript.call(this);
            });
        });
    }()
};

// Pages
const Navigation = {
    getLoginOrSignup: function (path) {
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
    changeLoginNode: function (linkText, loggedIn, indexPath) {
        let nodes = this.getNodes();
        nodes.loginNodeAnchor.innerText = linkText;

        if (loggedIn === true && indexPath === true) {
            // Link prefixes based from index.html
            nodes.firstLoginSibling.insertAdjacentHTML("beforeBegin", `
                    <li class="dynamic-js">
                        <a href="./html/settings.html" role="menuitem">Accountinstellingen</a>
                    </li>
                    <li class="dynamic-js">
                        <a href="./html/reading-history.html" role="menuitem">Leesgeschiedenis</a>
                    </li>
                    <li class="dynamic-js">
                        <a href="#reading-list" role="menuitem">Leeslijst</a>
                    </li>
                    <li class="dynamic-js">
                        <a href="./html/notifications.html" role="menuitem">Notificaties</a>
                    </li>
                `);
        } else if (loggedIn === true && indexPath !== true) {
            // Change the link prefixes to the base of the html folder.
            nodes.firstLoginSibling.insertAdjacentHTML("beforeBegin", `
                    <li class="dynamic-js">
                        <a href="settings.html" role="menuitem">Accountinstellingen</a>
                    </li>
                    <li class="dynamic-js">
                        <a href="reading-history.html" role="menuitem">Leesgeschiedenis</a>
                    </li>
                    <li class="dynamic-js">
                        <a href="../index.html#reading-list" role="menuitem">Leeslijst</a>
                    </li>
                    <li class="dynamic-js">
                        <a href="notifications.html" role="menuitem">Notificaties</a>
                    </li>
                `);
        } else {
            // Remove the added children from above.
            this.removeAddedMenuItems();
        }
    },
    getNodes: function () {
        let loginNode = DOMTraverse.mainMenu.querySelector("#login-node"),
            menuList = loginNode.parentElement,
            loginNodeAnchor = loginNode.firstElementChild,
            firstLoginSibling = loginNode.nextElementSibling;

        return {
            loginNode: loginNode,
            menuList: menuList,
            loginNodeAnchor: loginNodeAnchor,
            firstLoginSibling: firstLoginSibling
        }
    },
    removeAddedMenuItems: function () {
        let nodes = this.getNodes();
        let dynamics = [...nodes.menuList.querySelectorAll(".dynamic-js")];
        dynamics.forEach((li, i) => {
            dynamics.splice(i, 1);
        });
    }
};

const IndexPage = {
    setFormListeners: function () {
        DOMTraverse.searchform.addEventListener("submit", function (e) {
            e.preventDefault();

            let input = DOMTraverse.searchInput.value;

            this.reset();
            Utility.route("input", input);
        });

        DOMTraverse.allStoriesButton.addEventListener("click", () => Utility.route("input", "allStories"));
    },
    removeFromList: function () {
        let readingList = [...window.localStorage.readingList.split(",")];
    },
    getReadingList: function (storageItem) {
        if (window.localStorage.getItem("login") != null || window.localStorage.getItem("signUp") != null) {
            let ls = localStorage.getItem("readingList");

            if (ls === null || ls.length == 0) {
                LoadStories.hideSortButton();
                this.readingListNotFound();
            } else {
                let wrapperClassList = DOMTraverse.articleWrapper.classList;
                if (wrapperClassList.contains("no-results")) {
                    wrapperClassList.remove("no-results");
                }
                LoadStories.createRequest(storageItem);
            }
        } else {
            let span = document.createElement("span");
            span.innerHTML = "Om je leeslijst te zien, moet je ingelogd zijn. <a href='/html/signup.html'>U kunt zich hier inloggen</a>.";
            LoadStories.hideSortButton();
            DOMTraverse.articleWrapper.parentElement.classList.add("reading-list-js-no-login");
            DOMTraverse.articleWrapper.appendChild(span);
        }
    },
    readingListNotFound: function () {
        let articleWrapper = DOMTraverse.articleWrapper,
            iTag = document.createElement("i"),
            spanTag = document.createElement("span");

        iTag.setAttribute("aria-label", "Leeslijst icon");
        spanTag.innerHTML = "Er zijn geen verhalen gevonden in uw leeslijst.<br><a href='#search-form'>Ga op zoek naar nieuwe ervaringen!</a>";

        articleWrapper.classList.add("no-results");
        articleWrapper.appendChild(iTag);
        articleWrapper.appendChild(spanTag);
    }
};

const SignUpPage = {
    Constraint: {
        getDate: function () {
            let today = new Date();
            let dd = today.getDate();
            let mm = (today.getMonth() + 1);
            let yyyy = today.getFullYear();

            function addZeroIfLessThanTen(unit) {
                if (unit < 10) {
                    unit = '0' + unit;
                    return unit;
                } else {
                    return unit;
                }
            }

            today = `${addZeroIfLessThanTen(dd)}/${addZeroIfLessThanTen(mm)}/${yyyy}`;
            return today;
        },
        setCurrentDate: function () {
            let cd = this.getDate();
            DOMTraverse.signUpBirthday.setAttribute("max", cd);
        },
        getConstraints: function () {
            let email = ["[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$", "Een email bestaat uit letters en nummers, een @ en minstens één punt"];
            let name = ["^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$", "Een volledige naam bestaat uit enkel woorden en spaties."];
            let password = ["^([a-zA-Z0-9@*#]{8,15})$", "Een goed wachtwoord bestaat uit minimaal 8 tekens, waarvan minstens één hoofd- en kleine letter en een nummer."];
            return {
                email: email,
                name: name,
                password: password
            }
        },
        matchConstraintToInputField: function (constraint, input) {
            let constraints = this.getConstraints();
            for (const key of Object.keys(constraints)) {
                if (constraint.includes(key)) {
                    this.createConstraint(constraints, key, input);
                }
            }
        },
        createConstraint: function (obj, key, input) {
            let newConstraint = new RegExp(obj[key][0]);

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
        checkElements: function () {
            DOMTraverse.tovalidate.forEach((input) => {
                input.addEventListener("keyup", () => {
                    if (input.classList.contains("password")) {
                        this.matchConstraintToInputField("password", input);
                    } else if (input.classList.contains("email")) {
                        this.matchConstraintToInputField("email", input);
                    } else if (input.classList.contains("name")) {
                        this.matchConstraintToInputField("name", input);
                    }
                });
            });
        }
    },
    UserActions: {
        userLogin: function () {
            DOMTraverse.loginForm.addEventListener("submit", function (e) {
                e.preventDefault();
                let email = this.querySelector("#login-email").value;
                let password = this.querySelector("#login-password").value;

                let login = {
                    email: email,
                    password: password
                }
                setStorage(login);
            });

            function setStorage(login) {
                localStorage.setItem("login", JSON.stringify(login));
                window.location.href = "/index.html";
            }
        },
        userPasswordReset: function () {
            DOMTraverse.resetForm.addEventListener("submit", function (e) {
                e.preventDefault();
                let email = this.querySelector("#reset-password").value;
                setStorage(email);
            });

            function setStorage(email) {
                localStorage.setItem("reset", email);
            }
        },
        userSignUp: function () {
            DOMTraverse.signUpForm.addEventListener("submit", function (e) {
                e.preventDefault();
                let birthday = this.querySelector("#sign-up-birthday").value,
                    email = this.querySelector("#sign-up-email").value,
                    name = this.querySelector("#sign-up-name").value,
                    nationality = this.querySelector("#sign-up-nationality").value,
                    password = this.querySelector("#sign-up-password").value;

                let signUp = {
                    birthday: birthday,
                    email: email,
                    name: name,
                    nationality: nationality,
                    password: password
                }
                setStorage(signUp);
            });

            function setStorage(signUp) {
                localStorage.setItem("signUp", JSON.stringify(signUp));
                window.location.href = "/index.html";
            }
        },
        init: function () {
            this.userLogin();
            this.userPasswordReset();
            this.userSignUp();
        }
    }
};

const ResultPage = {
    readingListArray: [],
    addActiveClass: function () {
        this.classList.toggle("js-active");
        setTimeout(() => {
            ResultPage.addToReadingList.call(this);
            ResultPage.showTopMessage.call(this);
        }, 1500);
    },
    addToReadingList: function () {
        // Get current reading list.
        let title = this.id.slice(this.id.lastIndexOf("-") + 1);

        let readingListStorage = window.localStorage.getItem("readingList");

        ResultPage.readingListArray.push(title);

        window.localStorage.setItem("readingList", ResultPage.readingListArray);
    },
    showTopMessage: function () {
        DOMTraverse.topSpan.classList.add("js-active");
        setTimeout(() => {
            this.classList.remove("js-active");
            DOMTraverse.topSpan.classList.remove("js-active");
        }, 3000);
    }
};

const StoryPage = {
    Kater: {
        getElements: function () {
            let kater = document.getElementsByClassName("story-1")[0],
                article = kater.firstElementChild,
                allSections = article.querySelectorAll("section"),
                titleSection = article.querySelector(".title"),
                paragraph = article.querySelector("p");

            return {
                allSections: allSections,
                article: article,
                kater: kater,
                paragraph: paragraph,
                titleSection: titleSection,
            }
        },
        getTranslateValue: (translateString) => {
            let n = translateString.indexOf("("),
                n1 = translateString.indexOf("%");

            let res = parseInt(translateString.slice(n + 1, n1 - 1));
            return res;
        },
        handleScroll: function () {
            const {
                allSections,
                kater,
                paragraph,
                titleSection,
            } = this.getElements();

            let pActive;

            if (Utility.getCurrentScreenHeight >= 1000) {
                // Scroll events for higher screens.
                kater.addEventListener("scroll", () => {
                    scrollEvents(7);
                });
            } else {
                // Scroll events for less high screens.
                kater.addEventListener("scroll", () => {
                    scrollEvents(4);
                });
            }

            function scrollEvents(centerPage) {
                // Check if the user scrolled more than halfway of the story.
                if (kater.scrollTop >= (kater.scrollHeight / centerPage)) {
                    // Check if the user has allready scrolled down to the paragraph once.
                    if (pActive === true) {
                        titleSection.style.transform = `translateY(700%)`;
                        // Check if the parapgrah has got a transform that is less than 5% of the center. If that is not the case, set the value of translateX to 0% by default.
                        if (StoryPage.Kater.getTranslateValue(paragraph.style.transform) <= 5) {
                            paragraph.style.transform = `translateX(0%)`;
                        }
                    } else {
                        paragraph.style.transform = `translateX(${kater.scrollHeight / (centerPage - 1) - kater.scrollTop}%)`;
                        setTimeout(function () {
                            pActive = true;
                        }, 500);
                    }
                } else {
                    allSections.forEach((section, i) => {
                        section.style.transform = `skew(${Math.floor(Math.random() * 10) + 5}deg, ${Math.floor(Math.random() * 10) + 5}deg) rotate(${Math.floor(Math.random() * 10) + 5}deg) scale(${Math.random() + 0.5}) translateY(-${kater.scrollTop * centerPage}px) translateX(${kater.scrollTop * centerPage}px)`;
                    });
                }
            }
        },
    },
    Paranoia: {
        getElements: function () {
            const article = document.querySelector(".story-2>article"),
                followLeft = document.querySelectorAll(".follow-left"),
                followRight = document.querySelectorAll(".follow-right");

            return {
                article: article,
                followLeft: followLeft,
                followRight: followRight,
            }
        },
        getScrollTop: function () {
            const {
                article,
                followLeft,
                followRight,
            } = this.getElements();
            let scrollTop;

            window.addEventListener("load", function () {
                followRight.forEach((frEl) => {
                    frEl.classList.add("js-hide");
                });
            });
            article.addEventListener("scroll", function () {
                scrollTop = article.scrollTop;
                if (scrollTop < 300 || scrollTop > 1800 && scrollTop < 2499 || scrollTop > 3200) {
                    followLeft.forEach((flEl) => {
                        flEl.classList.remove("js-hide");
                    });
                    followRight.forEach((frEl) => {
                        frEl.classList.add("js-hide");
                    });
                } else if (scrollTop > 300 && scrollTop < 1799 || scrollTop > 2500 && scrollTop < 3199) {
                    followLeft.forEach((flEl) => {
                        flEl.classList.add("js-hide");
                    });
                    followRight.forEach((frEl) => {
                        frEl.classList.remove("js-hide");
                    });
                }
            });
        },
    },
}

// Fires immediately, which triggers all the JavaScript in the pages.
let onLoad = function () {
    let cp = Utility.getCurrentPath();

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