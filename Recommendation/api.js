/*
 * Define a module to interact with the api.
 */

// To run localy with node
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


let API = {
    // Defines the maximum number of requests allowed per seconds
    MAX_REQUESTS_S : 200,

    // Define the base URL of the API
    BASE_URL : "https://[[LANG]].wikipedia.org/w/api.php",

    // Define the langage of the API we want to use
    language : "en",

    /**
     * Send a query to the API.
     *  - parameters : the parameters send to the API
     *  - handle : a function that will be called we the answer is catched
     */
    sendQuery : function(parameters, handle) {
        let url = API.BASE_URL.replace("[[LANG]]", API.language);

        url += "?action=query";
        url += "&format=json";

        for (var key in parameters)
            url += "&" + key + "=" + parameters[key];

        console.info("Sending request to", url);
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                handle(JSON.parse(xmlHttp.responseText));
        }
        xmlHttp.open("GET", url, true);
        xmlHttp.send(null);
    }
};
