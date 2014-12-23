// A planet on the screen
function Planet(options) {
	this.circle       = options.circle; // The raphael object to which it is referred
	this.position     = options.position     || new Vector(0,0);
	this.velocity     = options.velocity     || new Vector(0,0);
	this.acceleration = options.acceleration || new Vector(0,0);
	this.mass 	      = options.mass 		 || 0
	this.radius		  = options.radius 		 || 0

	this.move = function() {
		this.velocity.add( this.acceleration.scale(PLANEMATOR.TIME_STEP) );
		this.position.add( this.velocity.scale(PLANEMATOR.TIME_STEP) );
	}

	this.absorb = function(small_planet) {
		// TODO: figure out what happens to velocity and acceleration
		this.mass 	+= small_planet.mass;
		this.radius += small_planet.radius;
		this.circle.attr('r', this.radius);
	}
}