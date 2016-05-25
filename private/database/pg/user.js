'use strict'
const global        = require( __dirname + '/global.js')
const q             = require('q')

module.exports = {
  insert: insert,
  get: get,
  all: all
}

function insert(user, callback){
  global.instance.query('INSERT INTO ' + global.tables.user + ' (id) VALUES (' + user.id + ')', function(err){
    if (err) {
      console.log(err)
    } else {
      callback(err)
    }
  })
}

function get(id, callback){
  let result = []
  global.instance.query('SELECT * FROM ' + global.tables.user + ' WHERE id=' + id, function(err, result){
    if (err) {
      console.log(err)
    } else {
      callback(result.rows)
    }
  })
}

function all(callback){
  let result = []
  global.instance.query('SELECT * FROM '+ global.tables.user, function(err, result){
    if (err) {
      console.log(err)
    } else {
      callback(result.rows)
    }
  })
}