'use strict'
const q = require('q')
const dtw_evaluation = require(__dirname + "/dtw_evaluation.js")

module.exports = {
	compare: compare
}

function compare(newSignature, savedSignatures) {
  	const deferred = q.defer()

    dtw_evaluation.compare(newSignature, savedSignatures, function(result){
        console.log("finished calculation: ", result)
      	deferred.resolve(result)

    })


    return deferred.promise
}
