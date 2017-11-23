const now = new Date();

const Constants = {
    REQUESTS_MAX : 200,
    PEDIA_URL : 'https://[[LANG]].wikipedia.org/w/api.php',
    BASE_URL : 'https://en.wikipedia.org/wiki/',
    VIEWS_URL : 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/#1/daily/#2/#3',
    MOST_VIEWED_URL: 'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/',
    STORAGE_ARTICLES : 'WikiRec|articles',

    //Slideshow
    FADE_SPEED : 0.03,
    FREQUENCY : 16,

    // Last week
    DATE_BEG : new Date((new Date(now)).setDate(now.getDate() - 7)),
    DATE_END : now,

    // Filter max selections
    SECOND_PASS_CANDIDATES: 20,

    // Most viewed articles _imagesCount
    MOST_VIEWED_COUNT: 50,
    MOST_VIEWED_TOTAL: 1000
};

// To run locally with node
// const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class HttpModule {

    /** Module to interact with the API
     * @param {number} max_requests maximum requests allowed per second
     * @param {string} base_url defines the base URL of the API
     * @param {string} language defines the langage of the API we want to use
     */
    constructor(language) {
        this.LANGUAGE = language;
        this.queriesCount = 0;
    };

    /** Returns the amount of queries the HM is waiting for
    * @return {number} this.queriesCount
    */
    get getQueriesCount() { return this.queriesCount(); };

    /** Send a query to the main API.
    *  @param {object} parameters the parameters send to the API
    *  @param {function} handle a function that will be called we the answer is catched
    */
    sendQueryMainAPI(parameters, handle) {
        let url = Constants.PEDIA_URL.replace("[[LANG]]", this.LANGUAGE) +
                    "?action=query&format=json&cllimit=500";
        for (let key in parameters)
            url += "&" + key + "=" + parameters[key];
        this.sendQuery(url, handle);
    }

    /** Get views of a given article
    * @param {string} title the title of the article
    * @param {Date} dateBeg beginning of the time period
    * @param {Date} dateEnd end of the time period
    * @param {function} handle a function that will be called we the answer is catched
    */
    _getViews(title, dateBeg, dateEnd, handle) {
        const padNumber = ( n => (n < 10) ? '0' + n : String(n));
        const formatDate = ( date =>
            String(date.getFullYear()) +
            padNumber(date.getMonth() + 1) +
            padNumber(date.getUTCDate())
        );
        const replaceRegExp = /^(.*)(#1)(.*)(#2)(\/)(#3)+/;

        this.sendQuery(
            Constants.VIEWS_URL.replace(
                replaceRegExp,
                '$1' + title.replace('/', '_') + '$3' + formatDate(dateBeg) + '/' + formatDate(dateEnd)
            ),
            handle
        );
    }

    _getMostViewedArticles(callback) {
        this.sendQuery(
            Constants.MOST_VIEWED_URL + Constants.DATE_BEG.getFullYear() + '/' + (Constants.DATE_BEG.getMonth() + 1) + '/' + Constants.DATE_BEG.getUTCDate(),
            callback
        );
    }

    /** Send a query to the main API.
    *  @param {string} url the target url
    */
   sendRawQuery(url, handle) {

       let xmlHttp = new XMLHttpRequest();
       xmlHttp.onreadystatechange = function() {
           if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
               --this.queriesCount;
               handle(xmlHttp.responseText);
           }

       }
       xmlHttp.open("GET", url, true);
       xmlHttp.send(null);
       ++this.queriesCount;
   };

     /** Send a JSON query to the main API.
     *  @param {string} url the target url
     */
    sendQuery(url, handle) {

        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                --this.queriesCount;
                handle(JSON.parse(xmlHttp.responseText));
            }
        }
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
        ++this.queriesCount;
    };

    getId(name, callback) {

        const pageGot = (page) => {
            const d = new DOMParser();
            const doc = d.parseFromString(page, 'text/xml');
            callback(
                doc.getElementById('mw-pageinfo-article-id').getElementsByTagName('td')[1].innerHTML
            );
        }

        this.sendRawQuery("https://en.wikipedia.org/w/index.php?title=[[name]]&action=info".replace("[[name]]", name), pageGot);
    }
}

