'use strict'
const global        = require( __dirname + '/global.js')
const q             = require('q')

module.exports = {
  insert: insert,
  get: get
}

function insert(certainities) {
  const deferred = q.defer()

  global.instance.query("INSERT INTO " + global.tables.signature + " ((personID, xCertainity, xCertainitySliced, yCertainity, yCertainitySliced, forceCertainity, accelerationCertainity, orientationCertainity, widthCertainity, heightCertainity, durationCertainity, numStrokesCertainity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $12, $13) RETURNING personID", signature, function(err, result){
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

  global.instance.query('SELECT * FROM ' + global.tables.certainities + ' WHERE personID=' + personID, function(err, result){
    if (err) {
      console.log('DB error (signature - get):', err)
      deferred.reject(err)
    } else {
      deferred.resolve(result.rows)
    }
  })

  return deferred.promise
}
