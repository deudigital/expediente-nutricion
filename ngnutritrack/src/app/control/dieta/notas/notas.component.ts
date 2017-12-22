import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Analisis, Consulta } from '../../data/formControlData.model';
import { FormControlDataService }     from '../../data/formControlData.service';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styles: []
})
export class NotasComponent implements OnInit {
	model:any;
	consulta=new Consulta();
	oConsulta=new Consulta();
	tagBody:any;

  constructor(private router: Router, private formControlDataService: FormControlDataService) {
	  this.model	=	formControlDataService.getFormControlData();
	  this.consulta	=	this.model.getFormConsulta();
	  this.setInfoInit();
   }

  ngOnInit() {
	  this.tagBody = document.getElementsByTagName('body')[0];
	  this.tagBody.classList.add('menu-parent-dieta');
  }
  
	ngOnDestroy() {
		/*this.formControlDataService.setFormControlData(this.model);
		this.model.getFormConsulta().set(this.consulta);
		if(this.infoEdited())
			this.saveInfo(this.consulta);*/
		this.saveForm();
		this.tagBody.classList.remove('menu-parent-dieta');	
	}
	setInfoInit(){
		this.oConsulta.notas				=	this.consulta.notas;
	}
	
	infoEdited(){
		return this.oConsulta.notas !== this.consulta.notas;
	}
	
	saveInfo(data){
		this.tagBody.classList.add('sending');
		console.log('saveInfo:sending...');
		console.log(data);
		this.formControlDataService.saveNotasConsulta(data)
		.subscribe(
			 response  => {
						console.log('saveInfo:receiving...');
						console.log(response);
						this.tagBody.classList.remove('sending');
						},
			error =>  console.log(<any>error)
		);
	}

	saveForm(){
		this.formControlDataService.setFormControlData(this.model);
		this.model.getFormConsulta().set(this.consulta);
		if(this.infoEdited())
			this.saveInfo(this.consulta);
	}
	Previous(){
		this.saveForm();
		this.router.navigate(['/patron-menu']);
	}
	Next(){
		this.saveForm();
		this.router.navigate(['/inicio']);
	}
}