class APIModule extends HttpModule {

    /**
     * @param {number} maxRequests maximum requests allowed per second
     * @param {string} baseUrl defines the base URL of the API
     * @param {string} language defines the langage of the API we want to use
     */
    constructor(language) {
        super(language);
        this.articles = new Object();
    };

    /** Get views of a given article
    * @param {string} title the title of the article
    * @param {Date} dateBeg beginning of the time period
    * @param {Date} dateEnd end of the time period
    * @param {function} callback to be called on views (int)
    */
    getViews({title, dateBeg, dateEnd, callback}) {
        this._getViews(title, dateBeg, dateEnd, ( jsonparsed => {
            const views = Object.values(jsonparsed)[0].map(
                obj => obj.views
            ).reduce(
                (a, b) => a + b, 0
            );
            callback(views);
        }));
    };

    retrieveImage({link, callback}) {
        const pageGot = (page) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(page, "text/xml");
            const imgs = doc.getElementById("mw-content-text").getElementsByTagName("img");
            let imgDOM = imgs[0], i = 0;
            while (imgDOM.offsetParent && imgDOM.offsetParent.className == "mbox-image") {
                i += 1;
                imgDOM = imgs[i];
            }
            let img = {
                'src': imgDOM.getAttribute('src'),
                'title': doc.getElementById("firstHeading").innerHTML
            };

            callback( (img.src === undefined) ? null : img );
        }

        this.sendRawQuery(link, pageGot);
    };

    /**
     * Get the raw text of a wikipedia page given its url
     */
    retrieveText(link, callback) {
        const pageGot = (page) => {
            const parser = new DOMParser();
            const raw = parser.parseFromString(page, "text/xml").getElementById('content').innerHTML;  // get raw text

            const no_note = $(raw).find('p').text().replace(/\[\d*\]/g, '');    // remove footnotes

            callback(no_note);
        };

        this.sendRawQuery(link, pageGot);
    };

    getMostViewedArticles(callback) {
        this._getMostViewedArticles(callback);
    }

    /** Get specific parameter for a given article
     * @param {string} title the title of the article
     * @param {string} key the key we want informations about
     * @param {function} handler a function called when the request ends with an object as parameter
     */
    getAttribute(id, key, handle) {
        this.sendQueryMainAPI(
            {
                'prop': key,
                'pageids': id
            },
            data => handle( data.query.pages[id][key] ) // Callback handle on the key category
        );
    };

    /** Calculates the count of different categories between two articles
     * @param {int} page1 the id of the first page
     * @param {int} page2 the id of the second page
     * @param {function} handler a function called when the distance has been processed
     */
    distance(page1, page2, handler) {
        // Finally process the distance with two given list of categories
        // the count of categories that belongs to both
        const categories = [];

        [page1, page2].map( p => {
            this.getAttribute(p, 'categories', (data) => {
                categories.push(data);
                if (categories.length === 2)
                    process_distance();
            });
        });

        const process_distance = () => {
            const categories_0_titles = Object.values(categories[0].map( o => o.title ));
            const categories_1_titles = Object.values(categories[1].map( o => o.title ));
            const intersection = categories_0_titles.reduce(
                (acc, elem) =>  acc + (categories_1_titles.includes(elem) ? 1 : 0),
                0
            );
            handler(1 - (intersection / (1 + Math.min(categories[0].length, categories[1].length))));
        };
    }

    distanceFromNames(name1, name2, handler) {

        const ids = [];

        const idGot = (id) => {
            ids.push(id);
            if (ids.length == 2) {
                this.distance(ids[0], ids[1], handler);
                return;
            }
        }
        this.getId(name1, idGot);
        this.getId(name2, idGot);
    }
}


const apiMod = new APIModule("en");

class Slideshow {

    constructor() {
        this._imagesCount = 0;
        this._maxSlides = 0;
        this._imgWidth = 0;
        this._HTMLelement = this.createDiv();
        this._images = []; // {img: ..., href: ...}
        this._opacity = 0;
    }

