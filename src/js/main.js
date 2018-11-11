// Component which contains most of the DOM elements.
const DOMTraverse = {
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
    topSpans: [...document.getElementsByClassName("top-span")],

    /* Signup Page */
    // Forms
    loginForm: document.getElementById("login-form"),
    resetForm: document.getElementById("reset-form"),
    signUpForm: document.getElementById("sign-up-form"),
    // Inputs
    signUpBirthday: document.getElementById("sign-up-birthday"),
    // Constraint
    tovalidate: [...document.getElementsByClassName("validateJS")],
}

// Component which contains mostly reusable logic.
const Utility = {
    currentPath: window.location.pathname,
    getCurrentPath: function () {
        if (this.currentPath == "/index.html" || this.currentPath == "/" || this.currentPath == "/projects/dfds_seaways/" || this.currentPath == "/projects/dfds_seaways/index.html") {
            return "index"
        } else if (this.currentPath == "/projects/dfds_seaways/html/search-results.html" || this.currentPath == "/html/search-results.html") {
            return "searchResults"
        } else if (this.currentPath == "/html/download-list.html" || this.currentPath == "/projects/dfds_seaways/html/download-list.html") {
            return "downloads"
        } else if (this.currentPath == "/html/signup.html" || this.currentPath == "/projects/dfds_seaways/html/signup.html") {
            return "signUp"
        } else if (this.currentPath == "/html/stories/kater.html" || this.currentPath == "/projects/dfds_seaways/html/stories/kater.html") {
            return "kater"
        } else if (this.currentPath == "/html/stories/paranoia.html" || this.currentPath == "/projects/dfds_seaways/html/stories/paranoia.html") {
            return "paranoia"
        } else if (this.currentPath == "/html/stories/vrijdag-de-dertiende.html" || this.currentPath == "/projects/dfds_seaways/html/stories/vrijdag-de-dertiende.html") {
            return "vrijdag"
        }
    },
    getCurrentScreenHeight: window.innerHeight,
    getCurrentScreenWidth: window.innerWidth,
    getImagePath: function (image) {
        let path

        if (this.currentPath.includes("dfds_seaways")) {
            if (this.currentPath == "/" || this.currentPath.includes("/index.html")) {
                path = `/projects/dfds_seaways/dist/img/icons/${image}.svg`
            } else if (!this.currentPath.includes("stories")) {
                path = `../dist/img/icons/${image}.svg`
            } else {
                path = `../../dist/img/icons/${image}.svg`
            }
        } else {
            if (this.currentPath == "/" || this.currentPath == "/index.html") {
                path = `./dist/img/icons/${image}.svg`
            } else if (!this.currentPath.includes("stories")) {
                path = `../dist/img/icons/${image}.svg`
            } else {
                path = `../../dist/img/icons/${image}.svg`
            }
        }

        return path
    },
    MajorBreakPointTwo: 1039,
    route: function (key, value) {
        localStorage.setItem(key, value)
        if (this.currentPath == "/" || this.currentPath == "/index.html") {
            window.location.href = "/html/search-results.html"
        } else {
            window.location.href = "/projects/dfds_seaways/html/search-results.html"
        }
    },
    storyStorage: "https://api.myjson.com/bins/qvlgr",
    xhr: new XMLHttpRequest()
}

