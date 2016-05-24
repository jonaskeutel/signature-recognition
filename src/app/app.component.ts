'use strict'
import {Component, OnInit} from '@angular/core';
import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';
import {HTTP_PROVIDERS} from '@angular/http';
import {SampleService} from './services/sample.service';

import {SignatureComponent} from './signature.component';



@Component({
    selector: 'sample',
    providers: [ SampleService],
    directives: [SignatureComponent, ROUTER_DIRECTIVES],
    template:`
        <main>
          <signature></signature>
          <router-outlet></router-outlet>
        </main>
    `
})
@Routes([
  {path:'/', component: SignatureComponent},
  {path:'/registration', component: SignatureComponent}
])

export class AppComponent implements OnInit {

  constructor(
    // private _router:Router,
    public sample:SampleService){}

  ngOnInit(){
  }

}
