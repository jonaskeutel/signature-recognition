'use strict'

module.exports = {
	featurize: featurize
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
        width: signature.width,
        height: signature.height,
        duration: signature.duration,
        numStrokes: signature.strokes,
    }
}
