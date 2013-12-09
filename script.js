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

//An object storing a single planet
function Planet(args) 
{
	var _self = this;
	this.position = args.position;
	this.velocity = args.velocity;
	this.mass = args.mass;
	this.radius = args.radius;

	this.create = function() 
	{
		_self.raphael = paper.circle(
			_self.position[0],
			_self.position[1],
			_self.radius);
	}
}

$(document).ready(function(){
	$('svg').on('mousemove', function(e){
		console.log(this);
	});
	$('#foo').append('<animate attributeName="cy" from="50" to="200" dur="3s"/>');


	paper = new Raphael('container', '100%', '100%'); 
	circle = paper.circle(50, 40, 10);

	handlers();

	testCirc = new Planet({'position': [625,215], 'radius':100});

});

function create_planet(clickEvent)
{
	var x = clickEvent.offsetX;
	var y = clickEvent.offsetY;

	var new_planet = paper.circle(x, y, 0);
	new_planet.animate({'r': 200}, 2000);


	$(paper.canvas).on('mouseup.create_planet', function(e) {
		console.log(e.offsetX - x);
		console.log(clickEvent.timeStamp - e.timeStamp);
		$(paper.canvas).off('.create_planet');
	});

	planets.push(new_planet);
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
			circle.attr({'cx': e.offsetX, 'cy': e.offsetY});
		}
	});


}