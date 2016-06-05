'use strict'
import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';

import {SignatureComponent} from './signature.component';
import {ApiService} from './services/api.service';

@Component({
  selector: 'comparison-component',
  directives: [SignatureComponent, ROUTER_DIRECTIVES],
  providers: [ApiService],
  template: `
    <div id="signature-comparison">
      <div class="header">
        <h1>Comparison</h1>
      </div>

      <div id="personal-information">
        <div class=" form-buttons">
          <button class="btn btn-primary" (click)="compare()">Compare</button>
          <button class="btn btn-primary" (click)="clear()">Clear</button>
        </div>
        <signature></signature>
      </div>
    </div>
  `
})

export class ComparisonComponent implements OnInit{

  @ViewChild(SignatureComponent)
  private signatureComponent:SignatureComponent;

  constructor(
    private _api:ApiService,
    private _router:Router
  ){}

  ngOnInit(){

  }

  compare(){
      this._api.checkSignature(this.signatureComponent.getTouches()) //TODO: also pass ID?
  }

  clear(){
    console.log("clear canvas")
    this.signatureComponent.clear()
  }

}
