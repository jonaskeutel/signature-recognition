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
var CanvasDrawer = (function () {
    function CanvasDrawer(el) {
        this.currentTouch = [];
        this.touchesOverTime = [];
        this.canvas = el;
        console.log(el);
        el.nativeElement.width = el.nativeElement.scrollWidth;
    }
    CanvasDrawer.prototype.touchStart = function (canvas, event) {
        event.preventDefault();
        var context = this.canvas.nativeElement.getContext("2d");
        var touches = event.changedTouches;
        // TODO: Decide, if we want to use more than one finger
        for (var i = 0; i < 1; i++) {
            var x = touches[i].pageX - event.srcElement.offsetLeft;
            var y = touches[i].pageY - canvas.offsetTop;
            var force = touches[i].force;
            this.touchesOverTime.push({
                timestamp: Date.now(),
                x: x,
                y: y,
                pressure: force
            });
            console.log(touches[i]);
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
            this.touchesOverTime.push({
                timestamp: Date.now(),
                x: x,
                y: y,
                pressure: force
            });
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
                console.log(this.currentTouch, this.currentTouch.length);
            }
        }
    };
    CanvasDrawer.prototype.thickness = function (force, thickness) { thickness = thickness ? thickness : 3; return thickness * force * force; };
    CanvasDrawer.prototype.touchEnd = function (canvas, event) {
        console.log(this.touchesOverTime);
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
        console.log(this.currentTouch);
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
        core_1.Directive({ selector: 'canvas[drawable]' }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], CanvasDrawer);
    return CanvasDrawer;
}());
var SignatureComponent = (function () {
    function SignatureComponent() {
    }
    SignatureComponent.prototype.ngOnInit = function () {
    };
    SignatureComponent.prototype.ngAfterViewInit = function () {
    };
    SignatureComponent.prototype.touchstart = function () {
        console.log("Touchstart");
    };
    __decorate([
        core_1.ViewChild("signatureCanvas"), 
        __metadata('design:type', core_1.ElementRef)
    ], SignatureComponent.prototype, "signatureCanvas", void 0);
    SignatureComponent = __decorate([
        core_1.Component({
            selector: 'signature',
            providers: [],
            directives: [CanvasDrawer],
            template: "\n    <h1>Signature</h1>\n    <div class=\"canvas-wrapper\">\n      <canvas #signatureCanvas class=\"signatureCanvas\" drawable>\n        Your browser does not support canvas element.\n      </canvas>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], SignatureComponent);
    return SignatureComponent;
}());
exports.SignatureComponent = SignatureComponent;
//# sourceMappingURL=signature.component.js.map