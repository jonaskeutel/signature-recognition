'use strict'

module.exports = {
	computeDTWResultNormal: computeDTWResultNormal,
	computeDTWResultFiltered: computeDTWResultFiltered
}

var DTW = require('dtw')
var dtw = new DTW()

function compare(newSignature, savedSignatures, callback) {
  	var newFeatures = featurizer.featurize(newSignature)
    var oldFeatures = []

  	for (var i = savedSignatures.length - 1; i >= 0; i--) {
  		oldFeatures.push(featurizer.featurize(savedSignatures[i]))
  	}
    // console.log("everything featurized")

    var result = calculateCertainitiesFromFeatures(newFeatures, oldFeatures)

	callback(result)
}

function calculateCertainitiesFromFeatures(newFeatures, oldFeatures) {
        // // console.log()
        // // console.log("-------------------------  x  --------------------------------")
        var xCertainity = getCertainity(newFeatures.x, oldFeatures.map(function(o){return o.x}))
        // // console.log()
        // // console.log()
        // // console.log("-------------------------  x slicing --------------------------------")
    	var xSlicingCertainity = dtw_slicing.getCertainity(newFeatures.x, oldFeatures.map(function(o){return o.x}))
        // // console.log()
        // // console.log()
        // // console.log("-------------------------  y  --------------------------------")
      	var yCertainity = getCertainity(newFeatures.y, oldFeatures.map(function(o){return o.y}))
        // // console.log()
        // // console.log()
        // // console.log("-------------------------  y slicing  --------------------------------")
        var ySlicingCertainity = dtw_slicing.getCertainity(newFeatures.y, oldFeatures.map(function(o){return o.y}))
        // // console.log()
        // // console.log()
        // // console.log("-------------------------  force  --------------------------------")
        var forceDTWCertainity = getCertainity(newFeatures.force, oldFeatures.map(function(o){return o.force}))
        // // console.log()
        // // console.log()
        // // console.log("-------------------------  force min/max  --------------------------------")
        var forceMinMaxCertainity = getMinMaxCertainity(newFeatures.minForce, newFeatures.maxForce, oldFeatures.map(function(o){return o.minForce}), oldFeatures.map(function(o){return o.maxForce}))
        // // console.log()
        // // console.log()
        // // console.log("-------------------------  acceleration  --------------------------------")
        var accelerationDTWCertainity = getCertainity(newFeatures.acceleration, oldFeatures.map(function(o){return o.acceleration}))
        // // console.log()
        // // console.log()
        // // console.log("-------------------------  acceleration min/max  --------------------------------")
        var accelerationMinMaxCertainity = getMinMaxCertainity(newFeatures.minAcceleration, newFeatures.maxAcceleration, oldFeatures.map(function(o){return o.minAcceleration}), oldFeatures.map(function(o){return o.maxAcceleration}))
        // // console.log()
        // // console.log()
        // // console.log("-------------------------  orientation  --------------------------------")
        var orientationCertainity = getCertainity(newFeatures.gyroscope, oldFeatures.map(function(o){return o.orientation}))
        // // console.log()
        // // console.log()
        // // console.log("-------------------------  width  --------------------------------")
        var widthCertainity = getCertainity(newFeatures.width, oldFeatures.map(function(o){return o.width}))
        // // console.log()
        // // console.log()
        // // console.log("-------------------------  height  --------------------------------")
        var heightCertainity = getCertainity(newFeatures.height, oldFeatures.map(function(o){return o.height}))
        // // console.log()
        // // console.log()
        // // console.log("-------------------------  duration  --------------------------------")
        var durationCertainity = getCertainity(newFeatures.duration, oldFeatures.map(function(o){return o.duration}))
        // // console.log()
        // // console.log()
        // // console.log("-------------------------  numStrokes  --------------------------------")
        var numStrokesCertainity = getNumStrokesCertainity(newFeatures.numStrokes, oldFeatures.map(function(o){return o.numStrokes}))
        // // console.log()
        // // console.log()
        // // console.log("Got all certainities")
        var combinedCertainity = combineCertainities(xCertainity, xSlicingCertainity, yCertainity, ySlicingCertainity, forceDTWCertainity, accelerationDTWCertainity, orientationCertainity, widthCertainity, heightCertainity, durationCertainity, numStrokesCertainity)
        // // console.log("combinedCertainity: ", combinedCertainity)
        // // console.log()
        // // console.log()
        var certainitySuccess = combinedCertainity >= CERTAINITY_THRESHOLD ? true : false

      	var result = {
            certainitySuccess: certainitySuccess,
            combinedCertainity: combinedCertainity,
            xCertainity: xCertainity,
    		xSlicingCertainity: xSlicingCertainity,
            yCertainity: yCertainity,
    		ySlicingCertainity: ySlicingCertainity,
            forceCertainity: forceDTWCertainity,
            accelerationCertainity: accelerationDTWCertainity,
            orientationCertainity: orientationCertainity,
            widthCertainity: widthCertainity,
            heightCertainity: heightCertainity,
            durationCertainity: durationCertainity,
            numStrokesCertainity: numStrokesCertainity,
      	}
        // // console.log("Result: " + result)
        return result
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
                if (!diff) {
                    continue
                }
                overallDiff += diff
                maxDiff = diff > maxDiff ? diff : maxDiff
                numberOfComparisons++
            }
        }
        newDiff = compareValues(newValues, savedValues)
        // console.log("new Diff:\t\t\t\t" + newDiff)
    } else {
        // compare numbers (width, height, duration, ...)

        for (var i = 0; i < savedValues.length; i++) {
            for (var j = 0; j < savedValues.length; j++) {
                if (i <= j) {
                    continue
                }
                var diff = compareNumber(savedValues[i], savedValues, true)
                overallDiff += diff
                maxDiff = diff > maxDiff ? diff : maxDiff
                numberOfComparisons++
            }
        }
        newDiff = compareNumber(newValues, savedValues, false)
        // console.log("new Diff:\t\t\t\t " + newDiff)
        var averageValue = averageOfArray(savedValues)
        var deviationFromAverageCertainity = 1 - (newDiff / averageValue)
        // console.log("average Value:\t\t\t\t " + averageValue)
        // console.log("deviationFromAverageCertainity:\t\t " + deviationFromAverageCertainity)
    }
    if (numberOfComparisons === 0) {
        return false
    }
    var averageDiff = overallDiff / numberOfComparisons
    var avgCertainity = newDiff < averageDiff ? 1 : averageDiff / newDiff
    var maxCertainity = newDiff < maxDiff ? 1 : maxDiff / newDiff
    var resultingCertainity = (avgCertainity + maxCertainity) / 2
    // console.log("Average diff:\t\t\t	 " + averageDiff)
    // console.log("Average certainity:\t\t\t " + avgCertainity)
    // console.log("Max diff:\t\t\t\t " + maxDiff)
    // console.log("Max certainity:\t\t\t\t " + maxCertainity)
    // console.log("resulting certainity:\t\t\t " + ((avgCertainity + maxCertainity) / 2))
    if (deviationFromAverageCertainity) {
        var weightedCertainityFromDeviation = (deviationFromAverageCertainity + resultingCertainity) / 2
        // console.log("weightedCertainityFromDeviation:\t " + weightedCertainityFromDeviation)
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
    // // console.log("Compare " + newValues + " with " + savedValues)
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
            // console.log(err)
            return false;
        }
        // // console.log(i, result)
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

    var minCertainity = numStrokes <= min ? numStrokes / min : 1 / (numStrokes / min)
    var maxCertainity = numStrokes <= max ? numStrokes / max : 1 / (numStrokes / max)
    var resultingCertainity = (minCertainity + maxCertainity) / 2
    // console.log("numStrokes: \t\t\t\t" + numStrokes)
    // console.log("min: \t\t\t\t\t" + min)
    // console.log("max: \t\t\t\t\t" + max)
    // console.log("minCertainity: \t\t\t\t" + minCertainity)
    // console.log("maxCertainity: \t\t\t\t" + maxCertainity)
    // console.log("resultingCertainity: \t\t\t" + resultingCertainity)
    if (numStrokes >= min && numStrokes <= max) {
        return 1
    }
    return resultingCertainity
}

