
class User {

	/** Definition of a user
     * @param {number} queriesSeen the number of articles consulted so far
     * @param {Array}  articlesSeen the (names? / links ?) of the articles seen so far  
     * @param {Array}  articlesScorerelevance stores the relevance-score of the article
     * @param {Array}  articlesScorequality stores the quality-score of the article
     */

	constructor(language){
		this.LANGUAGE = language;
		this.queriesSeen = 0;
		this.articlesSeen = [];
		this.articlesScorerelevance = [];
		this.articlesScorequality = [];		
	}

	addarticleSeen(id,scorerelevence,scorequality){
		this.queriesSeen++;
		this.addarticleSeen.push(id);
		this.articlesScorerelevance(scorerelevence);
		this.articlesScorequality(scorequality);
	}

}