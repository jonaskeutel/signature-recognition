'use strict'
const q = require('q')
const dtw_evaluation = require(__dirname + "/dtw_evaluation.js")
const neural_network = require(__dirname + "/neural_network_wrapper.js")

module.exports = {
	compare: compare
}

function compare(newSignature, savedSignatures) {
  	const deferred = q.defer()

    var neural_probs = neural_network.test(newSignature)

    dtw_evaluation.compare(newSignature, savedSignatures, function(result){
        console.log("finished calculation: ", result)
      	deferred.resolve({
          dtw: result,
          neural: neural_probs 
        })

    })

    return deferred.promise
}
