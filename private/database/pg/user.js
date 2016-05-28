'use strict'
const global        = require( __dirname + '/global.js')
const q             = require('q')

module.exports = {
  insert: insert,
  get: get,
  all: all
}

function insert(user){
  const deferred = q.defer()

  global.instance.query("INSERT INTO " + global.tables.user + " (name, age, gender, hand) VALUES ($1, $2, $3, $4) RETURNING id", user, function(err, result){
    if (err) {
      console.log('DB error (user - insert):', err)
      deferred.reject(err)
    } else {
      console.log('user inserted with id: ' + result.rows[0].id);
      deferred.resolve()
    }
  })

  return deferred.promise
}

function get(id) {
  const deferred = q.defer()

  global.instance.query('SELECT * FROM ' + global.tables.user + ' WHERE id=' + id, function(err, result){
    if (err) {
      console.log('DB error (user - get):', err)
      deferred.reject(err)
    } else {
      deferred.resolve(result.rows)
    }
  })

  return deferred.promise
}

function all(callback) {
  const deferred = q.defer()

  global.instance.query('SELECT * FROM '+ global.tables.user, function(err, result){
    if (err) {
      console.log('DB error (user- all):', err)
      deferred.reject(err)
    } else {
      deferred.resolve(result.rows)
    }
  })

  return deferred.promise
}