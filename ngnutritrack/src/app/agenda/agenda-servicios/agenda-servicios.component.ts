import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AgendaServicio }     from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';

@Component({
  selector: 'app-agenda-servicios',
  templateUrl: './agenda-servicios.component.html',
  styleUrls: ['./agenda-servicios.component.css']
})
export class AgendaServiciosComponent implements OnInit {
	nuevo:boolean=false;
	agendaServicios:any[];
	newAgendaServicio=new AgendaServicio();
	tiempos: any = [
					{id:10, nombre:"10 minutos"},
					{id:15, nombre:"15 minutos"},
					{id:20, nombre:"20 minutos"},
					{id:30, nombre:"30 minutos"},
					{id:45, nombre:"45 minutos"},
					{id:60, nombre:"60 minutos"},
					{id:75, nombre:"75 minutos"},
					{id:90, nombre:"90 minutos"},
					{id:120, nombre:"120 minutos"},
					{id:150, nombre:"150 minutos"},
					{id:180, nombre:"180 minutos"},
					
				];
	fcd:any;
	mng:any;	
	body:any;
	helpers:any;

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
		this.mng		=	this.fcd.getManejadorDatos();
		this.helpers	=	this.fcd.getHelpers();
	}

	ngOnInit() {
		this.body = document.getElementsByTagName('body')[0];
		this.cargarServicios();		
	}  
	ngOnDestroy(){
		this.helpers.scrollToForm();
	}
	showFormEdit(){
		this.nuevo	=	!this.nuevo;
	}
	cargarServicios(){
		var data:any	=	{'nutricionista_id':this.fcd.nutricionista_id}
		this.formControlDataService.select('agenda-servicio', data)
		.subscribe(
			 response  => {
						this.agendaServicios	=	response;						
						},
			error =>  console.log(<any>error)
		);
	}
	
	setAgendaServicio(response){		
		if(response.code==201){
			var agendaServicio	=	response.data;
			this.agendaServicios.push(agendaServicio);
			this.newAgendaServicio.nombre	=	'';
			this.newAgendaServicio.duracion	=	0;
			this.nuevo	=	false;

		}
	}
	isValid(){
		return true;
	}
	adicionarNuevo(){
		if(this.isValid()){
			this.newAgendaServicio.nutricionista_id	=	this.fcd.nutricionista_id;
			this.save(this.newAgendaServicio);
		}
	}
	save(data){
		this.formControlDataService.store('agenda-servicio', data)
		.subscribe(
			 response  => {
						this.setAgendaServicio(response);
						},
			error =>  console.log(<any>error)
		);
	}
	
	remove(agendaServicio){
		var index	=	this.agendaServicios.indexOf(agendaServicio);
		this.formControlDataService.delete('agenda-servicio', agendaServicio).subscribe(
			 response  => {
						this.agendaServicios.splice(index,1);
						},
			error =>  console.log(<any>error)
		);
	}
	isNumberKey(evt) {
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode == 46) {
			var txt 	=	String(this.newAgendaServicio.duracion)
			if (txt.indexOf('.') === -1) {
				return true;
			} else {
				return false;
			}
		} else {
			if (charCode > 31
				 && (charCode < 48 || charCode > 57))
				return false;
		}
		return true;
	}
}
