'use strict'
import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';

import {SignatureComponent} from './signature.component';
import {ApiService} from './services/api.service';

@Component({
  selector: 'registration-component',
  directives: [SignatureComponent, ROUTER_DIRECTIVES],
  providers: [ApiService],
  template: `
    <div id="user-registration">
      <div class="header">
        <h1>Registration</h1>
      </div>

      <div id="personal-information">
        <div class="input-form" [ngClass]="{'close': step != 1}">
          <div class="input-group">
            <span class="input-group-addon" id="basic-addon1"></span>
            <input [(ngModel)]="name" type="text" class="form-control" placeholder="Name" aria-describedby="basic-addon1">
          </div>
          <div class="input-group">
            <span class="input-group-addon" id="basic-addon1"></span>
            <input [(ngModel)]="age" type="text" class="form-control" placeholder="Age" aria-describedby="basic-addon1">
          </div>
          <div class="radio-input">
              <span class="input-group-addon">
                <input [checked]="gender == 'm'" type="radio" (click)="gender='m'" value="m">
                Male
              </span>
              <span class="input-group-addon">
                <input [checked]="gender == 'f'" type="radio" (click)="gender='f'" value="f">
                Female
              </span>
          </div>
          <div class="radio-input">
              <span class="input-group-addon">
                <input [checked]="hand == 'l'" type="radio" (click)="hand='l'" value="m">
                Left hand
              </span>
              <span class="input-group-addon">
                <input [checked]="hand == 'r'" type="radio" (click)="hand='r'" value="f">
                Right Hand
              </span>
          </div>
        </div>
        <div class=" form-buttons">
          <button class="btn btn-primary" (click)="next()">Next</button>
          <button class="btn btn-primary" (click)="clear()" [ngClass]="{'hidden': step==1}">Clear</button>
        </div>
        <signature *ngIf="step > 1 && step < 6"></signature>
        <div *ngIf="step > 2">Nochmal wiederholen</div>
      </div>
    </div>
  `
})

export class RegistrationComponent implements OnInit{
  public name:string = '';
  public age:number = 18;
  public gender:string = 'm';
  public hand:string = 'r';
  public touchData = {sth: "jaoksdkh"};

  public step:number = 1;

  @ViewChild(SignatureComponent)
  private signatureComponent:SignatureComponent;

  constructor(
    private _api:ApiService,
    private _router:Router
  ){}

  ngOnInit(){

  }

  next(){
    if(this.step == 1){
      this._api.register({
        name: this.name,
        age: this.age,
        gender: this.gender,
        hand: this.hand
      })
    }else if(this.step > 1){
      this._api.addSignature(this.signatureComponent.getTouches(), this.signatureComponent.getOrientation(), this.signatureComponent.getAcceleration(), this.signatureComponent.getWidth(), this.signatureComponent.getHeight(), this.signatureComponent.getNumStrokes())
      this.signatureComponent.clear()
    }

    this.step++
    if(this.step == 6){
      this._router.navigate(['/']);
    }
  }

  clear(){
    console.log("clear canvas")
    this.signatureComponent.clear()
  }

}
