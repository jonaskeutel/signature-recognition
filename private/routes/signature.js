const db  = require(__dirname + "/../database/dbinterface.js")

module.exports = {
  newSignature: newSignature,
  getSignature: getSignature
}

function newSignature(req, res){
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
    	db.newSignature(newSignature, function(err) {
    		if (err) {
    			return res.json({"status": "error", "message": "signature not created"})
    		}
    		return res.json({"status": "success", "message": "signature successfully created"})
    	})
    }
}

function getSignature(req, res){
  if(!req.query.personID) {
    return res.json({"status": "error", "message": "missing parameter 'personID'"})
  } else {
    db.getSignature(req.query.personID, function(result) {
      return res.json(result)
    })
  }
}