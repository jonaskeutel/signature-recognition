'use strict'

const data    = require(__dirname + "/data.js")
const sample  = require(__dirname + "/routes/sample.js")

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

  app.route('/api/data')
    .get(sample.route)
}
