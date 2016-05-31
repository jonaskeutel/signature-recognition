'use strict'
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';
import {ApiService} from './services/api.service';

@Component({
  selector: 'overview',
  providers: [ROUTER_DIRECTIVES, ApiService],
  template: `
    <div id="user-overview">
      <h1>Overview</h1>
      <div>
        <button class="btn btn-primary new-button" (click)="newUser()" >New</button>
      </div>
      <div class="persons">
        <div class="person" ng-click="console.log('sdsad')" *ngFor="let person of persons">
          <div class="person-image">
            <img src="assets/img/graphics/avatar_male.png" *ngIf="person.gender == 'm'">
            <img src="assets/img/graphics/avatar_female.png" *ngIf="person.gender == 'f'">
          </div>
          <div class="person-info">
            {{ person.name }}, {{ person.age }} | {{ person.hand }}
          </div>
        </div>
      </div>
    </div>
  `
})

export class OverviewComponent implements OnInit{
  public persons:Object;

  constructor(
    private _router:Router,
    private _api:ApiService
  ){
    
  }

  ngOnInit(){
     this._api.getUsers()
      .then( users => {
        console.log(users)
        this.persons = users
      }) 
  }

  newUser(){
    this._router.navigate(['/registration']);
  }

  compare(id){
    console.log('compare')
    this._router.navigate(['/compare']);
  }
}
