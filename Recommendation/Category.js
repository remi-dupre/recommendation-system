class Category {

    constructor(title, link) {
        this.title = title;
        this.link = link;
    }

    belongsToCategory(article) {
        return this.title in article.categories.map(c => c.title);
    }
}
