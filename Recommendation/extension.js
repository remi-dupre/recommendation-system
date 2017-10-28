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
// @resource     bootstrap https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css
// @resource     fontawesome https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css
// @resource     customCSS https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/styles.css
// @require      https://code.jquery.com/jquery-1.12.0.min.js
// @require      https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js
// @resource     user-interface https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/user-interface.html
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/userinterface.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/Constants.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/HttpModule.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/APIModule.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/api.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

GM_addStyle(GM_getResourceText("bootstrap"));
GM_addStyle(GM_getResourceText("font-awesome"));
GM_addStyle(GM_getResourceText("customCSS"));


const p = new p5();

setup();

$(document).ready(function () {
    $("body").append(GM_getResourceText("user-interface"));
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
});
