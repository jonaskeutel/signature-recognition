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

  addSignature(touches:Array, orientation:Array, acceleration:Array, width, height, strokes){
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    var data = {
      personid: this.userId,
      x: touches.map( (elem) => {return elem ? elem.x : null}),
      y: touches.map( (elem) => {return elem ? elem.y: null}),
      force: touches.map( (elem) => {return elem ? elem.pressure : null}),
      acceleration: acceleration.map( (elem) => {return elem ? elem: null}),
      gyroscope: orientation.map( (elem) => {return elem ? elem: null}),
      duration: touches.length * 10,
      height: height,
      width: width,
      strokes: strokes,
    }
    data = this.normalizeSignature(data)

    console.log(data)

    return new Promise((resolve, reject) => {
      this._http.post('/api/signature/' + data.personid, this.objectToString(data),  {headers: headers} )
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

  checkSignature(touches:Array, orientation:Array, acceleration:Array, width, height, strokes, userId:String){
    var headers = new Headers()
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    var data = {
      personid: userId,
      x: touches.map((elem) => { return elem ? elem.x : null }),
      y: touches.map((elem) => { return elem ? elem.y : null }),
      force: touches.map((elem) => { return elem ? elem.pressure : null }),
      acceleration: acceleration,
      gyroscope: orientation,
      width: width,
      height: height,
      strokes,
      duration: touches.length * 10
    }
    data = this.normalizeSignature(data)
    console.log("about to post to /api/signature/check")
    return new Promise((resolve, reject) => {
      this._http.post('/api/signature/check', this.objectToString(data),  {headers: headers} )
            .subscribe(
              data => {
                        var result = JSON.parse(data['_body']);
                        var resString = "Signature was ";
                        if (!result.success) {
                            resString += "not "
                        }
                        resString += "successful. Certainity was " + Math.round(result.combinedCertainity * 100) + "%, but the threshold is 85%.";
                        alert(resString);
                      },
              err => console.log(err),
              () => console.log('Authentication Complete')
            );
      resolve()
    });
  }


  addCertainities(certainities){
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise((resolve, reject) => {
      this._http.post('/api/certainities/' + certainities.personid, this.objectToString(certainities),  {headers: headers} )
            .subscribe(
              data => console.log(data),
              err => console.log(err),
              () => console.log('Complete')
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

  normalizeSignature(signature){
    var dataPoints = signature.x.length;
    // var width = Math.max.apply(Math, signature.x) - Math.min.apply(Math, signature.x.filter(function(elem){return elem != null}))
    // var height = Math.max.apply(Math, signature.y) - Math.min.apply(Math, signature.y.filter(function(elem){return elem != null}))
    var minX = Math.min.apply(Math, signature.x.filter(function(elem){return elem != null}))
    var minY = Math.min.apply(Math, signature.y.filter(function(elem){return elem != null}))

    var newX = [], newY = []
    // console.log(signature)
    for(var i=0; i<dataPoints; i++){
      newX.push( signature.x[i] ? signature.x[i] - minX : null )
      newY.push( signature.x[i] ? signature.y[i] - minY : null)
    }
    signature.x = newX
    signature.y = newY
    // signature.width = width
    // signature.height = height
    console.log("normalized")
    return signature
  }

}
