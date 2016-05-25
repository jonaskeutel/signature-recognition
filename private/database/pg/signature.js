'use strict'
const global        = require( __dirname + '/global.js')
const q             = require('q')

module.exports = {
  insert: insert,
  get: get
}

function insert(signature, callback){
  global.instance.query('INSERT INTO ' + global.tables.signature + ' (id) VALUES (' + signature.id + ')', function(err){
    if (err) {
      console.log(err)
    } else {
      callback(err)
    }
  })
}

function get(id, callback){
  let result = []
  global.instance.query('SELECT * FROM ' + global.tables.signature + ' WHERE id=' + id, function(err, result){
    if (err) {
      console.log(err)
    } else {
      callback(result.rows)
    }
  })
}