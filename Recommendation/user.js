class User {
    /** Definition of a user. Articles will be identified with their names.
     * @param {Set}    _articlesSeen the set of the articles seen so far.
     * @param {Array}  _articlesVote the votes we registered for know articles. It can be 'none', 'up' or 'down'.
     */

    constructor(language) {
        this.LANGUAGE = language;
        this._articlesSeen = new Set();
        this._articlesVote = {};
    }

    /**
     * Specify that the user saw a specific page.
     * @param {Int} id the id of the page.
     */
    watchedSeen(id) {
        this._articlesSeen.push(id);
        this._articlesVote[id] = 'none';
    }

    /**
     * Specify that the user upvoted the page.
     * @param {Int} id the id of the page.
     */
    upVoted(id) {
        this._articlesVote[id] = 'up';
    }

    /**
     * Specify that the user downvoted the page.
     * @param {Int} id the id of the page.
     */
    downVoted(id) {
        this._articlesVote[id] = 'down';
    }

   /**
    * Returns articles stored locally, {title1: {lastSeen, count}, ...}
    * @param {string} keyWord local key of content to access
    */
    getStorage(keyWord) {
        return ((localStorage[keyWord] == undefined) ?
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
        const articlesContainer = this.getStorage('WikiRec|articles');
        const pageTitle = location.href.match(/wiki\/.*/i)[0].slice(5);
        if ( !(pageTitle in articlesContainer) ) {
            articlesContainer[pageTitle] = {"lastSeen": Date.now(), "count": 1 };
        } else {
            articlesContainer[pageTitle]["lastSeen"] = Date.now();
            articlesContainer[pageTitle]["count"] += 1;
        }
        this.setStorage('WikiRec|articles', articlesContainer);
    }
}


// Load user data from storage
const user = GM_getValue('userdata', new User());
user.addArticleSeen();
