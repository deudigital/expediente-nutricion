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
	
	/* When we select file */
	examen:any; /* property of File type */

	sending:boolean; /* property of File type */


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
		/*console.log(this.examen);*/
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
						/*console.log('<!--upload bioquimica');
						console.log(response);*/
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
		//event.dataTransfer.setData("Text", event.target.id);
		//document.getElementById("demo").innerHTML = "Started to drag the p element";
		event.stopPropagation();
		/*console.log('dragStart');
		console.log(event);*/
	}

	allowDrop(event) {
		//event.preventDefault();
		event.stopPropagation();
		/*console.log('allowDrop');
		console.log(event);*/
	}

	drop(event) {
		event.stopPropagation();
		//event.preventDefault();
		//var data = event.dataTransfer.getData("Text");
//		event.target.appendChild(document.getElementById(data));
//		document.getElementById("demo").innerHTML = "The p element was dropped";
		/*console.log('drop');
		console.log(event);*/
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
