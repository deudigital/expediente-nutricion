import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {IMyDpOptions, IMyDate} from 'mydatepicker';

import { Analisis, Paciente } from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-personales',
  templateUrl: './personales.component.html',
  styles: []
})
export class PersonalesComponent implements OnInit {
	fcData:any;
	mng:any;
	helpers:any;
	paciente=new Paciente();
	oPaciente=new Paciente();
	esMenor:boolean=false;

	btnNavigation_pressed:boolean;
	page:string;
	pacienteNuevo:boolean;
	
	private selDate: IMyDate = {year: 0, month: 0, day: 0};
	public fecha_nac: any;

	public birthdayOptions: IMyDpOptions = {
		dateFormat: 'dd/mm/yyyy',
		editableDateField: false,
		showClearDateBtn: false
	};

	constructor(private auth: AuthService, private router: Router, private formControlDataService: FormControlDataService) {
		this.fcData		=	formControlDataService.getFormControlData();
		this.mng		=	this.fcData.getManejadorDatos();
		this.paciente	=	this.fcData.getFormPaciente();
		this.helpers	=	this.fcData.getHelpers();
	}
	ngOnInit() {
		this.btnNavigation_pressed	=	false;
		this.pacienteNuevo	=	this.mng.operacion=='nuevo-paciente';
		this.auth.verifyUser(localStorage.getItem('nutricionista_id'))
			.then((response) => {
				var response	=	response.json();
				if(!response.valid){
					localStorage.clear();
					this.formControlDataService.getFormControlData().message_login	=	response.message;
					this.router.navigateByUrl('/login');
					return false;
				}		
				
				this.setInfoInit();				
				this.mng.setMenuPacienteStatus(true);				
			})
			.catch((err) => {
				console.log(JSON.parse(err._body));
			});
			
	}
	ngOnDestroy() {
		if(!this.btnNavigation_pressed)
			this.saveForm();
		this.helpers.scrollToForm();
	}
	setInfoInit(){
		if(!this.paciente.nutricionista_id)
			this.paciente.nutricionista_id	=	this.fcData.nutricionista_id;
		
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
		this.formControlDataService.saveDatosPersonales(data)
		.subscribe(
			 response  => {
						this.updatePacienteInfo(response);
						this.goTo(this.page);
						this.btnNavigation_pressed	=	false;
					},
			error =>  {
				console.log(<any>error)
				this.btnNavigation_pressed	=	false;
			}
		);
	}
	saveForm(){
		this.formControlDataService.getFormControlData().getFormPaciente().set(this.paciente);
		if(this.infoEdited())
			this.saveInfo(this.paciente);
		else
			this.goTo(this.page);
	}
	
	Next(){
		this.btnNavigation_pressed	=	true;
		this.page	=	'/contacto';
		this.saveForm();
		if(!this.pacienteNuevo)
			this.router.navigate(['/contacto']);
	}
	goTo(page){
		if(this.btnNavigation_pressed)
			this.router.navigate([page]);
	}
	updatePacienteInfo(data){
		this.paciente.id		=	data.id;
		this.paciente.persona_id=	data.id;
		this.formControlDataService.getFormControlData().getFormPaciente().set(this.paciente);
	}
	get mostrarFormParentezco(){
		return this.verificarEdad();
	}
	verificarEdad() {
		this.esMenor	=	false;
		
		if (this.fecha_nac) {
			this.paciente.fecha_nac	=	this.fecha_nac.date.day + '/' + this.fecha_nac.date.month + '/' + this.fecha_nac.date.year;;
			var fecha	=	new Date(this.fecha_nac.date.year, this.fecha_nac.date.month, this.fecha_nac.date.day).getTime();
			var timeDiff = Math.abs(Date.now() - fecha);
			var edad	=	Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365);		
			this.paciente.esMayor	=	edad>17;			
			return !this.paciente.esMayor;			
		}
		return false;
	}
}
