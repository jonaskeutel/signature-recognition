'use strict'

module.exports = {
	computeDTWResultNormal: computeDTWResultNormal,
	computeDTWResultFiltered: computeDTWResultFiltered
}

var DTW = require('dtw')
var dtw = new DTW()

function computeDTWResultNormal(normalizedNew, normalizedSaved) {
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

function computeDTWResultFiltered(normalizedNew, normalizedSaved) {
	var result
	try {
		normalizedNew = normalizedNew.filter(function(n){ return n != undefined })
		normalizedSaved = normalizedSaved.filter(function(n){ return n != undefined })
		result = dtw.compute(normalizedNew, normalizedSaved)
	}
	catch(err) {
		console.log(err)
		return false;
	}

	return result
}
