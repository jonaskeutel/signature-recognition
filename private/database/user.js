const rethinkdb = require('rethinkdb')
const q = require('q')

//Environment Variables
const port = 28015
const host = 'localhost'
const databaseName = 'nexboard'

function connectDb(){
	var deferred = q.defer()
	rethinkdb.connect(
		{
			host: host,
			port: port,
			db: databaseName
		},
		function (error, conn) {
			if (error)
				throw error

			console.log("Connected to RethinkDB Server")
			deferred.resolve(conn)
		}
	)
	return deferred.promise
}

function insertUser(user){
	connectDb()
		.then(function(conn){
			rethinkdb.table("user").insert(user).run(conn)
		})
}

module.exports = {
	insertUser
}
