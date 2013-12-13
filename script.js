"use strict";
var GRAVITY = 1; // A coefficient for our gravity
// hint: Fg = G * m1 * m2 / r^2
var DENSITY = 1; // Set a standard density for now.
var TIME_STEP = 0.1; // One unit of time

var paper;
var Planets = []; // An array containing all Planets
var circle;
var testCirc;

var windowWidth = $(window).width();
var windowHeight = $(window).height();

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
	for (var i = 0; i < Planets.length; i++) {
		var v = Planets[i].data('velocity');
		var p = new Vector(Planets[i].attr('cx'),  Planets[i].attr('cy'));
		var scaledV = v.getMultiple(TIME_STEP);
		p.add( scaledV );
		// var p1 = [p[0] + v[0]*TIME_STEP, p[1] + v[1]*TIME_STEP];
		Planets[i].data('nextPosition', p);
		if(p.x < 0 || p.x > windowWidth || p.y < 0 || p.y > windowHeight) {
			Planets[i].remove();
			Planets.splice(i,1);
		}
	};
}

function draw() 
{
	for (var i = 0; i < Planets.length; i++) {
		var nextPosition = Planets[i].data('nextPosition');
		Planets[i].attr({
			'cx': nextPosition.x,
			'cy': nextPosition.y
		});
	};
}



function calculate_gravitational_forces()
{
	// A Planets.length by Planets.length matrix of all gravity vectors
	var gravityVectors = Matrix2d(Planets.length, Planets.length);

	for (var i = 0; i < Planets.length; i++) {

		for (var j = i+1; j < Planets.length; j++) {
			

			console.log(Planets[i].node, Planets[j].node); 
		};
	};
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

	Planets[i].planetData('velocity') = v1;
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
	new_planet.attr('fill', 'black');
	new_planet.animate({'r': 200}, 5000);
	var vPath = paper.path('M'+x+' '+y+'L'+x+' '+y);

	$(paper.canvas).on('mousemove.create_planet', function(e)
	{
		vPath.attr('path', 'M'+x+' '+y+'L'+e.offsetX+' '+e.offsetY);
		// console.log(e);
	});
	$(paper.canvas).on('mouseup.create_planet', function(e) 
	{
		new_planet.stop();
		var v = new Vector(e.offsetX - x, e.offsetY - y);
		new_planet.data('velocity', v);
		new_planet.data('mass', DENSITY*new_planet.attr('r'));
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