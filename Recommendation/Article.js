class Article {

    constructor(page) {
        this._page = page;
        this._title = this.extractTitle();
        this._links = this.extractLinks();
        this._categories = this.extractCategories();
    }

    get title() { return this._title; }
    get links() { return Array.from(this._links); }
    get categories() { return Array.from(this._categories); }

    /**
    * Gets page title from the HTML code
    */
    extractTitle() {
        return this._page.getElementById("firstHeading").innerHTML;
    }

    /**
    * Gets page links, after the filtering
    */
    extractLinks() {
        return this.filter(
            Array.from(
                Array.from(
                    this._page.getElementById("bodyContent").getElementsByTagName("p")
                ).map( p => Array.from(p.getElementsByTagName("a")) )
            )
            .reduce( (a, b) => a.concat(b) ).filter( l => l.className == "")
        );
    }

    /**
    * Gets categories of the article (/!\ even hidden ones !)
    */
    extractCategories() {
        return Array.from(
            this._page.getElementById("catlinks").getElementsByTagName("a")
        ).map( link =>
            new Category(link.innerHTML, link.href)
        )
    }

    /**
    * Filters an array of links to keep relevant ones.
    * @param {Array of links} links to be filtered
    */
    filter(links) {
        return Filter.filter(links);
    }

}