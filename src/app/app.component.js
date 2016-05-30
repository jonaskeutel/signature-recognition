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
var sample_service_1 = require('./services/sample.service');
var overview_component_1 = require('./overview.component');
var registration_component_1 = require('./registration.component');
var AppComponent = (function () {
    function AppComponent(_router, sample) {
        this._router = _router;
        this.sample = sample;
    }
    AppComponent.prototype.ngOnInit = function () {
        // this._router.navigate(['/registration']);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'sample',
            providers: [sample_service_1.SampleService],
            directives: [registration_component_1.RegistrationComponent, overview_component_1.OverviewComponent, router_1.ROUTER_DIRECTIVES],
            template: "\n        <main>\n          <router-outlet></router-outlet>\n        </main>\n    "
        }),
        router_1.Routes([
            { path: '/', component: overview_component_1.OverviewComponent },
            { path: '/registration', component: registration_component_1.RegistrationComponent }
        ]), 
        __metadata('design:paramtypes', [router_1.Router, sample_service_1.SampleService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map