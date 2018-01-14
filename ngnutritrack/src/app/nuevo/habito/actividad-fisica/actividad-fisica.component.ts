import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HabitosEjercicio }     from '../../../control/data/formControlData.model';
import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-actividad-fisica',
  templateUrl: './actividad-fisica.component.html',
  styles: []
})
export class ActividadFisicaComponent implements OnInit {
	nuevo:boolean=false;
	habitosEjercicios:any[];
	habitosEjercicio=new HabitosEjercicio();
	ejercicios:any[];
	newHabitosEjercicio=new HabitosEjercicio();
	fcd:any;
	mng:any;	
	body:any;
	helpers:any;

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
		this.mng		=	this.fcd.getManejadorDatos();
		this.helpers	=	this.fcd.getHelpers();
	}

	ngOnInit() {
		this.body = document.getElementsByTagName('body')[0];
		this.ejercicios	=	this.mng.getEjercicios();
		console.log(this.ejercicios);
		this.cargarActividadesDelPaciente();
		
	}  
	ngOnDestroy(){

	}
	showFormEdit(){
		this.nuevo	=	!this.nuevo;
	}

	
	
	cargarActividadesDelPaciente(){
		this.habitosEjercicios	=	this.fcd.getFormPacienteHabitosEjercicios();
	}
	isValid(){
		return true;
	}
	remove(habitosEjercicio){
		var index	=	this.habitosEjercicios.indexOf(habitosEjercicio);
		this.formControlDataService.delete('ejercicios', habitosEjercicio).subscribe(
			 response  => {
						console.log('Eliminado');
						console.log(response);						
						this.habitosEjercicios.splice(index,1);
						},
			error =>  console.log(<any>error)
		);
	}
	save(data){
		this.formControlDataService.store('habitos_ejercicios', data)
		.subscribe(
			 response  => {
						console.log('store->response...');
						console.log(response);
						this.setHabitosEjercicio(response);
						},
			error =>  console.log(<any>error)
		);
	}
	adicionarNuevo(){
		if(this.isValid()){
			this.newHabitosEjercicio.paciente_id	=	this.fcd.getFormPaciente().id;
			this.save(this.newHabitosEjercicio);
		}
	}
	setHabitosEjercicio(response){		
		if(response.code==201){
			var habitosEjercicio	=	response.data;
			this.habitosEjercicios.push(habitosEjercicio);
			this.newHabitosEjercicio.horas_semanales	=	0;
			this.nuevo	=	false;
		}
	}
	
	Previous(){
		this.router.navigate(['/objetivo']);
	}
	Next(){
		this.router.navigate(['/valoracion-dietetica']);
	}
	isNumberKey(evt) {
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode == 46) {
			//Check if the text already contains the . character
			var txt 	=	String(this.newHabitosEjercicio.horas_semanales)
			if (txt.indexOf('.') === -1) {
				return true;
			} else {
				return false;
			}
		} else {
			if (charCode > 31
				 && (charCode < 48 || charCode > 57))
				return false;
		}
		return true;
	}
}
