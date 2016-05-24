'use strict'
import {Component, OnInit} from '@angular/core';
import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';
import {HTTP_PROVIDERS} from '@angular/http';
import {SampleService} from './services/sample.service';

import {OverviewComponent} from './overview.component';
import {RegistrationComponent} from './registration.component';



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
  {path:'/registration', component: OverviewComponent},
  {path:'/', component: RegistrationComponent}
])

export class AppComponent implements OnInit {

  constructor(
    private _router:Router,
    public sample:SampleService){}

  ngOnInit(){
    // this._router.navigate(['/registration']);
  }

}
