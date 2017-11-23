class Recommender {

    constructor() {
        this._chosenArticles = [];
    }

    /**
     * Estimate how it is relevant to choose an article.
     */
    static estimate(link, callback) {

        // We check if the user already saw this page1
        if ( Object.values(user.getStorage(Constants.STORAGE_ARTICLES)).map(
            l => l.link
        ).includes(link) )
            callback(Infinity);

        const gotArticleText = (articleText) => {

            let answers = 0, min_val = Infinity, returned = false;

            // Callback functions

            const successFunction = (dist) => {
                if (returned) return;
                answers += 1;
                min_val = Math.min(min_val, Number(dist));
                if (answers == candidates.length)
                   callback(min_val);
            }

            const errorFunction = (dist) => {
                if (returned) return;
                answers += 1;
                if (answers == candidates.length) {}
                   callback(min_val);
            }

            const dist_url = 'https://whoping.fr:8080/text/dist'; // Url to get the distance
            const candidates = Object.values(user.getStorage(Constants.STORAGE_ARTICLES)).map(x => x.link);

            const compareArticles = (retrievedText) => {
                $.post({
                    'url': dist_url,
                    'dataType': 'text',
                    'data': { 'text1': articleText, 'text2': retrievedText },
                    'success': successFunction,
                    'error': errorFunction
                });
            }

            // Already visited articles comparison

            for (let visitedArticle of candidates) {
                apiMod.retrieveText(visitedArticle, compareArticles);
            }

            setTimeout(() => { returned = true; callback(min_val); }, 3000);

        }

        apiMod.retrieveText(link, gotArticleText);
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