    draw() {
        let offset = 0;
        for (let img of this._images) {
            const divDOM = document.createElement('div');

            divDOM.style.backgroundImage = "url('" + img.img + "')";
            divDOM.style.height = "100px";
            divDOM.style.width = this._imgWidth + "px";
            divDOM.style.backgroundPosition = "center 30%";
            divDOM.style.backgroundRepeat = "no-repeat";
            divDOM.style.cursor = "pointer";
            divDOM.style.display = "inline-block";
            divDOM.onclick = () => { location.href = img.href; }

            const bottom_lane = document.createElement('div');
            divDOM.appendChild(bottom_lane);

            bottom_lane.innerHTML = img.title;
            bottom_lane.style.textAlign = "center";
            bottom_lane.style.padding = "1px";
            bottom_lane.style.color = "white";
            bottom_lane.style.fontWeight = "bold";
            bottom_lane.style.background = "rgba(0, 0, 0, 0.6)";
            bottom_lane.style.position = "relative";
            bottom_lane.style.marginLeft = "-1px";
            bottom_lane.style.marginTop = "85px";
            bottom_lane.style.zIndex = 2;

            this._HTMLelement.appendChild(divDOM);
        }


        const upper_lane = document.createElement('div');
        this._HTMLelement.appendChild(upper_lane);

        upper_lane.innerHTML = "Pages you may be interested in..."
        upper_lane.style.textAlign = "center";
        upper_lane.style.padding = "1px";
        upper_lane.style.color = "white";
        upper_lane.style.fontWeight = "bold";
        upper_lane.style.background = "rgba(0, 0, 0, 0.6)";
        upper_lane.style.position = "relative";
        upper_lane.style.marginTop = "-101px";
        upper_lane.style.marginLeft = "-1px";
        upper_lane.style.zIndex = 2;
    }

    createDiv() {
        const parent = document.getElementById("contentSub");
        parent.style = "height: 100px;"
        const div = document.createElement('div');
        div.id = "WikirecSlideshow";

        div.style.width = "70%";
        div.style.height = "100%";
        div.style.marginLeft = "15%";
        div.style.opacity = this._opacity;

        parent.appendChild(div);

        this._maxSlides = parseInt(div.offsetWidth / 162);
        this._imgWidth = parseInt(div.offsetWidth / this._maxSlides) - 1;

        return div;
    }

    delete() {
        this.disappear();
        this._images = [];
        this._imagesCount = 0;
    }

    retrieveImage(link) {
        if (this._imagesCount >= this._maxSlides)
            return
        this._imagesCount += 1;
        const callback = (img) => {
            this._images.push({'img': img.src, 'title': img.title, 'href': link});
            if (this._images.length == this._maxSlides) {
                this.draw();
                this.appear();
            }
        }
        apiMod.retrieveImage({
            'link': link,
            'callback': callback
        });
    }

    update(links) {
        for (let link of links) {
            this.retrieveImage(link.href);
        }
    }

    setOpacity(x) {
        this._opacity = Math.min(1, Math.max(0, x));
        this._HTMLelement.style.opacity = this._opacity;
    }

    disappear() {
        this._imagesCount = 0;
        this._images = []; // {img: ..., href: ...}
        this.setOpacity(this._opacity - Constants.FADE_SPEED);
        let that = this;
        if (this._opacity > 0) {
            setTimeout( () => { that.disappear(); }, Constants.FREQUENCY );
        } else {
            $('#WikirecSlideshow')[0].innerHTML = '';
        }
    }

    appear() {
        this.setOpacity(this._opacity + Constants.FADE_SPEED);
        let that = this;
        if (this._opacity < 1) {
            setTimeout( () => { that.appear(); }, Constants.FREQUENCY );
        }
    }
}

let slideshow = new Slideshow();

class Filter {

    /**
    * Each method here is static. Filters erase list elements depending on
    * their relevance
    */

    static filter(links, article) {
        Filter.popularityFiltering(
            Filter.titleFiltering(links), article
        );
    }

