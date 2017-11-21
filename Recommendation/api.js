const testArticle = {
    title: "Michael Jackson",
    dateBeg: new Date(2017, 9, 22),
    dateEnd: new Date(2017, 9, 23)
};

// apiMod.getViews(testArticle);
 //apiMod.getAttr(14995351, 'categories', console.log);
// apiMod.getAttr(16095, 'categories', console.log);

apiMod.distance(14995351, 16095,  (a) => console.log('Distance Michael - Jimi : ', a));
apiMod.distance(14995351, 5843419, (a) => console.log('Distance Michael - France : ', a));
apiMod.distance(17515, 5843419, (a) => console.log('Distance Luxembourg - France : ', a));
apiMod.distance(22989, 5843419, (a) => console.log('Distance Paris - France : ', a));
apiMod.getAttribute(47527969, 'categories', (a) => console.log('categories word to vect :',a));
