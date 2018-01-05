import { Injectable } from '@angular/core';

import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormControlDataService }     from '../control/data/formControlData.service';

@Injectable()
export class EnsureAuthenticated implements CanActivate {
	constructor(private auth: AuthService, private router: Router, private formControlDataService: FormControlDataService) {}	
	canActivate(): boolean {//console.log('EnsureAuthenticated->canActivate()');
		if(!localStorage.getItem('token')){
			this.router.navigateByUrl('/login');
			return false;
		}
		
		if (localStorage.getItem('token') && localStorage.getItem('nutricionista_id')) {
			this.formControlDataService.setSession(localStorage.getItem('nutricionista_id'), localStorage.getItem('token'));
			
			var fcd	=	this.formControlDataService.getFormControlData();
			var mng	=	fcd.getManejadorDatos();
			
			//console.log('mng.dataStored: ' + mng.dataStored );
			//if (!mng.dataStored && localStorage.getItem('data')){console.log('data from localStorage');
			if (localStorage.getItem('data')){//console.log('data from localStorage');
				var data	=	JSON.parse(localStorage.getItem('data'));
				//mng.fillDataForm(data, true);
				mng.fillDataForm(data);
			}
			/*
			if (!fcd.consulta.id && localStorage.getItem('consulta_id') ){console.log('consulta from localStorage');
				var consulta_id	=	JSON.parse(localStorage.getItem('consulta_id'));								
				this.formControlDataService.getConsultaSelected(consulta_id).subscribe(
					data => {console.log('getConsultaSelected(' + consulta_id + ') from ensure-auth');console.log(data);
						fcd.fill(data);
					},
					error => console.log(<any>error)
				);
				
			}*/
			return true;
		}
		else {
			this.router.navigateByUrl('/login');
			//console.log(false);
			return false;
		}
	}
	canActivate__old(): boolean {
		//console.log('ensure-auth_>canActivate');
		if (localStorage.getItem('token')) {
			//console.log(true);
			return true;
		}
		else {
			this.router.navigateByUrl('/login');
			//console.log(false);
			return false;
		}
	}
}
