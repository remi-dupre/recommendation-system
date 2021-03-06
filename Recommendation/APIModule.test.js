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
apiMod.distanceFromNames('Michael_Jackson', 'Elvis_Presley', console.log);
