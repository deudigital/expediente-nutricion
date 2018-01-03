import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import { User } from '../Models/user';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
  private BASE_URL: string = 'https://expediente.nutricion.co.cr/nutri/public/api/web/';
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  constructor(private http: Http) {}
  login(user: User): Promise<any> {
    let url: string = `${this.BASE_URL}login`;//console.log(url);
    return this.http.post(url, user, {headers: this.headers}).toPromise();
  }
  reminder(user: User): Promise<any> {
    let url: string = `${this.BASE_URL}login/reminder`;console.log(url);
    return this.http.post(url, user, {headers: this.headers}).toPromise();
  }
  register(user: User): Promise<any> {
    let url: string = `${this.BASE_URL}/register`;
    return this.http.post(url, user, {headers: this.headers}).toPromise();
  }
  ensureAuthenticated(token): Promise<any> {
    let url: string = `${this.BASE_URL}/status`;
    let headers: Headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(url, {headers: headers}).toPromise();
  }
}
