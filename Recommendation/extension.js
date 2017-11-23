
// ==UserScript==
// @name         Wikiex
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Wikipedia Recommender System
// @downloadURL  https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/extension.js
// @updateURL    https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/extension.js
// @match        https://en.wikipedia.org/wiki/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @resource     bootstrap https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/css/custom-bootstrap.css
// @resource     bootstrap-slider https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.9.0/css/bootstrap-slider.min.css
// @resource     customCSS https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/css/style.css
// @require      https://code.jquery.com/jquery-1.12.0.min.js
// @require      https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.9.0/bootstrap-slider.min.js
// @resource     user-interface https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/UI/user-interface.html
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/Constants.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/HttpModule.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/APIModule.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/Slideshow.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/Category.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/Filter.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/Article.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/user.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/Recommender.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/ui.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/UI/userinterface.js
// ==/UserScript==
