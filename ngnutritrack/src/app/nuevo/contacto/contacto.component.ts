import { Component, OnInit } from '@angular/core';

import { Analisis, Paciente } from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styles: []
})
export class ContactoComponent implements OnInit {
	model:any;

	fcData:any;
	paciente=new Paciente();
	oPaciente=new Paciente();
	esMenor:boolean=false;
	constructor(private formControlDataService: FormControlDataService) {
		this.fcData		=	formControlDataService.getFormControlData();
		this.paciente	=	this.fcData.getFormPaciente();
		this.setInfoInit();
	}
/*
	constructor(private formControlDataService: FormControlDataService) {
		this.model	=	formControlDataService.getFormControlData().getFormPaciente();
	}*/

	ngOnInit() {
	}
	ngOnDestroy() {
		this.formControlDataService.getFormControlData().getFormPaciente().set(this.paciente);
		if(this.infoEdited())
			this.saveInfo(this.paciente);

	}
	
	setInfoInit(){
		this.oPaciente.telefono				=	this.paciente.telefono;
		this.oPaciente.celular				=	this.paciente.celular;
		this.oPaciente.email				=	this.paciente.email;
		this.oPaciente.provincia			=	this.paciente.provincia;
		this.oPaciente.canton				=	this.paciente.canton;
		this.oPaciente.distrito				=	this.paciente.distrito;
		this.oPaciente.detalles_direccion	=	this.paciente.detalles_direccion;
		this.oPaciente.responsable_telefono	=	this.paciente.responsable_telefono;
		this.oPaciente.responsable_email	=	this.paciente.responsable_email;
	}
	
	infoEdited(){
		return 	(
			this.oPaciente.telefono				!==	this.paciente.telefono || 
			this.oPaciente.celular				!==	this.paciente.celular || 
			this.oPaciente.email				!==	this.paciente.email || 
			this.oPaciente.provincia			!==	this.paciente.provincia || 
			this.oPaciente.canton				!==	this.paciente.canton || 
			this.oPaciente.distrito				!==	this.paciente.distrito || 
			this.oPaciente.detalles_direccion	!==	this.paciente.detalles_direccion || 
			this.oPaciente.responsable_telefono	!==	this.paciente.responsable_telefono || 
			this.oPaciente.responsable_email	!==	this.paciente.responsable_email
		);

	}
	saveInfo(data){
		console.log('saveInfo:sending...');
		console.log(data);
		this.formControlDataService.saveDatosContacto(data)
		.subscribe(
			 response  => {
						console.log('saveInfo:receiving...');
						console.log(response);
						},
			error =>  console.log(<any>error)
		);
	}

}
