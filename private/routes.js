'use strict'

const user  = require(__dirname + "/routes/user.js")
const signature  = require(__dirname + "/routes/signature.js")

module.exports = function(app) {

  /**
    *  GET: :return_to - either 'register' or 'settings'
    */
  // app.route('/api/endpoint')
  //   .get(function(req, res) {
  //
  //   })
  //   .post(function(req, res){
  //
  //   })

  app.route('/api/user')
    .post(user.newUser)
    .get(user.getUser)

  app.route('/api/user/all')
    .get(user.getAllUser)

  app.route('/api/signature')
    .post(signature.newSignature)
    .get(signature.getSignature)

  // app.route('/api/checkSignature')
  //   .post(signature.checkSignature)
}
