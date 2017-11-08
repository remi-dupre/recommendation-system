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
}
