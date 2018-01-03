import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Analisis,Patologia } from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';

@Component({
  selector: 'app-hcp',
  templateUrl: './hcp.component.html',
  styles: []
})
export class HcpComponent implements OnInit {
	fcd:any;
	mng:any;
	paciente:any;
	notas:any;
	patologias:Patologia[];
	oPatologias:any[];
	data:{ [id: string]: any; } = {'0':''};
	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
		this.mng		=	this.fcd.getManejadorDatos();
		this.mng.setMenuPacienteStatus(true);
		this.paciente	=	this.fcd.getFormPaciente();
		this.oPatologias	=	[];
		this.data['paciente_id']	=	this.paciente.id;
	}
	ngOnInit() {
		this.cargarPatologiasDelPaciente();
		this.setInfoInit();
	}
	ngOnDestroy(){		
		/*if(this.infoEdited()){
			this.save(this.data);
		}*/
		this.saveForm();
	}
	infoEdited(){
		var notas_changed	=	false;
		this.data['notas']	=	[];
		this.data['items']	=	[];
		if(this.notas	!==	this.paciente.notas_patologias){
			notas_changed	=	true;
			this.data['notas'][0]	=	this.paciente.notas_patologias;
		}
			

		for(var i in this.patologias){
			var orig	=	this.oPatologias[i];
			var edit	=	this.patologias[i];
			/*console.log(orig);console.log(edit);*/
			var check_dif	=	orig.checked!== edit.checked;			
			
			if( check_dif ){
				this.data['items']	=	this.patologias;
				return true;
			}
				
		}
					
		/*return false;*/
		return notas_changed;
	}
/*
paciente_id	6
hcp_patologia_id	1
id	1
nombre	"Estreñimiento"
1
*/
	setInfoInit(){
		var obj;
		var item;
		this.notas	=	this.paciente.notas_patologias;
		for(var i in this.patologias){
			item	=	this.patologias[i];
			obj	=	new Object();
			obj.id		=	item.id;
			obj.nombre	=	item.nombre;
			/**/
			obj.checked	=	item.checked;		
			/**/
			this.oPatologias[i]	=	obj;
		}
	}
	cargarPatologiasDelPaciente(){
		this.patologias			=	this.mng.getHcpPatologias();
		var hcpPatologias		=	this.fcd.getFormPacienteHcpPatologias();
		var id;
		var found;
			
		for(var i in this.patologias)
			this.patologias[i].checked		=	false;
		
		for(var i in hcpPatologias){
			id		=	hcpPatologias[i].hcp_patologia_id;
			found			=	this.patologias.filter(function(arr){return arr.id == id})[0];
			if(found)
				found.checked	=	true;
		}
	}
	saveTest(){
		if(this.infoEdited()){
			this.data['items']	=	this.patologias;
			this.save(this.data);
		}
	}
	save(data){
		this.fcd.setFormPacienteHcpPatologias(this.patologias);
		this.formControlDataService.store('hcp_patologis', data)
		.subscribe(
			 response  => {
						console.log('store->response...');
						console.log(response);
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
		this.router.navigate(['/contacto']);
	}
	Next(){
		this.saveForm();
		this.router.navigate(['/alergias']);
	}
}
