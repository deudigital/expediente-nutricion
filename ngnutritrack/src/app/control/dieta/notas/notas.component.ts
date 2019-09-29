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
	/*historialNotas:any[];*/
	/*historialNotas:{ [id: string]: any; };*/
	historialPaciente: any[] = [];
	historialNutricionista: any[] = [];

	/*disableButtonHistorial:boolean=true;*/
	currentModal:string;
	hideModalDatos:boolean=true;
	showModalDatos:boolean=true;
	
	maxSizeUploadNotasNutri:boolean=false;
	maxSizeUploadNotasPaciente:boolean=false;
	
	showHistorialPaciente:boolean=false;
	archivo:any;
	sending:boolean;
	sending_paciente:boolean;
	sending_nutri:boolean;
	archivos:any;
	owner:any;
	form_uploading:any = {
		paciente: false,
		nutricionista: false
	};

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
	  this.maxSizeUploadNotasNutri	=	false;
	  this.maxSizeUploadNotasPaciente	=	false;
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
		this.oConsulta.notas_paciente		=	this.consulta.notas_paciente;
		this.archivos	=	this.consulta.archivos;
	}
	infoEdited(){
		var notas_changed	=	false;
		if(this.oConsulta.notas !== this.consulta.notas || this.oConsulta.notas_paciente !== this.consulta.notas_paciente){
			notas_changed	=	true;
			this.data['notas']	=	[];
			/*this.data['notas']['nutricionista']	=	this.consulta.notas;
			this.data['notas']['paciente']		=	this.consulta.notas_paciente;*/
			this.data['notas'].push({'nutricionista':this.consulta.notas, 'paciente':this.consulta.notas_paciente});
		}
		return notas_changed;
	}
	saveInfo(data){
		this.tagBody.classList.add('sending');
		this.formControlDataService.saveNotasConsulta(data)
		.subscribe(
			 response  => {
						this.model._displayMessage( response );
						if(this.finalizar){
							this.formControlDataService.resetFormControlData();
							this.finalizar	=	false;
							this.modalPrompt(response);
						}
						this.tagBody.classList.remove('sending');
						},
			error =>  {
				this.model._displayMessage();
				console.log(<any>error)
			}
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
			case 'notas_paciente':
				this.hideModalDatos	=	true;
				this.showHistorialPaciente	=	false;
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
			case 'notas_paciente':
				this.showHistorialPaciente	=	true;
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
				 this.processHistorial(response);
			},
			error =>  console.log('_getNotasOfConsulta: ' + <any>error)
		);
	}	

	processHistorial(historial){
		var consulta;
		var found;
		
		this.historialPaciente		=	[];
		this.historialNutricionista	=	[];
	
		for(var i =0;i<historial.length;i++){
			consulta	=	historial[i];
			found	=	false;
			if(consulta.archivos){
				let _found = consulta.archivos.filter(
									x => x.owner === 'nutricionista'
								  );
				if(_found[0])
					found=true;
			}
			if(consulta.notas.length>0 || found){
				this.historialNutricionista.push(consulta);				
			}
			found	=	false;
			if(consulta.archivos){
				let _found = consulta.archivos.filter(
									x => x.owner === 'paciente'
								  );
				if(_found[0])
					found=true;
			}
			if(consulta.notas_paciente.length>0 || found){
				this.historialPaciente.push(consulta);				
			}
			
		}
		
			/*this.historialNotas['nutricionista']=	historialNutricionista;
			this.historialNotas['paciente']		=	historialPaciente;
			console.log(this.historialNotas);*/
			/*console.log(this.historialNutricionista);
			console.log(this.historialPaciente);*/
			/*this.disableButtonHistorial	=	false;*//*this.historialNotas.length==0;*/
	}
	
/**/
	showMessage(validation){
		this.maxSizeUploadNotasNutri	=	false;
		this.maxSizeUploadNotasPaciente	=	false;
		switch(validation){
			case 'max-size-upload-paciente':
				this.maxSizeUploadNotasPaciente	=	true;
				break;
			case 'max-size-upload-nutricionista':
				this.maxSizeUploadNotasNutri	=	true;
				break;
		}
		setTimeout(() => {
						this.maxSizeUploadNotasNutri	=	false;
						this.maxSizeUploadNotasPaciente	=	false;
					}, 5000);
	}
	fileChange (event, owner) {
		const fileSelected		=	event.target.files[0];
		const sizeFileSelected	=	fileSelected.size/1024/1024;
		if(sizeFileSelected>8){
			this.showMessage('max-size-upload-' + owner);
			return ;
		}
			
		
		this.archivo =	event.target.files;console.log('archivo',this.archivo);
		
/*
1.19


0:	File
​​	lastModified: 1568221523087
	​​name: "8-IG-POST-TICKET-WORKSHOP-2000X2000.jpg"
	​​size: 1256896
	​​type: "image/jpeg"
*/
		this.onSubmit(owner);
		/*this.sending	=	true;*/
	}
	onSubmit(owner): void {
		let _formData = new FormData();
		_formData.append('consulta_id', this.consulta.id + '');
		_formData.append("archivo", this.archivo[0]);
		_formData.append("owner", owner);
		this.uploadFile(_formData, owner);
	}
	uploadFile(formData, owner){
		this.owner	=	owner;
		this.form_uploading[owner]	=	true;
		this.formControlDataService.upload('archivos', formData)
		.subscribe(
			 response  => {
						this.setData(response);
						/*this.sending	=	false;*/
					},
			error =>  console.log(<any>error),
			() =>{
				this.form_uploading[this.owner]	=	false;
				this.owner	=	'';
				}
		);
	}
	setData(response){
		if(response.code!=422)
			this.archivos.push(response.data);
	}
}