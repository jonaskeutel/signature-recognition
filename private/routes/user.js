'use strict'
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
  	var newUser = [
  		req.body.name,
  		req.body.age,
  		req.body.gender,
  		req.body.hand
  	]
  	db.newUser(newUser, function(err, userId) {
  		if (err) {
  			return res.json({"status": "error", "message": "user not created"})
  		}
  		return res.json({"status": "success", "message": "user successfully created"})
  	})
  }
}

function getUser(req, res){
  if(!req.query.id) {
    return res.json({"status": "error", "message": "missing parameter 'id'"})
  } else {
  	db.getUser(req.query.id, function(user) {
      return res.json(user)
    })
  }
}

function getAllUser(req, res){
  db.getAllUser(function(users) {
    return res.json(users)
  })
}