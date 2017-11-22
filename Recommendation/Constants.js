const now = new Date();

const Constants = {
    REQUESTS_MAX : 200,
    PEDIA_URL : 'https://[[LANG]].wikipedia.org/w/api.php',
    VIEWS_URL : 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/#1/daily/#2/#3',
    STORAGE_ARTICLES : 'WikiRec|articles',

    // Last week
    DATE_BEG : new Date((new Date(now)).setDate(now.getDate() - 7)),
    DATE_END : now,

    // Filter max selections
    SECOND_PASS_CANDIDATES: 20
};
