import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormControlDataService }     from '../control/data/formControlData.service';

@Injectable()
export class EnsureAuthenticated implements CanActivate {
	constructor(private auth: AuthService, private router: Router, private formControlDataService: FormControlDataService) {}	
	canActivate__working(): boolean {
		if(!localStorage.getItem('token')){
			this.router.navigateByUrl('/login');
			return false;
		}
		if (localStorage.getItem('token') && localStorage.getItem('nutricionista_id')) {
			console.log('verifyStatus(' + localStorage.getItem('nutricionista_id') + ')');
			var _status	=	this.formControlDataService.verifyStatus(localStorage.getItem('nutricionista_id'));
			console.log( _status );
			if( _status ){
				this.formControlDataService.setSession(localStorage.getItem('nutricionista_id'), localStorage.getItem('token'));
				
				var fcd	=	this.formControlDataService.getFormControlData();
				var mng	=	fcd.getManejadorDatos();
				
				if (localStorage.getItem('data')){
					var data	=	JSON.parse(localStorage.getItem('data'));
					mng.fillDataForm(data);
				}
				return true;
			}else{
				//localStorage.clear();
				localStorage.setItem('login_message', 'Su cuenta esta desactivada, favor ponerse en contacto con nosotros para solucionar este problema');
				this.router.navigateByUrl('/login');
				return false;
			}
		}
		else {
			this.router.navigateByUrl('/login');
			return false;
		}
	}
	canActivate(): boolean {
		if(!localStorage.getItem('token')){
			this.router.navigateByUrl('/login');
			return false;
		}
		if (localStorage.getItem('token') && localStorage.getItem('nutricionista_id')) {
			this.formControlDataService.setSession(localStorage.getItem('nutricionista_id'), localStorage.getItem('token'));
			
			var fcd	=	this.formControlDataService.getFormControlData();
			var mng	=	fcd.getManejadorDatos();
			
			if (localStorage.getItem('data')){
				var data	=	JSON.parse(localStorage.getItem('data'));
				mng.fillDataForm(data);
			}
			return true;
		}
		else {
			this.router.navigateByUrl('/login');
			return false;
		}
	}
}
