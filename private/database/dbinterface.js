'use strict'
const dbPath = './pg'

//import necessary modules
const global = require( dbPath + '/global.js')
const user = require( dbPath + '/user.js')
const signature = require( dbPath + '/signature.js')
const certainities = require( dbPath + '/certainities.js')

module.exports = {
  init: global.init,

  // User-related
  newUser: user.insert, 	// pass user object
  getUser: user.get, 		// find by id
  getAllUser: user.all,

  // Signature-related
  newSignature: signature.insert,	// pass signature object
  getSignatures: signature.get,		// pass signature object

  // certainity related
  newCertainities: certainities.insert,
  getCertainities: certainities.get
}
