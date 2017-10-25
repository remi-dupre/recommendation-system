var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// ==UserScript==
// @name         Wikipedia Recommendation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://en.wikipedia.org/wiki/*
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/Constants.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/HttpModule.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/APIModule.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/api.js
// @grant        none
// ==/UserScript==

/////////////////////////////////////////////////////////
const Constants = {
    REQUESTS_MAX : 200,
    PEDIA_URL : 'https://[[LANG]].wikipedia.org/w/api.php',
    VIEWS_URL : 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/#1/daily/#2/#3'
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

     /** Send a query to the main API.
     *  @param {string} url the target url
     */
    sendQuery(url, handle) {

        console.info("Sending request to", url);

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
    */
    getViews({title, dateBeg, dateEnd}) {
        this._getViews(title, dateBeg, dateEnd, ( jsonparsed => {
            const views = Object.values(jsonparsed)[0].map(
                obj => obj.views
            ).reduce(
                (a, b) => a + b, 0
            );
            console.log(views);
        }));
    };

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
            handler(1 - (intersection / Math.min(categories[0].length, categories[1].length)));
        };
    }


}
let apiMod = new APIModule("en");

const testArticle = {
    title: "Michael Jackson",
    dateBeg: new Date(2017, 9, 22),
    dateEnd: new Date(2017, 9, 23)
};

// apiMod.getViews(testArticle);
// apiMod.getAttr(14995351, 'categories', console.log);
// apiMod.getAttr(16095, 'categories', console.log);

apiMod.distance(14995351, 16095,  (a) => console.log('Distance Michael - Jimi : ', a));
apiMod.distance(14995351, 5843419, (a) => console.log('Distance Michael - France : ', a));
apiMod.distance(17515, 5843419, (a) => console.log('Distance Luxembourg - France : ', a));
apiMod.distance(22989, 5843419, (a) => console.log('Distance Paris - France : ', a));
