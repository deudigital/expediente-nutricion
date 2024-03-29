import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Analisis, Consulta } from '../../data/formControlData.model';
import { FormControlDataService }     from '../../data/formControlData.service';
import { CommonService } from '../../../services/common.service';

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
	showModalPrompt : boolean=false;
	hidePrompt : boolean=false;
	historialNotas:any[];
	disableButtonHistorial:boolean=true;
	currentModal:string;
	hideModalDatos:boolean=true;
	showModalDatos:boolean=true;
	
  constructor(private router: Router, private formControlDataService: FormControlDataService, private commonService: CommonService) {
	  this.model	=	formControlDataService.getFormControlData();
	  this.consulta	=	this.model.getFormConsulta();
	  this.setInfoInit();
   }

  ngOnInit() {
	  this.tagBody = document.getElementsByTagName('body')[0];
	  this.tagBody.classList.add('menu-parent-notas');
	  this.finalizar	=	false;
	  this.hidePrompt	=	false;
	  this.data			=	{'0':''};
	  this.data['id']	=	this.consulta.id;
	  this._getNotasOfConsulta();
  }
	ngOnDestroy() {
		this.saveForm();
		this.tagBody.classList.remove('menu-parent-notas');	
	}
	setInfoInit(){
		this.oConsulta.notas				=	this.consulta.notas;
	}
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
		this.formControlDataService.saveNotasConsulta(data)
		.subscribe(
			 response  => {
						if(this.finalizar){
							this.formControlDataService.resetFormControlData();
							this.finalizar	=	false;
							this.modalPrompt(response);
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
			this.saveInfo(this.data);
		}
			
	}
	Previous(){
		this.saveForm();
		this.router.navigate(['/patron-menu']);
	}
	Next(){
		this.finalizar	=	true;
		this.saveForm();
	}
	
	modalPrompt(data){		
		if(!data || !data.nutricionista.agregadoAPI){
			this.router.navigate(['/inicio']);
			return ;
		}
		
		this.hidePrompt	=	false;
		this.tagBody.classList.add('open-modal');
		this.currentModal	=	'prompt';
	}
	openModalFactura(){
		this.commonService.notifyOther({option: 'openModalDatos', persona_id:this.consulta.paciente_id, consulta_id: this.consulta.id, margin: true});
	}
		
	promptYes(){
		this.hidePrompt	=	true;
		this.openModalFactura()
	}
	promptCancelar(){
		this.tagBody.classList.remove('open-modal');
		this.router.navigate(['/inicio']);
	}
	hideModal(modal=''){		
		if(modal.length==0)
			modal	=	this.currentModal;
		switch(modal){
			case 'notas':
				this.hideModalDatos	=	true;
				break;
			case 'prompt':
				this.hidePrompt	=	true;
				break;
		}
		this.tagBody.classList.remove('open-modal');		
	}
	showModal(modal){
		this.hideModalDatos	=	true;
		this.hidePrompt		=	true;
		switch(modal){
			case 'notas':
				this.hideModalDatos	=	false;
				break;
		}
		this.tagBody.classList.add('open-modal');
		this.currentModal	=	modal;
		window.scrollTo(0, 0);
	}
	_getNotasOfConsulta(){
		var data			=	Object();
		data.paciente_id	=	this.consulta.paciente_id;
		this.formControlDataService.select('consulta-paciente', data)
		.subscribe(
			 response  => {
				this.historialNotas		=	response;
				this.disableButtonHistorial	=	this.historialNotas.length==0;
			},
			error =>  console.log('_getNotasOfConsulta: ' + <any>error)
		);
	}	
}