var evaluation  = require('./evaluation.js')
var db          = require('../database/dbInterface.js')
var fs          = require('fs')

db.init()
  .then( () => {

db.getAllUser()
  .then( (user) => {
    console.log(user)
    db.getSignatures(84)
      .then( (signatures_1) => {
        db.getSignatures(84)
          .then( (signatures_2) => {
            var savedX = []
            var savedY = []
            for (var i = signatures_1.length - 1; i >= signatures_1.length - 1; i--) {
          		savedX.push(JSON.parse(signatures_1[i].x))
          		savedY.push(JSON.parse(signatures_1[i].y))
            }
            var certainity = evaluation.getCertainity(JSON.parse(signatures_2[0].y), savedY, true)
            console.log('certainity:', certainity)
          })
      })
    })
})
