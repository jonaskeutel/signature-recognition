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
        db.getSignatures(66)
          .then( (signatures_2) => {
              dtw_slicing.compare(signatures_2[0], signatures_1, function(result) {
                console.log('# Result #');
                console.log('success:', result.success);
                console.log('combinedScore:', result.combinedScore);
                console.log('x:', result.x);
                console.log('y:', result.y);
              })
          })
      })
    })
})
