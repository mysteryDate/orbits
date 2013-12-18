"use strict";
// --------------------
// Variables
// --------------------
var GRAVITY = 10; 		// A coefficient for our gravity, hint: Fg = G * m1 * m2 / r^2
var DENSITY = 100; 		// Set a standard density for now.
var TIME_STEP = 0.03;	// One unit of time
var MAX_SIZE = 100;		// Maximum raidus of a planet (pixels)
var GROW_TIME = 10000;	// Time in ms for a planet to grow to full size
var BOUNDARY = 50;		// Number of pixels of escape before planet is deleted
var COLLISION_F = 0.99;	// Coefficient for energy maintained in collisions
// ---------------------

// ---------------------
// Options
// ---------------------
var solid_border = true;	// Do planets reflect off the border?
// ---------------------

var paper;				// The canvas
var Planets = []; 		// An array containing all Planets

var windowWidth = $(window).width();
var windowHeight = $(window).height();

var looping = false;
// var accelerationLines = false;

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
		// Planet is deleted if it leaves the zone
		if(p.x < 0 - BOUNDARY || p.x > windowWidth + BOUNDARY 
				|| p.y < 0 - BOUNDARY || p.y > windowHeight + BOUNDARY) {
			Planets[i].circle.remove();
			Planets.splice(i,1);
		}
		// Move the planet
		else {
			Planets[i].circle.attr({
				'cx': p.x,
				'cy': p.y
			});
		}
		// Planet reflects on borders with this option
		if(solid_border) {
			var r = Planets[i].radius;
			if(p.x - r <= 0)
				Planets[i].velocity.x *= -COLLISION_F;
			if(p.x + r >= windowWidth)
				Planets[i].velocity.x *= -COLLISION_F;
			if(p.y - r <= 0)
				Planets[i].velocity.y *= -COLLISION_F;
			if(p.y + r >= windowHeight)
				Planets[i].velocity.y *= -COLLISION_F;
		}
	};
}


function calculate_gravitational_forces()
{
	// A list of all gravitational force vectors for each planet
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
				gravityVectors[j].add(F.scale(-1)); // It's Newton's third law, Patrick!
			}
		};

		// var Fpath = paper.path('M'+p1.x+' '+p1.y+'L'+(p1.x+gravityVectors[i].x/10)+' '+(p1.y+gravityVectors[i].y/10));
		// Fpath.attr('stroke', 'red');
		Planets[i].acceleration = gravityVectors[i].scale(1/m1);	// F = ma, bitches
	};
}

// Arguments are the two colliding bodies and a vector of the distance between them
function collide(b1, b2, d) 
{
	if (!d ) d = Vector.add(p2, p1.scale(-1));

	// Initial velocities
	var u1 = b1.velocity;
	var u2 = b2.velocity;

	var E1 = 0.5*( b1.mass*Math.pow(b1.velocity.getMagnitude(),2) +
		b2.mass*Math.pow(b2.velocity.getMagnitude(),2) );

	// Component of initial velocity projected onto d
	var u1d = d.scale( Vector.dotProduct(u1,d) / (Math.pow(d.getMagnitude(),2)) );
	var u2d = d.scale( Vector.dotProduct(u2,d) / (Math.pow(d.getMagnitude(),2)) );

	// Perpendicular components of initial velocities
	var u1n = Vector.add(b1.velocity, u1d.scale(-1));
	var u2n = Vector.add(b2.velocity, u2d.scale(-1));

	// Components along d after collision, per conservation of energy and linear momentum
	var v1d = ( Vector.add( u1d.scale(b1.mass - b2.mass), u2d.scale(2*b2.mass) ) ).scale(COLLISION_F/(b1.mass + b2.mass));
	var v2d = ( Vector.add( u2d.scale(b2.mass - b1.mass), u1d.scale(2*b1.mass) ) ).scale(COLLISION_F/(b1.mass + b2.mass));

	// Velocities after collision 
	var v1 = Vector.add(v1d, u1n);
	var v2 = Vector.add(v2d, u2n);

	b1.velocity = v1;
	b2.velocity = v2;

	var E2 = 0.5*( b1.mass*Math.pow(b1.velocity.getMagnitude(),2) +
		b2.mass*Math.pow(b2.velocity.getMagnitude(),2) );

	// console.log(E2 - E1);
}

$(document).ready(function(){

	paper = new Raphael('container', '100%', '100%'); 
	handlers();
});

function create_planet(clickEvent)
{
	// I don't think the offset works in Firefox
	var x = clickEvent.offsetX;
	var y = clickEvent.offsetY;

	var circle = paper.circle(x, y, 5);
	circle.animate({'r': MAX_SIZE}, GROW_TIME);
	
	// Velocity path
	var vPath = paper.path('M'+x+' '+y+'L'+x+' '+y);

	var new_planet = new Planet(circle, new Vector(x,y));

	$(paper.canvas).on('mousemove.create_planet', function(e)
	{
		vPath.attr('path', 'M'+x+' '+y+'L'+e.offsetX+' '+e.offsetY);
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
		if( e.which == 99) { // Clear on 'c'
			for (var i = 0; i < Planets.length; i++) {
				Planets[i].circle.remove();
			};
			Planets = [];

		}
	});
}