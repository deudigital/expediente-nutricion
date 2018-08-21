import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormControlDataService }     from '../control/data/formControlData.service';

@Injectable()
export class EnsureAuthenticated implements CanActivate {
	_checking:boolean;
	_status:any;
	constructor(private auth: AuthService, private router: Router, private formControlDataService: FormControlDataService) {
		console.log('ensure-authenticated-service');
		this._checking	=	false;
	}
	canActivate__working(): boolean {
		if(!localStorage.getItem('token')){
			this.router.navigateByUrl('/login');
			return false;
		}
		if (localStorage.getItem('token') && localStorage.getItem('nutricionista_id')) {
			if(this._checking)
				return false;
			console.log('verifyStatus(' + localStorage.getItem('nutricionista_id') + ')');
			this._checking	=	true;
			this.formControlDataService.verifyStatus(localStorage.getItem('nutricionista_id'))
			.subscribe(
				 response  => {
					 console.log( response );
							this._checking	=	false;
							//this._status	=	JSON.stringify(response);
							this._status	=	response;
							if( this._status.activo ){
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
						},
				error =>  console.log(<any>error)
			);
		
			
		}
		else {
			this.router.navigateByUrl('/login');
			return false;
		}
	}
	canActivate(): boolean {console.log('canActivate');
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
