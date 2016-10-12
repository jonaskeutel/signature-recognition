const synaptic = require('synaptic'); // this line is not needed in the browser
const q        = require('q')

const Neuron = synaptic.Neuron
const Layer = synaptic.Layer
const Network = synaptic.Network
const Trainer = synaptic.Trainer
const Architect = synaptic.Architect;


module.exports = {
  create: newNetwork,
  create_all: newNetworkAll,
  existing: getExistingNetwork
}

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

function getExistingNetwork(){
  console.log("here")
  try{
    var imported = Network.fromJSON(exst_network);
  }catch(err) {console.log(err)}
  return imported
}

function newNetworkAll(all_signatures){
  var trainingSet = []

  // Converts the given signatures into a format expected by the neural network framework
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
 
  // Set up the Neural Network and train it
  try{
    var network = new Architect.Perceptron(trainingSet[0].input.length, 10 ,all_signatures.length)
    var trainer = new Trainer(network)
    
    // Train network with the set error rate and iterations
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