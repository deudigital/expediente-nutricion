import { Injectable } from '@angular/core';

import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class LoginRedirect {
	constructor(private auth: AuthService, private router: Router) {}
	canActivate(): boolean {
		 /*console.log('LoginRedirect');*/
		if (localStorage.getItem('token')) {
		  this.router.navigateByUrl('/inicio');
		  return false;
		}
		else {
		  return true;
		}
	}
}
