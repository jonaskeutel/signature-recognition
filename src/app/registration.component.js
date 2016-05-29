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
var signature_component_1 = require('./signature.component');
var RegistrationComponent = (function () {
    function RegistrationComponent() {
        this.gender = 'm';
        this.hand = 'r';
        this.touches1 = [4];
        this.step = 1;
    }
    RegistrationComponent.prototype.ngOnInit = function () {
    };
    RegistrationComponent.prototype.next = function () {
        this.step++;
        console.log(this.name, this.age);
        console.log(this.touches1);
    };
    RegistrationComponent.prototype.clear = function () {
        console.log("clear canvas");
    };
    RegistrationComponent = __decorate([
        core_1.Component({
            selector: 'registration-component',
            providers: [],
            directives: [signature_component_1.SignatureComponent],
            template: "\n    <div id=\"user-registration\">\n      <div class=\"header\">\n        <h1>Registration</h1>\n      </div>\n    \n      <div id=\"personal-information\">\n        <div class=\"input-form\" [ngClass]=\"{'close': step != 1}\">\n          <div class=\"input-group\">\n            <span class=\"input-group-addon\" id=\"basic-addon1\"></span>\n            <input [(ngModel)]=\"name\" type=\"text\" class=\"form-control\" placeholder=\"Name\" aria-describedby=\"basic-addon1\">\n          </div>\n          <div class=\"input-group\">\n            <span class=\"input-group-addon\" id=\"basic-addon1\"></span>\n            <input [(ngModel)]=\"age\" type=\"text\" class=\"form-control\" placeholder=\"Age\" aria-describedby=\"basic-addon1\">\n          </div>\n          <div class=\"radio-input\">\n              <span class=\"input-group-addon\">\n                <input [checked]=\"gender == 'm'\" type=\"radio\" (click)=\"gender='m'\" value=\"m\">\n                Male\n              </span>\n              <span class=\"input-group-addon\">\n                <input [checked]=\"gender == 'f'\" type=\"radio\" (click)=\"gender='f'\" value=\"f\">\n                Female\n              </span>\n          </div>\n          <div class=\"radio-input\">\n              <span class=\"input-group-addon\">\n                <input [checked]=\"hand == 'l'\" type=\"radio\" (click)=\"hand='l'\" value=\"m\">\n                Left hand\n              </span>\n              <span class=\"input-group-addon\">\n                <input [checked]=\"hand == 'r'\" type=\"radio\" (click)=\"hand='r'\" value=\"f\">\n                Right Hand\n              </span>\n          </div>\n        </div>\n        <div class=\" form-buttons\">\n          <button class=\"btn btn-primary\" (click)=\"next()\">Next</button>\n          <button class=\"btn btn-primary\" (click)=\"clear()\" [ngClass]=\"{'hidden': step==1}\">Clear</button>\n        </div>\n        <signature *ngIf=\"step > 1\" [touches]=\"touches1\"></signature>\n      </div>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], RegistrationComponent);
    return RegistrationComponent;
}());
exports.RegistrationComponent = RegistrationComponent;
//# sourceMappingURL=registration.component.js.map