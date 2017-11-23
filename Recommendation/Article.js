class Article {

    constructor(page, href, callback) {
        this._page = page;
        this._href = href;
        this._title = this.extractTitle();
        this._links = this.extractLinks();
        this._categories = this.extractCategories();
        this._callback = callback;
    }

    get href() { return this._href; }
    get title() { return this._title; }
    get links() { return Array.from(this._links); }
    set links(links) { this._links = Array.from(links); this._callback(this._links); }
    get categories() { return Array.from(this._categories); }
    get categoriesNames() { return this.categories.map(c => c.title ); }

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
        const links = Array.from(
            Array.from(
                this._page.getElementById("bodyContent").getElementsByTagName("p")
            ).splice(0, 5).map( p => Array.from(p.getElementsByTagName("a")) )
        )
        .reduce( (a, b) => a.concat(b) )
        .filter( l => l.className == "")
        .filter(
            l => !l.innerHTML.match(/(^.*\[.*$)|(^.*<.*$)|(^\d+$)/)
        ).map(
            a => {
                return {
                    "name": a.getAttribute('href').match(/wiki\/.*/i)[0].slice(5),
                    "href": a.getAttribute('href'),
                    "innerHTML": a.innerHTML
                };
            }
        );
        Filter.popularityFiltering(links, this);
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
        console.log(links);
        return Filter.filter(links, this);
    }
}
