'use strict';

var stylus        = require('stylus'),
    express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    path          = require('path'),
    q             = require('q'),
    port          = 7070,
    cookieParser  = require('cookie-parser'),
    neural_network = require(__dirname + "/private/evaluation/neural_network_wrapper.js")


const dbInit      = require(__dirname + '/private/database/pg/global.js')

// --- app configuration
app.use(cookieParser());
app.use(bodyParser.urlencoded({  extended: true }))
app.use(bodyParser.json())
app.use(stylus.middleware(path.join(__dirname, 'styles')))

app.use( express.static(__dirname + '/src') )
app.use( express.static(__dirname + '/node_modules') )

// --- route initialization
require('./private/routes.js')(app)

// Database initialization
dbInit.init()
  .then(neural_network.init)
  .then(function(){
       // --- server and https setup
      // app.listen(port)
      app.listen(process.env.PORT || port);
      console.log("Listens on Port " + port)
  })
  .catch(function(err){console.log(err)})




