import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControlDataService }     from '../control/data/formControlData.service';
@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: []
})
export class RecepcionComponent implements OnInit {
	currentModal:string;
	hideModalDatos:boolean=true;
	fcd:any;
	tagBody:any;
	/* When we select file */
	file_for_upload:any; /* property of File type */
	estado:any;
	mensaje:any;
	sending:boolean=false;
	
	form_errors: any = {
		loading: false,
		successful_operation: false,
		ajax_failure: false
	  };

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
	}

	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		this.sending	=	false;
	}
	
	fileChange (event) {
		this.file_for_upload =	event.target.files;	
	}
	onSubmit(): void {
		let _formData = new FormData();
		_formData.append('estado', this.estado);
		_formData.append('mensaje', this.mensaje);
		_formData.append('nutricionista_id', this.fcd.nutricionista_id);
		_formData.append("file", this.file_for_upload[0]);
		this.uploadFile(_formData);
	}
	uploadFile(formData){
		this.sending	=	true;
		
		this.form_errors.ajax_failure = false;	
		this.form_errors.successful_operation = false;
					   
		this.formControlDataService.upload('recepcion', formData)
		.subscribe(
			 response  => {
						console.log('<!--upload Recepcion');
						console.log(response);
						this.sending	=	false;
						this.form_errors.successful_operation	=	true;
					},
			error =>  {
				console.log(<any>error)
				this.sending	=	false;
				this.form_errors.ajax_failure			=	true;
				this.hideIconMessages();
			},
			()=>{
				this.hideIconMessages();
				this.file_for_upload =	null;
				this.estado	=	'';
			}			
		);
	}
	hideIconMessages(){
		setTimeout(() => {
			  this.form_errors.successful_operation =	false;
			  this.form_errors.ajax_failure			=	false;
		}, 5000);
	}
/*
	cargar(){
		if(!this.validarCamposLlenos())
			return ;
			
		if(!this.validarFormatoXML())
			return "el formato del xml es inválido";
		
		if(!this.validarIdentReceptorCedNutricionista())
			return "el documento no fue emitido a usted, fue enviado a la identificación [numero identificacion receptor documento] y su identificacion es [cedula nutricionista]";
		
		this.prepareBeforeSendWebserve()
	}*/
	showModal(modal){
		this.hideModalDatos		=	true;
		switch(modal){
			case 'datos':
				this.hideModalDatos	=	false;
				break;
		}
		this.tagBody.classList.add('open-modal');
		this.currentModal	=	modal;
		window.scrollTo(0, 0);
	}
	hideModal(modal=''){
		if(modal.length==0)
			modal	=	this.currentModal;
		switch(modal){
			case 'datos':
				this.hideModalDatos	=	true;
				break;
		}
		this.tagBody.classList.remove('open-modal');		
	}
	
}
