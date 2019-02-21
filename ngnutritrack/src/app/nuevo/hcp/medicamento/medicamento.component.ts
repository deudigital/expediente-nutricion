import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControlData, ManejadorDatos, Paciente }     from '../../../control/data/formControlData.model';
import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-medicamento',
  templateUrl: './medicamento.component.html',
  styles: []
})
export class MedicamentoComponent implements OnInit {
	fcd:FormControlData;
	helpers:any;
	mng:ManejadorDatos;
	paciente:Paciente;
	medicamentos:any;
	body:any;

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
		this.helpers	=	this.fcd.getHelpers();
		this.mng		=	this.fcd.getManejadorDatos();
		this.paciente	=	this.fcd.getFormPaciente();
		this.medicamentos	=	this.paciente.notas_medicamentos;
	}
	ngOnInit() {
		this.body = document.getElementsByTagName('body')[0];
		this.body.classList.add('menu-parent-hcp');
	}
	ngOnDestroy(){
		this.body.classList.remove('menu-parent-hcp');
		this.saveForm();
		this.helpers.scrollToForm();
	}
	isValid(){
		return this.medicamentos!=this.paciente.notas_medicamentos;
	}
	save(data){
		this.formControlDataService.store('medicamentos', data)
		.subscribe(
			 response  => {},
			error =>  console.log(<any>error)
		);
	}
	
	saveForm(){
		if(this.isValid())
			this.save(this.paciente);
	}
	Previous(){
		this.saveForm();
		this.router.navigate(['/alergias']);
	}
	Next(){
		this.saveForm();
		this.router.navigate(['/bioquimica']);
	}

}
