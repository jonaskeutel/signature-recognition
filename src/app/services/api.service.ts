import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Sample} from '../model/sample';
// import {Observable} from 'rxjs/Observable';


@Injectable()
export class ApiService {
  private userId:number;
  constructor(private _http:Http){}

  register(user:Object){
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise((resolve, reject) => {
      this._http.post('/api/user', this.objectToString(user),  {headers: headers} )
            .subscribe(
              data => {
                console.log(data, data._body.id, data._body)
                this.userId = JSON.parse( data._body).id
                console.log(this.userId)
              },
              err => console.log(err),
              () => console.log('Authentication Complete')
            );
      resolve()
    });
  }

  addSignature(signature:Array){
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    var data = {
      personID: this.userId,
      x: signature.map( (elem) => {return elem ? elem.x : null}),
      y: signature.map( (elem) => {return elem ? elem.y: null}),
      force: signature.map( (elem) => {return elem ? elem.pressure : null}),
      acceleration: [],
      gyroscope: [],
      duration: signature.length * 10
    }

    return new Promise((resolve, reject) => {
      this._http.post('/api/signature', this.objectToString(data),  {headers: headers} )
            .subscribe(
              data => console.log(data),
              err => console.log(err),
              () => console.log('Authentication Complete')
            );
      resolve()
    });
  }

  getUsers(){
    return new Promise((resolve, reject) => {
      this._http.get('/api/user/all' )
            .subscribe(
              data => resolve( JSON.parse(data._body) ),
              err => console.log(err),
              () => {}
            );
    });
  }

  getSignature(userid){
    return new Promise((resolve, reject) => {
      this._http.get('/api/signature/'+userid )
            .subscribe(
              data => resolve( JSON.parse(data._body) ),
              err => console.log(err),
              () => {}
            );
    });
  }

  checkSignature(signature:Array, userId:String){
    var headers = new Headers()
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    var data = {
      personid: userId,
      x: signature.map((elem) => { return elem ? elem.x : null }),
      y: signature.map((elem) => { return elem ? elem.y : null }),
      force: signature.map((elem) => { return elem ? elem.pressure : null }),
      acceleration: [],
      gyroscope: [],
      duration: signature.length * 10
    }

    return new Promise((resolve, reject) => {
      this._http.post('/api/signature/check', this.objectToString(data),  {headers: headers} )
            .subscribe(
              data => console.log(data),
              err => console.log(err),
              () => console.log('Authentication Complete')
            );
      resolve()
    });
  }

  objectToString(body:Object){
    var converted:string = ""

    for(var i=0; i< Object.keys(body).length; i++){
      var key = Object.keys(body)[i]
      var value = typeof body[key] == 'object' ? JSON.stringify(body[key]) : body[key]


      converted += key+'='+value
      if( i < Object.keys(body).length-1 )
        converted += '&'
    }
    // console.log(converted)
    return converted
  }

}
