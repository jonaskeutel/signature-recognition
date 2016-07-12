const synaptic = require('synaptic'); // this line is not needed in the browser
const q        = require('q')

const Neuron = synaptic.Neuron
const Layer = synaptic.Layer
const Network = synaptic.Network
const Trainer = synaptic.Trainer
const Architect = synaptic.Architect;

module.exports = {
  create: newNetwork,
  create_all: newNetworkAll
}

// var historicMatch = {
//   'input': [43.2, 54.5],
//   'output': [1,0,0]
// }

// var future = { input: [ 31530, 390, 89 ] }

// var trainingSet = [ { input: [ 18500, 381, 89 ], output: [ 1 ] },
//   { input: [ 9380, 380, 68 ], output: [ 1 ] },
//   { input: [ 24940, 390, 89 ], output: [ 1 ] },
//    ]
// var network = new Architect.Perceptron(trainingSet[0].input.length, 6,6,1)
// var trainer = new Trainer(network)

// trainer.train(trainingSet, {
//   rate: .0003,
//   iteration: 1000000,
//   log: 100,
//   schedule: {
//     every: 10000,
//     do: function(data){
//       console.log("error ", data.error)
//     }
//   }
// })

// var toBePredicted = [future]
// toBePredicted.forEach(function(match){
//   var activations = match.input
//   console.log(activations, network.activate(activations))
// })

function newNetwork(signatures){
  var trainingSet = []
  for(var i=0; i<signatures.length; i++){
    trainingSet.push( {
      "input": signatures[i],
      "output": [1]
    })
  }
 
  console.log("Training set " + trainingSet.length)
  try{
  var network = new Architect.Perceptron(trainingSet[0].input.length, 10 ,1)
  var trainer = new Trainer(network)
  
  trainer.train(trainingSet, {
    rate: .00003,
    iteration: 100000,
    log: 100,
    schedule: {
      every: 10000,
      do: function(data){
        console.log("error ", data.error)
      }
      }
    })
  
}catch(err){
    console.log(err)
  }

  return network
}

function newNetworkAll(all_signatures){
  var trainingSet = []
  for(var j=0; j<all_signatures.length; j++){
    signatures = all_signatures[j]

    for(var i=0; i<signatures.length; i++){
      var output = array_of_length(all_signatures.length, 0)
      output[j] = 1
      
      trainingSet.push( {
        "input": signatures[i],
        "output": output
      })
    }
  }
 
  // console.log("Training set " + trainingSet.length)
  try{
  var network = new Architect.Perceptron(trainingSet[0].input.length, 10 ,all_signatures.length)
  var trainer = new Trainer(network)
  
  trainer.train(trainingSet, {
    rate: .003,
    iteration: 1000,
    log: 100,
    schedule: {
      every: 10000,
      do: function(data){
        console.log("error ", data.error)
      }
      }
    })
  
  // console.log( network.toJSON() ) 
}catch(err){
    console.log('Network error ', err)
  }

  return network
}


function array_of_length(length, val){
  var arr = []
  for(var i=0; i<length; i++){
    arr.push(val)
  }
  return arr
}