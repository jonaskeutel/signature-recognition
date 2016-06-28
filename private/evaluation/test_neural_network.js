var neural_network  = require('./neural_network.js')
var db              = require('../database/dbInterface.js')
var fs              = require('fs')
var Canvas          = require('canvas')

db.init()
  .then( () => {

db.getAllUser()
  .then( (user) => {
    console.log(user)
    db.getSignatures(52)
      .then( (signatures) => {
        featurizeSignatures(signatures)
      })
  })
})

function featurizeSignatures(signatures){
  var newSignatures = []

  //Put according vectors into one array to be passed
  for(var j=0; j<signatures.length-1; j++){
    newSignatures.push( featurize_signature(signatures[j]) )
  }

  var network = neural_network.create(newSignatures)
  check_signature(signatures[signatures.length -1], network)
    
  db.getSignatures(47)
      .then( (signatures) => {
        check_signature(signatures[0], network)
      })
}

function check_signature(signature, network){
  var check_sign = featurize_signature( signature )
  console.log(network.activate(check_sign))
}

function featurize_signature(signature){
  var tmp_sign = []

  //Rasterize signature to pixel_density
  var c = drawSignature(signature)
  var rasterised = blackDensity(c, signature)

  tmp_sign = tmp_sign.concat(rasterised)

  for(var i=6; i< Object.keys( signature ).length; i++){
      var key = Object.keys( signature )[i]
      tmp_sign.push(signature[key])
  }
  
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
function thickness(force, thickness){thickness = thickness != null ? thickness : 5; return Math.max( thickness * force * force, 0.3 )}

function blackDensity(canvas, signature){
  var width_step = Math.floor(signature.width / 96);
  var height_step = Math.floor(signature.height / 8);
  var image_data = canvas.getContext('2d').getImageData(0,0,signature.width, signature.height);
  var densities = []
  var width = signature.width
  var height = signature.height
  var pixel_index = 0;
  console.log(canvas.width, canvas.height, height_step, width_step)
  for(var y = 0; y<signature.height; y++){
      var y_index = y % height_step == 0 ? (y / height_step) : Math.max( Math.floor( (y / height_step) ), 0);
      y_index = Math.min(y_index, 7)
      if(y_index > densities.length-1){
        densities.push([])
      }
      for(var x=0; x<signature.width; x++){
        var x_index = x % width_step == 0 ? (x / width_step) : Math.max( Math.floor( (x / width_step) ), 0);
        x_index = Math.min(x_index, 95)
        if(x_index > densities[y_index].length-1){
          densities[y_index].push(0)
        }
        var pixel = y * signature.width * 4 + x * 4;
        var r = image_data.data[pixel]
        var g = image_data.data[pixel+1]
        var b = image_data.data[pixel+2]
        var alpha = image_data.data[pixel+3]
        if(r!=0 || g != 0 || b != 0 || alpha != 0){
          // console.log("Pixel at: " + x + " / " + y + " has (" + r +"/"+g+"/"+b+") - " + alpha)
          densities[y_index][x_index] += 1;
        }

      }
  }
  
  // Calc density and put into 1 array
  var result = []
  for(var row=0; row<densities.length; row++){
    for(var col=0; col<densities[row].length; col++){
      var dens = densities[row][col] / ( width_step * height_step)
      result.push(dens)
    }
  }
  console.log(densities.length + " / " + densities[1].length ," Result: " + result.length)
  return result
}