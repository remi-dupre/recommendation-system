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
            let i = 0, imgDOM = doc.getElementById("mw-content-text").getElementsByTagName("img")[0];
            while (imgDOM.offsetParent && imgDOM.offsetParent.className == "mbox-image") {
                i += 1;
                imgDOM = doc.getElementById("mw-content-text").getElementsByTagName("img")[i];
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

const apiMod = new APIModule("en");