// Component that loads and matches the stories that need to be created.
const LoadStories = {
    createRequest: function (storageItem) {
        const xhr = Utility.xhr
        xhr.open("GET", Utility.storyStorage, true)

        let processing

        xhr.onprogress = function () {
            if (processing == undefined) {
                LoadStories.createLoader(DOMTraverse.articleWrapper)
                processing = true
            }
        }
        xhr.onload = function () {
            if (this.status == 200) {
                let data = JSON.parse(this.responseText)
                LoadStories.createArticles(data, storageItem)
            }
        }
        xhr.onerror = function (err) {
            alertError(err)
        }
        xhr.send()

        function alertError(error) {
            const span = document.createElement("span")

            span.innerText = `Oeps, er ging iets fout. Probeer de pagina opnieuw te laden om de fout op te lossen!`
            DOMTraverse.articleWrapper.appendChild(span)
        }
    },
    createLoader: function (appendTo) {
        let ul = document.createElement("ul")

        for (var i = 0; i < 12; i++) {
            let li = document.createElement("li")
            ul.appendChild(li)
        }

        ul.classList.add("story-loader")
        appendTo.appendChild(ul)
    },
    createArticles: function (data, storageItem) {
        let ls,
            loopCount = 0

        function loopOverStories() {
            let resultArray = []

            if (localStorage.getItem("filters") === undefined || localStorage.getItem("filters") === null) {
                if (storageItem == "input") {
                    ls = localStorage.getItem(storageItem)
                    data.stories.forEach(story => {
                        if (ls === "allStories") {
                            resultArray.push(story.title)
                        } else {
                            if (story.title.toLowerCase().includes(ls.toLowerCase()) || (story.text.indexOf(ls.toLowerCase()) != -1)) {
                                resultArray.push(story.title)
                            }
                        }
                    })
                } else if (storageItem == "readingList") {
                    ls = [...localStorage.getItem(storageItem).split(",")]
                    ls.forEach((item) => {
                        resultArray.push(item)
                    })
                }
            } else {
                ls = JSON.parse(localStorage.getItem("filters"))
                for (const filter in ls) {
                    if (ls.hasOwnProperty(filter)) {
                        resultArray.push({
                            filter: ls[filter]
                        })
                    }
                }
            }
            return resultArray
        }

        (function getResults() {
            let matches

            function theUserIsFiltering() {
                const filters = loopOverStories()
                const filtersArray = []
                const resultArray = []

                (function getFilters() {
                    filters.forEach((filter) => {
                        for (const filterValue in filter) {
                            if (filter.hasOwnProperty(filterValue)) {
                                filter[filterValue].forEach((value) => {
                                    filtersArray.push(value)
                                })
                            }
                        }
                    })
                })()

                data.stories.forEach((story) => {
                    filtersArray.forEach((filter) => {
                        if (story.readTime === filter || story.storyLength === filter || story.ageSuggested === filter) {
                            resultArray.push(story.title)
                        }
                    })
                })

                return resultArray
            }

            if (localStorage.getItem("filters") === undefined || localStorage.getItem("filters") === null) {
                matches = loopOverStories()
            } else {
                matches = theUserIsFiltering()
            }

            if (matches.length == 0 || matches == undefined) {
                LoadStories.hideSortButton()
                const span = document.createElement("span")
                span.innerHTML = `Helaas, er zijn geen matches gevonden met de opgegeven input: ${ls}.<br>Probeer een ander zoekwoord, of gebruik de filters om te zoeken.`

                DOMTraverse.articleWrapper.style.backgroundColor = "white"
                DOMTraverse.articleWrapper.appendChild(span)
                setStoryAmount()
            } else if (matches.length > 25) {
                let currentCount = 0

                if (currentCount == 0) {
                    let toShow = matches.slice(0, 25)
                    mapMatches(toShow)
                }

                if (storageItem == "readingList") {
                    DOMTraverse.articleWrapper.classList.add("reading-list-js-results")
                }
                // Create a function that handles the button click, to load in more stories.
                (function showNextStories() {
                    if (Utility.getCurrentScreenWidth > Utility.MajorBreakPointTwo) {
                        let elHeight = DOMTraverse.articleWrapper.clientHeight

                        window.addEventListener("scroll", function () {
                            if (window.pageYOffset > (elHeight - 1500)) {
                                if (currentCount == 0) {
                                    const toShow = matches.slice(25, 50)
                                    elHeight += elHeight
                                    currentCount++
                                    mapMatches(toShow)
                                } else if (currentCount == 1) {
                                    const toShow = matches.slice(50, 75)
                                    elHeight += 6000
                                    currentCount++
                                    mapMatches(toShow)
                                } else if (currentCount == 2) {
                                    const toShow = matches.slice(75, 100)
                                    elHeight += elHeight
                                    currentCount++
                                    mapMatches(toShow)
                                }
                            }
                        })
                    } else {
                        let elWidth = DOMTraverse.articleWrapper.scrollWidth

                        DOMTraverse.articleWrapper.addEventListener("scroll", function () {
                            if (DOMTraverse.articleWrapper.scrollLeft > (elWidth - 1500)) {
                                if (currentCount == 0) {
                                    const toShow = matches.slice(25, 50)
                                    elWidth += elWidth
                                    currentCount++
                                    mapMatches(toShow)
                                } else if (currentCount == 1) {
                                    const toShow = matches.slice(50, 75)
                                    elWidth += 6000
                                    currentCount++
                                    mapMatches(toShow)
                                } else if (currentCount == 2) {
                                    const toShow = matches.slice(75, 100)
                                    elWidth += elWidth
                                    currentCount++
                                    mapMatches(toShow)
                                }
                            }
                        })
                    }
                })()

                setStoryAmount()
                setChevron()
            } else {
                if (storageItem == "readingList") {
                    DOMTraverse.articleWrapper.parentElement.classList.add("reading-list-js-results")
                }
                mapMatches(matches)
                setStoryAmount()
                setChevron()
            }

            function setStoryAmount() {
                [...DOMTraverse.sectionTitles].forEach((title) => {
                    if (title.innerHTML == "Resultaten" || title.innerHTML == "Leeslijst") {
                        title.innerHTML += ` - ${matches.length}`
                    }
                })
            }
        })()

        function mapMatches(matches) {
            if (loopCount == 0) {
                matches.forEach((match, i) => {
                    data.stories.forEach(story => LoadStories.matchStorageToRequest(match, story, i))
                })
                loopCount++
            } else if (loopCount == 1) {
                let iterator = 25
                matches.forEach((match) => {
                    iterator++
                    data.stories.forEach(story => LoadStories.matchStorageToRequest(match, story, iterator))
                })
                loopCount++
            } else if (loopCount == 2) {
                let iterator = 50
                matches.forEach((match) => {
                    iterator++
                    data.stories.forEach(story => LoadStories.matchStorageToRequest(match, story, iterator))
                })
                loopCount++
            } else if (loopCount == 3) {
                let iterator = 75
                matches.forEach((match) => {
                    iterator++
                    data.stories.forEach(story => LoadStories.matchStorageToRequest(match, story, iterator))
                })
            }
        }

        function setChevron() {
            if (Utility.getCurrentScreenWidth < Utility.MajorBreakPointTwo) {
                DOMTraverse.articleSection.querySelector(".right-chevron").classList.add("js-active")
                console.log(true)
            } else {
                DOMTraverse.articleSection.removeChild(DOMTraverse.articleSection.querySelector(".right-chevron"))
            }
        }

        DOMTraverse.articleWrapper.removeChild(DOMTraverse.storyLoader[0])
        this.loadingFininished = true
    },
    hideSortButton: function () {
        let sortButton = document.getElementById("toggle-button-group-sort")
        sortButton.style.display = "none"
    },
    loadingFininished: false,
    matchStorageToRequest: function (match, story, i) {
        if (match == story.title.toLowerCase() || match == story.title) {
            let img
            if (story.image != null || story.image != undefined) {
                if (!Utility.currentPath.includes("dfds_seaways")) {
                    img = `/dist/img/storyImages/${story.image}`
                } else if (Utility.currentPath.includes("search-results")) {
                    img = `../dist/img/storyImages/${story.image}`
                } else {
                    img = `dist/img/storyImages/${story.image}`
                }
            } else return

            let title = story.title.toLowerCase(),
                number = story.nr,
                by = story.by

            let filters = {
                readTime: story.readTime,
                storyLength: story.storyLength,
                ageSuggested: story.ageSuggested
            }

            let maxLength = 150

            // NT3RP @StackOverflow - Splits the text up to a preview length
            let trimmedString = story.text.substr(0, maxLength)
            trimmedString = story.text.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))

            let preview = trimmedString,
                fullText = story.text.substring(Math.max(trimmedString.length, trimmedString.lastIndexOf(" ")))

            DOMTraverse.articleWrapper.innerHTML += CreateArticle.Article(img, by, title, number, preview, fullText, i, filters)
        }
    }
}

