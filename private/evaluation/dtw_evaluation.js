/**
 * This file encapsulates the normal and the filtered dtw approaches.
 * It exports the according methods to be called from the evaluation.js file.
 */

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
		// Call the dtw compute method from the dtw library
		result = dtw.compute(normalizedNew, normalizedSaved)
	}
	catch(err) {
		console.log('Normal:', err)
		return false;
	}

	return result
}

function computeDTWResultFiltered(normalizedNew, normalizedSaved) {
	var result
	try {
		// Normalize the values (remove 'undefined' values and call the dtw compute method from the dtw library
		normalizedNew = normalizedNew.filter(function(n){ return n != undefined })
		normalizedSaved = normalizedSaved.filter(function(n){ return n != undefined })
		result = dtw.compute(normalizedNew, normalizedSaved)
	}
	catch(err) {
		console.log('Filtered:', err)
		return false;
	}

	return result
}
