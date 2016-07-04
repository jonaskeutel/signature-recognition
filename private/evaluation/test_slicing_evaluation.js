var dtw_slicing  = require('./dtw_slicing_evaluation.js')
var db              = require('../database/dbInterface.js')
var fs              = require('fs')

db.init()
  .then( () => {

db.getAllUser()
  .then( (user) => {
    console.log(user)
    db.getSignatures(66)
      .then( (signatures_1) => {
        db.getSignatures(65)
          .then( (signatures_2) => {
            var savedX = []
            var savedY = []
            for (var i = signatures_1.length - 1; i >= 0; i--) {
          		savedX.push(JSON.parse(signatures_1[i].x))
          		savedY.push(JSON.parse(signatures_1[i].y))
            }
            var certainity = dtw_slicing.getCertainity(JSON.parse(signatures_2[0].x), savedX)
            console.log('certainity:', certainity);
          })
      })
    })
})