// Component that holds most dynamica of the sorting process.
const SortStories = {
    getElements: function () {
        const sortForm = document.getElementById("button-group-sort"),
            inputs = sortForm.querySelectorAll("input"),
            labels = sortForm.querySelectorAll("label")

        return {
            sortForm: sortForm,
            inputs: inputs,
            labels: labels,
        }
    },
    determineActiveSorter: function () {
        const {
            sortForm,
            inputs,
            labels,
        } = this.getElements()

        let previousCheckedInput = [],
            prev,
            currentActive

        inputs.forEach((input) => {
            function pushActives(inp) {
                previousCheckedInput.push(inp)
            }

            if (input.checked) {
                pushActives(input)
            }

            input.addEventListener("click", function () {
                if (this.checked === true) {
                    pushActives(this)

                    prev = previousCheckedInput.shift()
                    prev.checked = false
                } else {
                    prev = this
                }

                prev.addEventListener("change", function () {
                    setTimeout(function () {
                        if (this.checked === false) {
                            this.checked = true
                        }
                    }, 500)
                })
                currentActive = previousCheckedInput[0]
                SortStories.sortPerActive(currentActive)
            })
        })

        currentActive = previousCheckedInput[0]
        SortStories.sortPerActive(currentActive)
    },
    getStoriesArray: function () {
        let articles = document.querySelectorAll(".article-wrapper article")
        return articles
    },
    sortPerActive: function (currentActive) {
        let stories = [...this.getStoriesArray()]

        // Laurens Holst @Stackoverflow - Fisher Yates Algorithm.
        function shuffle(array) {
            let currentIndex = array.length,
                temporaryValue, randomIndex

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex)
                currentIndex -= 1

                // And swap it with the current element.
                temporaryValue = array[currentIndex]
                array[currentIndex] = array[randomIndex]
                array[randomIndex] = temporaryValue
            }

            return array
        }

        if (currentActive.name.includes("numeric")) {
            function getStoryNum(story) {
                let storyNumString = story.firstElementChild.firstElementChild.dataset.target,
                    storyNum = storyNumString.slice(storyNumString.lastIndexOf("-" + 1))

                return storyNum
            }
            let num = stories.sort(function (a, b) {
                return getStoryNum(a) == getStoryNum(b) ? 0 : (getStoryNum(a) > getStoryNum(b) ? 1 : -1)
            })
            this.updateHTML(num)
        } else if (currentActive.name.includes("alphabetically")) {
            let alpha = stories.sort(function (a, b) {
                return a.id == b.id ? 0 : (a.id > b.id ? 1 : -1)
            })
            this.updateHTML(alpha)
        } else if (currentActive.name.includes("popularity")) {
            let pop = shuffle(stories)
            this.updateHTML(pop)
        } else if (currentActive.name.includes("relevance")) {
            let rel = shuffle(stories)
            this.updateHTML(rel)
        }
    },
    updateHTML: function (typeSort) {
        DOMTraverse.articleWrapper.innerHTML = ""
        typeSort.forEach((story) => {
            DOMTraverse.articleWrapper.appendChild(story)
        })
    }
}

// Component which holds the structure of each article.
const CreateArticle = {
    Article: function (img, by, title, number, preview, fullText, i, filters) {
        let article = `
        <article
            id="${title}"
            data-filter-readTime=${filters.readTime}
            data-filter-storyLength=${filters.storyLength}
            data-filter-ageSuggested=${filters.ageSuggested}
        >
            ${this.ArticleHeader(img, by, title, number, i)}
            ${this.Paragraph(i, preview, fullText)}
            ${this.Footer(title, this.UploadSection(i, by), this.ErrorModalDownloads(i), this.ErrorModalUploads(i), this.errorModalLogin(i), i)}
         </article>
        `
        return article
    },
    ArticleHeader: function (img, by, title, number, i) {
        return `
            <header class="article-header">
                <img
                    src=${img}
                    alt="search-result-image"
                    onclick="Microinteractions.toggleJavascript.call(this)"
                    class="toggleFullStory"
                    data-target="rest-text-${i}"
                    data-open="upload-photo-section-${i}"
                >
                <span>
                    Door: ${by}
                </span>
                <div
                    onclick="Microinteractions.toggleJavascript.call(this)"
                    class="toggleFullStory"
                    data-target="rest-text-${i}"
                    data-open="upload-photo-section-${i}"
                >
                    <h3>
                        ${title} (${number})
                    </h3>
                </div>
            </header>
        `
    },
    Paragraph: function (i, preview, fullText) {
        return `
            <p
                onclick="Microinteractions.toggleJavascript.call(this)"
                aria-label="Open volledig verhaal"
                id="article-text-${i}"
                data-target="rest-text-${i}"
                data-open="upload-photo-section-${i}"
            >
                ${preview}
                <span id="rest-text-${i}">
                    ${fullText}
                </span>
            </p>
        `
    },
    Footer: function (title, UploadSection, errorModalDownloads, errorModalUploads, errorModalLogin, i) {
        let footer

        if (Utility.currentPath == "/") {
            footer = `
                <footer>
                    ${UploadSection}
                    <button
                        type="button"
                        class="btn btn-main"
                        onClick="IndexPage.removeFromList.call(this)"
                        id=read-later-${title}
                    >
                        Verwijderen uit leeslijst
                    </button>
                    <button type="button" class="btn btn-main" id="toggle-download-modal-${i}">
                        Toevoegen aan downloadlijst
                    </button>
                    ${errorModalDownloads}
                    ${errorModalUploads}
                    ${errorModalLogin}
                </footer>
            `
        } else {
            footer = `
                <footer>
                    ${UploadSection}
                    <button
                        type="button"
                        class="btn btn-main"
                        onClick="ResultPage.addActiveClass.call(this)"
                        id=read-later-${title}
                    >
                        Toevoegen aan leeslijst
                    </button>
                    <button
                        type="button"
                        class="btn btn-main"
                        id="toggle-download-modal-${i}"
                        onClick="Downloading.handlePopup.call(this)"
                    >
                        Toevoegen aan downloadlijst
                    </button>
                    ${errorModalDownloads}
                    ${errorModalUploads}
                    ${errorModalLogin}
                </footer>
            `
        }

        return footer
    },
    UploadSection: function (i, by) {
        return `
            <section class="upload-photo-section" id="upload-photo-section-${i}">
                <p>
                    De foto geuploaded bij dit verhaal was van:
                    ${by}. Hij heeft al <span>${Math.floor(Math.random() * 400) + 10} volgers</span>
                    verkregen door regelmatig foto’s te plaatsen
                    bij verhalen die hij passend vindt bij zijn reis-
                    foto’s. Denk je dat je het beter kunt?
                </p>
                <form id="upload-image-form-${i}">
                    <fieldset>
                        <div>
                            <label for="select-image-${i}">
                                Upload je foto
                            </label>
                            <input type="file" accept=".jpg, .png" id="select-image-${i}">
                            <button type="button" class="btn btn-main" onclick="UploadPhoto.submitActions.call(this)">
                                Upload
                            </button>
                        </div>
                    </fieldset>
                </form>
                <p>
                    dan hier je foto en wie weet ontdekken
                    toekomstige reizigers nog mooie locaties
                    door jouw foto’s! Je weet nooit wat voor
                    bedankje ze je hiervoor kunnen geven.
                </p>
            </section>
        `
    },
    ErrorModalUploads: function (i) {
        let src

        if (Utility.currentPath.includes("dfds_seaways")) {
            src = "/projects/dfds_seaways/dist/img/icons/multiply_white.svg"
        } else {
            src = "/dist/img/icons/multiply_white.svg"
        }

        return `
            <section id="uploads-modal-${i}" class="uploads-modal">
                <header>
                    <h4>
                        Uploadfout - Formaat
                    </h4>
                    <img src=${src} class="remove-uploads-modal">
                </header>
                <p>
                    Zo te zien is er iets fout gegaan bij het
                    uploaden van de door u zo zeer
                    gewaardeerde foto. Zorg ervoor dat de
                    afbeelding niet groter is dan 20mb en het
                    een .jp(e)g of .png formaat heeft.
                </p>
            </section>
        `
    },
    errorModalLogin: function (i) {
        let src

        if (Utility.currentPath.includes("dfds_seaways")) {
            src = "/projects/dfds_seaways/dist/img/icons/multiply_white.svg"
        } else {
            src = "/dist/img/icons/multiply_white.svg"
        }

        return `
            <section id="login-modal-${i}" class="login-modal">
                <header>
                    <h4>
                        Inloggen Vereist!
                    </h4>
                    <img src=${src} class="remove-login-modal">
                </header>
                <p>
                    Om verhalen toe te voegen aan de
                    leeslijst dient u ingelogd te zijn. U
                    kunt snel naar de inlogpagina navigeren
                    door op dit venster te klikken of door
                    in het menu rechtsboven op “Inloggen /
                    aanmelden” te drukken.
                </p>
            </section>
        `
    },
    ErrorModalDownloads: function (i) {
        let src

        if (Utility.currentPath.includes("dfds_seaways")) {
            src = "/projects/dfds_seaways/dist/img/icons/multiply_white.svg"
        } else {
            src = "/dist/img/icons/multiply_white.svg"
        }

        return `
            <section id="download-modal-${i}" class="download-modal">
                <header>
                    <h4>
                        Inloggen Vereist!
                    </h4>
                    <img src=${src} id="remove-modal-${i}"/>
                </header>
                <p>
                    Om verhalen toe te voegen aan de
                    downloadlijst dient u ingelogd te zijn. U
                    kunt snel naar de inlogpagina navigeren
                    door op dit venster te klikken of door
                    in het menu rechtsboven op “Inloggen /
                    aanmelden” te drukken.
                </p>
            </section>
        `
    }
}