    /**
    * Examines article's title to determine its relevance
    * @param {Array links} links to be rated
    */
    static titleFiltering(links) {

        // Doublons deletion, as links is sorted
        const newLinks = []
        let previousName = null;
        for (let link of links) {
            if (link.name !== previousName) {
                newLinks.push(link);
                previousName = link.name;
            }
        }
        return newLinks.filter( l => !l.innerHTML.match(/(^.*\[.*$)|(^.*<.*$)|(^\d+$)/) );
    }

    /**
    * Examines article's popularity to determine its relevance
    * @param {Array links} links to be rated
    */
    static popularityFiltering(links, article) {
        const popularityContainer = [];

        // Function called after loading views
        const end = () => {

            if (popularityContainer.length == 0) {
                console.log("Container is empty. Article : ");
                console.log(article);
                return;
            }

            popularityContainer.sort( (a, b) => b.views - a.views );

            // Uniform pick of SECOND_PASS_CANDIDATES articles wrt views
            let sumViews = popularityContainer.map(
                tuple => tuple.views
            ).reduce( (a, b) => a + b );

            const chosenArticles = [];

            for (let i=0; i < Math.min(popularityContainer.length, Constants.SECOND_PASS_CANDIDATES); ++i) {
                const pick = parseInt(Math.random() * sumViews);

                let sum = popularityContainer[0].views, i = 0;
                while (pick > sum) {
                    i += 1;
                    sum += popularityContainer[i].views;
                }
                chosenArticles.push(popularityContainer[i]);
                sumViews -= popularityContainer[i].views;
                popularityContainer.splice(i, 1);
            }
            article.links = links;
        };

        // Callback function
        const addToContainer = (link, views) => {
            popularityContainer.push( {
                "link": link,
                "views": views
            });
            if (popularityContainer.length === links.length) {
                end();
            }
        };

        for (let link of links) {
            apiMod.getViews( {
                "title": link.name,
                "dateBeg": Constants.DATE_BEG,
                "dateEnd": Constants.DATE_END,
                "callback": (
                    (views) => {
                        addToContainer(link, views);
                    }
                )
            })
        }

        // To avoid lost packages, inexistant pages...
        setTimeout(end, 3000);
    }

    /**
    * Examines article's content to determine its relevance
    * @param {Array links} links to be rated
    */
    static contentBasedFiltering(links, article) {
        console.info("Article parsed.");
        article.links = links;
    }
}


class Category {

    constructor(title, link) {
        this.title = title;
        this.link = link;
    }

    belongsToCategory(article) {
        return this.title in article.categories.map(c => c.title);
    }
}

class Article {

    constructor(page, href, callback) {
        this._page = page;
        this._href = href;
        this._title = this.extractTitle();
        this._links = this.extractLinks();
        this._categories = this.extractCategories();
        this._callback = callback;
    }

    get href() { return this._href; }
    get title() { return this._title; }
    get links() { return Array.from(this._links); }
    set links(links) { this._links = Array.from(links); this._callback(this._links); }
    get categories() { return Array.from(this._categories); }
    get categoriesNames() { return this.categories.map(c => c.title ); }

    /**
    * Gets page title from the HTML code
    */
    extractTitle() {
        return this._page.getElementById("firstHeading").innerHTML;
    }

    /**
    * Gets page links, after the filtering
    */
    extractLinks() {
        const links = Array.from(
            Array.from(
                this._page.getElementById("bodyContent").getElementsByTagName("p")
            ).splice(0, 5).map( p => Array.from(p.getElementsByTagName("a")) )
        )
        .reduce( (a, b) => a.concat(b) )
        .filter( l => l.className == "")
        .filter(
            l => !l.innerHTML.match(/(^.*\[.*$)|(^.*<.*$)|(^\d+$)/)
        ).map(
            a => {
                return {
                    "name": a.getAttribute('href').match(/wiki\/.*/i)[0].slice(5),
                    "href": a.getAttribute('href'),
                    "innerHTML": a.innerHTML
                };
            }
        );
        Filter.popularityFiltering(links, this);
    }

    /**
    * Gets categories of the article (/!\ even hidden ones !)
    */
    extractCategories() {
        return Array.from(
            this._page.getElementById("catlinks").getElementsByTagName("a")
        ).map( link =>
            new Category(link.innerHTML, link.href)
        )
    }

    /**
    * Filters an array of links to keep relevant ones.
    * @param {Array of links} links to be filtered
    */
    filter(links) {
        console.log(links);
        return Filter.filter(links, this);
    }
}

class User {
    /** Definition of a user. Articles will be identified with their names.
     * @param {string}    _pagetitle title of the focused page, used as a key.
     * @param {Object}    _articlesSeen the set of the articles seen so far.
     */

