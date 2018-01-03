import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {IMyDpOptions} from 'mydatepicker';

import { Analisis, Paciente } from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';

@Component({
  selector: 'app-personales',
  templateUrl: './personales.component.html',
  styles: []
})
export class PersonalesComponent implements OnInit {
	fcData:any;
	mng:any;
	paciente=new Paciente();
	oPaciente=new Paciente();
	esMenor:boolean=false;
	public fecha_nac: any = { date: {year: 2000, month: 1, day:1 } };;

	public birthdayOptions: IMyDpOptions = {
		dateFormat: 'dd/mm/yyyy',
		editableDateField: false,
		showClearDateBtn: false
	};
  

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcData		=	formControlDataService.getFormControlData();
		this.mng		=	this.fcData.getManejadorDatos();
		this.paciente	=	this.fcData.getFormPaciente();
		console.log(this.paciente);		
		this.setInfoInit();
		
		this.mng.setMenuPacienteStatus(true);
	}

	ngOnInit() {
		//this.verificarEdad();
	}
	ngOnDestroy() {
		this.saveForm();
	}
	setInfoInit(){
		if(this.paciente.fecha_nac){
			var current_fecha = this.paciente.fecha_nac.split('/');	
			var year	=	Number(current_fecha[2]);
			var month	=	Number(current_fecha[1]);
			var day		=	Number(current_fecha[0]);		
			this.fecha_nac		= { date: {year: year, month: month, day:day } };
		}
		
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
		console.log('save Datos Personales...');
		console.log(data);
		this.formControlDataService.saveDatosPersonales(data)
		.subscribe(
			 response  => {
						console.log('Response Datos Personales');
						console.log(response);
						this.updatePacienteInfo(response);
						this.mng.setEnableLink(true);
						this.router.navigate(['/contacto']);
						
					},
			error =>  console.log(<any>error)
		);
	}
	saveForm(){
		this.formControlDataService.getFormControlData().getFormPaciente().set(this.paciente);
		if(this.infoEdited())
			this.saveInfo(this.paciente);
	}
	
	Next(){
		this.saveForm();
	}
	updatePacienteInfo(data){
		this.paciente.id		=	data.id;
		this.paciente.persona_id=	data.id;
		this.formControlDataService.getFormControlData().getFormPaciente().set(this.paciente);
		//this.formControlDataService.getFormPaciente.id	=	data.id;
		this.mng.setEnableLink(true);
	}
	get mostrarFormParentezco(){
		return this.verificarEdad();
		/*return this.paciente.esMenor();*/
	}
	verificarEdad() {
		//console.log(this.paciente.fecha_nac);
		this.esMenor	=	false;
		
		if (this.fecha_nac) {
			//console.log(this.fecha_nac.date);
			this.paciente.fecha_nac	=	this.fecha_nac.date.day + '/' + this.fecha_nac.date.month + '/' + this.fecha_nac.date.year;;
			var fecha	=	new Date(this.fecha_nac.date.year, this.fecha_nac.date.month, this.fecha_nac.date.day).getTime();
			var timeDiff = Math.abs(Date.now() - fecha);
			var edad	=	Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365);		
			this.paciente.esMayor	=	edad>17;			
			return !this.paciente.esMayor;			
		}
		return false;
		/*return this.paciente.esMenor();*/
	}

	verificarEdad__old() {
		this.esMenor	=	false;
		if (this.paciente.fecha_nac) {
			var current_fecha = this.paciente.fecha_nac.split('/');	
			var year	=	Number(current_fecha[2]);
			var month	=	Number(current_fecha[1]);
			var day		=	Number(current_fecha[0]);
			var fecha	=	new Date(year, month, day).getTime();
			var timeDiff = Math.abs(Date.now() - fecha);
			var edad	=	Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365);		
			this.paciente.esMayor	=	edad>17;			
			return !this.paciente.esMayor;			
		}
		return false;
		/*return this.paciente.esMenor();*/
	}
	
}
