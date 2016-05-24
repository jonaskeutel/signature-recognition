'use strict'
const config = require( __dirname + '/../dbconfig.json').mysql

const db  = require('mysql');
const q   = require('q')

//Instance variable
var mysql = db.createPool({
  host     : config.host,
  user     : config.user,
  password : config.password
})

//Tables
let tables = {
  user: config.database + '.user',
}

module.exports = {
  init: setupDatabase,
  instance: mysql,
  tables: tables
}

function connect(){
  var deferred = q.defer()

  mysql.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      deferred.reject(err)
    }else{
      console.log('Connected to MySQL-DB');
      deferred.resolve()
    }
  });

  return deferred.promise
}

function createDatabase(){
  const deferred = q.defer()

  mysql.query('CREATE DATABASE IF NOT EXISTS '+config.database, function(err, result){
    if(err){
      console.log(err)
      deferred.reject(err)
    }else{
      deferred.resolve()
    }
  })

  return deferred.promise
}

function createUserTable(){
  const deferred = q.defer()
  const userTable = `Create Table ${tables.user} (
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
  )`
  mysql.query(userTable, function(err, result){
    if(err){
      if(err.code === 'ER_TABLE_EXISTS_ERROR'){
        updateUserTable()
          .then(deferred.resolve)
          .catch(deferred.reject)
      }else{
        console.log(err)
        deferred.reject(err)
      }
    }else{
      deferred.resolve()
    }
  })

  return deferred.promise
}


function setupDatabase () {
  return createDatabase()
      .then(createUserTable)
      
    .then( () => {
      console.log("Connected to Database")
      return mysql
    })
    .catch( err => {
      console.log("Database Error: ", err)
    })
}

