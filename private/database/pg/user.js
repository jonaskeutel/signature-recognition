'use strict'
const global        = require( __dirname + '/global.js')
const q             = require('q')

module.exports = {
  insert: insert,
  get: get,
  all: all
}

function insert(user, callback){
  global.instance.query("INSERT INTO " + global.tables.user + " (name, age, gender, hand) VALUES ($1, $2, $3, $4) RETURNING id", user, function(err, result){
    if (err) {
      console.log('DB error (user - insert):', err)
    } else {
      console.log('user inserted with id: ' + result.rows[0].id);
      callback(err, result.rows[0].id)
    }
  })
}

function get(id, callback){
  let result = []
  global.instance.query('SELECT * FROM ' + global.tables.user + ' WHERE id=' + id, function(err, result){
    if (err) {
      console.log('DB error (user - get):', err)
    } else {
      callback(result.rows)
    }
  })
}

function all(callback){
  let result = []
  global.instance.query('SELECT * FROM '+ global.tables.user, function(err, result){
    if (err) {
      console.log('DB error (user- all):', err)
    } else {
      callback(result.rows)
    }
  })
}