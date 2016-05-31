'use strict'
const q = require('q')
const SCORE_THRESHOLD = 0.2

module.exports = {
	compare: compare
}

var DTW = require('dtw')
var dtw = new DTW()
var result = [false, false]

function compare(newSignature, savedSignatures) {
  	const deferred = q.defer()

  	var savedX = []
  	var savedY = []

  	for (var i = savedSignatures.length - 1; i >= 0; i--) {
  		savedX.push(savedSignatures[i].x)
  		savedY.push(savedSignatures[i].y)
  	};

  	var xResult = compareValues(newSignature.x, savedX)
  	var yResult = compareValues(newSignature.y, savedY)

  	var combinedScore = combineScores(xResult, yResult)
  	var success = combinedScore < SCORE_THRESHOLD ? true : false;
  	deferred.resolve( {
  		success: success,
  		combinedScore: combinedScore,
  		x: xResult,
  		y: yResult,
  		acceleration: null,
  		gyroscope: null,
  		force: null,
  	})

	return deferred.promise
}

function compareValues(newValues, savedValues) {
	var score = 0;
	for (var i = 0; i < savedValues.length; i++) {
		var result = dtw.compute(JSON.parse(newValues), JSON.parse(savedValues[i]))
		// console.log('x' + i + ': ' + result)
		score = score + result
	}

	return score/savedValues.length
}

function combineScores(xScore, yScore) {
	return (xScore + yScore)/2
}