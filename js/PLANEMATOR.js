"use strict";
var PLANEMATOR = (function(){
	// --------------------
	// Variables
	// --------------------
	var paper       = new Raphael('container', '100%', '100%'),
		GRAVITY     = 10,    // A coefficient for our gravity, hint: Fg = G * m1 * m2 / r^2
		DENSITY     = 100,   // Set a standard density for now.
		TIME_STEP   = 0.03,  // One unit of time
		MAX_SIZE    = 100,   // Maximum raidus of a planet (pixels)
		GROW_TIME   = 10000, // Time in ms for a planet to grow to full size
		BOUNDARY    = 50,    // Number of pixels of escape before planet is deleted
		COLLISION_F = 0.99,  // Coefficient for energy maintained in collisions
	// ---------------------

	// ---------------------
	// Options
	// ---------------------
		solid_border = true, // Do planets reflect off the border?
	// ---------------------
		paper,               // The canvas
		Planets      = [],   // An array containing all Planets

		windowWidth  = $(window).width(),
		windowHeight = $(window).height(),

		looping      = false,
		lastRequest;
		// accelerationLines = false;

	function loop() {
		looping = true;
		update();
		draw();
		queue();
	}

	function isLooping() {
		return looping;
	}

	function stopLoop() {
		looping = false;
		if (lastRequest) window.cancelAnimationFrame(lastRequest);
	}

	function queue() {
		lastRequest = window.requestAnimationFrame(loop);
	}

	function update(){
		Planets.forEach(function(planet){
			planet.move()
		});

		calculate_gravitational_forces();
	}

	function clear() {
		Planets.forEach(function(planet){
			planet.circle.remove();
		});
		Planets.length = 0;
	}

	function draw() {
		var p, i;

		Planets.forEach(function(planet, i){
			// Planet reflects on borders with this option
			if (solid_border) {
				var r = planet.radius;
				if(planet.position.x - r <= 0) {
					planet.position.x = r;
					planet.velocity.x *= -COLLISION_F; }
				if(planet.position.y - r <= 0) {
					planet.position.y = r;
					planet.velocity.y *= -COLLISION_F; }
				if(planet.position.x + r >= windowWidth) {
					planet.position.x = windowWidth - r;
					planet.velocity.x *= -COLLISION_F; }
				if(planet.position.y + r >= windowHeight) { 
					planet.position.y = windowHeight - r;
					planet.velocity.y *= -COLLISION_F; }
			}

			p = planet.position;
			
			// Planet is deleted if it leaves the zone
			if (   p.x < 0 - BOUNDARY 
				|| p.x > windowWidth + BOUNDARY 
				|| p.y < 0 - BOUNDARY 
				|| p.y > windowHeight + BOUNDARY) {
				planet.circle.remove();
				Planets.splice(i,1);
			}

			// Move the planet
			else planet.circle.attr({'cx': p.x, 'cy': p.y});
		});
	}

	function calculate_gravitational_forces(){
		// A list of all gravitational force vectors for each planet
		var gravityVectors = [],
			i,
			m1, p1, r1,
			m2, p2, r2,
			d,  dMag,
			F,  Fmag;

		Planets.forEach(function(){
			gravityVectors.push(new Vector);
		});

		Planets.forEach(function(planet1, i, _this){
			m1 = planet1.mass;
			p1 = planet1.position;
			r1 = planet1.radius;

			for (var j = i+1; j < Planets.length; j++) {
				m2   = Planets[j].mass;
				p2   = Planets[j].position;
				r2   = Planets[j].radius;
				d    = Vector.add(p2, p1.scale(-1));
				dMag = d.getMagnitude();

				if( dMag <= r1 + r2 ) {
					collide(planet1, Planets[j], d);
				}
				else {
					Fmag = GRAVITY*m1*m2/Math.pow(dMag,2);
					F = Vector.fromAngle(d.getAngle(), Fmag);
					gravityVectors[i].add(F);
					gravityVectors[j].add(F.scale(-1)); // It's Newton's third law, Patrick!
				}
			};

			planet1.acceleration = gravityVectors[i].scale(1/m1);	// F = ma, bitches
		});
	}

	// Arguments are the two colliding bodies and a vector of the distance between them
	function collide(b1, b2, d) {
		if (!d ) d = Vector.add(p2, p1.scale(-1));

		// Initial velocities
		var u1 = b1.velocity,
			u2 = b2.velocity,
			E1 = 0.5 * (   b1.mass*Math.pow(b1.velocity.getMagnitude(),2) 
				         + b2.mass*Math.pow(b2.velocity.getMagnitude(),2)),
			E2,

		    // Component of initial velocity projected onto d
			u1d = d.scale( Vector.dotProduct(u1,d) / (Math.pow(d.getMagnitude(),2)) ),
			u2d = d.scale( Vector.dotProduct(u2,d) / (Math.pow(d.getMagnitude(),2)) ),

		    // Perpendicular components of initial velocities
			u1n = Vector.add(b1.velocity, u1d.scale(-1)),
			u2n = Vector.add(b2.velocity, u2d.scale(-1)),

		    // Components along d after collision, per conservation of energy and linear momentum
			v1d = ( Vector.add( u1d.scale(b1.mass - b2.mass), u2d.scale(2*b2.mass) ) ).scale(COLLISION_F/(b1.mass + b2.mass)),
			v2d = ( Vector.add( u2d.scale(b2.mass - b1.mass), u1d.scale(2*b1.mass) ) ).scale(COLLISION_F/(b1.mass + b2.mass)),

		    // Velocities after collision 
			v1 = Vector.add(v1d, u1n),
			v2 = Vector.add(v2d, u2n);

		b1.velocity = v1;
		b2.velocity = v2;
		E2 = 0.5 * (   b1.mass*Math.pow(b1.velocity.getMagnitude(),2)
			         + b2.mass*Math.pow(b2.velocity.getMagnitude(),2));
	}

	function create_planet(clickEvent) {

		var p = get_offset(clickEvent), 
			x = p[0], y = p[1],
			vPath,
			new_planet,
			circle = paper.circle(x, y, 5);

		circle.animate({'r': MAX_SIZE}, GROW_TIME);
		
		// Velocity path
		vPath = paper.path('M' + x + ' ' + y + 
			               'L' + x + ' ' + y);

		new_planet = new Planet({
			circle   : circle, 
			position : new Vector(x,y)
		});

		// NICE NAMSPACING BREUH!
		$(paper.canvas).on('mousemove.create_planet', function(moveEvent) {
			var np  = get_offset(moveEvent);
			vPath.attr('path', 'M'+x+' '+y+'L'+np[0]+' '+np[1]);
		});
		$(paper.canvas).on('mouseup.create_planet', function(mouseupEvent) {
			var np 	= get_offset(mouseupEvent),
				v 	= new Vector(np[0] - x, np[1] - y),
				r 	= circle.attr('r');

			circle.stop();

			new_planet.velocity = v;
			new_planet.acceleration = new Vector(0, 0);
			new_planet.mass = DENSITY*Math.PI*r*r;
			new_planet.radius = r;

			vPath.remove();
			$(paper.canvas).off('.create_planet');
		});

		Planets.push(new_planet);
	}

	// A polyfill function for offset bugs in SVG and Firefox (when used with jQuery)
	// Not sure if this works in all browsers
	function get_offset(event) {
		var x 	= (event.offsetX || event.pageX - event.target.clientLeft),
			y 	= (event.offsetY || event.pageY - event.target.clientTop),
			pos = [x, y];

		return pos;
	}

	// Add two planets to start, if necessary
	function seed(){
		var r = windowWidth/20;
		var x = windowWidth/2;
		var y = windowHeight/2;
		var p1 = new Planet({
			position : new Vector(x,y),
			circle : paper.circle(x, y, r),
			radius : r,
			mass   : DENSITY*Math.PI*r*r
		});
		Planets.push(p1);

		r /= 8;
		x += windowWidth/5;
		var v = new Vector(0, windowWidth/6);
		var p2 = new Planet({
			position : new Vector(x,y),
			circle : paper.circle(x, y, r),
			radius : r,
			mass   : DENSITY*Math.PI*r*r,
			velocity : v
		});
		Planets.push(p2);

		r /= 2;
		x -= windowWidth/10;
		var v = new Vector(0, -windowWidth/3.5);
		var p3 = new Planet({
			position : new Vector(x,y),
			circle : paper.circle(x, y, r),
			radius : r,
			mass   : DENSITY*Math.PI*r*r,
			velocity : v
		});
		Planets.push(p3);
	}

	return {
		TIME_STEP    	: TIME_STEP,
		loop         	: loop,
		looping      	: looping,
		isLooping	 	: isLooping,
		stopLoop     	: stopLoop,
		clear        	: clear,
		create_planet	: create_planet,
		solid_border	: solid_border,
		paper        	: paper,
		seed 			: seed
	}
})();