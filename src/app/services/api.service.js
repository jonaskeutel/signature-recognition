"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var http_1 = require('@angular/http');
var core_1 = require('@angular/core');
// import {Observable} from 'rxjs/Observable';
var ApiService = (function () {
    function ApiService(_http) {
        this._http = _http;
    }
    ApiService.prototype.register = function (user) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return new Promise(function (resolve, reject) {
            _this._http.post('/api/user', _this.objectToString(user), { headers: headers })
                .subscribe(function (data) {
                console.log(data, data._body.id, data._body);
                _this.userId = JSON.parse(data._body).id;
                console.log(_this.userId);
            }, function (err) { return console.log(err); }, function () { return console.log('Authentication Complete'); });
            resolve();
        });
    };
    ApiService.prototype.addSignature = function (touches, orientation, acceleration, width, height, strokes) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data = {
            personid: this.userId,
            x: touches.map(function (elem) { return elem ? elem.x : null; }),
            y: touches.map(function (elem) { return elem ? elem.y : null; }),
            force: touches.map(function (elem) { return elem ? elem.pressure : null; }),
            acceleration: acceleration.map(function (elem) { return elem ? elem : null; }),
            gyroscope: orientation.map(function (elem) { return elem ? elem : null; }),
            duration: touches.length * 10,
            height: height,
            width: width,
            strokes: strokes,
        };
        data = this.normalizeSignature(data);
        console.log(data);
        return new Promise(function (resolve, reject) {
            _this._http.post('/api/signature/' + data.personid, _this.objectToString(data), { headers: headers })
                .subscribe(function (data) { return console.log(data); }, function (err) { return console.log(err); }, function () { return console.log('Authentication Complete'); });
            resolve();
        });
    };
    ApiService.prototype.getUsers = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._http.get('/api/user/all')
                .subscribe(function (data) { return resolve(JSON.parse(data._body)); }, function (err) { return console.log(err); }, function () { });
        });
    };
    ApiService.prototype.getSignature = function (userid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._http.get('/api/signature/' + userid)
                .subscribe(function (data) { return resolve(JSON.parse(data._body)); }, function (err) { return console.log(err); }, function () { });
        });
    };
    ApiService.prototype.checkSignature = function (touches, orientation, acceleration, width, height, strokes, userId) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data = {
            personid: userId,
            x: touches.map(function (elem) { return elem ? elem.x : null; }),
            y: touches.map(function (elem) { return elem ? elem.y : null; }),
            force: touches.map(function (elem) { return elem ? elem.pressure : null; }),
            acceleration: acceleration,
            gyroscope: orientation,
            width: width,
            height: height,
            strokes: strokes,
            duration: touches.length * 10
        };
        data = this.normalizeSignature(data);
        console.log("about to post to /api/signature/check");
        return new Promise(function (resolve, reject) {
            _this._http.post('/api/signature/check', _this.objectToString(data), { headers: headers })
                .subscribe(function (data) { return console.log(data); }, function (err) { return console.log(err); }, function () { return console.log('Authentication Complete'); });
            resolve();
        });
    };
    ApiService.prototype.objectToString = function (body) {
        var converted = "";
        for (var i = 0; i < Object.keys(body).length; i++) {
            var key = Object.keys(body)[i];
            var value = typeof body[key] == 'object' ? JSON.stringify(body[key]) : body[key];
            converted += key + '=' + value;
            if (i < Object.keys(body).length - 1)
                converted += '&';
        }
        // console.log(converted)
        return converted;
    };
    ApiService.prototype.normalizeSignature = function (signature) {
        var dataPoints = signature.x.length;
        // var width = Math.max.apply(Math, signature.x) - Math.min.apply(Math, signature.x.filter(function(elem){return elem != null}))
        // var height = Math.max.apply(Math, signature.y) - Math.min.apply(Math, signature.y.filter(function(elem){return elem != null}))
        var minX = Math.min.apply(Math, signature.x.filter(function (elem) { return elem != null; }));
        var minY = Math.min.apply(Math, signature.y.filter(function (elem) { return elem != null; }));
        var newX = [], newY = [];
        // console.log(signature)
        for (var i = 0; i < dataPoints; i++) {
            newX.push(signature.x[i] ? signature.x[i] - minX : null);
            newY.push(signature.x[i] ? signature.y[i] - minY : null);
        }
        signature.x = newX;
        signature.y = newY;
        // signature.width = width
        // signature.height = height
        console.log("normalized");
        return signature;
    };
    ApiService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ApiService);
    return ApiService;
}());
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map