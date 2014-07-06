/**
 * Hype-Amplifier, Andrea Ercolino, http://andowebsit.es/blog/noteslog.com
 */

chrome.extension.sendRequest({getLocalStorage: "points_weight"}, function(response) {
	
	var titles$ = $('#siteTable div.link');
	if (! titles$.length) return;

    var news = {
        titles$:  titles$,
        points:   extractNumbers(titles$.find('div.score.unvoted')),
        comments: extractNumbers(titles$.find('a.comments'))
    };

    var amplitude = 0.618 * $('#siteTable div.entry:eq(0)').width(); //0.618 is the golden ratio

    var ratio = getRatio(response && response.points_weight);

    amplify(news, amplitude, ratio, moveElements);

    //---

    function moveElements(element, distance) {
        var entry$ = $(element).find('div.entry');
        var before$ = entry$.prevUntil('.midcol');
        if (before$.length) {
            entry$ = before$.eq(0);
        }
        entry$.css({'margin-left': distance});
    }

});

