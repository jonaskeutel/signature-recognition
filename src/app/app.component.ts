'use strict'
import {Component, OnInit} from '@angular/core';
// import {RouteConfig, Router, ROUTER_DIRECTIVES} from '@angular/router';
import {HTTP_PROVIDERS} from '@angular/http';
import {SampleService} from './services/sample.service';

import {SignatureComponent} from './signature.component';



@Component({
    selector: 'sample',
    providers: [ SampleService],
    directives: [SignatureComponent],
    template:`
        <main>
          <signature></signature>
        </main>
    `
})
// @RouteConfig([
//   {path:'/', name: 'Home', component: SampleComponent},
//   {path:'/profile/:profileid', name: 'Profile', component: SampleComponent}
// ])

export class AppComponent implements OnInit {

  constructor(
    // private _router:Router,
    public sample:SampleService){}

  ngOnInit(){
  }

}
