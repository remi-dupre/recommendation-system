class Recommender {

    constructor() {
        this._chosenArticles = [];
    }

    /**
     * Estimate how it is relevant to choose an article.
     */
    static estimate(link, callback) {
        const dist_url = 'http://whoping.fr:8080/text/dist'; // Url to get the distance
        const candidates = Object.values(user.getStorage(Constants.STORAGE_ARTICLES)).map(x => x.links);

        apiMod.retrieveText(link, function(text1) {
            let answers = 0;        // Count the number of answers so far
            let min_val = Infinity; // Minimum distance so far

            candidates.map((link2) => apiMod.retrieveText(link2, function(text2) {
                // Calculate distance
                $.post({
                    url: dist_url,
                    dataType: 'text',
                    data: {'text1': text1, 'text2': text2},
                    success: function(dist) {
                        answers += 1;
                        min_val = Math.min(min_val, Number(dist));

                        if (answers == candidates.length) {
                            callback(1 / min_val);
                        }
                    },
                    error: function(err) {
                        answers += 1;

                        if (answers == candidates.length) {
                            callback(1 / min_val);
                        }
                    }
                });
            }));
        });
    }

    static mind() {

        this._chosenArticles = [];

        const likedArticles = [];
        const neutralArticles = [];

        for (let key in user.getStorage(Constants.STORAGE_ARTICLES)) {
            if (seenArticles[key].vote == 1) {
                likedArticles.push(seenArticles[key]);
            } else {
                neutralArticles.push(seenArticles[key]);
            }
        }

        const currentArticle = new Article(document);
        const serendipityCoin = 0.5;

        const choseArticle = (articles) => {

            const links = articles.items[0].articles.splice(
                Constants.MOST_VIEWED_TOTAL - Constants.MOST_VIEWED_COUNT
            ).map(
                a => {
                    return {
                        'name': a.article,
                        'href': Constants.BASE_URL + a.article
                    }
                }
            ).filter(
                !(l.name in ["Main_Page", "Special:Search"] )
            ).map(
                l => {
                    return {
                        'value': Recommender.estimate(l),
                        'href': l.href
                    }
                }
            ).sort(
                (a, b) => b.value - a.value
            );

            slideshow.update(chosenArticle.link);
        }

        for (let i = 0; i < slideshow._maxSlides; i++) {
            if (Math.random() < serendipityCoin) {
                // Global
                const mostViewedArticles = apiMod.getMostViewedArticles(choseArticle);
            } else {
                // Personal
            }
        }
    }
}
