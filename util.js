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

	this.getUnitVector = function() {
		return this.scale(1/this.getMagnitude());
	}

	this.getAngle = function() {
		return Math.atan2(this.y,this.x);
	}

	this.getComponents = function(angle) {
		// var x = 
	}

	// this.getSum = function(vector) {
	// 	var x = this.x + vector.x;
	// 	var y = this.y + vector.y;
	// 	var sum = new Vector(x, y);
	// 	return sum;
	// }

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

// // Returns the angle between two vectors, A and B
// Vector.angleBetween = function(A, B) {
// 	// The dot product
// 	var AdotB = (A.x * B.x) + (A.y * B.y);
// 	var Amag = A.getMagnitude();
// 	var Bmag = B.getMagnitude();

// 	var cos = AdotB/(Amag*Bmag);
// 	// Rounding erros can make the ratio slightly more than one, in this case
// 	if ( Math.abs(cos) > 1) cos = 1;

// 	return Math.acos( cos );
// };

// m, n are the dimensions of the matrix
// function Matrix2d(m, n)
// {
// 	var matrix = []
// 	for (var i = 0; i < m; i++) {
// 		matrix[i] = [];
// 		for (var j = 0; j < n; j++) {
// 			matrix[i].push(0);
// 		};
// 	};
// 	return matrix;
// }

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