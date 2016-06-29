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
    var savedHeight = []
    var savedWidth = []
    var savedAcceleration = []
    var savedOrientation = []
    var savedDuration = []

  	for (var i = savedSignatures.length - 1; i >= 0; i--) {
  		savedX.push(savedSignatures[i].x)
  		savedY.push(savedSignatures[i].y)
        savedForce.push(savedSignatures[i].force)
        savedWidth.push(savedSignatures[i].width)
        savedHeight.push(savedSignatures[i].height)
        savedAcceleration.push(savedSignatures[i].acceleration)
        savedOrientation.push(savedSignatures[i].gyroscope)
        savedDuration.push(savedSignatures[i].duration)
  	}

    var xResult = compareValues(newSignature.x, savedX, true, true)
  	var yResult = compareValues(newSignature.y, savedY, true, true)
    var forceResult = compareValues(newSignature.force, savedForce, true, false)
    var accelerationResult = compareValues(newSignature.acceleration, savedAcceleration, true, false)
    var orientationResult = compareValues(newSignature.gyroscope, savedOrientation, true, false)
    var widthResult = compareNumber(newSignature.width, savedWidth)
    var heightResult = compareNumber(newSignature.width, savedHeight)

    var xCertainity = getCertainity(JSON.parse(newSignature.x), savedX)
  	var yCertainity = getCertainity(JSON.parse(newSignature.y), savedY)
    var forceCertainity = getCertainity(JSON.parse(newSignature.force), savedForce)
    var accelerationCertainity = getCertainity(JSON.parse(newSignature.acceleration), savedAcceleration)
    var orientationCertainity = getCertainity(JSON.parse(newSignature.gyroscope), savedOrientation)
    var widthCertainity = getCertainity(newSignature.width, savedWidth)
    var heightCertainity = getCertainity(newSignature.height, savedHeight)
    var durationCertainity = getCertainity(newSignature.duration, savedDuration)


  	var combinedScore = combineScores(xResult, yResult, forceResult, accelerationResult, orientationResult, widthResult, heightResult)
  	var success = combinedScore < SCORE_THRESHOLD ? true : false
  	var result = {
  		success: success,
  		combinedScore: combinedScore,
  		x: xResult,
  		y: yResult,
        height: heightResult,
        width: widthResult,
  		acceleration: null,
  		gyroscope: null,
  		force: forceResult,
        widthCertainity: widthCertainity,
        heightCertainity: heightCertainity,
        durationCertainity: durationCertainity,
  	}
    console.log("Result: " + result)
	callback(result)
}

function compareNumber(newValue, savedValues) {
    var diff = 0
    for (var i = 0; i < savedValues.length; i++) {
        diff += Math.abs(savedValues[i] - newValue)
    }
    return diff / savedValues.length
}

function getCertainity(newValues, savedValues) {
    console.log("inside getCertainity")
    console.log(newValues)
    if (Array.isArray(newValues)) {
        // compare array of values (x, y, force, acceleration, ...)
        console.log("compare arrays")
        return null
    } else {
        // compare numbers (width, height, duration, ...)
        console.log("compare single numbers")

        // compute average diff
        var diff = 0
        var numberOfComparisons = 0
        for (var i = 0; i < savedValues.length; i++) {
            for (var j = 0; j < savedValues.length; j++) {
                if (i <= j) {
                    continue
                }
                console.log("Comparison between " + i + " and " + j + " --> " + compareNumber(savedValues[i], savedValues))
                diff += compareNumber(savedValues[i], savedValues)
                numberOfComparisons++
            }
        }
        var averageDiff = diff / numberOfComparisons
        var newDiff = compareNumber(newValues, savedValues)
        console.log("new Diff: " + newDiff)
        var certainity = newDiff < averageDiff ? 1 : averageDiff / newDiff
        return certainity
    }
}

function compareValues(newValues, savedValues, normalizeLength, normalizeMagnitude) {
    // console.log("Compare " + newValues + " with " + savedValues)
	var score = 0;
    newValues = normalize(JSON.parse(newValues), normalizeLength, normalizeMagnitude)

    var normalizedNew = normalize(newValues, normalizeLength, normalizeMagnitude)
	for (var i = 0; i < savedValues.length; i++) {
        var normalizedOld = normalize(JSON.parse(savedValues[i]), normalizeLength, normalizeMagnitude)
		var result

        try {
            result = dtw.compute(normalizedNew, normalizedOld) / normalizedNew.length;
        }
        catch(err) {
            console.log(err)
            return false;
        }
        // console.log(i, result)
		score = score + result
	}

	return score/savedValues.length
}

function combineScores(xScore, yScore, forceScore, accelerationScore, orientationScore, widthScore, heigthScore) {
    var result = 0
    var certainity = 0
    var numberOfScores = 0
    if (xScore) {
        result += xScore * 0.05
        numberOfScores++
    }
    if (yScore) {
        result += yScore * 0.25
        numberOfScores++
    }
    if (forceScore) {
        result += forceScore * 1000
        numberOfScores++
    }
    if (accelerationScore) {
        result += accelerationScore * 2
        numberOfScores++
    }
    if (orientationScore) {
        result += orientationScore * 2
        numberOfScores++
    }


    result += widthScore + heigthScore
    return result
}

function normalize(array, normalizeLength, normalizeMagnitude) {
    var normalized = array
    normalized[0] = normalized[0] ? normalized[0] : 0
    // if (normalizeMagnitude) {
    //     normalized = normMagnitude(normalized)
    //
    // }
    // if (normalizeLength) {
    //     normalized = normLinear(normalized)
    // }

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
