const synaptic = require('synaptic'); // this line is not needed in the browser
const q        = require('q')

const Neuron = synaptic.Neuron
const Layer = synaptic.Layer
const Network = synaptic.Network
const Trainer = synaptic.Trainer
const Architect = synaptic.Architect;

module.exports = {
  create: newNetwork
}

// var historicMatch = {
//   'input': [43.2, 54.5],
//   'output': [1,0,0]
// }

var future = { input: [ 31530, 390, 89 ] }

var trainingSet = [ { input: [ 18500, 381, 89 ], output: [ 1 ] },
  { input: [ 9380, 380, 68 ], output: [ 1 ] },
  { input: [ 24940, 390, 89 ], output: [ 1 ] },
   ]
var network = new Architect.Perceptron(trainingSet[0].input.length, 6,6,1)
var trainer = new Trainer(network)

trainer.train(trainingSet, {
  rate: .0003,
  iteration: 1000000,
  log: 100,
  schedule: {
    every: 10000,
    do: function(data){
      console.log("error ", data.error)
    }
  }
})

var toBePredicted = [future]
toBePredicted.forEach(function(match){
  var activations = match.input
  console.log(activations, network.activate(activations))
})

function newNetwork(signatures){
//   var trainingSet = []
//   for(var i=0; i<signatures.length; i++){
//     trainingSet.push( {
//       "input": signatures[i],
//       "output": [1]
//     })
//   }
 
//   console.log(trainingSet)
//   try{
//   var network = new Architect.Perceptron(trainingSet[0].input.length, 6,6,1)
//   var trainer = new Trainer(network)

//   trainer.train(trainingSet, {
//     rate: .1,
//     iteration: 100000,
//     log: 100,
//     schedule: {
//       every: 10000,
//       do: function(data){
//         console.log("error ", data.error)
//       }
//       }
//     })
  
// }catch(err){
//     console.log(err)
//   }

  return network
}

Array.prototype.repeat= function(what, L){
 while(L) this[--L]= what;
 return this;
}