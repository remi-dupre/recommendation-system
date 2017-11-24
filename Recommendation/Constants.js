const now = new Date();

const Constants = {
    REQUESTS_MAX : 200,
    PEDIA_URL : 'https://[[LANG]].wikipedia.org/w/api.php',
    BASE_URL : 'https://en.wikipedia.org/wiki/',
    VIEWS_URL : 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/#1/daily/#2/#3',
    MOST_VIEWED_URL: 'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access/',
    STORAGE_ARTICLES : 'WikiRec|articles',

    //Slideshow
    FADE_SPEED : 0.03,
    FREQUENCY : 16,
    ROTATION_SPEED : Math.PI / 32,

    // Last week
    DATE_BEG : new Date((new Date(now)).setDate(now.getDate() - 7)),
    DATE_END : now,

    // Filter max selections
    SECOND_PASS_CANDIDATES: 20,

    // Most viewed articles _imagesCount
    MOST_VIEWED_COUNT: 50,
    MOST_VIEWED_TOTAL: 1000
};
