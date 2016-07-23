var evaluation  = require('./evaluation.js')
const dtw_evaluation 					= require(__dirname + "/dtw_evaluation.js")
const dtw_slicing_evaluation 	= require(__dirname + "/dtw_slicing_evaluation.js")
var db          = require('../database/dbInterface.js')
var fs          = require('fs')

function computeDTWResultNormal(normalizedNew, normalizedSaved) {
	 return dtw_evaluation.computeDTWResultNormal(normalizedNew, normalizedSaved)
}

function computeDTWResultFiltered(normalizedNew, normalizedSaved) {
	 return dtw_evaluation.computeDTWResultFiltered(normalizedNew, normalizedSaved)
}

function computeDTWResultSlicing(normalizedNew, normalizedSaved) {
	 return dtw_slicing_evaluation.computeDTWResult(normalizedNew, normalizedSaved)
}

const DTW_NORMAL = computeDTWResultNormal
const DTW_FILTERED = computeDTWResultFiltered
const DTW_SLICING = computeDTWResultSlicing

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
            var certainity = evaluation.getCertainity(JSON.parse(signatures_2[0].x), savedX, DTW_NORMAL)
            console.log('certainity normal:', certainity)
            var certainity = evaluation.getCertainity(JSON.parse(signatures_2[0].x), savedX, DTW_SLICING)
            console.log('certainity slicing:', certainity)
          })
      })
    })
})
