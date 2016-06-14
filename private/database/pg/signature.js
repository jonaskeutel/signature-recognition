'use strict'
const global        = require( __dirname + '/global.js')
const q             = require('q')

module.exports = {
  insert: insert,
  get: get
}

function insert(signature) {
  const deferred = q.defer()

  global.instance.query("INSERT INTO " + global.tables.signature + " (personID, x, y, force, acceleration, gyroscope, duration, width, height) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING personID", signature, function(err, result){
    if (err) {
      console.log('DB error (signature - insert):', err)
      deferred.reject(err)
    } else {
      console.log('signature inserted for user: ' + result.rows[0].personid);
      deferred.resolve()
    }
  })

  return deferred.promise
}

function get(personID) {
  const deferred = q.defer()

  global.instance.query('SELECT * FROM ' + global.tables.signature + ' WHERE personID=' + personID, function(err, result){
    if (err) {
      console.log('DB error (signature - get):', err)
      deferred.reject(err)
    } else {
      deferred.resolve(result.rows)
    }
  })

  return deferred.promise
}
