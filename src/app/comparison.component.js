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
    }
    ComparisonComponent.prototype.ngOnInit = function () {
    };
    ComparisonComponent.prototype.compare = function () {
        this._api.checkSignature(this.signatureComponent.getTouches()); //TODO: also pass ID?
    };
    ComparisonComponent.prototype.clear = function () {
        console.log("clear canvas");
        this.signatureComponent.clear();
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
            template: "\n    <div id=\"signature-comparison\">\n      <div class=\"header\">\n        <h1>Comparison</h1>\n      </div>\n\n      <div id=\"personal-information\">\n        <div class=\" form-buttons\">\n          <button class=\"btn btn-primary\" (click)=\"compare()\">Compare</button>\n          <button class=\"btn btn-primary\" (click)=\"clear()\">Clear</button>\n        </div>\n        <signature></signature>\n      </div>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [api_service_1.ApiService, router_1.Router])
    ], ComparisonComponent);
    return ComparisonComponent;
}());
exports.ComparisonComponent = ComparisonComponent;
//# sourceMappingURL=comparison.component.js.map