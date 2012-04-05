/**
 * News Amplifier, Andrea Ercolino, http://noteslog.com
 */

chrome.extension.sendRequest({getLocalStorage: "points_weight"}, function(response) {
	
	var news$ = $('#siteTable div.link');
	if (! news$.length) return;
	
	var amplitude = 0.618 * $('#siteTable div.entry:eq(0)').width(); //0.618 is the golden ratio
	
	//returns points and comments in this$ item
	function getPointsAndComments(this$) {
		var points = getInteger(this$.find('div.score.unvoted'));
		var comments = getInteger(this$.find('a.comments'));
		//console.log(points + ', ' + comments);
		return [points, comments];
	}
	
	//moves the elements for this$ item
	function moveElements(this$, distance) {
		this$.find('div.entry').css('paddingLeft', Math.floor(distance));
	}
	
	var ratio = {points: (response && response.points_weight || 50) / 100};
	ratio.comments = 1 - ratio.points;
	
	amplify(news$, amplitude, ratio, getPointsAndComments, moveElements);
});

