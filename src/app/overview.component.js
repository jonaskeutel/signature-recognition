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
var api_service_1 = require('./services/api.service');
var OverviewComponent = (function () {
    function OverviewComponent(_router, _api) {
        this._router = _router;
        this._api = _api;
    }
    OverviewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._api.getUsers()
            .then(function (users) {
            console.log(users);
            _this.persons = users;
        });
    };
    OverviewComponent.prototype.newUser = function () {
        this._router.navigate(['/registration']);
    };
    OverviewComponent.prototype.compare = function (id) {
        console.log('compare with ' + id);
        this._router.navigate([("./userdetail/" + id)], this.currSegment);
    };
    OverviewComponent = __decorate([
        core_1.Component({
            selector: 'overview',
            providers: [router_1.ROUTER_DIRECTIVES, api_service_1.ApiService],
            template: "\n    <div id=\"user-overview\">\n      <h1>Overview</h1>\n      <div>\n        <button class=\"btn btn-primary new-button\" (click)=\"newUser()\" >New</button>\n      </div>\n      <div class=\"persons\">\n        <div class=\"person\" (click)=\"compare(person.id)\" *ngFor=\"let person of persons\">\n          <div class=\"person-image\">\n            <img src=\"assets/img/graphics/avatar_male.png\" *ngIf=\"person.gender == 'm'\">\n            <img src=\"assets/img/graphics/avatar_female.png\" *ngIf=\"person.gender == 'f'\">\n          </div>\n          <div class=\"person-info\">\n            {{ person.name }}, {{ person.age }} | {{ person.hand }}\n          </div>\n        </div>\n      </div>\n    </div>\n  "
        }), 
        __metadata('design:paramtypes', [router_1.Router, api_service_1.ApiService])
    ], OverviewComponent);
    return OverviewComponent;
}());
exports.OverviewComponent = OverviewComponent;
//# sourceMappingURL=overview.component.js.map