// Component that contains microinteractions.
const Microinteractions = {
    toggleJavascript: function () {
        document.getElementById(`${this.dataset.target}`).classList.toggle("js-active")
        if (this.dataset.open !== undefined && this.dataset.open !== null) {
            document.getElementById(`${this.dataset.open}`).classList.toggle("js-active")
        }
        Microinteractions.determineElClicked.call(this)
    },
    determineElClicked: function () {
        let dataTar = this.dataset.target

        if (dataTar.includes("main-menu")) {
            this.firstElementChild.alt == "Account icon" ? (
                DOMTraverse.mainMenu.classList.add("js-active"),
                DOMTraverse.mainTag.classList.add("js-active"),
                this.firstElementChild.alt = "Sluit icon",
                this.firstElementChild.src = Utility.getImagePath("multiply"),
                this.setAttribute("aria-label", "Sluit hoofdmenu")
            ) : (
                DOMTraverse.mainTag.classList.remove("js-active"),
                this.firstElementChild.alt = "Account icon",
                this.firstElementChild.src = Utility.getImagePath("account"),
                this.setAttribute("aria-label", "Open hoofdmenu")
            )
        } else if (dataTar.includes("result-page-search-form")) {
            // this.ariaLabel.includes("Open zoekbalk") ? console.log(true) : console.log(false)
        } else if (dataTar.includes("rest-text") && this.classList.contains("toggleFullStory")) {
            function getParagraph() {
                let dt = this.getAttribute("data-target"),
                    pNum = dt.slice(dt.lastIndexOf("-") + 1),
                    paragraph = document.getElementById(`article-text-${pNum}`)

                return paragraph
            }
            let p = getParagraph.call(this)
            !p.classList.contains("js-active") ? (
                p.setAttribute("aria-label", "Sluit volledig verhaal"),
                p.classList.add("js-active")
            ) : (
                p.setAttribute("aria-label", "Open volledig verhaal"),
                p.classList.remove("js-active")
            )
        } else if (dataTar.includes("rest-text")) {
            !this.classList.contains("js-active") ? (
                this.setAttribute("aria-label", "Sluit volledig verhaal"),
                this.classList.add("js-active")
            ) : (
                this.setAttribute("aria-label", "Open volledig verhaal"),
                this.classList.remove("js-active")
            )
        } else if (dataTar.includes("button-group-sort")) {
            this.parentElement.classList.toggle("js-active")
        } else {
            this.classList.toggle("js-active")
        }
    },
    loopOverDataTargets: function () {
        [...document.querySelectorAll("[data-target]")].forEach(toggle => {
            toggle.addEventListener("click", function (e) {
                e.preventDefault()
                Microinteractions.toggleJavascript.call(this)
            })
        })
    }()
}

