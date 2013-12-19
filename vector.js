function Vector(x, y) {
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

	this.getUnitVector = function() {
		return this.scale(1/this.getMagnitude());
	}

	this.getAngle = function() {
		return Math.atan2(this.y,this.x);
	}

	// Returns a scaled version of the vector
	this.scale = function(scalar) {
		var x = this.x * scalar;
		var y = this.y * scalar;
		var scaled = new Vector(x, y);
		return scaled;
	}
}

// Returns the sum of two vectors, A and B
Vector.add = function(A, B) {
	var x = A.x + B.x;
	var y = A.y + B.y;
	return new Vector(x, y);
};

// Creates a new vector given an angle and magnitude
Vector.fromAngle = function(angle, magnitude) {
	return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
};

Vector.dotProduct = function(A, B) {
	return (A.x * B.x) + (A.y * B.y);
}