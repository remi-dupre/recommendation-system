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
            this._articlesSeen[this.pageTitle] = {
                "lastSeen": Date.now(),
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
