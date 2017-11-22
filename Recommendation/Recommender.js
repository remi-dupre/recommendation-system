class Recommender {

    constructor() {
        this._chosenArticles = [];
    }

    static estimate() {
        
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
                    'name': a.article,
                    'href': Constants.BASE_URL + a.article
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
