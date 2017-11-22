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
}
