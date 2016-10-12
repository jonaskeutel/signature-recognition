/**
 * This file wraps the processes to prepare the data that are passed to the neural network
 * It featurizes the signatures and initiates the training
 * It further more manages the created instance and offers an api to test a signature against the network
 */

const neural_network  = require('./neural_network.js')
const db              = require('../database/dbInterface.js')
const fs              = require('fs')
const Canvas          = require('canvas')
const evaluation      = require('./evaluation.js')
const q               = require('q')
const featurizer 			= require(__dirname + "/featurizer.js")

var network = null;

module.exports = {
  testSignature: testSign,
  init: function(){
    const deferred = q.defer()
    console.log(" -----  INIT NEURAL NETWORK -----")

    db.getAllUser()
      .then( (user) => {
        console.log(user)

        train_all(user)
          .then(deferred.resolve)

      })

    return deferred.promise
  },
  initFor: function(user){
    const deferred = q.defer()
    console.log(" -----  INIT NEURAL NETWORK FOR USER "+user.id+"-----")

    train_all([user])
      .then(deferred.resolve)

    return deferred.promise
  }
}

// Takes a signature and tests it against the existing signature
function testSign(signature){
    signature.width = parseInt(signature.width)
    signature.height = parseInt(signature.height)
    signature.duration = parseInt(signature.duration)
    signature.strokes = parseInt(signature.strokes)

    signature = featurize_signature( signature , null)

    return network.activate(signature)
  }

function train_all(user){
  const deferred = q.defer()

  var promises = []
  for(var i=0; i<user.length; i++){
    promises.push( db.getSignatures(user[i].id) )
  }

  q.all(promises)
    .then( (result) => {
      var all = []
      
      for(var i=0; i<result.length; i++){
        var user_signs = []
        for(var j=1; j<result[i].length; j++){

          user_signs.push( featurize_signature( result[i][j] , null) )

        }
        all.push(user_signs)
      }
      console.log("Train network! with " + all.length)
      network = neural_network.create_all(all)

      deferred.resolve(network)
    })
    .catch(console.log)

    return deferred.promise
}


function check_signature(user_id, signature, network){
  var deferred = q.defer()

  db.getSignatures(user_id)
      .then( (signatures) => {
        evaluation.compare(signature, signatures)
          .then( (dtw_result) => {

            var check_sign = featurize_signature( signature, dtw_result )

            console.log(network.activate(check_sign))
          })
          .catch(console.log)
      })

  return deferred.resolve()
}

function featurize_signature(signature, dtw_result){
  var tmp_sign = []

  //Rasterize signature to pixel_density
  var c = drawSignature(signature)
  var rasterised = blackDensity(c, signature)

  tmp_sign = tmp_sign.concat(rasterised)

  tmp_sign.push(signature.height / signature.width)

  return tmp_sign
}

function array_average(arr){
  var sum = 0;
  var elems = 0;
  for(var i=0; i<arr.length; i++){
    if(arr[i] != null){
      sum += arr[i]
      elems++;
    }
  }
  return sum / Math.max(elems, 1)
}

// Uses node canvas to create an image of the existing signature data
function drawSignature(signature){
  try{
  canvas = new Canvas(signature.width, signature.height)
  ctx = canvas.getContext('2d');
  signature.x = typeof signature.x == 'object' ? signature.x : JSON.parse(signature.x)
  signature.y = typeof signature.y == 'object' ? signature.y : JSON.parse(signature.y) 
  signature.force = typeof signature.force == 'object' ? signature.force : JSON.parse(signature.force)
  
  var currTouch = signature
  for(var i=0; i<signature.x.length; i++){
      if(i==0 && currTouch.x[i] != null || currTouch.x[i] != null && currTouch.x[i-1] == null){
          ctx.beginPath();
          ctx.arc(currTouch.x[i], currTouch.y[i], thickness(currTouch.force[i], 10) , 0, 2 * Math.PI, false);  // a circle at the start
          ctx.fillStyle = 'black';
          ctx.fill();
          ctx.stroke();
      }else if(currTouch.x[i] != null ){
          ctx.beginPath();
          ctx.moveTo(currTouch.x[i-1], currTouch.y[i-1]);
          ctx.lineTo(currTouch.x[i], currTouch.y[i]);
          ctx.lineWidth = thickness(currTouch.force[i], null);
          ctx.strokeStyle = 'black';
          ctx.stroke();
      }
  }
  }catch(err){console.log(err)}

  return canvas
}

function thickness(force, thickness){thickness = thickness != null ? thickness : 5; return Math.max( thickness * force * force, 0.3 )}

const raster_width = 25
const raster_height = 25

// Takes the image of a signature and calculates the density of black pixels in a set Grid
function blackDensity(canvas, signature){
  
  try{
  var width_step = Math.ceil(signature.width / raster_width);
  var height_step = Math.ceil(signature.height / raster_height);
  var grid = create_grid(signature.width, signature.height)
  var vert_vector = grid[0]
  grid.splice(0,1)
  var image_data = canvas.getContext('2d').getImageData(0,0,signature.width, signature.height);
  
  var width = signature.width
  var height = signature.height
  var pixel_index = 0;

  var y_coord = 0;
  var x_coord = 0;
  var densities = []

  for(var row = 0; row<vert_vector.length; row++){
    var dens_row = array_of_length(raster_width, 0);
    for(var y = 0; y < vert_vector[row]; y++){
        
        for(var col=0; col < grid[row].length; col++){

          for(var x=0; x < grid[row][col]; x++ ){
            var pixel = y_coord * signature.width * 4 + x_coord * 4;
            var r = image_data.data[pixel]
            var g = image_data.data[pixel+1]
            var b = image_data.data[pixel+2]
            var alpha = image_data.data[pixel+3]
            dens_row[col] += alpha > 0 ? 1 : 0
            x_coord++;
            if( y == vert_vector[row] - 1 && x == grid[row][col]-1){
              dens_row[col] = dens_row[col] / ( vert_vector[row] * grid[row][col] ) 
            }
          }

        }
        x_coord = 0;
        y_coord++;
    }
    densities.push(dens_row)
  
  }
  }catch(err){console.log(err)}
  
  // Calc density and put into 1 array
  var result = []
  for(var row=0; row<densities.length; row++){
    for(var col=0; col<densities[row].length; col++){
      result.push(densities[row][col])
    }
  }

  return result
}

function create_grid(width, height){
  try{
  var grid = []
  var vert = []
  var width_step = Math.floor(width / raster_width);
  var height_step = Math.floor(height / raster_height);

  var left_width = width - width_step * raster_width
  var left_height = height - height_step * raster_height
  var remain_width = Math.floor( 1 /  ( ( width / raster_width ) - width_step ) )
  var remain_height = Math.floor( 1 / ( ( height / raster_height ) - height_step ) )

  for(var y =0; y<raster_height; y++){
    grid.push([])
    vert.push(height_step)
    if(remain_height && y % remain_height == 0 ){
      vert[y] += 1
      left_height--;
    }
    if(y == raster_height-1){
      vert[y] += left_height
    }
    left_row_elems = left_width
    for(var x=0; x<raster_width; x++ ){
      grid[y].push(width_step)
      if(remain_width && x % remain_width == 0 ){
        grid[y][x] += 1
        left_row_elems--;
      }
      if(x == raster_width-1){
        grid[y][x] += left_row_elems
      }
    }
  }
  }catch(err){console.log(err)}

  return [vert].concat(grid)
}

function array_of_length(length, val){
  var arr = []
  for(var i=0; i<length; i++){
    arr.push(val)
  }
  return arr
}