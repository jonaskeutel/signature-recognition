'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var SignatureComponent = (function () {
    function SignatureComponent() {
    }
    SignatureComponent.prototype.ngOnInit = function () {
        init();
    };
    SignatureComponent = __decorate([
        core_1.Component({
            selector: 'signature',
            providers: [],
            template: "\n    <h1>Signature</h1>\n    <canvas class=\"signatureCanvas\">\n      Your browser does not support canvas element.\n    </canvas>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], SignatureComponent);
    return SignatureComponent;
}());
exports.SignatureComponent = SignatureComponent;
var gyroData = [];
var accelerometerData = [];
var forceData = [];
var ongoingTouches = new Array();
var numStrokes = 0;
var recording = false;
function clearCanvas() {
    var el = document.getElementsByTagName("canvas")[0];
    var context = el.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}
function handleStart(evt) {
    recording = true;
    if (numStrokes == 0) {
        gyroData = [];
        accelerometerData = [];
        forceData = [];
    }
    numStrokes++;
    evt.preventDefault();
    // log("touchstart.");
    var el = document.getElementsByTagName("canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        // log("touchstart:" + i + "...");
        ongoingTouches.push(copyTouch(touches[i]));
        var color = colorForTouch(touches[i]);
        ctx.beginPath();
        ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false); // a circle at the start
        ctx.fillStyle = color;
        ctx.fill();
    }
}
function handleMove(evt) {
    evt.preventDefault();
    var el = document.getElementsByTagName("canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
    for (var i = 0; i < 1; i++) {
        var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);
        // console.log(touches[i]);
        // log(touches[i].force);
        if (recording) {
            forceData.push(touches[i].force);
            var f = document.getElementById('force');
            f.innerHTML = "Force: <br>" + touches[i].force.toString().substring(0, 5);
        }
        if (idx >= 0) {
            // log("continuing touch "+idx);
            ctx.beginPath();
            // log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            // log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
            ctx.lineTo(touches[i].pageX, touches[i].pageY);
            ctx.lineWidth = 4;
            ctx.strokeStyle = color;
            ctx.stroke();
            ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
        }
        else {
        }
    }
}
function handleEnd(evt) {
    evt.preventDefault();
    // log("touchend");
    var el = document.getElementsByTagName("canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            ctx.lineWidth = 4;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            ctx.lineTo(touches[i].pageX, touches[i].pageY);
            ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8); // and a square at the end
            ongoingTouches.splice(idx, 1); // remove it; we're done
        }
        else {
        }
    }
    setTimeout(function () {
        numStrokes--;
        if (numStrokes == 0) {
            recording = false;
            var body = JSON.stringify(accelerometerData);
            var subject = Date.now().toString();
            document.getElementById('subject').value = subject;
            document.getElementById('data').value = JSON.stringify(forceData) + "###" + JSON.stringify(gyroData) + "###" + JSON.stringify(accelerometerData);
        }
    }, 1000);
}
function handleCancel(evt) {
    evt.preventDefault();
    // log("touchcancel.");
    var touches = evt.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        ongoingTouches.splice(i, 1); // remove it; we're done
    }
}
function colorForTouch(touch) {
    var r = touch.identifier % 16;
    var g = Math.floor(touch.identifier / 3) % 16;
    var b = Math.floor(touch.identifier / 7) % 16;
    r = r.toString(16); // make it a hex digit
    g = g.toString(16); // make it a hex digit
    b = b.toString(16); // make it a hex digit
    var color = "#" + r + g + b;
    // log("color for touch with identifier " + touch.identifier + " = " + color);
    return color;
}
function copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}
function ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier;
        if (id == idToFind) {
            return i;
        }
    }
    return -1; // not found
}
function log(msg) {
    var p = document.getElementById('log');
    p.innerHTML = msg + "\n"; // + p.innerHTML;
}
function init() {
    var el = document.getElementsByTagName("canvas")[0];
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchcancel", handleCancel, false);
    el.addEventListener("touchmove", handleMove, false);
    // log("initialized.");
    el.width = window.innerWidth * 0.9;
    el.height = window.innerHeight * 0.5;
    window.addEventListener('deviceorientation', function (event) {
        if (recording) {
            gyroData.push({
                'a': event.alpha,
                'b': event.beta,
                'c': event.gamma });
        }
        document.getElementById("gyro").innerHTML = "Gyro: <br>" + event.alpha.toString().substring(0, 5) + ' <br> ' + event.beta.toString().substring(0, 5) + ' <br> ' + event.gamma.toString().substring(0, 5);
    });
    window.addEventListener("devicemotion", function (event) {
        if (recording) {
            accelerometerData.push({
                'a': event.rotationRate.alpha,
                'b': event.rotationRate.beta,
                'c': event.rotationRate.gamma });
        }
        document.getElementById("accelerometer").innerHTML = "Accelerometer: <br>" + Math.sqrt(event.rotationRate.alpha * event.rotationRate.alpha + event.rotationRate.beta * event.rotationRate.beta + event.rotationRate.gamma * event.rotationRate.gamma).toString().substring(0, 5);
        // document.getElementById("accelerometer").innerHTML =
        //   event.rotationRate.alpha + ' <br> ' +
        //   event.rotationRate.beta + ' <br> ' +
        //   event.rotationRate.gamma
    }, true);
}
//# sourceMappingURL=signature.component.js.map