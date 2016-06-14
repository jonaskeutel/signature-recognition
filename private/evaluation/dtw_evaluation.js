'use strict'
const SCORE_THRESHOLD = 200
const LENGTH = 1000

module.exports = {
	compare: compare
}

var DTW = require('dtw')
var dtw = new DTW()

function compare(newSignature, savedSignatures, callback) {
  	var savedX = []
  	var savedY = []
    var savedForce = []

  	for (var i = savedSignatures.length - 1; i >= 0; i--) {
  		savedX.push(savedSignatures[i].x)
  		savedY.push(savedSignatures[i].y)
        savedForce.push(savedSignatures[i].force)
  	}

  	var xResult = compareValues(newSignature.x, savedX, true, true)
  	var yResult = compareValues(newSignature.y, savedY, true, true)
    var forceResult = compareValues(newSignature.force, savedForce, true, false)

  	var combinedScore = combineScores(xResult, yResult, forceResult)
  	var success = combinedScore < SCORE_THRESHOLD ? true : false
  	var result = {
  		success: success,
  		combinedScore: combinedScore,
  		x: xResult,
  		y: yResult,
  		acceleration: null,
  		gyroscope: null,
  		force: forceResult,
  	}
    console.log("Result: " + result)
	callback(result)
}

function compareValues(newValues, savedValues, normalizeLength, normalizeMagnitude) {
    // console.log("Compare " + newValues + " with " + savedValues)
	var score = 0;
    newValues = normalize(JSON.parse(newValues), normalizeLength, normalizeMagnitude)

    var normalizedNew = normalize(newValues, normalizeLength, normalizeMagnitude)
	for (var i = 0; i < savedValues.length; i++) {
		var result = dtw.compute(normalizedNew, normalize(JSON.parse(savedValues[i]), normalizeLength, normalizeMagnitude)) / normalizedNew.length;
		score = score + result
	}

	return score/savedValues.length
}

function combineScores(xScore, yScore, forceScore) {
	return (xScore * 0.1 + yScore * 0.2 + forceScore) / 3
}

function normalize(array, normalizeLength, normalizeMagnitude) {
    var normalized = array
    if (normalizeMagnitude) {
        normalized = normMagnitude(normalized)

    }
    if (normalizeLength) {
        normalized = normLinear(normalized)
    }

    return normalized
}

function normMagnitude(array) {
    var normalized = []
    var min = Infinity;
    for (var i = 0; i < array.length; i++) {
        min = (array[i] !== null && array[i] < min) ? array[i] : min
    }
    normalized = array.map(function(num) {
        return num === null ? null : num - min
    })
    return normalized
}

function normLinear(array) {
    var normalizedLengthArray = []
    var startIndex = 0
    var endIndex = 0
    for (var i = 0; i < array.length - 1; i++) {
        var startValue = array[i]
        var endValue = array[i+1]
        endIndex = Math.floor(((i+1) / (array.length - 1)) * LENGTH - 1)
        for (var j = startIndex; j <= endIndex; j++) {
            normalizedLengthArray[j] = startValue + ((j-startIndex) / (endIndex - startIndex)) * (endValue - startValue)
        }
        startIndex = endIndex
    }
    return normalizedLengthArray
}
