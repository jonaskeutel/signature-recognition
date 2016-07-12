var neural_network  = require('./neural_network.js')
var db              = require('../database/dbInterface.js')
var fs              = require('fs')
var Canvas          = require('canvas')
var evaluation      = require('./evaluation.js')
var q               = require('q')

db.init()
  .then( () => {

db.getAllUser()
  .then( (user) => {
    console.log(user)
    // db.getSignatures(66)
    //   .then( (signatures) => {
    //     featurizeSignatures(signatures)
    //   })
    train_all(user)
  })
})


function train_all(user){
  var promises = []
  for(var i=0; i<user.length; i++){
    promises.push( db.getSignatures(user[i].id) )
  }

  q.all(promises)
    .then( (result) => {
      var all = []

      for(var i=0; i<result.length; i++){
        var user_signs = []
        for(var j=0; j<result[i].length; j++){

          user_signs.push( featurize_signature( result[i][j] , null) )

        }
        all.push(user_signs)
      }

      var network = neural_network.create_all(all)
      // var check_sign = featurize_signature( result[0][0], null )

      for(var u=0; u<all.length;u++){
        console.log(u + '. User: ' + network.activate( all[u][0]) )
      }
    })
    .catch(console.log)
}

function featurizeSignatures(signatures){
  var newSignatures = []

  evaluation.compare(signatures[0], signatures)
    .then( dtw_result => {
            // console.log(dtw_result)
        //Put according vectors into one array to be passed
        for(var j=0; j<signatures.length-1; j++){
          newSignatures.push( featurize_signature(signatures[j], dtw_result) )
          console.log("After sign " + j + " / " + signatures.length)
        }

        var network = neural_network.create(newSignatures)
        // check_signature(66, signatures[signatures.length -1], network)
        var check_sign = featurize_signature( signatures[signatures.length -1], dtw_result )
            // console.log(check_sign)
            console.log('First: ' + network.activate(check_sign))

        db.getSignatures(67)
            .then( (signatures) => {
              console.log("check signature")
              check_signature(66, signatures[0], network)
            })
            .catch(console.log)
    })
  
}

function check_signature(user_id, signature, network){
  var deferred = q.defer()

  db.getSignatures(user_id)
      .then( (signatures) => {
        evaluation.compare(signature, signatures)
          .then( (dtw_result) => {
            // console.log("passed eval", dtw_result)
            var check_sign = featurize_signature( signature, dtw_result )
            // console.log(check_sign)
            console.log(network.activate(check_sign))
          })
          .catch(console.log)
      })

  return deferred.resolve()
}

function featurize_signature(signature, dtw_result){
  var tmp_sign = []

  // printSignature(signature)
  //Rasterize signature to pixel_density
  var c = drawSignature(signature)
  var rasterised = blackDensity(c, signature)

  tmp_sign = tmp_sign.concat(rasterised)
  // tmp_sign = tmp_sign.concat( [
  //   dtw_result.combinedScore, 
  //   dtw_result.x, 
  //   dtw_result.y,
  //   dtw_result.force
  // ])

  // for(var i=6; i< Object.keys( signature ).length; i++){
  //     var key = Object.keys( signature )[i]
  //     tmp_sign.push(signature[key])
  // }
  return tmp_sign
}



function drawSignature(signature){
  canvas = new Canvas(signature.width, signature.height)
  ctx = canvas.getContext('2d');
  signature.x = JSON.parse(signature.x)
  signature.y = JSON.parse(signature.y)
  signature.force = JSON.parse(signature.force)
  
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
  // fs.writeFile('out.svg', canvas.toBuffer());
  return canvas
}
function printSignature(signature){
  canvas = new Canvas(signature.width, signature.height, 'svg')
  ctx = canvas.getContext('2d');
  signature.x = JSON.parse(signature.x)
  signature.y = JSON.parse(signature.y)
  signature.force = JSON.parse(signature.force)
  
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
  fs.writeFile(Math.random()+'out.svg', canvas.toBuffer());
}
function thickness(force, thickness){thickness = thickness != null ? thickness : 5; return Math.max( thickness * force * force, 0.3 )}

const raster_width = 25
const raster_height = 25

function blackDensity(canvas, signature){
  var width_step = Math.ceil(signature.width / raster_width);
  var height_step = Math.ceil(signature.height / raster_height);
  var grid = create_grid(signature.width, signature.height)
  var vert_vector = grid[0]
  grid.splice(0,1)
  var image_data = canvas.getContext('2d').getImageData(0,0,signature.width, signature.height);
  // var densities = []
  var width = signature.width
  var height = signature.height
  var pixel_index = 0;
  console.log(canvas.width, canvas.height, height_step, width_step)
  // console.log(grid)
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

  // for(var y = 0; y<signature.height; y++){
  //     var y_index = y % height_step == 0 ? (y / height_step) : Math.max( Math.floor( (y / height_step) ), 0);
  //     y_index = Math.min(y_index, raster_height)
  //     if(y_index > densities.length-1){
  //       densities.push([])
  //     }
  //     for(var x=0; x<signature.width; x++){
  //       var x_index = x % width_step == 0 ? (x / width_step) : Math.max( Math.floor( (x / width_step) ), 0);
  //       x_index = Math.min(x_index, raster_width)
  //       if(x_index > densities[y_index].length-1){
  //         densities[y_index].push(0)
  //       }
  //       var pixel = y * signature.width * 4 + x * 4;
  //       var r = image_data.data[pixel]
  //       var g = image_data.data[pixel+1]
  //       var b = image_data.data[pixel+2]
  //       var alpha = image_data.data[pixel+3]
  //       if(r!=0 || g != 0 || b != 0 || alpha != 0){
  //         // console.log("Pixel at: " + x + " / " + y + " has (" + r +"/"+g+"/"+b+") - " + alpha)
  //         densities[y_index][x_index] += 1;
  //       }

  //     }
  // }
  
  // // Calc density and put into 1 array
  var result = []
  for(var row=0; row<densities.length; row++){
    for(var col=0; col<densities[row].length; col++){
      result.push(densities[row][col])
    }
  }
  console.log(densities.length + " / " + densities[1].length ," Result: " + result.length)
  return result
}

function create_grid(width, height){
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

  return [vert].concat(grid)
}

// console.log( create_grid(282, 107) )

function array_of_length(length, val){
  var arr = []
  for(var i=0; i<length; i++){
    arr.push(val)
  }
  return arr
}