function getMinMaxCertainity(newMin, newMax, savedMin, savedMax) {
    var delta = 0.0000000001 //to avoid division by 0
    newMin += delta
    newMax += delta
    savedMin = Math.min.apply(null, savedMin) + delta
    savedMax = Math.max.apply(null, savedMax) + delta
    // console.log(newMin, newMax, savedMin, savedMax)
    var minCertainity = newMin <= savedMin ? newMin / savedMin : 1 / (newMin / savedMin)
    var maxCertainity = newMax <= savedMax ? newMax / savedMax : 1 / (newMax / savedMax)
    // console.log("minCertainity: \t\t\t\t" + minCertainity)
    // console.log("maxCertainity: \t\t\t\t" + maxCertainity)
    if (!minCertainity || !maxCertainity) {
        return false
    }

    var resultingCertainity = (minCertainity + maxCertainity) / 2
    // console.log("resultingCertainity: \t" + resultingCertainity)
    return resultingCertainity
}

function combineCertainities(xCertainity, xSlicingCertainity, yCertainity, ySlicingCertainity, forceCertainity, accelerationCertainity, orientationCertainity, widthCertainity, heightCertainity, durationCertainity, numStrokesCertainity) {
    var certainity = 0
    var numberOfCertainities = 0
    var i = 0
    if (xCertainity) {
        certainity += xCertainity
        numberOfCertainities++
    }
		if (xSlicingCertainity) {
        certainity += xSlicingCertainity
        numberOfCertainities++
    }
    if (yCertainity) {
        certainity += yCertainity
        numberOfCertainities++
    }
		if (ySlicingCertainity) {
        certainity += ySlicingCertainity
        numberOfCertainities++
    }
    if (forceCertainity) {
        certainity += 5 * forceCertainity
        numberOfCertainities += 5
    }
    if (accelerationCertainity) {
        certainity += 2 * accelerationCertainity
        numberOfCertainities += 2
    }
    if (orientationCertainity) {
        certainity += 0.1 * orientationCertainity
        numberOfCertainities += 0.1
    }
    if (widthCertainity) {
        certainity += 3 * widthCertainity
        numberOfCertainities += 3
    }
    if (heightCertainity) {
        certainity += 10 * heightCertainity
        numberOfCertainities += 10
    }
    if (durationCertainity) {
        certainity += 10 * durationCertainity
        numberOfCertainities += 10
    }
    if (numStrokesCertainity) {
        certainity += 10 * numStrokesCertainity
        numberOfCertainities += 10
    }

    if (numberOfCertainities === 0) {
        return 0
    }
    return certainity / numberOfCertainities
}

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
