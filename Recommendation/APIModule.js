const HttpModule = require('./HttpModule.js');

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
     */
    getAttr(title, key, handle) {
        this.sendQueryMainAPI(
            {
                'prop': key,
                'titles': title
            },
            function(data) {
                let filtered = data.query.pages;
                handle(filtered)
            }
        );
    };
}

module.exports = APIModule;
