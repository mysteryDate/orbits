// A planet on the screen
function Planet(circle, position, velocity, acceleration) {
	this.circle = circle; // The raphael object to which it is referred
	this.position = position || new Vector(0,0);
	this.velocity = velocity || new Vector(0,0);
	this.acceleration = acceleration || new Vector(0,0);
	this.mass;
	this.radius;

	this.move = function() {
		this.velocity.add( this.acceleration.scale(PLANEMATOR.TIME_STEP) );
		this.position.add( this.velocity.scale(PLANEMATOR.TIME_STEP) );
	}
}