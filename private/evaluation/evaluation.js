/**
 * Encapsulates the three dtw approaches:
 * normal (without preprocessing),
 * filtered (with preprocessing: remove NULL/undefined values from the series),
 * slicing (presented slicing approach)
 * Returns the computed result (certainities) of the three dtw approaches.
 */

'use strict'

const q 											= require('q')
const dtw_evaluation 					= require(__dirname + "/dtw_evaluation.js")
const dtw_slicing_evaluation 	= require(__dirname + "/dtw_slicing_evaluation.js")
const featurizer 							= require(__dirname + "/featurizer.js")
const neural_network 					= require("./neural_network_wrapper.js")

// Configutation parameters
// Threshold for the certainity determining if a signature with a certainity is accepted (if above CERTAINITY_THRESHOLD) or rejected (below CERTAINITY_THRESHOLD)
const CERTAINITY_THRESHOLD = 0.85
// Assign methods (to be called) to the according constants
const DTW_NORMAL = computeDTWResultNormal
const DTW_FILTERED = computeDTWResultFiltered
const DTW_SLICING = computeDTWResultSlicing

module.exports = {
	compare: compare,
	getCertainity: getCertainity // only exported for testing the evaluation with the test_evaluation.js, not needed for the frontend
}

// Make DTW functions available inside this file (assigned to constants which are declared above)
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

// Call according function determined by the constant
function computeDTWResult(func, args) {
	return func.apply(this, args)
}

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
				/**
				 * Compute the certainities for the three approaches (DTW_NORMAL, DTW_FILTERED, DTW_SLICING) for the
				 * dynamic features (x, y, force, acceleration, orientation), the certainities for the other features
				 * (number of strokes, width, height, duration), the combined Certainity and a passed/fail flag
				 */

        var xCertainity = getCertainity(newFeatures.x, savedFeatures.map(function(o){return o.x}), DTW_NORMAL)

        var xFilteredCertainity = getCertainity(newFeatures.x, savedFeatures.map(function(o){return o.x}), DTW_FILTERED)

        var xSlicingCertainity = getCertainity(newFeatures.x, savedFeatures.map(function(o){return o.x}), DTW_SLICING)

      	var yCertainity = getCertainity(newFeatures.y, savedFeatures.map(function(o){return o.y}), DTW_NORMAL)

        var yFilteredCertainity = getCertainity(newFeatures.y, savedFeatures.map(function(o){return o.y}), DTW_FILTERED)

        var ySlicingCertainity = getCertainity(newFeatures.y, savedFeatures.map(function(o){return o.y}), DTW_SLICING)

        var forceDTWCertainity = getCertainity(newFeatures.force, savedFeatures.map(function(o){return o.force}), DTW_NORMAL)

        var forceMinMaxCertainity = getMinMaxCertainity(newFeatures.minForce, newFeatures.maxForce, savedFeatures.map(function(o){return o.minForce}), savedFeatures.map(function(o){return o.maxForce}))

        var accelerationDTWCertainity = getCertainity(newFeatures.acceleration, savedFeatures.map(function(o){return o.acceleration}), DTW_NORMAL)

        var accelerationMinMaxCertainity = getMinMaxCertainity(newFeatures.minAcceleration, newFeatures.maxAcceleration, savedFeatures.map(function(o){return o.minAcceleration}), savedFeatures.map(function(o){return o.maxAcceleration}))

        var orientationCertainity = getCertainity(newFeatures.gyroscope, savedFeatures.map(function(o){return o.orientation}), DTW_NORMAL)

        var widthCertainity = getCertainity(newFeatures.width, savedFeatures.map(function(o){return o.width}))

        var heightCertainity = getCertainity(newFeatures.height, savedFeatures.map(function(o){return o.height}))

        var durationCertainity = getCertainity(newFeatures.duration, savedFeatures.map(function(o){return o.duration}))

        var numStrokesCertainity = getNumStrokesCertainity(newFeatures.numStrokes, savedFeatures.map(function(o){return o.numStrokes}))

        var combinedCertainity = combineCertainities(xCertainity, xFilteredCertainity, xSlicingCertainity, yCertainity, yFilteredCertainity, ySlicingCertainity, forceDTWCertainity, accelerationDTWCertainity, orientationCertainity, widthCertainity, heightCertainity, durationCertainity, numStrokesCertainity)

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
        // Compare array of values (x, y, force, acceleration, ...)

				// Compare already existing series (signatures) to determine the variance
				for (var i = 0; i < savedValues.length; i++) {
            for (var j = 0; j < savedValues.length; j++) {
                if (i <= j) {
                    continue
                }
                var diff = compareValues(savedValues[i], savedValues, dtwFunction)
                if (!diff) {
										// An error occured while comparing the values
                    continue
                }
								// Sum up the differences for the two compared series of a feature
                overallDiff += diff
								// Determine the maximum difference between the saved series
                maxDiff = diff > maxDiff ? diff : maxDiff
                numberOfComparisons++
            }
        }

				// Compare new signature values with the existing values
				newDiff = compareValues(newValues, savedValues, dtwFunction)
    } else {
        // Compare numbers (width, height, duration, ...)

				// Analogue to array comparison above
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
				// Compute average of saved values in order to determine the deviation of the new values to the existing values
        var averageValue = averageOfArray(savedValues)
        var deviationFromAverageCertainity = 1 - (newDiff / averageValue)
    }
    if (numberOfComparisons === 0) {
        return false
    }
		// Compute the average difference between the series and compute a certainity from the new and the average differences
    var averageDiff = overallDiff / numberOfComparisons
    var avgCertainity = newDiff < averageDiff ? 1 : averageDiff / newDiff
    var maxCertainity = newDiff < maxDiff ? 1 : maxDiff / newDiff
    var resultingCertainity = (avgCertainity + maxCertainity) / 2
		// Take the deviation from the average certainity into account (retrieve weighted certainity)
    if (deviationFromAverageCertainity) {
        var weightedCertainityFromDeviation = (deviationFromAverageCertainity + resultingCertainity) / 2
        return weightedCertainityFromDeviation
    }
    return resultingCertainity
}

