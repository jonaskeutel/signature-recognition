'use strict'

module.exports = {
	computeDTWResult: computeDTWResult
}

var DTW = require('dtw')
var dtw = new DTW()

function computeDTWResult(normalizedNew, normalizedSaved) {
	var result
	try {
		result = dtw.compute(normalizedNew, normalizedSaved)
	}
	catch(err) {
		console.log(err)
		return false;
	}

	return result
}
