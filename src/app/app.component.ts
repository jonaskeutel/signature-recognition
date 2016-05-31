'use strict'
import {Component, OnInit} from '@angular/core';
import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';
import {HTTP_PROVIDERS} from '@angular/http';
import {SampleService} from './services/sample.service';

import {OverviewComponent} from './overview.component';
import {RegistrationComponent} from './registration.component';
import {ComparisonComponent} from './comparison.component';

import {SignatureComponent} from './signature.component';

@Component({
    selector: 'sample',
    providers: [ SampleService],
    directives: [RegistrationComponent, OverviewComponent, ROUTER_DIRECTIVES],
    template:`
        <main>
          <router-outlet></router-outlet>
        </main>
    `
})
@Routes([
  {path:'/', component: OverviewComponent},
  {path:'/registration', component: RegistrationComponent},
  {path: '/compare', component: ComparisonComponent}
])

export class AppComponent implements OnInit {

  constructor(
    private _router:Router,
    public sample:SampleService){}

  ngOnInit(){
    // this._router.navigate(['/registration']);
  }

}
