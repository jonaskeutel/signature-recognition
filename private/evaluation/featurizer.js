'use strict'

module.exports = {
	featurize: featurize,
    featuresToArray: featuresToArray
}

/*
  TODO:
    rasterize
    numForceSpikes
    numAccelerationSpikes
 */
function featurize(signature) {
    var force = JSON.parse(signature.x)
    var minForce = Math.min.apply(null, force)
    var maxForce = Math.max.apply(null, force)

    var acceleration = JSON.parse(signature.acceleration)
    var minAcceleration = Math.min.apply(null, acceleration)
    var maxAcceleration = Math.max.apply(null, acceleration)

    var orientation = JSON.parse(signature.gyroscope)
    var minOrientation = Math.min.apply(null, orientation)
    var maxOrientation = Math.max.apply(null, orientation)

    return {
        x: JSON.parse(signature.x),
        y: JSON.parse(signature.y),
        force: force,
        minForce: minForce,
        maxForce, maxForce,
        acceleration: acceleration,
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
    //TODO: rasterize
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
