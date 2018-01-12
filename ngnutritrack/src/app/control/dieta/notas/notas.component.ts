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
	finalizar:boolean=false;
	data:{ [id: string]: any; } = {'0':''};
	
	showModalFactura : boolean=false;
	
  constructor(private router: Router, private formControlDataService: FormControlDataService) {
	  this.model	=	formControlDataService.getFormControlData();
	  this.consulta	=	this.model.getFormConsulta();
	  this.setInfoInit();
   }

  ngOnInit() {
	  this.tagBody = document.getElementsByTagName('body')[0];
	  this.tagBody.classList.add('menu-parent-dieta');
	  this.finalizar	=	false;
	  this.data			=	{'0':''};
	  this.data['id']	=	this.consulta.id;
  }
	ngOnDestroy() {
		console.log('ngOnDestroy');
		this.saveForm();
		this.tagBody.classList.remove('menu-parent-dieta');	
	}
	setInfoInit(){
		this.oConsulta.notas				=	this.consulta.notas;
	}
	
	/*infoEdited(){
		return this.oConsulta.notas !== this.consulta.notas;
	}*/
	
	infoEdited(){
		var notas_changed	=	false;
		if(this.oConsulta.notas !== this.consulta.notas){
			notas_changed	=	true;
			this.data['notas']	=	[];
			this.data['notas'][0]	=	this.consulta.notas;
		}
		return notas_changed;
	}
	saveInfo(data){
		this.tagBody.classList.add('sending');
		console.log('save Notas...');
		console.log(data);
		this.formControlDataService.saveNotasConsulta(data)
		.subscribe(
			 response  => {
						console.log('Response Notas');
						console.log(response);
						if(this.finalizar){
							this.formControlDataService.resetFormControlData();
							this.finalizar	=	false;
							this.router.navigate(['/inicio']);
						}
						this.tagBody.classList.remove('sending');
						},
			error =>  console.log(<any>error)
		);
	}

	saveForm(){
		this.formControlDataService.setFormControlData(this.model);
		this.model.getFormConsulta().set(this.consulta);
		if(this.infoEdited() || this.finalizar){
			if(this.finalizar)
				this.data['finalizar']	=	true;
			//this.saveInfo(this.consulta);
			this.saveInfo(this.data);
		}
			
	}
	Previous(){
		//this.saveForm();
		this.router.navigate(['/patron-menu']);
	}
	Next(){
		this.finalizar	=	true;
		this.saveForm();
		this.openModalFactura();
	}
	openModalFactura(){
		this.showModalFactura = !this.showModalFactura;
		let body = document.getElementsByTagName('body')[0];
		if(this.showModalFactura)
			body.classList.add('open-modal');
		else
			body.classList.remove('open-modal');
	}
}