const UploadPhoto = {
    submitActions: function () {
        let input = this.previousElementSibling,
            inputValue = input.value,
            section = this.parentElement.parentElement.parentElement.parentElement,
            paragraphs = section.querySelectorAll("p")

        if (window.localStorage.getItem("login") !== null || window.localStorage.getItem("signUp") !== null) {

        }
        if (inputValue !== null && inputValue !== undefined && inputValue.length !== 0 && inputValue.includes(".jpg") || inputValue.includes(".png")) {
            this.classList.add("js-success")
            this.innerHTML = "Geuploaded"

            paragraphs.forEach((p) => {
                section.removeChild(p)
            })

            section.innerHTML += `
                <p>
                    Je hebt voor dit verhaal op \${datum} al een
                    foto geuploaded, deze foto is te zien voor
                    alle mensen die zich in de buurt bevinden van
                    locatie, waar de foto vandaan is genomen.
                    Als u vindt dat u, op dezelfde OF een andere
                    locatie een betere foto hebt gemaakt, schroom
                    dan niet om die ook te uploaden.
                </p>
            `
        } else {
            // Show error modal
            const footer = this.parentElement.parentElement.parentElement.parentElement.parentElement,
                uploadErrorModal = footer.querySelector(".uploads-modal")

            this.classList.add("js-error")
            uploadErrorModal.classList.add("js-active")

            setTimeout(function () {
                this.classList.remove("js-error")
                uploadErrorModal.classList.remove("js-active")
            }, 5000)

            uploadErrorModal.querySelector(".remove-uploads-modal").addEventListener("click", function () {
                uploadErrorModal.classList.remove("js-active")
            })
        }
    },
}

// Component that holds most dynamica of the download process.
const Downloading = {
    isUserLoggedIn: Boolean,
    downloading: false,
    getElements: function () {
        const downloadButton = this

        const storyNumber = downloadButton.id.slice(downloadButton.id.lastIndexOf("-") + 1),
            modal = document.getElementById(`download-modal-${storyNumber}`),
            closeModalButton = modal.firstElementChild.firstElementChild.nextElementSibling

        return {
            downloadButton: downloadButton,
            storyNumber: storyNumber,
            modal: modal,
            closeModalButton: closeModalButton,
        }
    },
    handlePopup: function () {
        const {
            downloadButton,
            modal,
            closeModalButton,
        } = Downloading.getElements.call(this)

        let loading = true
        determineIfLoading()

        if (Downloading.isUserLoggedIn) {
            modal.classList.remove("js-active")

            let mappableDownloadList = undefined
            let stringified

            let storyToAdd = this.parentElement.parentElement.id

            if (window.localStorage.getItem("downloadList") !== null) {
                if (window.localStorage.getItem("downloadList").length !== 0) {
                    mappableDownloadList = window.localStorage.getItem("downloadList").split(",")
                    let isItemInCurrentDownloadList = false

                    mappableDownloadList.forEach((listItem) => {
                        if (storyToAdd === listItem) {
                            isItemInCurrentDownloadList = true
                        }
                    })

                    if (isItemInCurrentDownloadList === false) {
                        stringified = mappableDownloadList.toString()
                        stringified += `,${storyToAdd}`

                        setLocalStorage(stringified)
                        addSuccessResponses()
                    } else {
                        addSuccessResponses(true)
                    }
                } else {
                    addInitialItems(stringified, storyToAdd)
                    setLocalStorage(stringified)
                    addSuccessResponses()
                }
            } else {
                addInitialItems(stringified, storyToAdd)
                setLocalStorage(stringified)
                addSuccessResponses()
            }
        } else {
            modal.classList.add("js-active")
            closeModalButton.addEventListener("click", function () {
                modal.classList.remove("js-active")
            })

            setTimeout(function () {
                modal.classList.remove("js-active")
            }, 10000)
        }

        function addInitialItems(stringified, storyToAdd) {
            stringified = ""
            stringified += `${storyToAdd}`
        }

        function setLocalStorage(stringified) {
            window.localStorage.setItem("downloadList", stringified)
        }

        function addSuccessResponses(isAddedAllready = false) {
            let downloadSpan = DOMTraverse.topSpanDownloads

            loading = false
            determineIfLoading()


            if (!isAddedAllready) {
                downloadButton.classList.add("js-loading")

                setTimeout(() => {
                    downloadSpan.classList.add("js-active")
                    downloadButton.classList.remove("js-loading")
                    downloadButton.classList.add("js-success")
                    downloadButton.innertText = "Toegevoegd aan downloadlijst"
                }, 4000)

                setTimeout(() => {
                    downloadSpan.classList.remove("js-active")
                }, 8000)
            } else {
                downloadButton.classList.add("js-success")
                downloadButton.innerText = "Al toegevoegd aan downloadlijst"
            }
        }

        function determineIfLoading() {
            if (loading === true) {
                downloadButton.classList.add("js-loading")

                setTimeout(() => {
                    downloadButton.classList.remove("js-loading")
                }, 4000)
            } else {
                downloadButton.classList.remove("js-loading")
            }
        }
    },
    handleButtonClick: function () {
        const button = DOMTraverse.downloadStoryButton,
            modal = DOMTraverse.downloadModal,
            downloadAllButon = DOMTraverse.downloadAllButton

        const buttons = [button, downloadAllButon]
        buttons.forEach((button) => {
            button.addEventListener("click", function () {
                modal.classList.add("js-active")
            })
        })
    },
    handleModalClick: function () {
        const modal = DOMTraverse.downloadModal,
            allForms = modal.querySelectorAll("form"),
            allButtons = modal.querySelectorAll(".btn-main"),
            closeButton = modal.querySelector("#close-modal-button")

        closeButton.addEventListener("click", function () {
            modal.classList.remove("js-active")
        })

        allForms.forEach((form) => {
            form.addEventListener("submit", (e) => {
                e.preventDefault()
            })

            form.addEventListener("keyup", function (e) {
                if (e.target.getAttribute("type") === "email") {
                    SignUpPage.Constraint.matchConstraintToInputField("email", e.target)
                }
            })
        })

        allButtons.forEach((button) => {
            button.addEventListener("click", function () {
                handleButtonClicks.call(this)
            })
        })

        function handleButtonClicks() {
            if (this.getAttribute("name").includes("sms") || this.getAttribute("name").includes("mail")) {
                Downloading.downloading = true
                this.classList.add("js-loading")
                this.innerText = "Versturen..."
                setTimeout(() => {
                    this.classList.remove("js-loading")
                    this.innerText = "Verstuur opnieuw"
                    this.classList.add("js-success")
                }, 4000)
            } else {
                Downloading.downloading = true
            }
        }
    },
    SmallScreenDownload: function () {
        const modal = DOMTraverse.downloadInformationModal,
            loader = DOMTraverse.downloadLoader,
            paragraph = modal.querySelector("p")

        modal.classList.add("js-active")

        paragraph.addEventListener("click", function () {
            loader.classList.add("js-active")

            setTimeout(() => {
                loader.classList.remove("js-active")
                loader.firstElementChild.setAttribute("src", "dist/img/icons/verify_sign.svg")
            }, 4000)
        })

        setTimeout(() => {
            modal.classList.remove("js-active")
        }, 4000)
    }
}

