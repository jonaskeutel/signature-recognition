'use strict'
const db  = require(__dirname + "/../database/dbinterface.js")

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
  if(!req.query.personID) {
    return res.json({"status": "error", "message": "missing parameter 'personID'"})
  } else {
    db.getSignatures(req.query.personID)
      .then(function(result) {
        return res.json(result)
      }, function(err) {
        return res.json({"status": "error", "message": "DB error getSignatures"})
      })
  }
}

function checkSignature(req, res) {
  if(!req.body.personID || !req.body.x || !req.body.y || !req.body.force ||
    !req.body.acceleration || !req.body.gyroscope || !req.body.duration) {
        return res.json({"status": "error", "message": "missing a parameter"})
    } else {
      db.getSignatures(req.body.personID)
        .then(function(result) {
          // do sth
          if (true) {
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
        }, function(err) {
          return res.json({"status": "error", "message": "DB error getSignatures"})
        })
    }
}