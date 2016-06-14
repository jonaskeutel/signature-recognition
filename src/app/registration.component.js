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
var RegistrationComponent = (function () {
    function RegistrationComponent(_api, _router) {
        this._api = _api;
        this._router = _router;
        this.name = '';
        this.age = 18;
        this.gender = 'm';
        this.hand = 'r';
        this.touchData = { sth: "jaoksdkh" };
        this.step = 1;
    }
    RegistrationComponent.prototype.ngOnInit = function () {
    };
    RegistrationComponent.prototype.next = function () {
        if (this.step == 1) {
            this._api.register({
                name: this.name,
                age: this.age,
                gender: this.gender,
                hand: this.hand
            });
        }
        else if (this.step > 1) {
            this._api.addSignature(this.signatureComponent.getTouches(), this.signatureComponent.getWidth(), this.signatureComponent.getHeight());
            this.signatureComponent.clear();
        }
        this.step++;
        if (this.step == 6) {
            this._router.navigate(['/']);
        }
    };
    RegistrationComponent.prototype.clear = function () {
        console.log("clear canvas");
        this.signatureComponent.clear();
    };
    __decorate([
        core_1.ViewChild(signature_component_1.SignatureComponent), 
        __metadata('design:type', signature_component_1.SignatureComponent)
    ], RegistrationComponent.prototype, "signatureComponent", void 0);
    RegistrationComponent = __decorate([
        core_1.Component({
            selector: 'registration-component',
            directives: [signature_component_1.SignatureComponent, router_1.ROUTER_DIRECTIVES],
            providers: [api_service_1.ApiService],
            template: "\n    <div id=\"user-registration\">\n      <div class=\"header\">\n        <h1>Registration</h1>\n      </div>\n\n      <div id=\"personal-information\">\n        <div class=\"input-form\" [ngClass]=\"{'close': step != 1}\">\n          <div class=\"input-group\">\n            <span class=\"input-group-addon\" id=\"basic-addon1\"></span>\n            <input [(ngModel)]=\"name\" type=\"text\" class=\"form-control\" placeholder=\"Name\" aria-describedby=\"basic-addon1\">\n          </div>\n          <div class=\"input-group\">\n            <span class=\"input-group-addon\" id=\"basic-addon1\"></span>\n            <input [(ngModel)]=\"age\" type=\"text\" class=\"form-control\" placeholder=\"Age\" aria-describedby=\"basic-addon1\">\n          </div>\n          <div class=\"radio-input\">\n              <span class=\"input-group-addon\">\n                <input [checked]=\"gender == 'm'\" type=\"radio\" (click)=\"gender='m'\" value=\"m\">\n                Male\n              </span>\n              <span class=\"input-group-addon\">\n                <input [checked]=\"gender == 'f'\" type=\"radio\" (click)=\"gender='f'\" value=\"f\">\n                Female\n              </span>\n          </div>\n          <div class=\"radio-input\">\n              <span class=\"input-group-addon\">\n                <input [checked]=\"hand == 'l'\" type=\"radio\" (click)=\"hand='l'\" value=\"m\">\n                Left hand\n              </span>\n              <span class=\"input-group-addon\">\n                <input [checked]=\"hand == 'r'\" type=\"radio\" (click)=\"hand='r'\" value=\"f\">\n                Right Hand\n              </span>\n          </div>\n        </div>\n        <div class=\" form-buttons\">\n          <button class=\"btn btn-primary\" (click)=\"next()\">Next</button>\n          <button class=\"btn btn-primary\" (click)=\"clear()\" [ngClass]=\"{'hidden': step==1}\">Clear</button>\n        </div>\n        <signature *ngIf=\"step > 1 && step < 6\"></signature>\n        <div *ngIf=\"step > 2\">Nochmal wiederholen</div>\n      </div>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [api_service_1.ApiService, router_1.Router])
    ], RegistrationComponent);
    return RegistrationComponent;
}());
exports.RegistrationComponent = RegistrationComponent;
//# sourceMappingURL=registration.component.js.map