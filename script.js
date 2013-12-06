"use strict";
var paper;
var circle;

//An object storing the abstraction of our current screen 
function ScreenGrid () {
	
}

$(document).ready(function(){
	$('svg').on('mousemove', function(e){
		console.log(this);
	});
	$('#foo').append('<animate attributeName="cy" from="50" to="200" dur="3s"/>');


	paper = new Raphael('container', '100%', '100%'); 
	circle = paper.circle(50, 40, 10);

	handlers();

});

function handlers() {

	$(paper.canvas).on({
		mousemove: function(e){
			var feedback = [
				e.clientX,	e.clientY,
				e.pageX,	e.pageY,
				e.screenX,	e.screenY,
				e.offsetX,	e.offsetY];

			$('#feedbackTable td').each(function(i,e){
				$(this).text(feedback[i]);
			});
		},
		click: function(e){
			circle.attr({'cx': e.offsetX, 'cy': e.offsetY});
		}
	});


}