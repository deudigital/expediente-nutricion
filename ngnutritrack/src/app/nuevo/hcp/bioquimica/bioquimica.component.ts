import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-bioquimica',
  templateUrl: './bioquimica.component.html',
  styles: []
})
export class BioquimicaComponent implements OnInit {

	nuevo:boolean=false;
	model:any;
	helpers:any;
	paciente:any;
	bioquimicas:any;
	body:any;	
	examen:any;
	sending:boolean;

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.model		=	formControlDataService.getFormControlData();
		this.helpers	=	this.model.getHelpers();
		this.paciente	=	this.model.getFormPaciente();
		this.bioquimicas	=	formControlDataService.getFormControlData().getFormPacienteBioquimicas();
		this.sending	=	false;
	}

	ngOnInit() {
		this.body = document.getElementsByTagName('body')[0];
		this.body.classList.add('menu-parent-hcp');	
	}
	ngOnDestroy(){
		this.body.classList.remove('menu-parent-hcp');	
		this.helpers.scrollToForm();
	}

	showFormEdit(){
		this.nuevo	=	!this.nuevo;
	}

	fileChange (event) {
		this.examen =	event.target.files;
		this.onSubmit();
		this.sending	=	true;
	}
	onSubmit(): void {
		let _formData = new FormData();
		_formData.append('paciente_id', this.paciente.persona_id);
		_formData.append("examen", this.examen[0]);
		this.uploadFile(_formData);
	}
	uploadFile(formData){
		this.formControlDataService.upload('bioquimicas', formData)
		.subscribe(
			 response  => {
						this.setData(response);
						this.sending	=	false;
					},
			error =>  console.log(<any>error)
		);
	}
	setData(response){
		if(response.code!=422)
			this.bioquimicas.push(response.data);
	}
	dragStart(event) {
		event.stopPropagation();
	}

	allowDrop(event) {
		event.stopPropagation();
	}
	drop(event) {
		event.stopPropagation();
	}
	
	
	
	saveForm(){
		
	}
	Previous(){
		this.saveForm();
		this.router.navigate(['/medicamentos']);
	}
	Next(){
		this.saveForm();
		if(this.paciente.genero=='M')
			this.router.navigate(['/hcf']);
		else
			this.router.navigate(['/hcp-otros']);
	}
}
