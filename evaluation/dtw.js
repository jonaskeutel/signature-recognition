var fs = require('fs');
var DTW = require('dtw');
var dtw = new DTW();
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

var pressureValues = [];
var accelerationValues = [];

function getPosition(str, m, i) {
   return str.split(m, i).join(m).length;
}

function getPressure(name, i) {
	var file = decoder.write(fs.readFileSync('./data/' + name));
	var pressure = file.substring(file.indexOf("["), file.indexOf("]")).split(",").map(function(val) {return parseFloat(val.replace(/[^0-9\.]/g,""))});

    // console.log(name + ": " + pressure);
    pressureValues[i] = pressure;
}

function getAcceleration(name) {
	var file = decoder.write(fs.readFileSync('./data/' + name));
	var acceleration = file.substring(getPosition(file, "[", 2) + 1, getPosition(file, "]", 2)).replace(/},/g, "};").split(";");
	var combinedAcceleration = acceleration.map(function(val){
		try {
			obj = JSON.parse(val);
		} catch (e) {
			return 0;
		}
		var res = Math.sqrt(Math.pow(obj.a, 2) + Math.pow(obj.b, 2) + Math.pow(obj.c, 2));
		return res;
	});
    accelerationValues[i] = combinedAcceleration;
}

function compareEverything(names, arrayToCompareFrom) {
    for (var i = 0; i < names.length; i++) {
        for (var j = 0; j < names.length; j++) {
            if (i === j) {
                continue;
            }
            console.log(names[i] + " ~ " + names[j] + " = " + dtw.compute(arrayToCompareFrom[i], arrayToCompareFrom[j]));
        }
    }
}

var names = ["maren", "nina", "jochen", "jonas", "maren2", "nina2", "jochen2", "jonas2"];
for (var i = 0; i < names.length; i++) {
	getPressure(names[i], i);
    getAcceleration(names[i], i);
}
compareEverything(names, accelerationValues);
// console.log(pressureValues);
// console.log("Compare nina and jochen: ", dtw.compute(pressureValues[1], pressureValues[2]));
// console.log("Compare nina and nina2: ", dtw.compute(pressureValues[1], pressureValues[5]));