// Pages
const Navigation = {
    getLoginOrSignup: function (path) {
        if (window.localStorage.getItem("login") != null || window.localStorage.getItem("signUp") != null) {
            if (path == "index") {
                this.changeLoginNode("Uitloggen", true, true, false)
                Downloading.isUserLoggedIn = true
            } else if (path == "searchResults") {
                this.changeLoginNode("Uitloggen", true, false, false)
                Downloading.isUserLoggedIn = true
            } else if (path == "stories") {
                this.changeLoginNode("Uitloggen", true, false, true)
                Downloading.isUserLoggedIn = true
            }
        } else {
            this.changeLoginNode("Inloggen")
            Downloading.isUserLoggedIn = false
        }
    },
    getNodes: function () {
        const loginNode = DOMTraverse.mainMenu.querySelector("#login-node"),
            menuList = loginNode.parentElement,
            loginNodeAnchor = loginNode.firstElementChild,
            firstLoginSibling = loginNode.nextElementSibling

        return {
            loginNode: loginNode,
            menuList: menuList,
            loginNodeAnchor: loginNodeAnchor,
            firstLoginSibling: firstLoginSibling
        }
    },
    changeLoginNode: function (linkText, loggedIn, indexPath, storyPath) {
        const nodes = this.getNodes()
        nodes.loginNodeAnchor.innerText = linkText

        if (loggedIn && indexPath === false && storyPath === false) {
            nodes.firstLoginSibling.insertAdjacentHTML("beforebegin", `
                <li class="dynamic-js">
                    <a href="download-list.html" role="menuitem">
                        Downloadlijst
                    </a>
                </li>
                <li class= "dynamic-js">
                    <a href="../index.html#reading-list" role="menuitem">
                        Leeslijst
                    </a>
                </li>
            `)
        } else if (loggedIn && indexPath && storyPath === false) {
            nodes.firstLoginSibling.insertAdjacentHTML("beforebegin", `
                <li class="dynamic-js">
                    <a href="html/download-list.html" role="menuitem">
                        Downloadlijst
                    </a>
                </li>
                <li class= "dynamic-js">
                    <a href="#reading-list" role="menuitem">
                        Leeslijst
                    </a>
                </li>
            `)
        } else if (loggedIn && storyPath) {
            nodes.loginNode.insertAdjacentHTML("afterend", `
                <li class="dynamic-js">
                    <a href="../download-list.html" role="menuitem">
                        Downloadlijst
                    </a>
                </li>
                <li class= "dynamic-js">
                    <a href="../../index.html#reading-list" role="menuitem">
                        Leeslijst
                    </a>
                </li>
            `)
        } else {
            this.removeAddedMenuItems()
        }
    },
    removeAddedMenuItems: function () {
        const nodes = this.getNodes()
        const dynamics = [...nodes.menuList.querySelectorAll(".dynamic-js")]

        dynamics.forEach((li, i) => {
            dynamics.splice(i, 1)
        })
    }
}

const IndexPage = {
    setFormListeners: function () {
        DOMTraverse.searchform.addEventListener("submit", function (e) {
            e.preventDefault()

            let input = DOMTraverse.searchInput.value

            this.reset()

            if (window.localStorage.getItem("filters") !== undefined) {
                window.localStorage.removeItem("filters")
            }
            Utility.route("input", input)
        })

        DOMTraverse.allStoriesButton.addEventListener("click", () => {
            if (window.localStorage.getItem("filters") !== undefined) {
                window.localStorage.removeItem("filters")
            }
            Utility.route("input", "allStories")
        })

        DOMTraverse.filterForm.addEventListener("submit", function (e) {
            e.preventDefault()

            IndexPage.Filtering.handleFilterForm()

            this.reset()
        })
    },
    removeFromList: function () {
        window.localStorage.readingList.split(",")
    },
    getReadingList: function (storageItem) {
        if (window.localStorage.getItem("login") != null || window.localStorage.getItem("signUp") != null) {
            const ls = localStorage.getItem("readingList")

            if (ls === null || ls.length == 0) {
                LoadStories.hideSortButton()
                this.readingListNotFound()
            } else {
                const wrapperClassList = DOMTraverse.articleWrapper.classList

                if (wrapperClassList.contains("no-results")) {
                    wrapperClassList.remove("no-results")
                }

                LoadStories.createRequest(storageItem)
            }
        } else {
            const span = document.createElement("span")

            span.innerHTML = "Om je leeslijst te zien, moet je ingelogd zijn. <a href='/html/signup.html'>U kunt zich hier inloggen</a>."

            LoadStories.hideSortButton()
            DOMTraverse.articleWrapper.parentElement.classList.add("reading-list-js-no-login")
            DOMTraverse.articleWrapper.appendChild(span)
        }
    },
    readingListNotFound: function () {
        const articleWrapper = DOMTraverse.articleWrapper,
            iTag = document.createElement("i"),
            spanTag = document.createElement("span")

        iTag.setAttribute("aria-label", "Leeslijst icon")
        spanTag.innerHTML = "Er zijn geen verhalen gevonden in uw leeslijst.<br><a href='#search-form'>Ga op zoek naar nieuwe ervaringen!</a>"

        articleWrapper.classList.add("no-results")
        articleWrapper.appendChild(iTag)
        articleWrapper.appendChild(spanTag)
    },
    Filtering: {
        getElements: function () {
            const filterFormInputs = DOMTraverse.filterForm.querySelectorAll("input")

            return {
                filterFormInputs: filterFormInputs,
            }
        },
        getActiveInputs: function () {
            const {
                filterFormInputs
            } = this.getElements()

            let checkedArray = []

            filterFormInputs.forEach(input => {
                if (input.checked) {
                    checkedArray.push(input)
                }
            })

            return checkedArray
        },
        handleFilterForm: function () {
            let activeInputs = this.getActiveInputs()

            if (activeInputs.length === 0 || activeInputs === undefined) {
                // Tell the user to select some filters
            } else {
                // Move forward to matching the filters to the stories.
                if (window.localStorage.getItem("input") != undefined) {
                    window.localStorage.removeItem("input")
                }

                let filterFor = {
                    readTime: [],
                    ageSuggested: [],
                    storyLength: [],
                }

                activeInputs.forEach((activeInput) => {
                    if (activeInput.id.includes("readTime")) {
                        filterFor.readTime.push(activeInput.id.substr(16))
                    } else if (activeInput.id.includes("ageSuggested")) {
                        filterFor.ageSuggested.push(activeInput.id.substr(20))
                    } else if (activeInput.id.includes("storyLength")) {
                        filterFor.storyLength.push(activeInput.id.substr(19))
                    }
                })

                // Create something in the request module so that the filters are matched with the stories.
                Utility.route("filters", JSON.stringify(filterFor))
            }
        },
    },
}

