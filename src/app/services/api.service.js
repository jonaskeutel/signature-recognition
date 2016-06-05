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
    ApiService.prototype.addSignature = function (signature) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data = {
            personID: this.userId,
            x: signature.map(function (elem) { return elem ? elem.x : null; }),
            y: signature.map(function (elem) { return elem ? elem.y : null; }),
            force: signature.map(function (elem) { return elem ? elem.pressure : null; }),
            acceleration: [],
            gyroscope: [],
            duration: signature.length * 10
        };
        return new Promise(function (resolve, reject) {
            _this._http.post('/api/signature', _this.objectToString(data), { headers: headers })
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
    ApiService.prototype.checkSignature = function (signature) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        var data = {
            personid: this.userId,
            x: signature.map(function (elem) { return elem ? elem.x : null; }),
            y: signature.map(function (elem) { return elem ? elem.y : null; }),
            force: signature.map(function (elem) { return elem ? elem.pressure : null; }),
            acceleration: [],
            gyroscope: [],
            duration: signature.length * 10
        };
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
    ApiService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ApiService);
    return ApiService;
}());
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map