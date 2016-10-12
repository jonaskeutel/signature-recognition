'use strict'
const config = require( __dirname + '/../dbconfig.json').pg

const db  = require('pg')
const q   = require('q')

//Tables
let tables = {
  user: 'person',
  signature: 'signature',
  certainities: 'certainities'
}

module.exports = {
  init: setupDatabase,
  instance: null,
  tables: tables
}

function connect() {
  var deferred = q.defer()
  console.log('Trying to connect...')
  db.defaults.ssl = true
  db.connect(config.url, function(err, client) {
    if (err) {
      console.error('error connecting: ' + err.stack)
      deferred.reject(err)
    } else {
      module.exports.instance = client
      console.log('Connected to postgres!')
      deferred.resolve()
    }
  });

  return deferred.promise
}

function setupDatabase () {
  return connect()

    .then( () => {
      console.log("Database set up!")
    })
    .catch( err => {
      console.log("DB setup error: ", err)
    })
}
