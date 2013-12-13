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

	this.getSum = function(vector) {
		var x = this.x + vector.x;
		var y = this.y + vector.y;
		var sum = new Vector(x, y);
		return sum;
	}

	this.getMultiple = function(scalar) {
		var x = this.x * scalar;
		var y = this.y * scalar;
		var scaled = new Vector(x, y);
		return scaled;
	}
}

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