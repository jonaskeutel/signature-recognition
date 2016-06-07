'use strict'
const db  = require(__dirname + "/../database/dbinterface.js")
const evaluation = require(__dirname + "/../evaluation/evaluation.js")

module.exports = {
  newSignature: newSignature,
  getSignatures: getSignatures,
  checkSignature: checkSignature
}

function newSignature(req, res) {
  if(!req.body.personID || !req.body.x || !req.body.y || !req.body.force ||
    !req.body.acceleration || !req.body.gyroscope || !req.body.duration) {
        return res.json({"status": "error", "message": "missing a parameter"})
    } else {
    	var newSignature = [
    		req.body.personID,
    		req.body.x,
    		req.body.y,
        req.body.force,
        req.body.acceleration,
        req.body.gyroscope,
    		req.body.duration
    	]
    	db.newSignature(newSignature)
        .then(function() {
          return res.json({"status": "success", "message": "signature successfully created"})
        }, function(err) {
      	  return res.json({"status": "error", "message": "signature not created"})
    	  })
    }
}

function getSignatures(req, res) {
  if(!req.userid) {
    return res.json({"status": "error", "message": "missing parameter 'personID'"})
  } else {
    db.getSignatures(req.userid)
      .then(function(result) {
        return res.json(result)
      }, function(err) {
        return res.json({"status": "error", "message": "DB error getSignatures"})
      })
  }
}

function checkSignature(req, res) {
  console.log(req.body)
  if(!req.body.personid || !req.body.x || !req.body.y || !req.body.force ||
    !req.body.acceleration || !req.body.gyroscope || !req.body.duration) {
        return res.json({"status": "error", "message": "missing a parameter"})
    } else {
      db.getSignatures(25) //req.body.personid
        .then(function(savedSignatures) {
          evaluation.compare(req.body, savedSignatures).done(function(result) {
            if (result) {
              return res.json(result)
              // var newSignature = [
              //   req.body.personID,
              //   req.body.x,
              //   req.body.y,
              //   req.body.force,
              //   req.body.acceleration,
              //   req.body.gyroscope,
              //   req.body.duration
              // ]
              // db.newSignature(newSignature)
              //   .then(function() {
              //     return res.json({"status": "success", "message": "signature check successful and new signature successfully created"})
              //   }, function(err) {
              //     return res.json({"status": "error", "message": "signature check successful, but new signature not created"})
              //   })
            } else {
              return res.json({"status": "error", "message": "signature check not successful"})
            }
          })
        }, function(err) {
          return res.json({"status": "error", "message": "DB error getSignatures"})
        })
    }
}
