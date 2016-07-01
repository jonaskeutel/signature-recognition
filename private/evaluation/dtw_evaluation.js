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
    var savedNumStrokes = []

  	for (var i = savedSignatures.length - 1; i >= 0; i--) {
  		savedX.push(JSON.parse(savedSignatures[i].x))
  		savedY.push(JSON.parse(savedSignatures[i].y))
        savedForce.push(JSON.parse(savedSignatures[i].force))
        savedWidth.push(savedSignatures[i].width)
        savedHeight.push(savedSignatures[i].height)
        savedAcceleration.push(JSON.parse(savedSignatures[i].acceleration))
        savedOrientation.push(JSON.parse(savedSignatures[i].gyroscope))
        savedDuration.push(savedSignatures[i].duration)
        savedNumStrokes.push(savedSignatures[i].strokes)
  	}
    console.log("everything parsed for savedSignatures")

    // var xResult = compareValues(newSignature.x, savedX, true, true)
    // console.log("got xResult (numeric)")
 //  	var yResult = compareValues(newSignature.y, savedY, true, true)
    // var forceResult = compareValues(newSignature.force, savedForce, true, false)
    // var accelerationResult = compareValues(newSignature.acceleration, savedAcceleration, true, false)
    // var orientationResult = compareValues(newSignature.gyroscope, savedOrientation, true, false)
    // var widthResult = compareNumber(newSignature.width, savedWidth)
    // var heightResult = compareNumber(newSignature.width, savedHeight)

    console.log()
    console.log("-------------------------  x  --------------------------------")
    var xCertainity = getCertainity(JSON.parse(newSignature.x), savedX)
    console.log()
    console.log()
    console.log("-------------------------  y  --------------------------------")
  	var yCertainity = getCertainity(JSON.parse(newSignature.y), savedY)
    console.log()
    console.log()
    console.log("-------------------------  force  --------------------------------")
    var forceCertainity = getCertainity(JSON.parse(newSignature.force), savedForce)
    console.log()
    console.log()
    console.log("-------------------------  acceleration  --------------------------------")
    var accelerationCertainity = getCertainity(JSON.parse(newSignature.acceleration), savedAcceleration)
    console.log()
    console.log()
    console.log("-------------------------  orientation  --------------------------------")
    var orientationCertainity = getCertainity(JSON.parse(newSignature.gyroscope), savedOrientation)
    // console.log("new width: " + newSignature.width + " ; old widths: " + savedWidth)
    console.log()
    console.log()
    console.log("-------------------------  width  --------------------------------")
    var widthCertainity = getCertainity(newSignature.width, savedWidth)
    console.log()
    console.log()
    console.log("-------------------------  height  --------------------------------")
    var heightCertainity = getCertainity(newSignature.height, savedHeight)
    console.log()
    console.log()
    console.log("-------------------------  duration  --------------------------------")
    var durationCertainity = getCertainity(newSignature.duration, savedDuration)
    console.log()
    console.log()
    console.log("-------------------------  numStrokes  --------------------------------")
    var numStrokesCertainity = getNumStrokesCertainity(newSignature.strokes, savedNumStrokes)
    console.log()
    console.log()
    // console.log("Got all certainities")
    var combinedCertainity = combineCertainities(xCertainity, yCertainity, forceCertainity, accelerationCertainity, orientationCertainity, widthCertainity, heightCertainity, durationCertainity, numStrokesCertainity)
    console.log("combinedCertainity: ", combinedCertainity)
    console.log()
    console.log()
    var certainitySuccess = combinedCertainity > 0.8 ? true : false

    //  	var combinedScore = combineScores(xResult, yResult, forceResult, accelerationResult, orientationResult, widthResult, heightResult)
 //  	var success = combinedScore < SCORE_THRESHOLD ? true : false
    // console.log("allright so far, now construct result object")


        // scoreSuccess: success,
// 		combinedScore: combinedScore,
// 		x: xResult,
// 		y: yResult,
    // height: heightResult,
    // width: widthResult,
// 		acceleration: null,
// 		gyroscope: null,
// 		force: forceResult,
  	var result = {
        certainitySuccess: certainitySuccess,
        combinedCertainity: combinedCertainity,
        xCertainity: xCertainity,
        yCertainity: yCertainity,
        forceCertainity: forceCertainity,
        accelerationCertainity: accelerationCertainity,
        orientationCertainity: orientationCertainity,
        widthCertainity: widthCertainity,
        heightCertainity: heightCertainity,
        durationCertainity: durationCertainity,
        numStrokesCertainity: numStrokesCertainity,
  	}
    // console.log("Result: " + result)
	callback(result)
}

function compareNumber(newValue, savedValues, includesSelf) {
    var diff = 0
    for (var i = 0; i < savedValues.length; i++) {
        diff += Math.abs(savedValues[i] - newValue)
    }
    if (includesSelf) {
        return diff / (savedValues.length - 1)
    }
    return diff / savedValues.length
}

