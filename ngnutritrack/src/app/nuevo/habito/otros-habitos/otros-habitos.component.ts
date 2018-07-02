import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControlData, ManejadorDatos, Paciente, HabitosOtro } from '../../../control/data/formControlData.model';
import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-otros-habitos',
  templateUrl: './otros-habitos.component.html',
  styles: []
})
export class OtrosHabitosComponent implements OnInit {
	fcd:FormControlData;
	mng:ManejadorDatos;
	paciente:Paciente;
	
	otros:HabitosOtro	=	new HabitosOtro();;
	oOtros:HabitosOtro=	new HabitosOtro();
	body:any;
	
	navitation:boolean=false;
	goToNext:boolean=false;
  
	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
		this.mng		=	this.fcd.getManejadorDatos();
		this.otros		=	this.fcd.getFormPacienteHabitosOtros();
		this.paciente	=	this.fcd.getFormPaciente();
		/*console.log(this.otros);*/
		//this.oOtros		=	new HabitosOtro();
		this.setInfoInit();
	}

	ngOnInit() {
		this.body = document.getElementsByTagName('body')[0];
		this.body.classList.add('menu-parent-habito');
		this.navitation	=	false;
		this.goToNext	=	false;
	}
	ngOnDestroy(){
		this.body.classList.remove('menu-parent-habito');
		/*if(this.infoEdited()){
			this.otros.paciente_id	=	this.paciente.id;
			this.save(this.otros);		
		}*/
		if(!this.navitation)
			this.saveForm();
	}
	
	setInfoInit(){
		this.oOtros.ocupacion			=	this.otros.ocupacion;
		this.oOtros.ocupacion_horas		=	this.otros.ocupacion_horas;
		this.oOtros.ocupacion_frecuencia=	this.otros.ocupacion_frecuencia;
		this.oOtros.sueno				=	this.otros.sueno;
		this.oOtros.fumado				=	this.otros.fumado;
		this.oOtros.fuma_cantidad		=	this.otros.fuma_cantidad;
		this.oOtros.fuma_frecuencia		=	this.otros.fuma_frecuencia;
		this.oOtros.alcohol				=	this.otros.alcohol;
		this.oOtros.alcohol_cantidad	=	this.otros.alcohol_cantidad;
		this.oOtros.alcohol_frecuencia	=	this.otros.alcohol_frecuencia;
		this.oOtros.notas				=	this.otros.notas;
	}
	infoEdited(){
		return 	(
			this.oOtros.ocupacion			!==	this.otros.ocupacion || 
			this.oOtros.ocupacion_horas		!==	this.otros.ocupacion_horas || 
			this.oOtros.ocupacion_frecuencia!==	this.otros.ocupacion_frecuencia || 
			this.oOtros.sueno				!==	this.otros.sueno || 
			this.oOtros.fumado				!==	this.otros.fumado || 
			this.oOtros.fuma_cantidad		!==	this.otros.fuma_cantidad || 
			this.oOtros.fuma_frecuencia		!==	this.otros.fuma_frecuencia || 
			this.oOtros.alcohol				!==	this.otros.alcohol || 
			this.oOtros.alcohol_cantidad	!==	this.otros.alcohol_cantidad || 
			this.oOtros.alcohol_frecuencia	!==	this.otros.alcohol_frecuencia || 
			this.oOtros.notas				!==	this.otros.notas
		);

	}
	save(data){
		this.formControlDataService.store('habitos_otros', data)
		.subscribe(
			 response  => {
						/*console.log('store->response...');
						console.log(response);*/
						},
			error =>  console.log(<any>error)
		);
	}

	saveForm(){
		if(this.infoEdited()){
			this.otros.paciente_id	=	this.paciente.id;
			this.save(this.otros);		
		}else{
			if(this.goToNext)
				this.router.navigate(['/valoracion']);
		}
	}
	Previous(){
		this.navitation	=	true;
		this.saveForm();
		this.router.navigate(['/gustos']);
	}
	Next(){
		this.navitation	=	true;
		this.saveForm();
		if(this.mng.operacion=='nuevo-paciente')
			this.crearConsulta(this.paciente);
		else
			this.router.navigate(['/valoracion']);		
	}
	crearConsulta(data){
		this.formControlDataService.store('consulta', data)
		.subscribe(
			 response  => {
						console.log('store->response...');
						console.log(response);
						this.formControlDataService.setSelectedConsuta(response['data']);
						this.mng.setOperacion('nueva-consulta');
						this.mng.setMenuPacienteStatus(false);
						this.mng.setEnableLink(true);
						this.router.navigate(['/valoracion']);
						},
			error =>  console.log(<any>error)
		);
	}
}
