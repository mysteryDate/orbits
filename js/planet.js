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
		// Areas combine, the square of the radius
		// Should be the cubes, but we're in 2d!
		this.radius = Math.pow( 
			Math.pow(small_planet.radius,2) + Math.pow(this.radius,2), 1/2);
		this.circle.attr('r', this.radius);
	}
}