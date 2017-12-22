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

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
		this.mng		=	this.fcd.getManejadorDatos();
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
						console.log('Service:habitosEjercicios->receiving...');
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
						console.log('Service:habitosEjercicios->receiving...');
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
}
