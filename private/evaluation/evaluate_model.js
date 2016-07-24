var neural_network  = require('./neural_network_wrapper.js')
var db              = require('../database/dbInterface.js')
var evaluation      = require('./evaluation.js')
var q               = require('q')


db.init()
  .then(neural_network.init)
  .then(db.getAllUser)
  .then(function(user){
    evaluate_model(user)
  })

function evaluate_model(user){
  console.log("----------------- Evaluation with following user -------------------")
  console.log(user)

  var deferred = q.defer()
  var index = 0

  function process(){
    console.log("Evaluating user " + user[index].id)
    evaluate_user(user[index], index)
      .then(() =>{
        index += 1
        if(index < user.length){
          console.log("--------------------------------------------------------")
          process()
        }
      })
  }
  process()

  return deferred.promise
}

function evaluate_user(user, index){
  const deferred = q.defer()
  var promises = []

  db.getSignatures(user.id)
    .then( (signatures) => {
      if(signatures.length == 4){
        for(var i=0; i<signatures.length; i++){
          var other_signatures = []
          for(var j=0; j<signatures.length; j++){
            other_signatures.push(signatures[j])
          }
          other_signatures.splice(i,1)
          promises.push(evaluate_signature(signatures[i], other_signatures, index, i))
        }
      }
        // console.log("user with id " + user.id + " has " + signatures.length + " signatures")
    })

  setTimeout( () => {
    q.all(promises)
      .then( (results) => {
        var avg_dtw = 0;
        var avg_neural = 0;
        for(var i=0; i<results.length; i++){
          avg_dtw += results[i].dtw
          avg_neural += results[i].neural
        }
        avg_dtw = avg_dtw / results.length
        avg_neural = avg_neural / results.length
        console.log("Avg_DTW: " + avg_dtw + "\t Avg_Neural: " + avg_neural)
        deferred.resolve()
      })
      .catch(deferred.reject)
  }, 2000)

  return deferred.promise
}

function evaluate_signature(signature, other_signatures, index, local_index){
  const deferred = q.defer()

  evaluation.compare(signature, other_signatures)
    .done(function(result) {
            var neural = neural_network.testSignature(signature)
            // console.log('Neural: \t' + neural)
            
            console.log('[ ' + index + ' ]' +  '[ ' + local_index + ' ]' + 'DTW: \t' + result.dtw.combinedCertainity + '\t Neural: \t' + neural[index] )

            deferred.resolve({
              dtw: result.dtw.combinedCertainity,
              neural: neural[index]
            })
    })

  return deferred.promise
}

// evaluation.compare(req.body, savedSignatures).done(function(result) {
                      
//     if (result) {
//       console.log(result.dtw.combinedCertainity)
//       var neural = neural_network.testSignature(req.body)
//       console.log(neural)
//       var prob = (1 * result.dtw.combinedCertainity + 1 * neural[user_index] ) / 2;
//       console.log(prob, user_index)
//       return res.json({
//         probability: prob
//       })
//     }
// })