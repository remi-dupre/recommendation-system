class Filter {

    /**
    * Each method here is static. Filters erase list elements depending on
    * their relevance
    */

    static filter(links) {
        return contentBasedFiltering(
            popularityFiltering(
                titleFiltering(
                    links
                )
            )
        );
    }

    /**
    * Examines article's title to determine its relevance
    * @param {Array links} links to be rated
    */
    static titleFiltering(links) {
        return links.filter( l => !l.match(/(^.*\[.*$)|(^.*<.*$)/) );
    }

    /**
    * Examines article's popularity to determine its relevance
    * @param {Array links} links to be rated
    */
    static popularityFiltering(links) {
        return links;
    }

    /**
    * Examines article's content to determine its relevance
    * @param {Array links} links to be rated
    */
    static contentBasedFiltering(links) {
        return links;
    }
}
