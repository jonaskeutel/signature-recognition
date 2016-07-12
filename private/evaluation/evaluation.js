'use strict'
const q = require('q')
const dtw_evaluation = require(__dirname + "/dtw_evaluation.js")

var neural_network = require("./neural_network_wrapper.js")
console.log(__dirname)
console.log("other: ", neural_network)
module.exports = {
	compare: compare
}

function compare(newSignature, savedSignatures) {
  	const deferred = q.defer()

   

    dtw_evaluation.compare(newSignature, savedSignatures, function(result){
        // console.log("finished calculation: ", result)
        // console.log(neural_network)
        // try{
        // var neural_probs = neural_network.testSignature(newSignature)
        
        // }catch(err){console.log(err)}

      	deferred.resolve({
          dtw: result,
        //   neural: neural_probs 
        })

    })

    return deferred.promise
}
