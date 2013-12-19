// A planet on the screen
function Planet(options) {
	this.circle       = options.circle; // The raphael object to which it is referred
	this.position     = options.position     || new Vector(0,0);
	this.velocity     = options.velocity     || new Vector(0,0);
	this.acceleration = options.acceleration || new Vector(0,0);
	this.mass;
	this.radius;

	this.move = function() {
		this.velocity.add( this.acceleration.scale(PLANEMATOR.TIME_STEP) );
		this.position.add( this.velocity.scale(PLANEMATOR.TIME_STEP) );
	}
}