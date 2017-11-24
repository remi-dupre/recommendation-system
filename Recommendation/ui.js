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
    		return 'Serendipity value: ' + value;
    	},
        tooltip_position: 'bottom'
    });

    $('#serendipity').slider({
    	formatter: function(value) {
    		return 'Serendipity value: ' + value;
    	},
        tooltip_position: 'bottom'
    });

    $('[data-toggle="tooltip"]').tooltip();

    $('#slideshow').carousel({
        interval: 5000
    });
    $('.carousel[data-type="multi"] .item').each(function() {
        var next = $(this).next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));

        for (var i = 0; i < 2; i++) {
            next = next.next();
            if (!next.length) {
                next = $(this).siblings(':first');
            }

            next.children(':first-child').clone().appendTo($(this));
        }
    });

    $('.gallery-item a').hover(
        function() {
            $(this).parent().find('.img-title').fadeTo(300, 1);
        },
        function() {
            $(this).parent().find('.img-title').fadeTo(200, 0);
        }
    );

});
