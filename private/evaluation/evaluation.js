'use strict'

const q 											= require('q')
const dtw_evaluation 					= require(__dirname + "/dtw_evaluation.js")
const dtw_slicing_evaluation 	= require(__dirname + "/dtw_slicing_evaluation.js")
const featurizer 							= require(__dirname + "/featurizer.js")
const neural_network 					= require("./neural_network_wrapper.js")
// console.log(__dirname)
// console.log("other: ", neural_network)

// Configutation parameters
const CERTAINITY_THRESHOLD = 0.85
const DTW_NORMAL = computeDTWResultNormal
const DTW_FILTERED = computeDTWResultFiltered
const DTW_SLICING = computeDTWResultSlicing

module.exports = {
	compare: compare,
	getCertainity: getCertainity // for testing purposes
}

// DTW functions
function computeDTWResultNormal(normalizedNew, normalizedSaved) {
	return dtw_evaluation.computeDTWResultNormal(normalizedNew, normalizedSaved)
}

function computeDTWResultFiltered(normalizedNew, normalizedSaved) {
	return dtw_evaluation.computeDTWResultFiltered(normalizedNew, normalizedSaved)
}

function computeDTWResultSlicing(normalizedNew, normalizedSaved) {
	return dtw_slicing_evaluation.computeDTWResult(normalizedNew, normalizedSaved)
}

// Helper functions

function averageOfArray(arr) {
    var sum = 0
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i]
    }
    return sum / arr.length
}

function normalize(array) {
  var normalized = array
  normalized[0] = normalized[0] ? normalized[0] : 0

  return normalized
}

function computeDTWResult(func, args) {
	return func.apply(this, args)
}

// Comparison logic

function compare(newSignature, savedSignatures) {
  	const deferred = q.defer()

	var newFeatures = featurizer.featurize(newSignature)
    var savedFeatures = []

  	for (var i = savedSignatures.length - 1; i >= 0; i--) {
  		savedFeatures.push(featurizer.featurize(savedSignatures[i]))
  	}
    var result = calculateCertainitiesFromFeatures(newFeatures, savedFeatures)
	deferred.resolve({
		dtw: result
	})

	return deferred.promise
}

