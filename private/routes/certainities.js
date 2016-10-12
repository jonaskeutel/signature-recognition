'use strict'
const db  = require(__dirname + "/../database/dbinterface.js")

module.exports = {
  newCertainities: newCertainities,
  getCertainities: getCertainities
}

function newCertainities(req, res) {
    if (!true) {
        return res.json({"status": "error", "message": "missing a parameter"})
    } else {
    	var newCertainities = []
    	db.newCertainities(newCertainities)
        .then(function() {
          return res.json({"status": "success", "message": "signature successfully created"})
        }, function(err) {
      	  return res.json({"status": "error", "message": err})
    	  })
    }
}

function getCertainities(req, res) {
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
