function setup() {

  var div =  createDiv(' ');
  div.id("plug");


  h1 = createElement('h1',"Recommendation");
  h1.id("recommend");
  div.child(h1);

  var like_button = createButton("like");
  like_button.id("like_button");
  var dislike_button = createButton("dislike");
  dislike_button.id("dislike_button");

  div.child(like_button);
  div.child(dislike_button);

  var serendipity = createP("Serendipity");
  div.child(serendipity);
  serendipity.position(80,110);


  var slider = createSlider(0,100,100);
  div.child(slider);
  slider.position(30,150);

}
