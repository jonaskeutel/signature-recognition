'use strict'
const dbPath = './pg'
// const dbPath = __dirname + '/rethinkdb'

//import necessary modules
const global = require( dbPath + '/global.js')
const user = require( dbPath + '/user.js')

module.exports = {
  init: global.init,
  
  // User-related
  newUser: user.insert, 	// pass user object
  getUser: user.get, 		// find by id
  getAllUser: user.getAll,

  // Signature-related
  // newSignature: signature.insert,	// pass signature object
  // checkSignature: signature.check 	// pass signature object
}


