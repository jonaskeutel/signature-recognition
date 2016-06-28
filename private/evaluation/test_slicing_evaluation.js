var dtw_slicing  = require('./dtw_slicing_evaluation.js')
var db              = require('../database/dbInterface.js')
var fs              = require('fs')

db.init()
  .then( () => {

db.getAllUser()
  .then( (user) => {
    console.log(user)
    db.getSignatures(52)
      .then( (signatures_1) => {
        db.getSignatures(47)
          .then( (signatures_2) => {
              dtw_slicing.compare(signatures_2[0], signatures_1, function(result) {
                console.log('finished');
              })
          })
      })
    })
})

// dtw_slicing.compare('abc', 'def', function(result) {
//   console.log(result);
// })
