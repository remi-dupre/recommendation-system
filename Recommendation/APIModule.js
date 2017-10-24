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
    getAttr(id, key, handle) {
        this.sendQueryMainAPI(
            {
                'prop': key,
                'pageids': id
            },
            function(data) {
                let filtered = data.query.pages[id][key];
                handle(filtered)
            }
        );
    };

    /** Calculates the count of different categories between two articles
     * @param {int} page1 the id of the first page
     * @param {int} page2 the id of the second page
     * @param {function} handler a function called when the distance has been processed
     */
    distance(page1, page2, handler) {
        let categories = [null, null];

        // Finally process the distance with two given list of categories
        function process_distance() {
            let intersection = 0; // the count of categories that belongs to both

            for (let cat1 in categories[0])
                for (let cat2 in categories[1])
                    if (categories[0][cat1].title == categories[1][cat2].title)
                        intersection += 1;

            // Total number of categories
            let total_count = categories[0].length + categories[1].length - intersection;

            handler(1 - (intersection / Math.min(categories[0].length, categories[1].length)));
        }

        this.getAttr(page1, 'categories', function(data) {
            categories[0] = data;

            if (categories[1] != null)
                process_distance()
        });

        this.getAttr(page2, 'categories', function(data) {
            categories[1] = data;

            if (categories[0] != null)
                process_distance()
        });
    }


}
