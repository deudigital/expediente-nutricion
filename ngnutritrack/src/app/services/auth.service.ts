import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { Headers, Http } from '@angular/http';
import { User } from '../models/user';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
	private BASE_URL: string = environment.loginUrl;
	private headers: Headers = new Headers({'Content-Type': 'application/json'});
	constructor(private http: Http) {}
	login(user: User): Promise<any> {
		let url: string = `${this.BASE_URL}login`;
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
	verifyUser(user_id): Promise<any> {
		let url: string = `${this.BASE_URL}status`;
		return this.http.post(url, {'user_id':user_id}).toPromise();
	}
}
