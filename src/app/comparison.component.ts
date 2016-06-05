'use strict'
import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Routes, Router, ROUTER_DIRECTIVES, OnActivate, RouteSegment} from '@angular/router';

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
    <div class="existing-signatures">
      
      
    
    </div>
  `
})

export class ComparisonComponent implements OnInit, OnActivate {

  @ViewChild(SignatureComponent)
  private signatureComponent:SignatureComponent;

  constructor(
    private _api:ApiService,
    private _router:Router
  ){}

  ngOnInit(){

  }

  routerOnActivate(curr: RouteSegment) {
    let userid = curr.getParam('userid')
    
    this._api.getSignature(userid)
      .then( (signatures) => {
        console.log(signatures)
      })
  }

  compare(){
      this._api.checkSignature(this.signatureComponent.getTouches()) //TODO: also pass ID?
  }

  clear(){
    console.log("clear canvas")
    this.signatureComponent.clear()
  }

  convertSignatureData(signature){
    signature.x = JSON.parse( signature.x )
    signature.y = JSON.parse( signature.y )
    signature.force = JSON.parse( signature.force )
    var dataPoints = signature.x.length;
    var width = Math.max.apply(Math, signature.x) - Math.min.apply(Math, signature.x)
    var height = Math.max.apply(Math, signature.y) - Math.min.apply(Math, signature.y)
    
    let converted = []
    for(var i=0; i<dataPoints; i++){
      converted.push({
        x: signature.x[i],
        y: signature.y[i],
        pressure: signature.force[i]
      })
    }
    
  }

  normalizeSignature(signature){
    
  }
}
