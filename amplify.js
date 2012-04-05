/**
 * Hype-Amplifier, Andrea Ercolino, http://noteslog.com
 */

//returns the integer contained in the text of the first element of this$
function getInteger(this$) {
    var result;
    result = this$.length && this$.text() || '0';
    result = result.replace(/\D+/g, '')   || '0';
    result = parseInt(result, 10);
    return result;
}

//amplifies the given news$ list	
function amplify(news$, amplitude, ratio, getPointsAndComments, moveElements) {
	//returns the distance this$ block is to be moved
	function getDistance(data) {
		var delta = {points: max.points - data.points, comments: max.comments - data.comments};  
	    var distance = max.factor * (delta.points * ratio.points + delta.comments * ratio.comments);
	    var result = Math.floor(distance);
	    return result;
	}
	
	//compute max points and comments
	var max = {points: 0, comments: 0};
	news$.each(function () {
	    var this$ = $(this);
	    var data = getPointsAndComments(this$);
	    data = {points: data[0], comments: data[1]};
	    this$.data('Hype-Amplifier', data);
	    if (data.points   > max.points)   max.points   = data.points;
		if (data.comments > max.comments) max.comments = data.comments;
	});
	
	//compute distance and move elements
	max.factor = amplitude / (max.points * ratio.points + max.comments * ratio.comments);
	news$.each(function () {  
	    var this$ = $(this);
	    var data = this$.data('Hype-Amplifier');
	    var distance = getDistance(data);
	    moveElements(this$, distance);
	});
}
