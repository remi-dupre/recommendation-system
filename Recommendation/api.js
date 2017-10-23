const APIModule = require('./APIModule.js');

let apiMod = new APIModule("en");

const testArticle = {
    title: "Michael Jackson",
    dateBeg: new Date(2017, 9, 22),
    dateEnd: new Date(2017, 9, 23)
};

apiMod.getViews(testArticle);
