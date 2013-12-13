"use strict";
var GRAVITY = 1; // A coefficient for our gravity
// hint: Fg = G * m1 * m2 / r^2
var DENSITY = 1; // Set a standard density for now.
var TIME_STEP = 0.1; // One unit of time

// Number of pixels of escape before planet is deleted
var BOUNDARY = 100; 

var paper;
var Planets = []; // An array containing all Planets
var circle;
var testCirc;

var windowWidth = $(window).width();
var windowHeight = $(window).height();

function loop() 
{
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
	for (var i = 0; i < Planets.length; i++) {
		Planets[i].move();
	};
}

function draw() 
{
	for (var i = 0; i < Planets.length; i++) {
		var p = Planets[i].position;
		if(p.x < 0 - BOUNDARY || p.x > windowWidth + BOUNDARY 
				|| p.y < 0 - BOUNDARY || p.y > windowHeight + BOUNDARY) {
			Planets[i].circle.remove();
			Planets.splice(i,1);
		}
		else
			Planets[i].circle.attr({
				'cx': p.x,
				'cy': p.y
			});
	};
}


function calculate_gravitational_forces()
{
	// A Planets.length by Planets.length matrix of all gravity vectors
	var gravityVectors = Matrix2d(Planets.length, Planets.length);

	for (var i = 0; i < Planets.length; i++) {
		var m1 = Planets[i].mass;
		var p1 = Planets[i].position;

		for (var j = i+1; j < Planets.length; j++) {
			var m2 = Planets[j].mass;
			var p2 = Planets[j].position
			var d = p1.getSum(p2.scale(-1));
			var Fx = GRAVITY*m1*m2/Math.pow(d.x,2);
			var Fy = GRAVITY*m1*m2/Math.pow(d.y,2);
			gravityVectors[i][j] = new Vector(Fx, Fy);
		};
	};

	console.log(gravityVectors);
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

	var circle = paper.circle(x, y, 0);
	circle.attr('fill', 'black');
	circle.animate({'r': 200}, 5000);
	var vPath = paper.path('M'+x+' '+y+'L'+x+' '+y);
	var new_planet = new Planet(circle, new Vector(x,y));

	$(paper.canvas).on('mousemove.create_planet', function(e)
	{
		vPath.attr('path', 'M'+x+' '+y+'L'+e.offsetX+' '+e.offsetY);
		// console.log(e);
	});
	$(paper.canvas).on('mouseup.create_planet', function(e) 
	{
		circle.stop();

		var v = new Vector(e.offsetX - x, e.offsetY - y);
		var r = circle.attr('r');

		new_planet.velocity = v;
		new_planet.acceleration = new Vector(0, 10);
		new_planet.mass = DENSITY*r;
		new_planet.radius = r;

		vPath.remove();
		$(paper.canvas).off('.create_planet');
		loop();
	});

	Planets.push(new_planet);
}

function onresize() {
	windowWidth = $(window).width();
	windowHeight = $(window).height();
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