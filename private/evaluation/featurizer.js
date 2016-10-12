'use strict'

module.exports = {
	featurize: featurize,
    featuresToArray: featuresToArray
}

const dtw_slicing_evaluation = require(__dirname + "/dtw_slicing_evaluation.js")

// Takes a signature and transforms it to a consistent format and further more only keeps relevant features
function featurize(signature) {
    var force = typeof signature.force == 'object' ? signature.force : JSON.parse(signature.force)
    force = force.map(function(elem){return elem != null})
    var minForce = Math.min.apply(null, force)
    var maxForce = Math.max.apply(null, force)
    var forceExtrema = getNumberOfPeakes(force)

    var acceleration = JSON.parse(signature.acceleration)
    acceleration = acceleration.map(function(elem){return elem != null})
    var minAcceleration = Math.min.apply(null, acceleration)
    var maxAcceleration = Math.max.apply(null, acceleration)
    var accelerationExtrema = getNumberOfPeakes(acceleration)

    var orientation = JSON.parse(signature.gyroscope)
    var minOrientation = Math.min.apply(null, orientation)
    var maxOrientation = Math.max.apply(null, orientation)

    return {
        x: typeof signature.x == 'object' ? signature.x : JSON.parse(signature.x),
        y: typeof signature.y == 'object' ? signature.y : JSON.parse(signature.y),
        force: force,
        forceMinPeakes: forceExtrema.min != null ? forceExtrema.min : 0,
        forceMaxPeakes: forceExtrema.max != null ? forceExtrema.max : 0,
        minForce: minForce,
        maxForce: maxForce,
        acceleration: acceleration,
        accelerationMinPeakes: accelerationExtrema.min != null ? accelerationExtrema.min : 0,
        accelerationMaxPeakes: accelerationExtrema.max != null ? accelerationExtrema.max : 0,
        minAcceleration: minAcceleration,
        maxAcceleration: maxAcceleration,
        orientation: orientation,
        minOrientation: minOrientation,
        maxOrientation: maxOrientation,
        width: parseInt(signature.width),
        height: parseInt(signature.height),
        duration: parseInt(signature.duration),
        numStrokes: parseInt(signature.strokes),
    }
}

function featuresToArray(features) {
    // if we don't want to skip the data series for x, y, force, acceleration, orientation just delete these lines
    var skip = ['x', 'y', 'force', 'acceleration', 'orientation']
    var temp = []
    for (var prop in features) {
        if (features.hasOwnProperty(prop) && skip.indexOf(prop) == -1) {
            if (Array.isArray(features[prop])) {
                for (var i = 0; i < features[prop].length; i++) {
                    temp.push(features[prop][i])
                }
            } else {
                temp.push(features[prop])
            }
        }
    }
    return temp
}

function getNumberOfPeakes(arr) {
    arr = arr.filter(function(n){ return n != undefined })
    if (arr.length === 0) {
        return {
            min: 0,
            max: 0
        }
    }
    var arrNew = arr.map(function(n){
       return n*100;
    })
    var min_max_lists = dtw_slicing_evaluation.getExtrema(arrNew)
    return {
        min: min_max_lists.minlist.length,
        max: min_max_lists.maxlist.length
    }
}
