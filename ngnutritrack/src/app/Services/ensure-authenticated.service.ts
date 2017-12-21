import { Injectable } from '@angular/core';

import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class EnsureAuthenticated implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  
  canActivate(): boolean {
	  console.log('ensure-auth_>canActivate');
    if (localStorage.getItem('token')) {
		console.log(true);
      return true;
    }
    else {
      this.router.navigateByUrl('/login');
	  console.log(false);
      return false;
    }
  }
}
