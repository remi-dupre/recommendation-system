class Filter {

    /**
    * Each method here is static. Filters erase list elements depending on
    * their relevance
    */

    static filter(links, article) {
        Filter.popularityFiltering(
            Filter.titleFiltering(links), article
        );
    }

    /**
    * Examines article's title to determine its relevance
    * @param {Array links} links to be rated
    */
    static titleFiltering(links) {

        // Doublons deletion, as links is sorted
        const newLinks = []
        let previousName = null;
        for (let link of links) {
            if (link.name !== previousName) {
                newLinks.push(link);
                previousName = link.name;
            }
        }
        return newLinks.filter( l => !l.innerHTML.match(/(^.*\[.*$)|(^.*<.*$)|(^\d+$)/) );
    }

    /**
    * Examines article's popularity to determine its relevance
    * @param {Array links} links to be rated
    */
    static popularityFiltering(links, article) {
        const popularityContainer = [];

        // Function called after loading views
        const end = () => {

            popularityContainer.sort( (a, b) => b.views - a.views );

            // Uniform pick of SECOND_PASS_CANDIDATES articles wrt views
            let sumViews = popularityContainer.map(
                tuple => tuple.views
            ).reduce( (a, b) => a + b );

            const chosenArticles = [];

            for (let i=0; i < Constants.SECOND_PASS_CANDIDATES; ++i) {
                const pick = parseInt(Math.random() * sumViews);


                let sum = popularityContainer[0].views, i = 0;
                while (pick > sum) {
                    i += 1;
                    sum += popularityContainer[i].views;
                }
                chosenArticles.push(popularityContainer[i]);
                sumViews -= popularityContainer[i].views;
                popularityContainer.splice(i, 1);
            }
            this.contentBasedFiltering(chosenArticles.map(
                tuple => tuple.link
            ), article);
        };

        // Callback function
        const addToContainer = (link, views) => {
            popularityContainer.push( {
                "link": link,
                "views": views
            });
            if (popularityContainer.length === links.length) {
                end();
            }
        };

        for (let link of links) {
            apiMod.getViews( {
                "title": link.name,
                "dateBeg": Constants.DATE_BEG,
                "dateEnd": Constants.DATE_END,
                "callback": (
                    (views) => {
                        addToContainer(link, views);
                    }
                )
            })
        }

        // To avoid lost packages, inexistant pages...
        setTimeout(end, 3000);
    }

    /**
    * Examines article's content to determine its relevance
    * @param {Array links} links to be rated
    */
    static contentBasedFiltering(links, article) {
        console.info("Article parsed.");
        article.links = links;
    }
}