function compareValues(newValues, savedValues, dtwFunction) {
	var score = 0;
	// Normalize the new values
  var normalizedNew = normalize(newValues)
	for (var i = 0; i < savedValues.length; i++) {
		// Normalize each existing series of the feature and apply dtw
    var normalizedSaved = normalize(savedValues[i])
		var result = computeDTWResult(dtwFunction, [normalizedNew, normalizedSaved])
		if (typeof(result) == "boolean" && !result) {
			// An error occured while applying dtw
			return false
		}
		// Sum up single dtw results and calculate the average
		score = score + result
	}
	return score / savedValues.length
}

function compareNumber(newValue, savedValues, includesSelf) {
		// Sum up single differences and calculate the average
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
		// Determine certainity for number of strokes
    var min = Infinity
    var max = 0
    for (var i = 0; i < savedNumStrokes.length; i++) {
        min = savedNumStrokes[i] < min ? savedNumStrokes[i] : min
        max = savedNumStrokes[i] > max ? savedNumStrokes[i] : max
    }

    var minCertainity = numStrokes <= min ? numStrokes / min : 1 / (numStrokes / min)
    var maxCertainity = numStrokes <= max ? numStrokes / max : 1 / (numStrokes / max)
    var resultingCertainity = (minCertainity + maxCertainity) / 2
    if (numStrokes >= min && numStrokes <= max) {
        return 1
    }
    return resultingCertainity
}

function getMinMaxCertainity(newMin, newMax, savedMin, savedMax) {
		// Calculate certainity for the minimum and the maximum of the acceleration values
    var delta = 0.0000000001 // to avoid division by 0
    newMin += delta
    newMax += delta
    savedMin = Math.min.apply(null, savedMin) + delta
    savedMax = Math.max.apply(null, savedMax) + delta
    var minCertainity = newMin <= savedMin ? newMin / savedMin : 1 / (newMin / savedMin)
    var maxCertainity = newMax <= savedMax ? newMax / savedMax : 1 / (newMax / savedMax)
    if (!minCertainity || !maxCertainity) {
        return false
    }

    var resultingCertainity = (minCertainity + maxCertainity) / 2
    return resultingCertainity
}

function combineCertainities(xCertainity, xFilteredCertainity, xSlicingCertainity, yCertainity, yFilteredCertainity, ySlicingCertainity, forceCertainity, accelerationCertainity, orientationCertainity, widthCertainity, heightCertainity, durationCertainity, numStrokesCertainity) {
		/**
		 * Sum up certainities of all features (for all saved series) and calulate final certainity
		 * weighting some features, e.g. force (*5) and acceleration (*2)
		 */
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
