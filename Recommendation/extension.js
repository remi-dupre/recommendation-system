// ==UserScript==
// @name         Wikiex
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Wikipedia Recommender System
// @author       You
// @match        https://en.wikipedia.org/wiki/*
// @require 	 https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.16/p5.min.js
// @require 	 https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.16/addons/p5.dom.min.js
// @require 	 https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.16/addons/p5.sound.min.js
// @resource     customCSS https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/styles.css
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/userinterface.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/Constants.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/HttpModule.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/APIModule.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/api.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

var newCSS = GM_getResourceText ("customCSS");
GM_addStyle (newCSS);
_
