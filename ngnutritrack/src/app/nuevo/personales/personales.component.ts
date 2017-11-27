import { Component, OnInit } from '@angular/core';

import { Analisis, Paciente } from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';

@Component({
  selector: 'app-personales',
  templateUrl: './personales.component.html',
  styles: []
})
export class PersonalesComponent implements OnInit {
	fcData:any;
	paciente=new Paciente();
	oPaciente=new Paciente();
	esMenor:boolean=false;
	constructor(private formControlDataService: FormControlDataService) {
		this.fcData		=	formControlDataService.getFormControlData();
		this.paciente	=	this.fcData.getFormPaciente();
		this.setInfoInit();
	}

	ngOnInit() {
		this.verificarEdad();
	}
	ngOnDestroy() {
		this.formControlDataService.getFormControlData().getFormPaciente().set(this.paciente);
		if(this.infoEdited())
			this.saveInfo(this.paciente);

	}
	setInfoInit(){
		this.oPaciente.cedula				=	this.paciente.cedula;
		this.oPaciente.nombre				=	this.paciente.nombre;
		this.oPaciente.genero				=	this.paciente.genero;
		this.oPaciente.fecha_nac			=	this.paciente.fecha_nac;
		this.oPaciente.responsable_cedula	=	this.paciente.responsable_cedula;
		this.oPaciente.responsable_nombre	=	this.paciente.responsable_nombre;
		this.oPaciente.responsable_parentezco	=	this.paciente.responsable_parentezco;
	}
	
	infoEdited(){
		return 	(
			this.oPaciente.cedula					!==	this.paciente.cedula || 
			this.oPaciente.nombre					!==	this.paciente.nombre || 
			this.oPaciente.genero					!==	this.paciente.genero || 
			this.oPaciente.fecha_nac				!==	this.paciente.fecha_nac || 
			this.oPaciente.responsable_cedula		!==	this.paciente.responsable_cedula || 
			this.oPaciente.responsable_nombre		!==	this.paciente.responsable_nombre || 
			this.oPaciente.responsable_parentezco	!==	this.paciente.responsable_parentezco
		);

	}
	saveInfo(data){
		console.log('saveInfo:sending...');
		console.log(data);
		this.formControlDataService.saveDatosPersonales(data)
		.subscribe(
			 response  => {
						console.log('saveInfo:receiving...');
						console.log(response);
						},
			error =>  console.log(<any>error)
		);
	}
	verificarEdad() {
		this.esMenor	=	false;
		if (this.paciente.fecha_nac) {
			console.log(Date.now() );
			/*console.log(Date.now()  +  ' - ' + this.paciente.fecha_nac );
			var timeDiff = Math.abs(Date.now() - this.paciente.fecha_nac);
			console.log(timeDiff);
			var edad	=	Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365);
			console.log(edad);
			this.esMenor	=	edad<18;*/
		
		}
	}
}
