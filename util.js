// My first utility function file!

function Vector(x, y) 
{
	this.x = x || 0;
	this.y = y || 0;

	this.add = function(vector) {
		this.x += vector.x;
		this.y += vector.y;
	}

	this.multiply = function(scalar) {
		this.x *= scalar;
		this.y *= scalar;
	}

	this.getMagnitude = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	this.getAngle = function() {
		return Math.atan2(this.y,this.x);
	}

	this.getSum = function(vector) {
		var x = this.x + vector.x;
		var y = this.y + vector.y;
		var sum = new Vector(x, y);
		return sum;
	}

	this.scale = function(scalar) {
		var x = this.x * scalar;
		var y = this.y * scalar;
		var scaled = new Vector(x, y);
		return scaled;
	}
}

// Creates a new vector given an angle and magnitude
Vector.fromAngle = function(angle, magnitude) {
	return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

// m, n are the dimensions of the matrix
function Matrix2d(m, n)
{
	var matrix = []
	for (var i = 0; i < m; i++) {
		matrix[i] = [];
		for (var j = 0; j < n; j++) {
			matrix[i].push(0);
		};
	};
	return matrix;
}

// A planet on the screen
function Planet(circle, position, velocity, acceleration) 
{
	this.circle = circle; // The raphael object to which it is referred
	this.position = position || new Vector(0,0);
	this.velocity = velocity || new Vector(0,0);
	this.acceleration = acceleration || new Vector(0,0);
	this.mass;
	this.radius;

	this.move = function() {
		this.velocity.add( this.acceleration.scale(TIME_STEP) );
		this.position.add( this.velocity.scale(TIME_STEP) );
	}
}