    constructor() {
        this._pagetitle = location.href.match(/wiki\/.*/i)[0].slice(5);
        this._articlesSeen = this.getStorage(Constants.STORAGE_ARTICLES);
    }

    get pageTitle() { return this._pagetitle; }

    /**
     * Specify that the user upvoted the page.
     */
    upVoted() {
        console.log('Upvoted the page');
        this._articlesSeen[this.pageTitle].vote = 1;
        this.setStorage(Constants.STORAGE_ARTICLES, this._articlesSeen);
    }

    /**
     * Specify that the user downvoted the page.
     */
    downVoted() {
        console.log('Downvoted the page');
        this._articlesSeen[this.pageTitle].vote = -1;
        this.setStorage(Constants.STORAGE_ARTICLES, this._articlesSeen);
    }

   /**
    * Returns articles stored locally, {title1: {lastSeen, count}, ...}
    * @param {string} keyWord local key of content to access
    */
    getStorage(keyWord) {
        return ((localStorage[keyWord] === undefined) ?
            {} :
            JSON.parse(localStorage[keyWord])
        );
    }

    /**
     * Updates local storage with content
     * @param {string} keyWord local key of content to access
     * @param {object} content object to store
     */
     setStorage(keyWord, content) {
         localStorage[keyWord] = JSON.stringify(content);
     }

    /**
     * Adds the current article page to the history in localStorage
     */
    addArticleSeen() {
        if ( !(this.pageTitle in this._articlesSeen) ) {
            const currentArticle = new Article(document);
            this._articlesSeen[this.pageTitle] = {
                "lastSeen": Date.now(),
                "title": currentArticle.title,
                "link": location.href,
                "categories": currentArticle.categoriesNames,
                "count": 1,
                "vote": 0
            };
        } else {
            this._articlesSeen[this.pageTitle].lastSeen = Date.now();
            this._articlesSeen[this.pageTitle].count += 1;
        }
        this.setStorage(Constants.STORAGE_ARTICLES, this._articlesSeen);
    }
}

// Load user data from storage
const user = new User();
user.addArticleSeen();

class Recommender {

    constructor() {
        this._articlesCount = 0;
        this._likedArticles = [];
        this._visitedArticles = [];
        this.loadArticles();
    }

    loadArticles() {

        const addArticle = (article, articleText, container) => {
            this._articlesCount += 1;
            const p = new DOMParser();
            article.dom = p.parseFromString(articleText, 'text/xml');
            const raw = article.dom.getElementById('content').innerHTML;  // get raw text

            article.text = $(raw).find('p').text().replace(/\[\d*\]/g, '').substr(0, Constants.MAX_TEXT_SIZE);
            container.push(article);
        }
        const candidates = Object.values(user.getStorage(Constants.STORAGE_ARTICLES));

        for (let article of candidates) {
            const container = (article.vote == 1) ? this._likedArticles : (article.vote == 0) ? this._visitedArticles : null;
            if (container === null) continue; // Disliked article
            apiMod.sendRawQuery(article.link, (articleText) => { addArticle(article, articleText, container); });
        }

    }

    /**
     * Estimate how it is relevant to choose an article.
     */
    estimate(link, callback) {

        // If articles aren't loaded, we wait
        if (this._articlesCount == 0) {
            let that = this;
            setTimeout(() => { that.estimate(link, callback); }, 3000);
            return;
        }

        // We check if the user already saw this page1
        if ( Object.values(user.getStorage(Constants.STORAGE_ARTICLES)).map(
            l => l.link
        ).includes(link) || this._chosenArticles.includes(link) ) {
            callback(Infinity);
            return;
        }


        const gotArticleText = (articleText) => {

            let answers = 0, min_val = Infinity, returned = false, length = this._articlesCount;
            articleText = articleText.substr(0, Constants.MAX_TEXT_SIZE);

            // Callback functions

            const successFunction = (dist) => {
                if (returned) return;
                answers += 1;
                min_val = Math.min(min_val, Number(dist));
                if (answers == length) {
                    callback(min_val);
                    returned = true;
                    return;
                }
            }

            const errorFunction = (dist) => {
                if (returned) return;
                answers += 1;
                if (answers == length) {
                    callback(min_val);
                    returned = true;
                    return;
                }
            }

            const dist_url = 'https://whoping.fr:8080/text/dist'; // Url to get the distance

            const compareArticles = (retrievedText) => {
                $.post({
                    'url': dist_url,
                    'dataType': 'text',
                    'data': { 'text1': articleText, 'text2': retrievedText },
                    'success': successFunction,
                    'error': errorFunction
                });
            }

            // Already visited articles comparison

            for (let visitedArticle of this._visitedArticles.concat(this._likedArticles)) {
                compareArticles(visitedArticle.dom);
            }

            setTimeout(() => {
                if (returned) return;
                returned = true;
                callback(min_val);
             }, 3000);

        }

        apiMod.retrieveText(link, gotArticleText);
    }

