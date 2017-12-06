import { Component, OnInit } from '@angular/core';

//import { Alergia } from '../../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';

@Component({
  selector: 'app-hcf',
  templateUrl: './hcf.component.html',
  styles: []
})
export class HcfComponent implements OnInit {

	fcd:any;
	mng:any;
	paciente:any;
	body:any;
	patologias:any[];
	oPatologias:any[];
	
	data:{ [id: string]: any; } = {'0':''};
  constructor(private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
		this.mng		=	this.fcd.getManejadorDatos();
		this.paciente	=	this.fcd.getFormPaciente();
		//console.log(this.paciente);
		this.data['paciente_id']	=	this.paciente.id;		
		this.oPatologias	=	[];		
	}
	ngOnInit() {
		this.body = document.getElementsByTagName('body')[0];
		this.cargarHcfPatologiasDelPaciente();
		this.setInfoInit();
	}
	ngOnDestroy(){		
		if(this.infoEdited()){
			this.data['items']	=	this.patologias;
			this.save(this.data);
		}	
	}
	
	infoEdited(){
		for(var i in this.patologias){
			var orig	=	this.oPatologias[i];
			var edit	=	this.patologias[i];
			//console.log(orig);console.log(edit);
			var notas_dif	=	orig.notas!== edit.notas;
			var check_dif	=	orig.checked!== edit.checked;			
			
			if( notas_dif || check_dif ){
				if(notas_dif && edit.checked)
					return true;
				return check_dif;					
			}
		}
		return false;
	}
	setInfoInit(){
		var obj;
		var item;
		for(var i in this.patologias){
			item	=	this.patologias[i];
			obj	=	new Object();
			obj.id		=	item.id;
			obj.nombre	=	item.nombre;
			obj.notas	=	item.notas;	
			/**/
			obj.checked	=	item.checked;		
			obj.row	=	item.row;
			/**/
			this.oPatologias[i]	=	obj;
		}
		//console.log(this.oPatologias);
	}
	cargarHcfPatologiasDelPaciente(){		
		this.patologias			=	this.mng.getHcfPatologias();
		var hcfPatologias		=	this.fcd.getFormPacienteHcfPatologias();
		//console.log(hcfPatologias);
		var id;
		var found;
				
		var index=1;
		for(var i in this.patologias){
			this.patologias[i].checked		=	false;
			this.patologias[i].row			=	false;
			if(index%3==0){
				this.patologias[i].row		=	true;
			}
			
			index++;
		}
		
		for(var i in hcfPatologias){
			id		=	hcfPatologias[i].hcf_patologia_id;
			found			=	this.patologias.filter(function(arr){return arr.id == id})[0];
			if(found){
				found.checked	=	true;
				found.notas		=	hcfPatologias[i].notas;
			}
		}
		//console.log(this.patologias);
	}
	saveTest(){
		if(this.infoEdited()){
			this.data['items']	=	this.patologias;
			this.save(this.data);
		}
	}
	save(data){
		this.fcd.setFormPacienteHcfPatologias(this.patologias);
		this.formControlDataService.store('hcf_patologis', data)
		.subscribe(
			 response  => {
						console.log('Service:hcf_patologis->receiving...');
						console.log(response);
						},
			error =>  console.log(<any>error)
		);
	}
}
