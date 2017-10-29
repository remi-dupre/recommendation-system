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
// @resource     bootstrap https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/bootstrap/css/custom-bootstrap.css
// @resource     bootstrap-slider https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.9.0/css/bootstrap-slider.min.css
// @resource     customCSS https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/css/style.css
// @require      https://code.jquery.com/jquery-1.12.0.min.js
// @require      https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.9.0/bootstrap-slider.min.js
// @resource     user-interface https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/UI/user-interface.html
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/UI/userinterface.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/Constants.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/HttpModule.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/APIModule.js
// @require      https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/api.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

GM_addStyle(GM_getResourceText("bootstrap"));
GM_addStyle(GM_getResourceText("bootstrap-slider"));
GM_addStyle(GM_getResourceText("customCSS"));

// $("head").append('<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" type="text/css">')
//          .append('<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-slider/9.9.0/css/bootstrap-slider.min.css" rel="stylesheet" type="text/css">')
//          .append('<link href="https://raw.githubusercontent.com/remi-dupre/recommendation-system/master/Recommendation/styles.css" rel="stylesheet" type="text/css">');

// const p = new p5();
// setup();

$( document ).ready(function() {

$("#p-navigation").after(GM_getResourceText("user-interface"));

$('.btn-number').click(function(e) {
    e.preventDefault();

    fieldName = $(this).attr('data-field');
    type = $(this).attr('data-type');
    var input = $("input[name='" + fieldName + "']");
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if (type == 'minus') {

            if (currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            }
            if (parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if (type == 'plus') {

            if (currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if (parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});
$('.input-number').focusin(function() {
    $(this).data('oldValue', $(this).val());
});
$('.input-number').change(function() {

    minValue = parseInt($(this).attr('min'));
    maxValue = parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());

    name = $(this).attr('name');
    if (valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
    } else {
        alert('Sorry, the minimum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    if (valueCurrent <= maxValue) {
        $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
    } else {
        alert('Sorry, the maximum value was reached');
        $(this).val($(this).data('oldValue'));
    }

});
$(".input-number").keydown(function(e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});

// Serendipity

$('#serendipity').slider({
	formatter: function(value) {
		return 'Serendipity value: ' + value;
	}
});

});
