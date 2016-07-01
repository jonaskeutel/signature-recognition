'use strict'
const db  = require(__dirname + "/../database/dbinterface.js")

module.exports = {
  newCertainities: newCertainities,
  getCertainities: getCertainities
}

function newCertainities(req, res) {
    console.log(req.body)
    // if(!req.body.personid || !req.body.x || !req.body.y || !req.body.force ||
    // !req.body.acceleration || !req.body.gyroscope || !req.body.duration || !req.body.width || !req.body.height) {
    if (!true) {
        return res.json({"status": "error", "message": "missing a parameter"})
    } else {
    	var newCertainities = [] // TODO
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
    db.getSignatures(req.userid) //TODO
      .then(function(result) {
        return res.json(result)
      }, function(err) {
        return res.json({"status": "error", "message": "DB error getSignatures"})
      })
  }
}
