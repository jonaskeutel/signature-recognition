'use strict'
const q = require('q')
const dtw_evaluation = require(__dirname + "/dtw_evaluation.js")

module.exports = {
	compare: compare
}

function compare(newSignature, savedSignatures) {
  	const deferred = q.defer()

  	var dtw_result = undefined
    dtw_evaluation.compare(req.body, savedSignatures, function(result){
      dtw_result = result
    })

  	deferred.resolve({
      dtw: dtw_result,
    })

	return deferred.promise
}
