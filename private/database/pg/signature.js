'use strict'
const global        = require( __dirname + '/global.js')
const q             = require('q')

module.exports = {
  insert: insert,
  get: get
}

function insert(signature, callback){
  global.instance.query("INSERT INTO " + global.tables.signature + " (personID , x, y, force, acceleration, gyroscope, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING personID", signature, function(err, result){
    if (err) {
      console.log('DB error (signature - insert):', err)
    } else {
      console.log('signature inserted for user: ' + result.rows[0].personID);
      callback(err)
    }
  })
}

function get(personID, callback){
  let result = []
  global.instance.query('SELECT * FROM ' + global.tables.signature + ' WHERE personID=' + personID, function(err, result){
    if (err) {
      console.log('DB error (signature - get):', err)
    } else {
      callback(result.rows)
    }
  })
}