    mind() {

        slideshow.disappear();

        // If articles aren't loaded, we wait
        if (this._articlesCount == 0) {
            let that = this;
            setTimeout(() => { that.mind(); }, 3000);
            return;
        }

        this._chosenArticles = [];

        //const serendipityCoin = Number($('#serendipity')[0].value) / 20;

        ///////////////////////// SERENDIPITY PART /////////////////////////

        let mostViewedArticles = [];

        const updateMostViewed = (articles) => {
            mostViewedArticles = articles.items[0].articles.splice(
                Constants.MOST_VIEWED_TOTAL - Constants.MOST_VIEWED_COUNT
            ).map(
                a => {
                    return {
                        'name': a.article,
                        'href': Constants.BASE_URL + a.article
                    }
                }
            ).filter(
                l => !(l.name in ["Main_Page", "Special:Search"] )
            );
        };

        apiMod.getMostViewedArticles(updateMostViewed);

        const pickMostViewedArticle = () => {

            if (mostViewedArticles.length == 0) {
                setTimeout( pickMostViewedArticle, 1000 );
                return;
            }

            let coin = parseInt(Math.random() * Constants.MOST_VIEWED_COUNT)

            if (mostViewedArticles[coin] === undefined) {
                setTimeout( pickMostViewedArticle, 500 );
                return;
            }

            this._chosenArticles.push(mostViewedArticles[coin]);
            mostViewedArticles.splice(coin, 1);

            if (this._chosenArticles.length == slideshow._maxSlides) {
                slideshow.update(this._chosenArticles);
            }
        }

        ///////////////////////// COMFORT ZONE PART /////////////////////////

        const choseBestLink = (baseTitle, links) => {
            console.log("a");
            if (this._chosenArticles >= slideshow._maxSlides) return;

            let best_link = null, best_distance = Infinity;
            const checkDistance = (link, distance) => {
                if (distance < best_distance) {
                    best_distance = distance;
                    best_link = link;
                }
            }
            for (let link of links) {
                if (this._chosenArticles.map(l => l.href).includes(link.href)) continue;

                apiMod.distanceFromNames(link.name, baseTitle, (distance) => { checkDistance(link, distance); });
            }

            const end = () => {
                if (this._chosenArticles.length < slideshow._maxSlides && best_link == null) {
                    pickPersonalArticle();
                    return;
                }
                this._chosenArticles.push(best_link);
                if (this._chosenArticles.length == slideshow._maxSlides) {
                    slideshow.update(this._chosenArticles);
                }
            }

            setTimeout( end, 3000 );
        }

        const pickPersonalArticle = () => {

            const articlesList = (this._likedArticles.length) ? this._likedArticles : (this._visitedArticles.length) ? this._visitedArticles : null;
            if (articlesList == null) {
                pickMostViewedArticle();
                return;
            }

            const tmp = articlesList[parseInt(Math.random() * articlesList.length)];
            const chosenStartingArticle = new Article(tmp.dom, tmp.link, (links) => { choseBestLink(tmp.link.match(/wiki\/.*/i)[0].slice(5), links); });
        }

        for (let i = 0; i < slideshow._maxSlides; i++) {
            if (Math.random() < 0) {
                // Global
                pickMostViewedArticle();
            } else {
                // Personal
                pickPersonalArticle();
            }
        }
    }
}

let rec = new Recommender();
rec.mind();
