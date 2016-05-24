'use strict'
const dbPath = './mysql'
// const dbPath = __dirname + '/rethinkdb'

//import necessary modules
const global = require( dbPath + '/global.js')
const user = require( dbPath + '/user.js')

module.exports = {
  init: global.init,
  
  //User related DB-Action
  getUser: user.get, // @Param (email) -> user
  
}


