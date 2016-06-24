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
var normalizedTouches = [];
var CanvasDrawer = (function () {
    function CanvasDrawer(el) {
        this.startTime = null;
        this.currentTouch = [];
        this.touchesOverTime = [];
        this.orientationOverTime = [];
        this.accelerationOverTime = [];
        this.numStrokes = 0;
        this.lastBegin = Date.now();
        this.lastEnd = null;
        this.secondLastEnd = null;
        this.normalizedTouches = [];
        this.normalizedOrientation = [];
        this.normalizedAcceleration = [];
        this.canvas = el;
        console.log("Construced");
        //  console.log(JSON.parse(JSON.stringify(el.nativeElement)) )
        console.log(el, el.nativeElement.clientWidth);
        setTimeout(function () {
            el.nativeElement.width = el.nativeElement.clientWidth;
        }, 200);
    }
    CanvasDrawer.prototype.touchStart = function (canvas, event) {
        this.lastBegin = Date.now();
        if (!this.startTime) {
            this.startTime = this.lastBegin;
        }
        this.numStrokes++;
        event.preventDefault();
        var context = this.canvas.nativeElement.getContext("2d");
        var touches = event.changedTouches;
        // TODO: Decide, if we want to use more than one finger
        for (var i = 0; i < 1; i++) {
            var x = touches[i].pageX - event.srcElement.offsetLeft;
            var y = touches[i].pageY - canvas.offsetTop;
            var force = touches[i].force;
            this.addTouchPoint({
                timestamp: Date.now(),
                x: x,
                y: y,
                pressure: force
            }, Date.now());
            //   console.log(touches[i])
            //   console.log(touches[i].identifier)
            this.currentTouch.push({ id: touches[i].identifier, x: x, y: y });
            context.beginPath();
            context.arc(x, y, this.thickness(touches[i].force, 2), 0, 2 * Math.PI, false); // a circle at the start
            context.fillStyle = 'blue';
            context.fill();
        }
    };
    CanvasDrawer.prototype.touchMove = function (canvas, event) {
        event.preventDefault();
        var context = this.canvas.nativeElement.getContext("2d");
        var touches = event.changedTouches;
        // console.log(event)
        for (var i = 0; i < 1; i++) {
            var x = touches[i].pageX - event.srcElement.offsetLeft;
            var y = touches[i].pageY - canvas.offsetTop;
            var force = touches[i].force;
            var ind = -1;
            this.addTouchPoint({
                timestamp: Date.now(),
                x: x,
                y: y,
                pressure: force
            }, Date.now());
            var touch = this.currentTouch.filter(function (t, index) {
                ind = index;
                if (t.id == touches[i].identifier) {
                    return true;
                }
                return false;
            });
            //   console.log(touch.length)
            // context.beginPath();
            // context.arc(x, y, 4 * touches[i].force, 0, 2 * Math.PI, false);  // a circle at the start
            // context.fillStyle = 'blue';
            // context.fill();
            if (touch.length == 1) {
                context.beginPath();
                // log("context.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
                context.moveTo(touch[0].x, touch[0].y);
                // log("context.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
                context.lineTo(x, y);
                context.lineWidth = this.thickness(touches[i].force, null);
                context.strokeStyle = 'blue';
                context.stroke();
                this.currentTouch.splice(ind, 1);
                this.currentTouch.push({ id: touches[i].identifier, x: x, y: y });
            }
        }
    };
    CanvasDrawer.prototype.thickness = function (force, thickness) { thickness = thickness ? thickness : 3; return Math.max(thickness * force * force, 0.5); };
    CanvasDrawer.prototype.touchEnd = function (canvas, event) {
        this.lastEnd = Date.now();
        event.preventDefault();
        var touches = event.changedTouches;
        // console.log(event)
        for (var i = 0; i < touches.length; i++) {
            var ind = -1;
            var touch = this.currentTouch.filter(function (t, index) {
                ind = index;
                if (t.id == touches[i].identifier) {
                    return true;
                }
                return false;
            });
            if (ind > -1)
                this.currentTouch.splice(ind, 1);
        }
        this.numStrokes--;
        var thing = this;
        this.normalizeTouches();
    };
    CanvasDrawer.prototype.addTouchPoint = function (touchpoint, timestamp) {
        this.touchesOverTime.push(touchpoint);
    };
    CanvasDrawer.prototype.clear = function () {
        var context = this.canvas.nativeElement.getContext("2d");
        context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    };
    CanvasDrawer.prototype.redraw = function () {
        var _this = this;
        setInterval(function () {
            if (_this.normalizedTouches.length > 0) {
                if (_this.normalizedTouches[0]) {
                    var context = _this.canvas.nativeElement.getContext("2d");
                    context.beginPath();
                    context.arc(_this.normalizedTouches[0].x, _this.normalizedTouches[0].y, _this.thickness(_this.normalizedTouches[0].pressure, 2), 0, 2 * Math.PI, false); // a circle at the start
                    context.fillStyle = 'blue';
                    context.fill();
                }
                _this.normalizedTouches.shift();
            }
        }, 10);
    };
    CanvasDrawer.prototype.drawSignature = function (signature) {
        for (var i = 0; i < signature.length; i++) {
            var currTouch = signature[i];
            if (currTouch) {
                var context = this.canvas.nativeElement.getContext("2d");
                context.beginPath();
                context.arc(currTouch.x, currTouch.y, this.thickness(currTouch.pressure, 10), 0, 2 * Math.PI, false); // a circle at the start
                context.fillStyle = 'blue';
                context.fill();
            }
        }
    };
    CanvasDrawer.prototype.normalizeTouches = function () {
        var touches = this.touchesOverTime;
        var acceleration = this.accelerationOverTime;
        var orientation = this.orientationOverTime;
        var touchesNormalized = [];
        var last = {};
        var lastStamp = -1;
        //Interval in ms
        var interval = 5;
        var offset = 0;
        if (this.normalizedTouches.length > 0) {
            var pause = Math.floor((touches[0].timestamp - this.normalizedTouches[this.normalizedTouches.length - 1].timestamp) / interval);
            for (var i = 0; i < pause; i++) {
                this.normalizedTouches.push(null);
            }
        }
        var startTime = touches[0].timestamp;
        while (touches.length > 0) {
            if (touchesNormalized.length == 0) {
                touchesNormalized.push(touches[0]);
                lastStamp = touches[0].timestamp;
                last = touches[0];
                touches.shift();
            }
            else {
                if (touches[0].timestamp - lastStamp > interval + offset) {
                    touchesNormalized.push(last);
                    offset += interval;
                }
                else if (touches[0].timestamp - lastStamp <= interval + offset) {
                    offset = 0;
                    touchesNormalized.push(touches[0]);
                    lastStamp = touches[0].timestamp;
                    last = touches[0];
                    touches.shift();
                }
            }
        }
        this.normalizedTouches = this.normalizedTouches.concat(touchesNormalized);
        this.normalizedOrientation = this.normalizedOrientation.concat(this.normalizeAccordingToTouches(this.orientationOverTime, startTime));
        this.normalizedAcceleration = this.normalizedAcceleration.concat(this.normalizeAccordingToTouches(this.accelerationOverTime, startTime));
        this.secondLastEnd = this.lastEnd;
        normalizedTouches = this.normalizedTouches;
    };
    CanvasDrawer.prototype.normalizeAccordingToTouches = function (array, startTime) {
        var interval = 5; //ms
        var normalizedArray = [];
        if (this.secondLastEnd) {
            startTime = this.secondLastEnd;
        }
        else {
            this.secondLastEnd = this.lastEnd;
        }
        // get start
        var startIndex = 0;
        for (var i = 0; i < array.length; i++) {
            if (array[i].timestamp < startTime) {
                startIndex++;
            }
            else {
                break;
            }
        }
        startIndex--;
        // TODO: fill everything until start with null
        console.log("start: " + startIndex + " - length: " + array.length);
        var lastTimestamp = array[startIndex].timestamp;
        normalizedArray.push(array[startIndex]);
        for (var i = startIndex; i < array.length; i++) {
            if (array[i].timestamp > this.lastEnd) {
                break;
            }
            if (array[i].timestamp - lastTimestamp < interval) {
                continue;
            }
            else {
                lastTimestamp = array[i].timestamp;
                normalizedArray.push(array[i]);
            }
        }
        return normalizedArray;
    };
    __decorate([
        core_1.HostListener('touchstart', ['$event.target', '$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], CanvasDrawer.prototype, "touchStart", null);
    __decorate([
        core_1.HostListener('touchmove', ['$event.target', '$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], CanvasDrawer.prototype, "touchMove", null);
    __decorate([
        core_1.HostListener('touchend', ['$event.target', '$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object]), 
        __metadata('design:returntype', void 0)
    ], CanvasDrawer.prototype, "touchEnd", null);
    CanvasDrawer = __decorate([
        core_1.Directive({
            selector: 'canvas[drawable]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], CanvasDrawer);
    return CanvasDrawer;
}());
var SignatureComponent = (function () {
    function SignatureComponent() {
    }
    SignatureComponent.prototype.ngOnInit = function () {
        //  window.addEventListener('orientationchange', function() {
        //    console.log(window.orientation)
        //  }, false);
        var that = this;
        window.addEventListener('deviceorientation', function (event) {
            that.drawable.orientationOverTime.push({
                timestamp: Date.now(),
                alpha: event.alpha,
                beta: event.beta,
                gamma: event.gamma
            });
        });
        window.addEventListener("devicemotion", function (event) {
            that.drawable.accelerationOverTime.push({
                timestamp: Date.now(),
                alpha: event.rotationRate.alpha,
                beta: event.rotationRate.beta,
                gamma: event.rotationRate.gamma
            });
        });
    };
    SignatureComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.sign) {
            console.log("Signature with objg", this.sign);
            // this.drawable.redraw()
            setTimeout(function () {
                var width = _this.drawable.canvas.nativeElement.width;
                var height = _this.drawable.canvas.nativeElement.height;
                _this.sign = _this.trasformSignatureToSize(_this.sign, width / _this.sign.width, height / _this.sign.height);
                _this.signNormalized = _this.convertSignature(_this.sign);
                _this.drawable.drawSignature(_this.signNormalized);
            }, 250);
        }
    };
    SignatureComponent.prototype.convertSignature = function (signature) {
        var converted = [];
        for (var i = 0; i < signature.x.length; i++) {
            if (signature.x[i]) {
                converted.push({
                    x: signature.x[i],
                    y: signature.y[i],
                    pressure: signature.force[i]
                });
            }
        }
        return converted;
    };
    SignatureComponent.prototype.trasformSignatureToSize = function (signature, widthRatio, heightRatio) {
        var newX = [], newY = [];
        for (var i = 0; i < signature.x.length; i++) {
            newX.push(signature.x[i] ? signature.x[i] * widthRatio : null);
            newY.push(signature.x[i] ? signature.y[i] * heightRatio : null);
        }
        signature.x = newX;
        signature.y = newY;
        return signature;
    };
    SignatureComponent.prototype.clear = function () {
        // this.drawable.normalizedTouches = []
        this.drawable.clear();
    };
    SignatureComponent.prototype.getTouches = function () {
        return this.drawable.normalizedTouches;
    };
    SignatureComponent.prototype.getOrientation = function () {
        return this.drawable.normalizedOrientation;
    };
    SignatureComponent.prototype.getAcceleration = function () {
        return this.drawable.normalizedAcceleration;
    };
    SignatureComponent.prototype.getWidth = function () {
        var xValues = this.getTouches().map(function (elem) { return elem ? elem.x : null; });
        var min = Math.min.apply(null, xValues);
        console.log(min);
        var max = Math.max.apply(null, xValues);
        console.log(max);
        return Math.round(max - min);
    };
    SignatureComponent.prototype.getHeight = function () {
        var yValues = this.getTouches().map(function (elem) { return elem ? elem.y : null; });
        var min = Math.min.apply(null, yValues);
        console.log(min);
        var max = Math.max.apply(null, yValues);
        console.log(max);
        return Math.round(max - min);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SignatureComponent.prototype, "sign", void 0);
    __decorate([
        core_1.ViewChild("signatureCanvas"), 
        __metadata('design:type', core_1.ElementRef)
    ], SignatureComponent.prototype, "signatureCanvas", void 0);
    __decorate([
        core_1.ViewChild(CanvasDrawer), 
        __metadata('design:type', CanvasDrawer)
    ], SignatureComponent.prototype, "drawable", void 0);
    SignatureComponent = __decorate([
        core_1.Component({
            selector: 'signature',
            providers: [],
            directives: [CanvasDrawer],
            template: "\n    <div class=\"canvas-wrapper\">\n      <canvas #signatureCanvas class=\"signatureCanvas\" drawable>\n        Your browser does not support canvas element.\n      </canvas>\n\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], SignatureComponent);
    return SignatureComponent;
}());
exports.SignatureComponent = SignatureComponent;
//# sourceMappingURL=signature.component.js.map