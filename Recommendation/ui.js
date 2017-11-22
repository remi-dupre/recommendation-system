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
        Recommender.mind();
    });

    $('#serendipity').slider({
    	formatter: function(value) {
    		return 'Serendipity value: ' + value;
    	},
        tooltip_position: 'bottom'
    });

    $('[data-toggle="tooltip"]').tooltip();
});
