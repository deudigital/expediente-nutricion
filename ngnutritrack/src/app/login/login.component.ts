import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { User } from '../Models/user';
import { FormControlDataService }     from '../control/data/formControlData.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  showFormReminder:boolean=false;
  showFormLogin:boolean=true;
  
   user: User = new User();
   fcd:any;
   mng:any;
   tagBody:any;
  constructor(private router: Router, private auth: AuthService, private formControlDataService: FormControlDataService) {
	  this.fcd	=	this.formControlDataService.getFormControlData();
	  this.mng	=	this.fcd.getManejadorDatos();
  }

  ngOnInit() {
	this.tagBody = document.getElementsByTagName('body')[0];
	this.tagBody.classList.add('page-login');
  }
  
	ngOnDestroy(){
		this.tagBody.classList.remove('page-login');
	}
  onReminder(): void {
    this.auth.reminder(this.user)
    .then((user) => {
		console.log(user.json());
    })
    .catch((err) => {
      console.log(err);
    });
  }
  onLogin(): void {
    this.auth.login(this.user)
    .then((user) => {
		var _user	=	user.json();
		//console.log(user.json());
		console.log(_user);
      localStorage.setItem('token', _user.access_token);
      localStorage.setItem('nutricionista_id', _user.nutricionista.id);	  
	  this.fcd.setNutricionistaId(_user.nutricionista.id);	  
      this.router.navigateByUrl('/inicio');	  
    })
    .catch((err) => {
      console.log(err);
    });
  }
  
  showReminder(){
    this.showFormReminder=true;
    this.showFormLogin=false;
  }
  showLogin(){
    this.showFormReminder=false;
    this.showFormLogin=true;
  }
}
