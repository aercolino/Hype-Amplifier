/**
 * Hype-Amplifier, Andrea Ercolino, http://andowebsit.es/blog/noteslog.com
 */

chrome.extension.sendRequest({getLocalStorage: "points_weight"}, function(response) {

    var titles$ = $('td:nth-child(3).title');
    if (! titles$.length) return;

    var news = {
        titles$:  titles$,
        points:   extractNumbers($('td.subtext').find('span:first')),
        comments: extractNumbers($('td.subtext').find('a:last'))
    };

    var amplitude = 0.618 * $('table:eq(0)').width(); //0.618 is the golden ratio

    var ratio = getRatio(response && response.points_weight);

    amplify(news, amplitude, ratio, moveElements);

    //---

    function moveElements(element, distance) {
        $(element).parent().next().find('td.subtext').add(element)
            .css({'padding-left': distance});
    }

});

