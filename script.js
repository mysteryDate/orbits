"use strict";
var GRAVITY = 1; // A coefficient for our gravity
// hint: Fg = G * m1 * m2 / r^2
var DENSITY = 1; // Set a standard density for now.
var TIME_STEP = 0.1; // One unit of time

var paper;
var planets = []; // An array containing all planets
var circle;
var testCirc;


function loop() 
{
	// clear();
	update();
	draw();
	queue();
}

var lastRequest;
function stopLoop()
{
	window.cancelAnimationFrame(lastRequest);
}

function queue() 
{
  	lastRequest = window.requestAnimationFrame(loop);
}

function update()
{
	for (var i = 0; i < planets.length; i++) {
		var v = planets[i].data('velocity');
		var p = [planets[i].attr('cx'),  planets[i].attr('cy')];
		var p1 = [p[0] + v[0]*TIME_STEP, p[1] + v[1]*TIME_STEP];
		planets[i].data('nextPosition', p1);
	};
}

function draw() 
{
	for (var i = 0; i < planets.length; i++) {
		var nextPosition = planets[i].data('nextPosition');
		planets[i].attr({
			'cx': nextPosition[0],
			'cy': nextPosition[1]
		});
	};
}



function calculate_gravitational_forces()
{

}

// Mass is a scalar, position, velocity and gravitaional_force are two dimensional vectors
function calculate_next_position(mass, position, velocity, gavitational_force)
{
	var m = mass;
	var v0 = velocity;
	var p0 = position;
	var Fg = gravitaional_force;
	
	var a = [F[0]/m, F[1]/m];
	var v1 = [v0[0] + a[0], v0[1] + a[1]];

	planets[i].planetData('velocity') = v1;
}

$(document).ready(function(){

	paper = new Raphael('container', '100%', '100%'); 
	handlers();

	// loop();

});

function create_planet(clickEvent)
{
	var x = clickEvent.offsetX;
	var y = clickEvent.offsetY;

	var new_planet = paper.circle(x, y, 0);
	new_planet.animate({'r': 200}, 5000);
	var v = paper.path('M'+x+' '+y+'L'+x+' '+y);

	$(paper.canvas).on('mousemove.create_planet', function(e)
	{
		v.attr('path', 'M'+x+' '+y+'L'+e.offsetX+' '+e.offsetY);
		// console.log(e);
	});
	$(paper.canvas).on('mouseup.create_planet', function(e) 
	{
		new_planet.stop();
		new_planet.data('velocity', [e.offsetX - x, e.offsetY - y]);
		v.remove();
		$(paper.canvas).off('.create_planet');
		loop();
	});

	planets.push(new_planet);
}

function Vector(x, y) 
{
	this.x = x || 0;
	this.y = y || 0;

	this.add = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
	}

	this.getMagnitude = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	this.multiply = function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
	}
}

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
		mousedown: function(e){
			stopLoop();
			create_planet(e);
		}
	});


}