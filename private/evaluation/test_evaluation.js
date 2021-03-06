/**
 * Test file for testing the dtw computation for the three approaches.
 * Can be only called from the command line, not included in/needed for the frontend.
 */

const evaluation              = require('./evaluation.js')
const dtw_evaluation 					= require(__dirname + "/dtw_evaluation.js")
const dtw_slicing_evaluation 	= require(__dirname + "/dtw_slicing_evaluation.js")
const db                      = require('../database/dbInterface.js')
const fs                      = require('fs')

const DTW_NORMAL = computeDTWResultNormal
const DTW_FILTERED = computeDTWResultFiltered
const DTW_SLICING = computeDTWResultSlicing

function computeDTWResultNormal(normalizedNew, normalizedSaved) {
	 return dtw_evaluation.computeDTWResultNormal(normalizedNew, normalizedSaved)
}

function computeDTWResultFiltered(normalizedNew, normalizedSaved) {
	 return dtw_evaluation.computeDTWResultFiltered(normalizedNew, normalizedSaved)
}

function computeDTWResultSlicing(normalizedNew, normalizedSaved) {
	 return dtw_slicing_evaluation.computeDTWResult(normalizedNew, normalizedSaved)
}

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
            console.log('xCertainity normal:', certainity)
            var certainity = evaluation.getCertainity(JSON.parse(signatures_2[0].x), savedX, DTW_FILTERED)
            console.log('xCertainity filtered:', certainity)
            var certainity = evaluation.getCertainity(JSON.parse(signatures_2[0].x), savedX, DTW_SLICING)
            console.log('xCertainity slicing:', certainity)
            var certainity = evaluation.getCertainity(JSON.parse(signatures_2[0].y), savedY, DTW_NORMAL)
            console.log('yCertainity normal:', certainity)
            var certainity = evaluation.getCertainity(JSON.parse(signatures_2[0].y), savedY, DTW_FILTERED)
            console.log('yCertainity filtered:', certainity)
            var certainity = evaluation.getCertainity(JSON.parse(signatures_2[0].y), savedY, DTW_SLICING)
            console.log('yCertainity slicing:', certainity)
          })
      })
  })
})
