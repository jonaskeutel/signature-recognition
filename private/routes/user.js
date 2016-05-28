'use strict'
const db  = require(__dirname + "/../database/dbinterface.js")

module.exports = {
  newUser: newUser,
  getUser: getUser,
  getAllUser: getAllUser
}

function newUser(req, res) {
  if(!req.body.name || !req.body.age || !req.body.gender || !req.body.hand) {
    return res.json({"status": "error", "message": "missing a parameter"})
  } else {
  	var newUser = [
  		req.body.name,
  		req.body.age,
  		req.body.gender,
  		req.body.hand
  	]
    db.newUser(newUser)
      .then(function() {
        return res.json({"status": "success", "message": "user successfully created"})
      }, function(err) {
        return res.json({"status": "error", "message": "user not created"})
      })
  }
}

function getUser(req, res) {
  if(!req.query.id) {
    return res.json({"status": "error", "message": "missing parameter 'id'"})
  } else {
    db.getUser(req.query.id)
      .then(function(user) {
        return res.json(user)
      }, function(err) {
        return res.json({"status": "error", "message": "DB error getUser"})
      })
  }
}

function getAllUser(req, res) {
  db.getAllUser()
    .then(function(users) {
      return res.json(users)
    }, function(err) {
      return res.json({"status": "error", "message": "DB error getAllUser"})
    })
}