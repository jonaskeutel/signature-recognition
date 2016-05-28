'use strict'
const q = require('q')

module.exports = {
	compare: compare
}

var DTW = require('dtw')
var dtw = new DTW()
var result = [false, false]

function compare(newSignature, savedSignatures) {
  	const deferred = q.defer()

	compareX(newSignature, savedSignatures)
		.then(function() {
			result[0] = true
		}, function() {
			deferred.resolve(false)
		})
	compareY(newSignature, savedSignatures)
		.then(function() {
			result[1] = true
		}, function() {
			deferred.resolve(false)
		})
	setTimeout(function(){ 
		if (result[0] == true && result[1] == true) {
			deferred.resolve(true)
		}
	}, 1000)

	return deferred.promise
}

function compareX(newSignature, savedSignatures, callback) {
	const deferred = q.defer()

	var x = 0;
	for (var i = 0; i < savedSignatures.length; i++) {
		var result = dtw.compute(JSON.parse(newSignature.x), JSON.parse(savedSignatures[i].x))
		// console.log('x' + i + ': ' + result)
		x = x + result
	}
	if (x/savedSignatures.length > 10) {
		deferred.reject()
	}
	deferred.resolve()

	return deferred.promise
}

function compareY(newSignature, savedSignatures, callback) {
	const deferred = q.defer()

	var y = 0;
	for (var i = 0; i < savedSignatures.length; i++) {
		var result = dtw.compute(JSON.parse(newSignature.y), JSON.parse(savedSignatures[i].y))
		// console.log('y' + i + ': ' + result)
		y = y + result
	}
	if (y/savedSignatures.length > 10) {
		deferred.reject()
	}
	deferred.resolve()

	return deferred.promise
}