function calculateCertainitiesFromFeatures(newFeatures, savedFeatures) {
        // console.log()
        // console.log("-------------------------  x  --------------------------------")
        var xCertainity = getCertainity(newFeatures.x, savedFeatures.map(function(o){return o.x}), DTW_NORMAL)
        // console.log()
        // console.log()
				// console.log("-------------------------  x filtered  --------------------------------")
        var xFilteredCertainity = getCertainity(newFeatures.x, savedFeatures.map(function(o){return o.x}), DTW_FILTERED)
        // console.log()
        // console.log()
        // console.log("-------------------------  x slicing --------------------------------")
    		var xSlicingCertainity = getCertainity(newFeatures.x, savedFeatures.map(function(o){return o.x}), DTW_SLICING)
        // console.log()
        // console.log()
        // console.log("-------------------------  y  --------------------------------")
      	var yCertainity = getCertainity(newFeatures.y, savedFeatures.map(function(o){return o.y}), DTW_NORMAL)
        // console.log()
        // console.log()
				// console.log("-------------------------  y filtered  --------------------------------")
        var yFilteredCertainity = getCertainity(newFeatures.y, savedFeatures.map(function(o){return o.y}), DTW_FILTERED)
        // console.log()
        // console.log()
        // console.log("-------------------------  y slicing  --------------------------------")
        var ySlicingCertainity = getCertainity(newFeatures.y, savedFeatures.map(function(o){return o.y}), DTW_SLICING)
        // console.log()
        // console.log()
        // console.log("-------------------------  force  --------------------------------")
        var forceDTWCertainity = getCertainity(newFeatures.force, savedFeatures.map(function(o){return o.force}), DTW_NORMAL)
        // console.log()
        // console.log()
        // console.log("-------------------------  force min/max  --------------------------------")
        var forceMinMaxCertainity = getMinMaxCertainity(newFeatures.minForce, newFeatures.maxForce, savedFeatures.map(function(o){return o.minForce}), savedFeatures.map(function(o){return o.maxForce}))
        // console.log()
        // console.log()
        // console.log("-------------------------  acceleration  --------------------------------")
        var accelerationDTWCertainity = getCertainity(newFeatures.acceleration, savedFeatures.map(function(o){return o.acceleration}), DTW_NORMAL)
        // console.log()
        // console.log()
        // console.log("-------------------------  acceleration min/max  --------------------------------")
        var accelerationMinMaxCertainity = getMinMaxCertainity(newFeatures.minAcceleration, newFeatures.maxAcceleration, savedFeatures.map(function(o){return o.minAcceleration}), savedFeatures.map(function(o){return o.maxAcceleration}))
        // console.log()
        // console.log()
        // console.log("-------------------------  orientation  --------------------------------")
        var orientationCertainity = getCertainity(newFeatures.gyroscope, savedFeatures.map(function(o){return o.orientation}), DTW_NORMAL)
        // console.log()
        // console.log()
        // console.log("-------------------------  width  --------------------------------")
        var widthCertainity = getCertainity(newFeatures.width, savedFeatures.map(function(o){return o.width}))
        // console.log()
        // console.log()
        // console.log("-------------------------  height  --------------------------------")
        var heightCertainity = getCertainity(newFeatures.height, savedFeatures.map(function(o){return o.height}))
        // console.log()
        // console.log()
        // console.log("-------------------------  duration  --------------------------------")
        var durationCertainity = getCertainity(newFeatures.duration, savedFeatures.map(function(o){return o.duration}))
        // console.log()
        // console.log()
        // console.log("-------------------------  numStrokes  --------------------------------")
        var numStrokesCertainity = getNumStrokesCertainity(newFeatures.numStrokes, savedFeatures.map(function(o){return o.numStrokes}))
        // console.log()
        // console.log()
        // console.log("Got all certainities")
        var combinedCertainity = combineCertainities(xCertainity, xFilteredCertainity, xSlicingCertainity, yCertainity, yFilteredCertainity, ySlicingCertainity, forceDTWCertainity, accelerationDTWCertainity, orientationCertainity, widthCertainity, heightCertainity, durationCertainity, numStrokesCertainity)
        // console.log("combinedCertainity: ", combinedCertainity)
        // console.log()
        // console.log()
        var certainitySuccess = combinedCertainity >= CERTAINITY_THRESHOLD ? true : false

      	var result = {
            certainitySuccess: certainitySuccess,
            combinedCertainity: combinedCertainity,
            xCertainity: xCertainity,
    				xFilteredCertainity: xFilteredCertainity,
    				xSlicingCertainity: xSlicingCertainity,
            yCertainity: yCertainity,
    				yFilteredCertainity: yFilteredCertainity,
    				ySlicingCertainity: ySlicingCertainity,
            forceCertainity: forceDTWCertainity,
            accelerationCertainity: accelerationDTWCertainity,
            orientationCertainity: orientationCertainity,
            widthCertainity: widthCertainity,
            heightCertainity: heightCertainity,
            durationCertainity: durationCertainity,
            numStrokesCertainity: numStrokesCertainity,
      	}
        // console.log("Result: " + result)
        return result
}

function getCertainity(newValues, savedValues, dtwFunction) {
    var overallDiff = 0
    var numberOfComparisons = 0
    var maxDiff = 0
    var newDiff = 0
		if (dtwFunction == undefined) {
			dtwFunction = DTW_NORMAL
		}

    if (Array.isArray(newValues)) {
        // compare array of values (x, y, force, acceleration, ...)

        for (var i = 0; i < savedValues.length; i++) {
            for (var j = 0; j < savedValues.length; j++) {
                if (i <= j) {
                    continue
                }
                var diff = compareValues(savedValues[i], savedValues, dtwFunction)
                if (!diff) {
                    continue
                }
                overallDiff += diff
                maxDiff = diff > maxDiff ? diff : maxDiff
                numberOfComparisons++
            }
        }
				newDiff = compareValues(newValues, savedValues, dtwFunction)
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

function compareValues(newValues, savedValues, dtwFunction) {
	var score = 0;
  var normalizedNew = normalize(newValues)
	for (var i = 0; i < savedValues.length; i++) {
    var normalizedSaved = normalize(savedValues[i])
		var result = computeDTWResult(dtwFunction, [normalizedNew, normalizedSaved])
		if (typeof(result) == "boolean" && !result) {
			return false
		}
		score = score + result
	}

	return score/savedValues.length
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

function combineCertainities(xCertainity, xFilteredCertainity, xSlicingCertainity, yCertainity, yFilteredCertainity, ySlicingCertainity, forceCertainity, accelerationCertainity, orientationCertainity, widthCertainity, heightCertainity, durationCertainity, numStrokesCertainity) {
    var certainity = 0
    var numberOfCertainities = 0
    var i = 0

    if (xCertainity) {
        certainity += xCertainity
        numberOfCertainities++
    }
		if (xFilteredCertainity) {
        certainity += xFilteredCertainity
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
		if (yFilteredCertainity) {
        certainity += yFilteredCertainity
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
