const db = require(__dirname + "/../database/dbinterface.js")

module.exports = {
  route: route
}

function route(req, res){
  res.send("Hello world!")
  db.getUser()
}