const SignUpPage = {
    Constraint: {
        getDate: function () {
            const today = new Date()
            const dd = today.getDate()
            const mm = (today.getMonth() + 1)
            const yyyy = today.getFullYear()

            function addZeroIfLessThanTen(unit) {
                if (unit < 10) {
                    unit = '0' + unit
                    return unit
                } else {
                    return unit
                }
            }

            return `${addZeroIfLessThanTen(dd)}/${addZeroIfLessThanTen(mm)}/${yyyy}`
        },
        setCurrentDate: function () {
            const cd = this.getDate()

            DOMTraverse.signUpBirthday.setAttribute("max", cd)
        },
        getConstraints: function () {
            const email = ["[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$", "Een email bestaat uit letters en nummers, een @ en minstens één punt"]
            const name = ["^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$", "Een volledige naam bestaat uit enkel woorden en spaties."]
            const password = ["^([a-zA-Z0-9@*#]{8,15})$", "Een goed wachtwoord bestaat uit minimaal 8 tekens, waarvan minstens één hoofd- en kleine letter en een nummer."]

            return {
                email,
                name,
                password,
            }
        },
        matchConstraintToInputField: function (constraint, input) {
            let constraints = this.getConstraints()

            for (const key of Object.keys(constraints)) {
                if (constraint.includes(key)) {
                    this.createConstraint(constraints, key, input)
                }
            }
        },
        createConstraint: function (obj, key, input) {
            let newConstraint = new RegExp(obj[key][0])

            if (input.value.length === 0) {
                input.classList.remove("js-active")
            } else {
                input.classList.add("js-active")
            }
            if (newConstraint.test(input.value)) {
                input.setCustomValidity("")
            } else {
                input.setCustomValidity(obj[key][1])
            }
        },
        checkElements: function () {
            DOMTraverse.tovalidate.forEach(input => {
                input.addEventListener("keyup", () => {
                    if (input.classList.contains("password")) {
                        this.matchConstraintToInputField("password", input)
                    } else if (input.classList.contains("email")) {
                        this.matchConstraintToInputField("email", input)
                    } else if (input.classList.contains("name")) {
                        this.matchConstraintToInputField("name", input)
                    }
                })
            })
        }
    },
    UserActions: {
        userLogin: function () {
            DOMTraverse.loginForm.addEventListener("submit", function (e) {
                e.preventDefault()
                const email = this.querySelector("#login-email").value
                const password = this.querySelector("#login-password").value

                const login = {
                    email: email,
                    password: password
                }

                setStorage(login)
            })

            function setStorage(login) {
                localStorage.setItem("login", JSON.stringify(login))

                if (Utility.currentPath.includes("dfds_seaways")) {
                    window.location.href = "../index.html"
                } else {
                    window.location.href = "/index.html"
                }
            }
        },
        userPasswordReset: function () {
            DOMTraverse.resetForm.addEventListener("submit", function (e) {
                e.preventDefault()

                const email = this.querySelector("#reset-password").value
                setStorage(email)
            })

            function setStorage(email) {
                localStorage.setItem("reset", email)
            }
        },
        userSignUp: function () {
            DOMTraverse.signUpForm.addEventListener("submit", function (e) {
                e.preventDefault()

                const birthday = this.querySelector("#sign-up-birthday").value,
                    email = this.querySelector("#sign-up-email").value,
                    name = this.querySelector("#sign-up-name").value,
                    nationality = this.querySelector("#sign-up-nationality").value,
                    password = this.querySelector("#sign-up-password").value

                const signUp = {
                    birthday,
                    email,
                    name,
                    nationality,
                    password,
                }

                setStorage(signUp)
            })

            function setStorage(signUp) {
                localStorage.setItem("signUp", JSON.stringify(signUp))
                window.location.href = "/index.html"
            }
        },
        init: function () {
            this.userLogin()
            this.userPasswordReset()
            this.userSignUp()
        }
    }
}

const ResultPage = {
    readingListArray: [],
    addActiveClass: function () {

        if (window.localStorage.getItem("login") !== null || window.localStorage.getItem("signUp") !== null) {
            this.classList.toggle("js-loading")

            setTimeout(() => {
                ResultPage.addToReadingList.call(this)
                ResultPage.showTopMessage.call(this)
            }, 1500)
        }
    },
    addToReadingList: function () {
        const title = this.id.slice(this.id.lastIndexOf("-") + 1)

        ResultPage.readingListArray.push(title)

        window.localStorage.setItem("readingList", ResultPage.readingListArray)
    },
    showTopMessage: function () {
        DOMTraverse.topSpanReadingList.classList.add("js-active")
        setTimeout(() => {
            this.classList.remove("js-loading")
            this.classList.add("js-active")
            this.innerText = "Toegevoegd aan leeslijst"
            DOMTraverse.topSpanReadingList.classList.remove("js-active")
        }, 4000)

        setTimeout(() => {
            this.classList.remove("js-active")
            this.classList.add("js-remove")
            this.innerText = "Verwijderen uit leeslijst"
        }, 8000)
    }
}

