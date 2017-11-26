GM_addStyle(GM_getResourceText("bootstrap"));
GM_addStyle(GM_getResourceText("bootstrap-slider"));
GM_addStyle(GM_getResourceText("customCSS"));


$(document).ready(function() {
    // Insert extra interface into the DOM
    $("#p-navigation").after(GM_getResourceText("user-interface"));

    // Link upvote and downvote buttons
    $('#btn-upvote').click(function(e) {
        e.preventDefault();
        user.upVoted();
    });

    $('#btn-downvote').click(function(e) {
        e.preventDefault();
        user.downVoted();
    });

    $('#btn-refresh').click(function(e) {
        $(this).find(".glyphicon-refresh").addClass("spinning");

        setTimeout(function() {
            $(this).find(".glyphicon-refresh").removeClass("spinning");
        }.bind(this), 1000);

        rec.mind();
    });

    $('#serendipity').slider({
    	formatter: function(value) {
    		return 'Serendipity value: ' + (localStorage[Constants.SERENDIPITY_KEY]) ? Number(localStorage[Constants.SERENDIPITY_KEY]) : 5;
    	},
        tooltip_position: 'bottom'
    });
    
    $('#serendipity').onchange(function(e) {
        localStorage[Constants.SERENDIPITY_KEY] = $('#serendipity').value;
    });


    $('[data-toggle="tooltip"]').tooltip();


});
