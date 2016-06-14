var neural_network = require('./neural_network.js')
var db = require('../database/dbInterface.js')

db.init()
  .then( () => {

db.getAllUser()
  .then( (user) => {
    db.getSignatures(user[0].id)
      .then( (signatures) => {
        featurizeSignatures(signatures)
      })
  })
})

function featurizeSignatures(signatures){
  var newSignatures = []
  for(var j=0; j<signatures.length; j++){
    var tmp_sign = []
    for(var i=6; i< Object.keys( signatures[j] ).length; i++){
        var key = Object.keys( signatures[j] )[i]
        tmp_sign.push(signatures[j][key])
    }
    newSignatures.push(tmp_sign)
  }

  neural_network.create(newSignatures)
    .then( (network) => {

    })
}