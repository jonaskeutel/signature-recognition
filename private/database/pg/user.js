'use strict'
const global        = require( __dirname + '/global.js')
const q             = require('q')

module.exports = {
  get: getUser,
  insert: insertUser
}

function getUser(id, callback){
  let result = []
  global.instance.query('SELECT * FROM testUser;')
    .on('row', function(row) {
      result.push(row)
    })
    .on('end', function() {
      callback(result)
    })
}

function insertUser(user){
  const deferred = q.defer()
  
  global.instance.query('INSERT INTO ' + global.tables.user + ' SET ?', user, function(err, result){
    if(err){
      console.log(err)
      deferred.reject(err)
    }else{

      deferred.resolve()
    }
  })

  return deferred.promise
}
