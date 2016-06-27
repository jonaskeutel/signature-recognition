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
    <div class="existing-signatures" *ngIf="signatures">

      <div class="col-md-6" *ngFor="let sign of signatures">
        <signature [sign]="sign"></signature>
      </div>

    </div>
  `
})

export class ComparisonComponent implements OnInit, OnActivate {

  @ViewChild(SignatureComponent)
  private signatureComponent:SignatureComponent;
  public signatures:Array;
  public userid:String = ""

  constructor(
    private _api:ApiService,
    private _router:Router
  ){}

  ngOnInit(){

  }

  routerOnActivate(curr: RouteSegment) {
    this.userid = curr.getParam('userid')

    this._api.getSignature(this.userid)
      .then( (signatures) => {
        console.log(signatures)
        var signs = []
        for(var i=0; i< signatures.length; i++){
          signs.push( this.convertSignatureData(signatures[i]) )
        }
        console.log(signs)
        this.signatures = signs
      })
  }

  compare(){
      console.log("touches: " + this.signatureComponent.getTouches().length)
    //   console.log(this.signatureComponent.getTouches())
      console.log("orientation: " + this.signatureComponent.getOrientation().length)
    //   console.log(this.signatureComponent.getOrientation())
      console.log("acceleration: " + this.signatureComponent.getAcceleration().length)
    //   console.log(this.signatureComponent.getAcceleration())
      this._api.checkSignature(this.signatureComponent.getTouches(), this.signatureComponent.getOrientation(), this.signatureComponent.getAcceleration().length, this.userid)
  }

  clear(){
    console.log("clear canvas")
    this.signatureComponent.clear()
  }

  convertSignatureData(signature){
    var dataPoints = signature.x.length;

    signature = this.normalizeSignature(signature)
    signature.force = JSON.parse( signature.force )

    return signature;
  }

  normalizeSignature(signature){
    signature.x = JSON.parse( signature.x )
    signature.y = JSON.parse( signature.y )
    var dataPoints = signature.x.length;
    var width = Math.max.apply(Math, signature.x) - Math.min.apply(Math, signature.x.filter(function(elem){return elem != null}))
    var height = Math.max.apply(Math, signature.y) - Math.min.apply(Math, signature.y.filter(function(elem){return elem != null}))
    var minX = Math.min.apply(Math, signature.x.filter(function(elem){return elem != null}))
    var minY = Math.min.apply(Math, signature.y.filter(function(elem){return elem != null}))

    var newX = [], newY = []
    console.log(signature)
    for(var i=0; i<dataPoints; i++){
      newX.push( signature.x[i] ? signature.x[i] - minX : null )
      newY.push( signature.x[i] ? signature.y[i] - minY : null)
    }
    console.log("normalize")
    signature.x = newX
    signature.y = newY
    signature.width = width
    signature.height = height

    return signature
  }
}