const StoryPage = {
    Kater: {
        getElements: function () {
            const kater = document.getElementsByClassName("story-1")[0],
                article = kater.firstElementChild,
                allSections = article.querySelectorAll("section"),
                titleSection = article.querySelector(".title"),
                paragraph = article.querySelector("p")

            return {
                allSections,
                article,
                kater,
                paragraph,
                titleSection,
            }
        },
        getTranslateValue: (translateString) => {
            const n = translateString.indexOf("("),
                n1 = translateString.indexOf("%")

            return parseInt(translateString.slice(n + 1, n1 - 1))
        },
        handleScroll: function () {
            const {
                allSections,
                kater,
                paragraph,
                titleSection,
            } = this.getElements()

            let pActive

            if (Utility.getCurrentScreenHeight >= 1000) {
                kater.addEventListener("scroll", () => {
                    scrollEvents(7)
                })
            } else {
                kater.addEventListener("scroll", () => {
                    scrollEvents(4)
                })
            }

            function scrollEvents(centerPage) {
                // Check if the user scrolled more than halfway of the story.
                if (kater.scrollTop >= (kater.scrollHeight / centerPage)) {
                    // Check if the user has allready scrolled down to the paragraph once.
                    if (pActive === true) {
                        titleSection.style.transform = `translateY(700%)`
                        // Check if the parapgrah has got a transform that is less than 5% of the center. If that is not the case, set the value of translateX to 0% by default.
                        if (StoryPage.Kater.getTranslateValue(paragraph.style.transform) <= 5) {
                            paragraph.style.transform = `translateX(0%)`
                        }
                    } else {
                        paragraph.style.transform = `translateX(${kater.scrollHeight / (centerPage - 1) - kater.scrollTop}%)`

                        setTimeout(function () {
                            pActive = true
                        }, 500)
                    }
                } else {
                    allSections.forEach((section, i) => {
                        section.style.transform = `skew(${Math.floor(Math.random() * 10) + 5}deg, ${Math.floor(Math.random() * 10) + 5}deg) rotate(${Math.floor(Math.random() * 10) + 5}deg) scale(${Math.random() + 0.5}) translateY(-${kater.scrollTop * centerPage}px) translateX(${kater.scrollTop * centerPage}px)`
                    })
                }
            }
        },
    },
    Paranoia: {
        getElements: function () {
            const article = document.querySelector(".story-2>article"),
                followLeft = article.querySelectorAll(".follow-left"),
                followRight = article.querySelectorAll(".follow-right"),
                paragraph = article.querySelector("p")

            return {
                article,
                followLeft,
                followRight,
                paragraph,
            }
        },
        getScrollTop: function () {
            const {
                followLeft,
                followRight,
                paragraph,
            } = this.getElements()
            let scrollTop

            window.addEventListener("load", function () {
                followRight.forEach(frEl => {
                    frEl.classList.add("js-hide")
                })
            })
            paragraph.addEventListener("scroll", function () {
                scrollTop = paragraph.scrollTop

                if (scrollTop < 300 || scrollTop > 1800 && scrollTop < 2499 || scrollTop > 3200) {
                    followLeft.forEach((flEl) => {
                        flEl.classList.remove("js-hide")
                    })
                    followRight.forEach((frEl) => {
                        frEl.classList.add("js-hide")
                    })
                } else if (scrollTop > 300 && scrollTop < 1799 || scrollTop > 2500 && scrollTop < 3199) {
                    followLeft.forEach((flEl) => {
                        flEl.classList.add("js-hide")
                    })
                    followRight.forEach((frEl) => {
                        frEl.classList.remove("js-hide")
                    })
                }
            })
        },
    },
    VrijdagDeDertiende: {
        getElements: function () {
            const verticalDrop = document.querySelector(".vertical-drop"),
                dividerRight = document.querySelector(".divider__right")

            return {
                verticalDrop,
                dividerRight,
            }
        },
        handleScroll: function () {
            const {
                verticalDrop,
                dividerRight,
            } = this.getElements()

            let lastScrollTop = dividerRight.scrollTop

            dividerRight.addEventListener("scroll", function () {
                let st = dividerRight.scrollTop,
                    randomPositiveOrNegative = Math.floor(Math.random() * 1.2) + .5

                randomPositiveOrNegative *= Math.floor((Math.random() * 2) == 1 ? 1 : -1)

                let verticalDropTransform = verticalDrop.style.transform,
                    translateProp = verticalDropTransform.substr(0, verticalDropTransform.indexOf(" ")),
                    translateValue = translateProp.slice(translateProp.indexOf("(") + 1, translateProp.indexOf("%"))

                if (st > lastScrollTop) {
                    verticalDrop.style.transform = `translateY(${dividerRight.scrollTop}%) rotateZ(90deg) scale(${Math.random() * (1.2 - .5) + .5}) translateX(${randomPositiveOrNegative}%)`
                } else {
                    verticalDrop.style.transform = `translateY(${translateValue - (dividerRight.scrollTop / 50)}%) rotateZ(90deg) scale(${Math.random() * (1.2 - .5) + .5}) translateX(${randomPositiveOrNegative}%)`
                }

                lastScrollTop = st
            }, false)
        },
    },
}

// Fires immediately, which triggers all the JavaScript in the pages.
const onLoad = function () {
    const cp = Utility.getCurrentPath()

    DOMTraverse.topSpans.forEach((span) => {
        window.addEventListener("scroll", function () {
            if (window.pageYOffset === 0) {
                span.style.top = "4em"
            } else {
                span.style.top = "0"
            }
        })
    })

    if (cp == "index") {
        if (Utility.getCurrentScreenWidth < Utility.MajorBreakPointTwo && Downloading.downloading) {
            Downloading.SmallScreenDownload()
        }

        IndexPage.getReadingList("readingList")
        IndexPage.setFormListeners()
        Navigation.getLoginOrSignup("index")
    } else if (cp == "searchResults") {
        if (window.localStorage.getItem("input") !== undefined) {
            LoadStories.createRequest("input")
        } else if (window.localStorage.getItem("filters") !== undefined) {
            LoadStories.createRequest("filters")
        }
        if (LoadStories.loadingFininished === true) {
            SortStories.determineActiveSorter()
        } else {
            let checkForLoaded = setInterval(() => {
                if (LoadStories.loadingFininished === true) {
                    SortStories.determineActiveSorter()
                    clearInterval(checkForLoaded)
                }
            }, 500)
        }
        Navigation.getLoginOrSignup("searchResults")
    } else if (cp == "downloads") {
        Downloading.handleButtonClick()
        Downloading.handleModalClick()
    } else if (cp == "signUp") {
        SignUpPage.Constraint.checkElements()
        SignUpPage.Constraint.setCurrentDate()
        SignUpPage.UserActions.init()
    } else if (cp == "kater") {
        StoryPage.Kater.handleScroll()
        Navigation.getLoginOrSignup("stories")
    } else if (cp == "paranoia") {
        StoryPage.Paranoia.getScrollTop()
        Navigation.getLoginOrSignup("stories")
    } else if (cp == "vrijdag") {
        StoryPage.VrijdagDeDertiende.handleScroll()
        Navigation.getLoginOrSignup("stories")
    }
}()