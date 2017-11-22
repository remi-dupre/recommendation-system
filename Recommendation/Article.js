class Article {

    constructor(page) {
        this._page = page;
        this._title = this.extractTitle();
        this._links = this.extractLinks();
        this._categories = this.extractCategories();
    }

    get title() { return this._title; }
    get links() { return Array.from(this._links); }
    set links(links) { this._links = Array.from(links); slideshow.update(links); }
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
        return this.filter(
            Array.from(
                Array.from(
                    this._page.getElementById("bodyContent").getElementsByTagName("p")
                ).map( p => Array.from(p.getElementsByTagName("a")) )
            )
            .reduce( (a, b) => a.concat(b) ).filter( l => l.className == "")
            .map(
                a => {
                    return {
                        "name": a.href.match(/wiki\/.*/i)[0].slice(5),
                        "href": a.href,
                        "innerHTML": a.innerHTML
                    };
                }
            )
            .sort(
                (a, b) => (a.name < b.name) ? -1 : 1
            )
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
        return Filter.filter(links, this);
    }

}

const art = new Article(document);
