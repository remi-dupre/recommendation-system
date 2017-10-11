let searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let contentUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';

let userInput, submitButton;

function setup() {
  noCanvas();
  userInput = select('#userinput');
  submitButton = select('#submit_but');

  submitButton.mouseClicked(submit);

  function submit() {
    let fullUrl = searchUrl + userInput.value();
    loadJSON(fullUrl, gotSearch, 'jsonp');
  };

  function gotSearch(data) {
    console.log(data);
    let title = data[1][1];
    title = title.replace(/\s+/g, '_');
    createDiv(title);
    console.log('Querying: ' + title);
    let url = contentUrl + title;
    loadJSON(url, gotContent, 'jsonp');
  };

  function gotContent(data) {
    console.log(data);
    let page = data.query.pages;
    createDiv(page[Object.keys(page)[0]].revisions[0]['*']);
  };
}
