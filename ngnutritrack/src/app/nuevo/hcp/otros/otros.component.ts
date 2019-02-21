import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HcpOtros } from '../../../control/data/formControlData.model';
import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-otros',
  templateUrl: './otros.component.html',
  styles: []
})
export class OtrosComponent implements OnInit {

	fcd:any;
	helpers:any;
	mng:any;
	paciente:any;
	hcpOtros:any;
	oHcpOtros=new HcpOtros();
	body:any;
	btnNavigation_pressed:boolean;
	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcd		=	this.formControlDataService.getFormControlData();
		this.helpers	=	this.fcd.getHelpers();
		this.paciente	=	this.fcd.getFormPaciente();
		this.hcpOtros	=	this.fcd.getFormPacienteHcpOtros();
		this.mng		=	this.fcd.getManejadorDatos();
		this.mng.setMenuPacienteStatus(true);
		this.setInfoInit();
	}

	ngOnInit() {
		this.body = document.getElementsByTagName('body')[0];
		this.body.classList.add('menu-parent-hcp');
		this.btnNavigation_pressed	=	false;
	}
	ngOnDestroy(){
		this.body.classList.remove('menu-parent-hcp');
		if(!this.btnNavigation_pressed)
			this.saveForm();
		this.helpers.scrollToForm();
	}
	
	setInfoInit(){
		this.oHcpOtros.ciclos_menstruales	=	this.hcpOtros.ciclos_menstruales;
		this.oHcpOtros.notas				=	this.hcpOtros.notas;		
	}
	infoEdited(){
		return 	(
			this.oHcpOtros.ciclos_menstruales	!==	this.hcpOtros.ciclos_menstruales || 
			this.oHcpOtros.notas				!==	this.hcpOtros.notas
		);
	}
	setHcpOtros(response){
		this.fcd.setFormPacienteHcpOtros(response.data);
	}
	saveInfo(data){
		if(!this.paciente.id){
			return ;
		}		
		this.formControlDataService.store('hcp_otros', data)
		.subscribe(
			 response  => {
						this.setHcpOtros(response);						
						},
			error =>  console.log(<any>error)
		);
	}
	saveForm(){
		if(this.infoEdited())
			this.saveInfo(this.hcpOtros);
	}
	Previous(){
		this.btnNavigation_pressed	=	true;
		this.saveForm();
		this.router.navigate(['/bioquimica']);
	}
	Next(){
		this.btnNavigation_pressed	=	true;
		this.saveForm();
		this.router.navigate(['/hcf']);
	}
}
