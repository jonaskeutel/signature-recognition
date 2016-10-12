import {Http, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import {Sample} from '../model/sample';
// import {Observable} from 'rxjs/Observable';


@Injectable()
export class SampleService {

  constructor(private _http:Http){}

  like(postId:string){
    // return this._http.get('/api/newTracks')
      // .subscribe(
      //   data => console.log(data),
      //   err => console.log(err),
      //   () => console.log('Authentication Complete')
      // );
    return new Promise((resolve, reject) => {

      resolve()
    });
  }


}
