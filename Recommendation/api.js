// To run locally with node
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class HttpModule {

    /** Module to interact with the API
     * @param {number} max_requests maximum requests allowed per second
     * @param {string} base_url defines the base URL of the API
     * @param {string} language defines the langage of the API we want to use
     */
    constructor(max_requests, base_url, language) {
        this.MAX_REQUESTS_S = max_requests;
        this.BASE_URL = base_url;
        this.LANGUAGE = language;
        this.queriesCount = 0;
    };

    /** Returns the amount of queries the HM is waiting for
    * @return {number} this.queriesCount
    */
    get getQueriesCount() { return this.queriesCount(); };

     /** Send a query to the API.
     *  @param {object} parameters the parameters send to the API
     *  @param {object} handle a function that will be called we the answer is catched
     */
    sendQuery(parameters, handle) {
        let url = this.BASE_URL.replace("[[LANG]]", this.LANGUAGE) +
                    "?action=query&format=json";
        for (let key in parameters)
            url += "&" + key + "=" + parameters[key];

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

let httpMod = new HttpModule(200, "https://[[LANG]].wikipedia.org/w/api.php", "en");
httpMod.sendQuery(
    {titles: "Michael Jackson"},
    (obj => console.info(JSON.stringify(obj)))
);
