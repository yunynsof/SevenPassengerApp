import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the FeeServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FeeServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello FeeServiceProvider Provider');
  }
/*
  getFee(credentials: CredentialsModel) {
    return this.http.post(this.cfg.apiUrl + this.cfg.user.login, credentials)
      .toPromise()
      .then(data => {
      })
      .catch(e => {throw(e)});
  }
  */

}
