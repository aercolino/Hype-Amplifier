// Hyped News Amplifier - (C) Andrea Ercolino, http://andowebsit.es

jQuery(function ($) {
    function save_options(e) {
        e.preventDefault();

        localStorage['points_weight'] = $('#slider').slider('value');

        $('#msg').html('Options saved.').fadeIn(500, function () {
            $(this).fadeOut(1500);
        });
    }

    function restore_options() {
        var points_weight = localStorage['points_weight'];
        $('#slider').slider('value', points_weight);
        show_value(points_weight);
    }

    function show_value(value) {
        $('#points_weight').text(value);
        $('#comments_weight').text(100 - value);
    }


    $('#slider').slider({
        slide: function (event, ui) {
            show_value(ui.value);
        }
    });

    restore_options();

    $('#save a').click(save_options);
});
