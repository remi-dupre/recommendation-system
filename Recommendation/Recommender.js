class Recommender {

    constructor() {
        this._articlesCount = 0;
        this._likedArticles = [];
        this._visitedArticles = [];
        this.loadArticles();
    }

    loadArticles() {

        const addArticle = (article, articleText, container) => {
            this._articlesCount += 1;
            const p = new DOMParser();
            article.dom = p.parseFromString(articleText, 'text/xml');
            const raw = article.dom.getElementById('content').innerHTML;  // get raw text

            article.text = $(raw).find('p').text().replace(/\[\d*\]/g, '').substr(0, Constants.MAX_TEXT_SIZE);
            container.push(article);
        }
        const candidates = Object.values(user.getStorage(Constants.STORAGE_ARTICLES));

        for (let article of candidates) {
            const container = (article.vote == 1) ? this._likedArticles : (article.vote == 0) ? this._visitedArticles : null;
            if (container === null) continue; // Disliked article
            apiMod.sendRawQuery(article.link, (articleText) => { addArticle(article, articleText, container); });
        }

    }

    /**
     * Estimate how it is relevant to choose an article.
     */
    estimate(link, callback) {

        // If articles aren't loaded, we wait
        if (this._articlesCount == 0) {
            let that = this;
            setTimeout(() => { that.estimate(link, callback); }, 3000);
            return;
        }

        // We check if the user already saw this page1
        if ( Object.values(user.getStorage(Constants.STORAGE_ARTICLES)).map(
            l => l.link
        ).includes(link) || this._chosenArticles.includes(link) ) {
            callback(Infinity);
            return;
        }


        const gotArticleText = (articleText) => {

            let answers = 0, min_val = Infinity, returned = false, length = this._articlesCount;
            articleText = articleText.substr(0, Constants.MAX_TEXT_SIZE);

            // Callback functions

            const successFunction = (dist) => {
                if (returned) return;
                answers += 1;
                min_val = Math.min(min_val, Number(dist));
                if (answers == length) {
                    callback(min_val);
                    returned = true;
                    return;
                }
            }

            const errorFunction = (dist) => {
                if (returned) return;
                answers += 1;
                if (answers == length) {
                    callback(min_val);
                    returned = true;
                    return;
                }
            }

            const dist_url = 'https://whoping.fr:8080/text/dist'; // Url to get the distance

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

            for (let visitedArticle of this._visitedArticles.concat(this._likedArticles)) {
                compareArticles(visitedArticle.dom);
            }

            setTimeout(() => {
                if (returned) return;
                returned = true;
                callback(min_val);
             }, 3000);

        }

        apiMod.retrieveText(link, gotArticleText);
    }

    mind() {

        slideshow.disappear();

        // If articles aren't loaded, we wait
        if (this._articlesCount == 0) {
            let that = this;
            setTimeout(() => { that.mind(); }, 3000);
            return;
        }

        this._chosenArticles = [];

        //const serendipityCoin = Number($('#serendipity')[0].value) / 20;

        ///////////////////////// SERENDIPITY PART /////////////////////////

        let mostViewedArticles = [];

        const updateMostViewed = (articles) => {
            mostViewedArticles = articles.items[0].articles.splice(
                Constants.MOST_VIEWED_TOTAL - Constants.MOST_VIEWED_COUNT
            ).map(
                a => {
                    return {
                        'name': a.article,
                        'href': Constants.BASE_URL + a.article
                    }
                }
            ).filter(
                l => !(l.name in ["Main_Page", "Special:Search"] )
            );
        };

        apiMod.getMostViewedArticles(updateMostViewed);

        const pickMostViewedArticle = () => {

            if (mostViewedArticles.length == 0) {
                setTimeout( pickMostViewedArticle, 1000 );
                return;
            }

            let coin = parseInt(Math.random() * Constants.MOST_VIEWED_COUNT)

            if (mostViewedArticles[coin] === undefined) {
                setTimeout( pickMostViewedArticle, 500 );
                return;
            }

            this._chosenArticles.push(mostViewedArticles[coin]);
            mostViewedArticles.splice(coin, 1);

            if (this._chosenArticles.length == slideshow._maxSlides) {
                slideshow.update(this._chosenArticles);
            }
        }

        ///////////////////////// COMFORT ZONE PART /////////////////////////

        const choseBestLink = (baseTitle, links) => {
            console.log("a");
            if (this._chosenArticles >= slideshow._maxSlides) return;

            let best_link = null, best_distance = Infinity;
            const checkDistance = (link, distance) => {
                if (distance < best_distance) {
                    best_distance = distance;
                    best_link = link;
                }
            }
            for (let link of links) {
                if (this._chosenArticles.map(l => l.href).includes(link.href)) continue;

                apiMod.distanceFromNames(link.name, baseTitle, (distance) => { checkDistance(link, distance); });
            }

            const end = () => {
                if (this._chosenArticles.length < slideshow._maxSlides && best_link == null) {
                    pickPersonalArticle();
                    return;
                }
                this._chosenArticles.push(best_link);
                if (this._chosenArticles.length == slideshow._maxSlides) {
                    slideshow.update(this._chosenArticles);
                }
            }

            setTimeout( end, 5000 );
        }

        const pickPersonalArticle = () => {

            const articlesList = (this._likedArticles.length) ? this._likedArticles : (this._visitedArticles.length) ? this._visitedArticles : null;
            if (articlesList == null) {
                pickMostViewedArticle();
                return;
            }

            const tmp = articlesList[parseInt(Math.random() * articlesList.length)];
            const chosenStartingArticle = new Article(tmp.dom, tmp.link, (links) => { choseBestLink(tmp.link.match(/wiki\/.*/i)[0].slice(5), links); });
        }

        for (let i = 0; i < slideshow._maxSlides; i++) {
            if (Math.random() < 0) {
                // Global
                pickMostViewedArticle();
            } else {
                // Personal
                pickPersonalArticle();
            }
        }
    }
}

let rec = new Recommender();
rec.mind();
