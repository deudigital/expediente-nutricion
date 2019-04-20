import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControlData, ManejadorDatos, Objetivo }     from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';

@Component({
  selector: 'app-objetivo',
  templateUrl: './objetivo.component.html',
  styles: []
})
export class ObjetivoComponent implements OnInit {
	fcd:FormControlData;
	mng:ManejadorDatos;
	helpers:any;
	nuevo:boolean=false;
	objetivos:Objetivo[];
	objetivo=new Objetivo();
	newObjetivo=new Objetivo();
	body:any;

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
		this.helpers	=	this.fcd.getHelpers();
		this.mng		=	this.fcd.getManejadorDatos();
		this.mng.setMenuPacienteStatus(true);
	}
	ngOnInit(){
		this.body = document.getElementsByTagName('body')[0];
		this.cargarObjetivosDelPaciente();
	}  
	ngOnDestroy(){
		this.helpers.scrollToForm();

	}
	showFormEdit(){
		this.nuevo	=	!this.nuevo;
	}
	cargarObjetivosDelPaciente(){
		this.objetivos	=	this.fcd.getFormPacienteObjetivos();
	}
	isValid(){
		return true;
	}
	remove(objetivo){
		var index	=	this.objetivos.indexOf(objetivo);
		this.formControlDataService.delete('objetivos', objetivo).subscribe(
			 response  => {
						this.objetivos.splice(index,1);
						},
			error =>  console.log(<any>error)
		);
	}
	save(data){
		this.formControlDataService.store('objetivos', data)
		.subscribe(
			 response  => {
						this.setObjetivo(response);
						},
			error =>  console.log(<any>error)
		);
	}
	adicionarNuevo(){
		if(this.isValid()){
			this.newObjetivo.paciente_id	=	this.fcd.getFormPaciente().id;
			this.save(this.newObjetivo);
		}
	}
	setObjetivo(response){
		if(response.code==201){
			var objetivo	=	response.data;
			this.objetivos.push(objetivo);
			this.newObjetivo.descripcion	=	'';
			this.nuevo	=	false;
		}
	}
	
	Previous(){
		this.router.navigate(['/hcf']);
	}
	Next(){
		this.router.navigate(['/actividad']);
	}
	
	
}
