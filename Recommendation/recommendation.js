// ==UserScript==
// @name         Wikipedia Recommendation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://en.wikipedia.org/wiki/*
// @grant        none
// ==/UserScript==

let viewsUrl = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/#1/daily/#2/#3';

function displayViews(jsonObject, title) {
  console.log(title);
  console.log(jsonObject.views);
}

function httpGetAsync(theUrl, callback) { // Asynchronous get function
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText).items[0]);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function getViews(pageTitle, dateBeg, dateEnd) { // Get views of a given page. Date format : AAAAMMDD
  let replaceRegExp = /^(.*)(#1)(.*)(#2)(\/)(#3)+/; // Regexp to formate getviews url from api
  httpGetAsync(
    viewsUrl.replace(replaceRegExp, "$1" + pageTitle + "$3" + dateBeg + "/" + dateEnd ),
      function(responseJSON) { displayViews(responseJSON, pageTitle); }
  );
}

function getLinks(page) { // Get pertinent links of a wikipedia page

  // We get each paragraph of the page in an array
  let paragraphs = page.getElementsByClassName("mw-parser-output")[0].getElementsByTagName("p");

  // We extract every links from paragraphs
  let links = [];
  for (let i=0; i < paragraphs.length; ++i) {
      let tmp_links = paragraphs[i].getElementsByTagName("a");
      for (let j=0; j < tmp_links.length; ++j) {
          if ( !["new", "mw-redirect"].includes(tmp_links[j].className)) {
            links.push(tmp_links[j]);
          }
      }
  }

  // We keep pertinent links
  let goodLinks = [];
  for (let i=0; i < links.length; ++i) {
    let text = links[i].innerHTML; // We get the text associated to the link
    let excluder = new RegExp(/^.*[\[<].*|[\d-_]+$/, 'i'); // We detect dates, imgs, isbn...
    if (!excluder.exec(text)) { goodLinks.push(links[i]); } // And we add the others
  }

  return goodLinks;
}

(function() {
    'use strict';

    for (let l of getLinks(document)) {
      getViews(l.title, "20171018", "20171019");
    }
})();
