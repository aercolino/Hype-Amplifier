/**
 * Hype-Amplifier, Andrea Ercolino, http://andowebsit.es/blog/noteslog.com
 */

chrome.extension.sendRequest({getLocalStorage: "points_weight"}, function(response) {

    var titles$ = $('td:nth-child(3).title');
    if (! titles$.length) return;

    // points and comments elements exist only if there are more than 0 points and comments respectively
    // this means it's not possible to .find() all points and comments at once (like in the Reddit case)
    var points   = [];
    var comments = [];
    $('td.subtext').each(function(k, v) {
        points  .push(extractNumbers($(v).find('span:first')));
        comments.push(extractNumbers($(v).find('a:last')));
    });

    var news = {
        titles$:  titles$,
        points:   points,
        comments: comments
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

