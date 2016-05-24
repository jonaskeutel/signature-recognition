'use strict'
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {SignatureComponent} from './signature.component';

@Component({
  selector: 'registration-component',
  providers: [],
  directives: [SignatureComponent],
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
        <signature *ngIf="step > 1"></signature>
      </div>
    </div>
  `
})

export class RegistrationComponent implements OnInit{
  public name:string;
  public age:number;
  public gender:string = 'm';
  public hand:string = 'r';
  
  public step:number = 1;
  
  ngOnInit(){
    
  }
  
  next(){
    this.step++
    console.log(this.name, this.age)
  }
  
  clear(){
    console.log("clear canvas")
  }

}
