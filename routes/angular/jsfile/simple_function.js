function test() {
		return "test";
}

exports.testFFF = test;


function getDate() {
		var d = new Date();

		var date = leadingZeros(d.getFullYear(), 4) +
				leadingZeros(d.getMonth() + 1, 2) +
				leadingZeros(d.getDate(), 2);
		return date;
}
exports.getDate = getDate;


function getTime() {
		let d = new Date();

		let date = leadingZeros(d.getFullYear(), 4) +
				leadingZeros(d.getMonth() + 1, 2) +
				leadingZeros(d.getDate(), 2);

		let time = leadingZeros(d.getHours(), 2) +
				leadingZeros(d.getMinutes(), 2) +
				leadingZeros(d.getSeconds(), 2);
		return date+time;
}
exports.getTime = getTime;


function leadingZeros(n, digits) {
		var zero = '';
		n = n.toString();

		if (n.length < digits) {
				for (i = 0; i < digits - n.length; i++){
						zero += '0';
				}
		}
		return zero + n;
}
