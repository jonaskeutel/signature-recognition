const db  = require(__dirname + "/../database/dbinterface.js")

module.exports = {
  newSignature: newSignature,
  getSignature: getSignature
}

function newSignature(req, res){
  if(!req.body.name || !req.body.age || !req.body.gender || !req.body.hand) {
        return res.json({"status": "error", "message": "missing a parameter"})
    } else {
    	var newSignature = {
    		name: req.body.name,
    		age: req.body.age,
    		gender: req.body.gender,
    		hand: req.body.hand
    	}
    	db.newSignature(newSignature, function(err) {
    		if (err) {
    			return res.json({"status": "error", "message": "signature not created"})
    		}
    		return res.json({"status": "success", "message": "signature successfully created"})
    	})
    }
}

function getSignature(req, res){
  if(!req.query.id) {
    return res.send({"status": "error", "message": "missing parameter 'id'"})
  } else {
    db.getSignature(req.query.id, function(result) {
      return res.json(result)
    })
  }
}