function getCertainity(newValues, savedValues) {
    // console.log(newValues)
    var overallDiff = 0
    var numberOfComparisons = 0
    var maxDiff = 0
    var newDiff = 0

    if (Array.isArray(newValues)) {
        // compare array of values (x, y, force, acceleration, ...)

        for (var i = 0; i < savedValues.length; i++) {
            for (var j = 0; j < savedValues.length; j++) {
                if (i <= j) {
                    continue
                }
                var diff = compareValues(savedValues[i], savedValues)
                // console.log("Comparison between " + i + " and " + j + " --> " + diff)
                if (!diff) {
                    continue
                }
                overallDiff += diff
                maxDiff = diff > maxDiff ? diff : maxDiff
                numberOfComparisons++
            }
        }
        newDiff = compareValues(newValues, savedValues)
        console.log("new Diff:\t\t\t\t" + newDiff)
    } else {
        // compare numbers (width, height, duration, ...)

        // compute average diff
        for (var i = 0; i < savedValues.length; i++) {
            for (var j = 0; j < savedValues.length; j++) {
                if (i <= j) {
                    continue
                }
                var diff = compareNumber(savedValues[i], savedValues, true)
                // console.log("Comparison between " + i + " and " + j + " --> " + diff)
                overallDiff += diff
                maxDiff = diff > maxDiff ? diff : maxDiff
                numberOfComparisons++
            }
        }
        newDiff = compareNumber(newValues, savedValues, false)
        console.log("new Diff:\t\t\t\t " + newDiff)
        var averageValue = averageOfArray(savedValues)
        var deviationFromAverageCertainity = 1 - (newDiff / averageValue)
        console.log("average Value:\t\t\t\t " + averageValue)
        console.log("deviationFromAverageCertainity:\t\t " + deviationFromAverageCertainity)
    }
    if (numberOfComparisons === 0) {
        return false
    }
    var averageDiff = overallDiff / numberOfComparisons
    var avgCertainity = newDiff < averageDiff ? 1 : averageDiff / newDiff
    var maxCertainity = newDiff < maxDiff ? 1 : maxDiff / newDiff
    var resultingCertainity = (avgCertainity + maxCertainity) / 2
    console.log("Average diff:\t\t\t	 " + averageDiff)
    console.log("Average certainity:\t\t\t " + avgCertainity)
    console.log("Max diff:\t\t\t\t " + maxDiff)
    console.log("Max certainity:\t\t\t\t " + maxCertainity)
    console.log("resulting certainity:\t\t\t " + ((avgCertainity + maxCertainity) / 2))
    if (deviationFromAverageCertainity) {
        var weightedCertainityFromDeviation = deviationFromAverageCertainity * resultingCertainity
        console.log("weightedCertainityFromDeviation:\t " + weightedCertainityFromDeviation)
        return weightedCertainityFromDeviation
    }
    return resultingCertainity
}

function averageOfArray(arr) {
    var sum = 0
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i]
    }
    return sum / arr.length
}

function compareValues(newValues, savedValues, normalizeLength, normalizeMagnitude) {
    // console.log("Compare " + newValues + " with " + savedValues)
	var score = 0;
    // newValues = normalize(JSON.parse(newValues), normalizeLength, normalizeMagnitude)
    var normalizedNew = normalize(newValues, normalizeLength, normalizeMagnitude)
	for (var i = 0; i < savedValues.length; i++) {
        var normalizedOld = normalize(savedValues[i], normalizeLength, normalizeMagnitude)
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

function getNumStrokesCertainity(numStrokes, savedNumStrokes) {
    var min = Infinity
    var max = 0
    for (var i = 0; i < savedNumStrokes.length; i++) {
        min = savedNumStrokes[i] < min ? savedNumStrokes[i] : min
        max = savedNumStrokes[i] > max ? savedNumStrokes[i] : max
    }

    var minCertainity = numStrokes <= min ? numStrokes / min : 1 - (numStrokes / min)
    var maxCertainity = numStrokes <= max ? numStrokes / max : 1 - (numStrokes / max)
    var resultingCertainity = (minCertainity + maxCertainity) / 2
    console.log("numStrokes: \t\t\t\t" + numStrokes)
    console.log("min: \t\t\t\t\t" + min)
    console.log("max: \t\t\t\t\t" + max)
    console.log("minCertainity: \t\t\t\t" + minCertainity)
    console.log("maxCertainity: \t\t\t\t" + maxCertainity)
    console.log("resultingCertainity: \t\t\t" + resultingCertainity)
    if (numStrokes >= min && numStrokes <= max) {
        return 1
    }
    return resultingCertainity
}

function combineCertainities(xCertainity, yCertainity, forceCertainity, accelerationCertainity, orientationCertainity, widthCertainity, heightCertainity, durationCertainity, numStrokesCertainity) {
    var certainity = 0
    var numberOfCertainities = 0
    var i = 0
    if (xCertainity) {
        certainity += xCertainity
        numberOfCertainities++
    }
    if (yCertainity) {
        certainity += yCertainity
        numberOfCertainities++
    }
    if (forceCertainity) {
        certainity += forceCertainity
        numberOfCertainities++
    }
    if (accelerationCertainity) {
        certainity += accelerationCertainity
        numberOfCertainities++
    }
    if (orientationCertainity) {
        certainity += orientationCertainity
        numberOfCertainities++
    }
    if (widthCertainity) {
        certainity += widthCertainity
        numberOfCertainities++
    }
    if (heightCertainity) {
        certainity += heightCertainity
        numberOfCertainities++
    }
    if (durationCertainity) {
        certainity += durationCertainity
        numberOfCertainities++
    }
    if (numStrokesCertainity) {
        certainity += numStrokesCertainity
        numberOfCertainities++
    }

    if (numberOfCertainities === 0) {
        return 0
    }
    return certainity / numberOfCertainities
}

function combineScores(xScore, yScore, forceScore, accelerationScore, orientationScore, widthScore, heigthScore) {
    var result = 0
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
