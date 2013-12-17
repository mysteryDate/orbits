"use strict";
var GRAVITY = 10; // A coefficient for our gravity
// hint: Fg = G * m1 * m2 / r^2
var DENSITY = 100; // Set a standard density for now.
var TIME_STEP = 0.05; // One unit of time
var MAX_SIZE = 100;
var GROW_TIME = 10000;

// Number of pixels of escape before planet is deleted
var BOUNDARY = 1000; 

var paper;
var Planets = []; // An array containing all Planets
var circle;
var testCirc;

var windowWidth = $(window).width();
var windowHeight = $(window).height();

var looping = false;
var accelerationLines = false;

function loop() 
{
	looping = true;
	update();
	draw();
	queue();
}

var lastRequest;
function stopLoop()
{
	looping = false;
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
	calculate_gravitational_forces();
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
		else {
			Planets[i].circle.attr({
				'cx': p.x,
				'cy': p.y
			});
		}
	};
}


function calculate_gravitational_forces()
{
	// A Planets.length by Planets.length matrix of all gravity vectors
	var gravityVectors = [];
	//var $fb = $('#feedback tbody tr td');

	for (var i = 0; i < Planets.length; i++) {
		gravityVectors[i] = new Vector;
	};

	for (var i = 0; i < Planets.length; i++) {
		var m1 = Planets[i].mass;
		var p1 = Planets[i].position;
		var r1 = Planets[i].radius;

		for (var j = i+1; j < Planets.length; j++) {
			var m2 = Planets[j].mass;
			var p2 = Planets[j].position;
			var r2 = Planets[j].radius;
			var d = Vector.add(p2, p1.scale(-1));
			var dMag = d.getMagnitude();
			// $fb.text(Math.round( dMag - (r1 + r2)) );
			if( dMag <= r1 + r2 ) {
				collide(Planets[i], Planets[j], d);
				// console.log(dMag);
			}
			else {
				var Fmag = GRAVITY*m1*m2/Math.pow(dMag,2);
				var F = Vector.fromAngle(d.getAngle(), Fmag);
				gravityVectors[i].add(F);
				gravityVectors[j].add(F.scale(-1)); 
			}
		};

		// var Fpath = paper.path('M'+p1.x+' '+p1.y+'L'+(p1.x+gravityVectors[i].x/10)+' '+(p1.y+gravityVectors[i].y/10));
		// Fpath.attr('stroke', 'red');
		Planets[i].acceleration = gravityVectors[i].scale(1/m1);
	};
}

// Arguments are the two colliding bodies and a vector of the distance between them
function collide(body1, body2, d) 
{
	if (!d ) d = Vector.add(p2, p1.scale(-1));

	var v1 = body1.velocity;
	var v2 = body2.velocity;

	var v1dotd = (v1.x*d.x + v1.y*d.y) / (v1.getMagnitude()*d.getMagnitude() );

	var p1 = body1.velocity.scale(body1.mass);
	var p2 = body2.velocity.scale(body2.mass);

	var E1 = 0.5*( body1.mass*Math.pow(body1.velocity.getMagnitude(),2) +
		body2.mass*Math.pow(body2.velocity.getMagnitude(),2) );

	body1.velocity = p2.scale(1/body1.mass);
	body2.velocity = p1.scale(1/body2.mass);

	var E2 = 0.5*( body1.mass*Math.pow(body1.velocity.getMagnitude(),2) +
		body2.mass*Math.pow(body2.velocity.getMagnitude(),2) );

	console.log(E2 - E1);
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
	//circle.attr('fill', 'black');
	circle.animate({'r': MAX_SIZE}, GROW_TIME);
	var vPath = paper.path('M'+x+' '+y+'L'+x+' '+y);
	vPath.attr('stroke','red');
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
		new_planet.acceleration = new Vector(0, 0);
		new_planet.mass = DENSITY*Math.PI*r*r;
		new_planet.radius = r;

		vPath.remove();
		$(paper.canvas).off('.create_planet');
		loop();
	});

	Planets.push(new_planet);
}

window.onresize = function(e) {
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

	$('body').on('keypress', function(e){
		console.log(e.which);
		if( e.which == 32 ) {  // Spacebar
			if(looping == true)
				stopLoop();
			else
				loop();
		}
	});
}