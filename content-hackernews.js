/**
 * News Amplifier, Andrea Ercolino, http://noteslog.com
 */

chrome.extension.sendRequest({getLocalStorage: "points_weight"}, function(response) {
	
	var news$ = $('td:nth-child(3).title');
	if (! news$.length) return;
	
	var amplitude = 0.618 * $('table:eq(0)').width(); //0.618 is the golden ratio
	
	//returns points and comments in this$ item
	function getPointsAndComments(this$) {
		var next$ = this$.parent().next().find('td.subtext');
		var points   = getInteger(next$.find('*:contains(point)'));
		var comments = getInteger(next$.find('*:contains(comment)'));
	    //console.log(points + ', ' + comments);
		return [points, comments];
	}
	
	//moves the elements for this$ item
	function moveElements(this$, distance) {
		this$.parent().next().find('td.subtext').add(this$).css('paddingLeft', distance);
	}
	
	var ratio = {points: (response && response.points_weight || 50) / 100};
	ratio.comments = 1 - ratio.points;
	
	amplify(news$, amplitude, ratio, getPointsAndComments, moveElements);
});

