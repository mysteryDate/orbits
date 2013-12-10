"use strict";
var GRAVITY = 1; // A coefficient for our gravity
// hint: Fg = G * m1 * m2 / r^2
var DENSITY = 1; // Set a standard density for now.
var TIME_STEP = 1; // One unit of time

var paper;
var planets = []; // An array containing all planets
var circle;
var testCirc;

function update_display() 
{
	for (var i = 0; i < planets.length; i++) {
		var nextPosition = planets[i].data('nextPosition');
		planets[i].attr({
			'cx': nextPosition[0],
			'cy': nextPosition[1]
		});
	};
}

function find_gravitational_force(planet)
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
	circle = paper.circle(50, 40, 10);

	handlers();

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
			create_planet(e);
		}
	});


}