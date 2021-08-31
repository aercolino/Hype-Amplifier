/**
 * Hype-Amplifier, Andrea Ercolino, http://andowebsit.es/blog/noteslog.com
 */

function goldenRatio(length) {
    return 0.618 * length; //0.618 is the golden ratio
}

function getRatio(points_weight) {
    var result = {points: (points_weight || 50) / 100};
    result.comments = 1 - result.points;
    return result;
}

function extractNumbers(items$) {
    var result = items$.map(function(k, v) {
        const scraped = $(v).text() || '0';
        let floatValue = parseFloat(scraped);
        if (/k$/i.test(scraped)) {
            floatValue *= 1000;
        }
        if (/m$/i.test(scraped)) {
            floatValue *= 1000 * 1000;
        }
        const intValue = Math.floor(floatValue, 10);
        return intValue;
    }).get();
    return result.length == 1 ? result[0] : result;
}

function amplify(news, amplitude, ratio, moveElements) {

    var max = {
        points:   getMax(news.points),
        comments: getMax(news.comments)
    };

    max.factor = amplitude / (max.points * ratio.points + max.comments * ratio.comments);

	news.titles$.each(function (index) {
	    var data = {
            points:   news.points[index],
            comments: news.comments[index]
        };
	    var distance = getDistance(data);
	    moveElements(this, distance);
	});

    //---

    function getMax(items) {
        return items.reduce(function(a, b) {
            return a < b ? b : a
        });
    }

    function getDistance(data) {
        var delta = {
            points:   max.points   - data.points,
            comments: max.comments - data.comments
        };
        var result = Math.floor(max.factor * (delta.points * ratio.points + delta.comments * ratio.comments));
        return result;
    }

}
