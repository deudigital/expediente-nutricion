import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
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
	correo:string='';
	user: User = new User();
	fcd:any;
	mng:any;
	tagBody:any;
	
	messages:any = {
		reminder_sent: false,
		reminder_message: false,
		login_usuario: false,
		login_password: false
	};
	 public usuario;
	
	constructor(private router: Router, private auth: AuthService, private formControlDataService: FormControlDataService) {
		this.fcd	=	this.formControlDataService.getFormControlData();
		this.mng	=	this.fcd.getManejadorDatos();
		 this.usuario = {
        "nombre": "",
        "apellidos": "",
        "email": "",
        "password": ""
    };
	}
	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		this.tagBody.classList.add('page-login');
		this.message	=	this.fcd.message_login;
	}  
	ngOnDestroy(){
		this.tagBody.classList.remove('page-login');
	}
	onReminder(){
		this.auth.reminder(this.user)
			.then((response) => {
				var response	=	response.json();
				if(response.code==201){
					this.messages.reminder_sent	=	true;
					setInterval(() => {
						this.messages.reminder_sent	=	false;
						this.user	=	new User();
						this.showLogin();
					  }, 5000);
				}
				if(response.code==204){
					this.messages.reminder_message	=	true;
					setInterval(() => {
						this.messages.reminder_message	=	false;						
					  }, 5000);
				}
				
			})
			.catch((err) => {
				console.log(err);
			});
	}
	onLogin(): void {
		this.message	=	'Ingresando...';
		this.auth.login(this.user)
			.then((user) => {
				var user	=	user.json();
				this.formControlDataService.setSession(user.nutricionista.id, user.access_token);				
				this.message	=	'Cargando datos...';
				this.loadDataForm();				
			})
			.catch((err) => {
				err	=	JSON.parse(err._body);				
				console.log(err);
				switch(err.error){
					case 'Unauthorized':
						this.message	=	err.message;
						break;
					default:
						this.message	=	'Error Interno, Intenta nuevamente mas tarde';
					
				}
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
		if (localStorage.getItem('data')){
			var data	=	JSON.parse(localStorage.getItem('data'));
			this.mng.fillDataForm(data, true);
			this.router.navigate(['/inicio']);
			return ;
		}
		
		this.formControlDataService.getDataForm()
		.subscribe(
			 response  => {
						this.message	=	'';
						this.mng.fillDataForm(response);
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
	 onSubmit(){
		/*console.log(this.usuario);*/
	}
}
