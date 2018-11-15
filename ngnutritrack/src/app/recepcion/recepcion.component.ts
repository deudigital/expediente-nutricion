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
	tipo_documento_id:any;
	mensaje:any;
	sending:boolean=false;
	filename_xml:string='';
	submit_message:string='';
	upload_error:boolean=false;
	upload_success:boolean=false;
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
		console.log(event.target.files);
		if(!this._validatiteXmlFile( event.target.files[0] )){
			this._displayMessage('xml_wrong');
			this.file_for_upload =	null;	
			this.filename_xml	=	'';
		}else{
			this._displayMessage('xml_success');
			this.file_for_upload =	event.target.files;	
			this.filename_xml	=	event.target.files[0].name;
		}
	}
	_displayMessage(error){
		this.upload_error	=	false;
		this.upload_success	=	false;
		switch(error){
			case 'xml_wrong':
				this.upload_error	=	true;
				setTimeout(() => {
					  this.upload_error	=	false;
				}, 5000);
				break;
			case 'xml_success':
				this.upload_success	=	true;
				break;
		}
	}
	_validatiteXmlFile(file){
/*
lastModified: 1541818471265​​
name: "xml-testing.xml"​​
size: 9259​​
type: "text/xml"​​
*/
			let _valid	=	false;
		if(file.type=='text/xml')
			_valid	=	true;

		return _valid;
	}
	onSubmit(): void {
		let _formData = new FormData();
		_formData.append('tipo_documento_id', this.tipo_documento_id);
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
						this._displayMessageSubmit(response);

					},
			error =>  {
				console.log(<any>error)
				this.sending	=	false;
				this.submit_message	=	error.statusText;
				this.form_errors.ajax_failure			=	true;
				this.hideIconMessages();
			},
			()=>{
				this.hideIconMessages();
				this.file_for_upload =	null;
				this.tipo_documento_id	=	'';
			}			
		);
	}
	_displayMessageSubmit(response){console.log(response);
		if(response.error){
			this.submit_message	=	response.error;
			this.form_errors.ajax_failure	=	true;
			setTimeout(() => {
				this.submit_message	=	'';
			}, 10000);
		}
		else
			this.form_errors.successful_operation	=	true;
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
