'use strict'

const user  = require(__dirname + "/routes/user.js")
const signature  = require(__dirname + "/routes/signature.js")

module.exports = function(app) {

  // parameter middleware that will run before the next routes
  app.param('userid', function(req, res, next, userid) {
      // save name to the request
      req.userid = userid;

      next();
  });

  app.route('/api/user')
    .post(user.newUser)
    .get(user.getUser)

  app.route('/api/user/all')
    .get(user.getAllUser)

  app.route('/api/signature/:userid')
    .post(signature.newSignature)
    .get(signature.getSignatures)

  app.route('/api/signature/check')
    .post(signature.checkSignature)
}
