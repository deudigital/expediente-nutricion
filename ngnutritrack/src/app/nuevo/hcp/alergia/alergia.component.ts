import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Alergia } from '../../../control/data/formControlData.model';
import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-alergia',
  templateUrl: './alergia.component.html',
  styles: []
})
export class AlergiaComponent implements OnInit {

	fcd:any;
	mng:any;
	helpers:any;
	paciente:any;
	notas:any;
	
	body:any;
	alergias:any[];
	oAlergias:any[];
	data:{ [id: string]: any; } = {'0':''};
	
	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
		this.helpers	=	this.fcd.getHelpers();
		this.mng		=	this.fcd.getManejadorDatos();
		this.paciente	=	this.fcd.getFormPaciente();
		this.oAlergias	=	[];
		this.data['paciente_id']	=	this.paciente.id;
	}

	ngOnInit() {
		this.body = document.getElementsByTagName('body')[0];
		this.body.classList.add('menu-parent-hcp');
		this.cargarAlergiasDelPaciente();
		this.setInfoInit();
	}
	ngOnDestroy(){
		this.body.classList.remove('menu-parent-hcp');
		/*if(this.infoEdited()){
			this.save(this.data);
		}*/
		this.saveForm();
		this.helpers.scrollToForm();
	}

	infoEdited(){
		var notas_changed	=	false;
		this.data['notas']	=	[];
		this.data['items']	=	[];
		if(this.notas	!==	this.paciente.notas_alergias){
			notas_changed	=	true;
			this.data['notas'][0]	=	this.paciente.notas_alergias;
		}
			

		for(var i in this.alergias){
			var orig	=	this.oAlergias[i];
			var edit	=	this.alergias[i];
			/*console.log(orig);console.log(edit);*/
			var check_dif	=	orig.checked!== edit.checked;			
			
			if( check_dif ){
				this.data['items']	=	this.alergias;
				return true;
			}
				
		}
		return notas_changed;
	}
	setInfoInit(){
		var obj;
		var item;
		this.notas	=	this.paciente.notas_alergias;
		for(var i in this.alergias){
			item	=	this.alergias[i];
			obj	=	new Object();
			obj.id		=	item.id;
			obj.nombre	=	item.nombre;
			/**/
			obj.checked	=	item.checked;		
			/**/
			this.oAlergias[i]	=	obj;
		}
	}
	cargarAlergiasDelPaciente(){		
		this.alergias			=	this.mng.getHcpAlergias();
		var hcpAlergias		=	this.fcd.getFormPacienteHcpAlergias();
		var id;
		var found;	
		for(var i in this.alergias)
			this.alergias[i].checked		=	false;
		
		for(var i in hcpAlergias){
			id				=	hcpAlergias[i].alergia_id;
			found			=	this.alergias.filter(function(arr){return arr.id == id})[0];
			if(found)
				found.checked	=	true;
		}
	}
	
	save(data){
		this.fcd.setFormPacienteHcpAlergias(this.alergias);
		this.formControlDataService.store('alergias', data)
		.subscribe(
			 response  => {
						/*console.log('store->response...');
						console.log(response);*/
						},
			error =>  console.log(<any>error)
		);
	}
	saveForm(){
		if(this.infoEdited()){
			this.save(this.data);
		}
	}
	Previous(){
		this.saveForm();
		this.router.navigate(['/hcp']);
	}
	Next(){
		this.saveForm();
		this.router.navigate(['/medicamentos']);
	}
}
