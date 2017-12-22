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
	message:string='';
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
		this.message	=	'Connecting...';
		this.auth.login(this.user)
			.then((user) => {
				var user	=	user.json();
				console.log(user);
				this.storeInfo(user);
				this.message	=	'Loading Info...';
				this.loadDataForm();				
			})
			.catch((err) => {
				console.log(err);
				err	=	JSON.parse(err._body);				
				this.message	=	err.message;
			});
	}
	storeInfo(data){
		this.fcd.setNutricionistaId(data.nutricionista.id);
		this.formControlDataService.setHeader(data.access_token);
		this.storeLocal(data);
	}
	storeLocal(data){		
		localStorage.setItem('token', data.access_token);
		localStorage.setItem('nutricionista_id', data.nutricionista.id);
	}
	loadDataForm(){
		this.formControlDataService.getDataForm()
		.subscribe(
			 response  => {
						this.message	=	'';
						this.mng.fillDataForm(response);
						//this.router.navigateByUrl('/inicio');
						this.router.navigate(['/inicio']);
						},
			error =>  console.log(<any>error)
		);
	}
	fillDataForm(data){
		this.mng.fillDataForm(data);		
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
