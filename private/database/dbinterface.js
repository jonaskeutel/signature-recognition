'use strict'
const dbPath = './pg'
// const dbPath = __dirname + '/rethinkdb'

//import necessary modules
const global = require( dbPath + '/global.js')
const user = require( dbPath + '/user.js')
const signature = require( dbPath + '/signature.js')

module.exports = {
  init: global.init,
  
  // User-related
  newUser: user.insert, 	// pass user object
  getUser: user.get, 		// find by id
  getAllUser: user.all,

  // Signature-related
  newSignature: signature.insert,	// pass signature object
  getSignature: signature.get	// pass signature object
}


