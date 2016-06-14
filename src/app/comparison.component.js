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
var router_1 = require('@angular/router');
var signature_component_1 = require('./signature.component');
var api_service_1 = require('./services/api.service');
var ComparisonComponent = (function () {
    function ComparisonComponent(_api, _router) {
        this._api = _api;
        this._router = _router;
        this.userid = "";
    }
    ComparisonComponent.prototype.ngOnInit = function () {
    };
    ComparisonComponent.prototype.routerOnActivate = function (curr) {
        var _this = this;
        this.userid = curr.getParam('userid');
        this._api.getSignature(this.userid)
            .then(function (signatures) {
            console.log(signatures);
            var signs = [];
            for (var i = 0; i < signatures.length; i++) {
                signs.push(_this.convertSignatureData(signatures[i]));
            }
            console.log(signs);
            _this.signatures = signs;
        });
    };
    ComparisonComponent.prototype.compare = function () {
        this._api.checkSignature(this.signatureComponent.getTouches(), this.userid); //TODO: also pass ID?
    };
    ComparisonComponent.prototype.clear = function () {
        console.log("clear canvas");
        this.signatureComponent.clear();
    };
    ComparisonComponent.prototype.convertSignatureData = function (signature) {
        var dataPoints = signature.x.length;
        signature = this.normalizeSignature(signature);
        signature.force = JSON.parse(signature.force);
        return signature;
    };
    ComparisonComponent.prototype.normalizeSignature = function (signature) {
        signature.x = JSON.parse(signature.x);
        signature.y = JSON.parse(signature.y);
        var dataPoints = signature.x.length;
        var width = Math.max.apply(Math, signature.x) - Math.min.apply(Math, signature.x.filter(function (elem) { return elem != null; }));
        var height = Math.max.apply(Math, signature.y) - Math.min.apply(Math, signature.y.filter(function (elem) { return elem != null; }));
        var minX = Math.min.apply(Math, signature.x.filter(function (elem) { return elem != null; }));
        var minY = Math.min.apply(Math, signature.y.filter(function (elem) { return elem != null; }));
        var newX = [], newY = [];
        console.log(signature);
        for (var i = 0; i < dataPoints; i++) {
            newX.push(signature.x[i] ? signature.x[i] - minX : null);
            newY.push(signature.x[i] ? signature.y[i] - minY : null);
        }
        console.log("normalize");
        signature.x = newX;
        signature.y = newY;
        signature.width = width;
        signature.height = height;
        return signature;
    };
    __decorate([
        core_1.ViewChild(signature_component_1.SignatureComponent), 
        __metadata('design:type', signature_component_1.SignatureComponent)
    ], ComparisonComponent.prototype, "signatureComponent", void 0);
    ComparisonComponent = __decorate([
        core_1.Component({
            selector: 'comparison-component',
            directives: [signature_component_1.SignatureComponent, router_1.ROUTER_DIRECTIVES],
            providers: [api_service_1.ApiService],
            template: "\n    <div id=\"signature-comparison\">\n      <div class=\"header\">\n        <h1>Comparison</h1>\n      </div>\n\n      <div id=\"personal-information\">\n        <div class=\" form-buttons\">\n          <button class=\"btn btn-primary\" (click)=\"compare()\">Compare</button>\n          <button class=\"btn btn-primary\" (click)=\"clear()\">Clear</button>\n        </div>\n        <signature></signature>\n      </div>\n    </div>\n    <div class=\"existing-signatures\" *ngIf=\"signatures\">\n      \n      <div class=\"col-md-6\" *ngFor=\"let sign of signatures\">\n        <signature [sign]=\"sign\"></signature>\n      </div>\n    \n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [api_service_1.ApiService, router_1.Router])
    ], ComparisonComponent);
    return ComparisonComponent;
}());
exports.ComparisonComponent = ComparisonComponent;
//# sourceMappingURL=comparison.component.js.map