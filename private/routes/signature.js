'use strict'
const db  = require(__dirname + "/../database/dbinterface.js")
const evaluation = require(__dirname + "/../evaluation/evaluation.js")
const neural_network = require(__dirname + "/../evaluation/neural_network_wrapper.js")

module.exports = {
  newSignature: newSignature,
  getSignatures: getSignatures,
  checkSignature: checkSignature
}

function newSignature(req, res) {
    console.log(req.body)
    if(!req.body.personid || !req.body.x || !req.body.y || !req.body.force ||
    !req.body.acceleration || !req.body.gyroscope || !req.body.duration || !req.body.width || !req.body.height) {
        return res.json({"status": "error", "message": "missing a parameter"})
    } else {
    	var newSignature = [
    		req.body.personid,
    		req.body.x,
    		req.body.y,
        req.body.force,
        req.body.acceleration,
        req.body.gyroscope,
    		req.body.duration,
        req.body.width,
        req.body.height,
        req.body.strokes
    	]
    	db.newSignature(newSignature)
        .then(function() {
          return res.json({"status": "success", "message": "signature successfully created"})
        }, function(err) {
      	  return res.json({"status": "error", "message": err})
    	  })
    }
}

function getSignatures(req, res) {
  if(!req.userid) {
    return res.json({"status": "error", "message": "missing parameter 'personID'"})
  } else {
    db.getSignatures(req.userid)
      .then(function(result) {
        return res.json(result)
      }, function(err) {
        return res.json({"status": "error", "message": "DB error getSignatures"})
      })
  }
}

function checkSignature(req, res) {
  if(!req.body.personid || !req.body.x || !req.body.y || !req.body.force ||
    !req.body.acceleration || !req.body.gyroscope || !req.body.duration) {
        return res.json({"status": "error", "message": "missing a parameter"})
    } else {
      db.getAllUser()
          .then( (all_user) => {
             var user_index = 0;
             for(var i=0; i<all_user.length; i++){
               if(all_user[i].id == req.body.personid){
                 user_index = i;
                 break;
               }
             }
              db.getSignatures(req.body.personid)
                  .then(function(savedSignatures) {
                    evaluation.compare(req.body, savedSignatures).done(function(result) {

                      if (result) {
                        var neural = neural_network.testSignature(req.body)
                        var prob
                        if (neural)
                          prob = (1 * result.dtw.combinedCertainity + 1 * neural[user_index] ) / 2;
                        else
                          prob = (1 * result.dtw.combinedCertainity );

                        var neuralResult = 'Neural Network not trained'
                        if(neural)
                          neuralResult = neural[user_index]

                        return res.json({
                          probability: prob,
                          dtw: result.dtw.combinedCertainity,
                          neural: neuralResult
                        })
                      } else {
                        return res.json({"status": "error", "message": "signature check not successful"})
                      }
                    })
                  }, function(err) {
                    return res.json({"status": "error", "message": "DB error getSignatures"})
                  })

          })

    }
}
