import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControlData, ManejadorDatos, HabitosGusto }     from '../../../control/data/formControlData.model';
import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-gustos',
  templateUrl: './gustos.component.html',
  styles: []
})
export class GustosComponent implements OnInit {
	fcd:FormControlData;
	mng:ManejadorDatos;
	gusto:HabitosGusto;
	oGusto:HabitosGusto;
	paciente:any;
	body:any;
	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
		this.mng		=	this.fcd.getManejadorDatos();
		this.gusto		=	this.fcd.getFormPacienteHabitosGustos();
		this.oGusto		=	new HabitosGusto();
		this.paciente	=	this.fcd.getFormPaciente();
		/*console.log('this.gusto');
		console.log(this.gusto);*/
		this.setInfoInit();
	}
	ngOnInit() {
		this.body = document.getElementsByTagName('body')[0];
		this.body.classList.add('menu-parent-habito');	
	}
	ngOnDestroy(){
		this.body.classList.remove('menu-parent-habito');
		/*if(this.infoEdited()){
			this.gusto.paciente_id	=	this.paciente.id;
			this.save(this.gusto);
		}*/
		this.saveForm();
	}
	setInfoInit(){
		this.oGusto.comidas_favoritas		=	this.gusto.comidas_favoritas;
		this.oGusto.comidas_no_gustan		=	this.gusto.comidas_no_gustan;
		this.oGusto.lugar_acostumbra_comer	=	this.gusto.lugar_acostumbra_comer;
		this.oGusto.lugar_caen_mal			=	this.gusto.lugar_caen_mal;
		this.oGusto.notas					=	this.gusto.notas;
	}
	infoEdited(){
		return 	(
			this.oGusto.comidas_favoritas		!==	this.gusto.comidas_favoritas || 
			this.oGusto.comidas_no_gustan		!==	this.gusto.comidas_no_gustan || 
			this.oGusto.lugar_acostumbra_comer	!==	this.gusto.lugar_acostumbra_comer || 
			this.oGusto.lugar_caen_mal			!==	this.gusto.lugar_caen_mal || 
			this.oGusto.notas					!==	this.gusto.notas
		);

	}
	save(data){
		this.formControlDataService.store('gustos', data)
		.subscribe(
			 response  => {
						console.log('store->response...');
						console.log(response);
						},
			error =>  console.log(<any>error)
		);
	}

	saveForm(){
		if(this.infoEdited()){
			this.gusto.paciente_id	=	this.paciente.id;
			this.save(this.gusto);
		}
	}
	Previous(){
		this.saveForm();
		this.router.navigate(['/valoracion-dietetica']);
	}
	Next(){
		this.saveForm();
		this.router.navigate(['/otros']);
	}
}
