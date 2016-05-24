const db  = require(__dirname + "/../database/dbinterface.js")

module.exports = {
  newUser: newUser,
  getUser: getUser,
  getAllUser: getAllUser
}

function newUser(req, res){
  if(!req.body.name || !req.body.age || !req.body.gender || !req.body.hand) {
        return res.json({"status": "error", "message": "missing a parameter"})
    } else {
    	var newUser = {
    		name: req.body.name,
    		age: req.body.age,
    		gender: req.body.gender,
    		hand: req.body.hand
    	}
    	db.newUser(newUser, function(err) {
    		if (err) {
    			return res.json({"status": "error", "message": "user not created"})
    		}
    		return res.json({"status": "success", "message": "user successfully created"})
    	})
    }
}

function getUser(req, res){
  if(!req.body.id) {
        return res.send({"status": "error", "message": "missing a parameter"})
    } else {
    	return res.json(db.getUser(req.body.id))
    }
}

function getAllUser(req, res){
    return res.json(db.getAllUser)
}