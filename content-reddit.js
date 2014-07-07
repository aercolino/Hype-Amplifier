/**
 * Hype-Amplifier, Andrea Ercolino, http://andowebsit.es/blog/noteslog.com
 */

chrome.extension.sendRequest({getLocalStorage: "points_weight"}, function(response) {

    $(function(){
        var titles$ = $('#siteTable div.link');
        if (! titles$.length) return;

        var news = {
            titles$:  titles$,
            points:   extractNumbers(titles$.find('div.score.unvoted')),
            comments: extractNumbers(titles$.find('a.comments'))
        };

        var amplitude = goldenRatio($('#siteTable div.entry:first').width());

        var ratio = getRatio(response && response.points_weight);

        amplify(news, amplitude, ratio, function(element, distance) {
            var entry$ = $(element).find('div.entry');
            var before$ = entry$.prevUntil('.midcol');
            if (before$.length) {
                entry$ = before$.eq(0);
            }
            entry$.css({'margin-left': distance});
        });
    });

});

