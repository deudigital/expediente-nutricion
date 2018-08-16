import { Component, OnInit, Input } from '@angular/core';
import { FormControlData, Consulta, Paciente } from './data/formControlData.model';
import { FormControlDataService }     from './data/formControlData.service';
import {Observable} from 'rxjs/Observable';
import { Router }              from '@angular/router';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: []
})
export class ControlComponent implements OnInit {	
	pacientes: any[];
	_pacientes:any;
	filter_pacientes:{ [id: string]: any; };
	nueva_consulta: Observable<Consulta[]>;
	selectedConsulta: Consulta;
	selectedPaciente: Paciente;
	tagBody:any;
	mng:any;
	helpers:any;
	seleccionado:boolean=false;
	q:string;
	showFilter:boolean=false;
	canFilter:boolean=false;
	
	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.mng		=	this.formControlDataService.getFormControlData().getManejadorDatos();
		this.helpers	=	this.formControlDataService.getFormControlData().getHelpers();
		this.getPacientesDeNutricionista();
	}
	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		this.tagBody.className = '';
		this.tagBody.classList.add('with-bg');
		this.tagBody.classList.add('page-control');
		this.showFilter		=	false;
		this.canFilter		=	false;
		this.seleccionado	=	false;
	}
	ngOnDestroy(){
		this.tagBody.classList.remove('with-bg');
		this.tagBody.classList.remove('page-control');
		this.helpers.scrollToForm(true);
	}
	getPacientesDeNutricionista(){
		this.formControlDataService.getPacientesDeNutricionista()
		.subscribe(
			 response  => {
						/*console.log('<--cRud getPacientesDeNutricionista');
						console.log(response);*/
						this.pacientes	=	response;
						this.canFilter	=	this.pacientes.length > 0;
					},
			error =>  console.log(<any>error)
		);
	}
	onFilter(){
		if(!this.canFilter)
			return ;
		this.q	=	this.q.trim();
		if(this.q.length==0){
			this.showFilter	=	false;
			return ;
		}			
		var search	=	this.q.toLowerCase();
		this.filter_pacientes	=	this.pacientes.filter(function(item) {
										var nombre = item.nombre.toString().toLowerCase();
										return nombre.indexOf(search)>-1;
									})
		this.showFilter	=	this.filter_pacientes.length>0;
	}
	onSelect(paciente: Paciente) {
		if(this.seleccionado)
			return ;
		
		this.selectedPaciente = paciente;
		this.formControlDataService.resetFormControlData();
		this.formControlDataService.setPaciente(paciente);

		this.mng.setOperacion('nueva-consulta');
		this.mng.setMenuPacienteStatus(false);
		this.mng.setEnableLink(true);
		this.mng.setCurrentStepConsulta('va');
		this.save(paciente);
		this.seleccionado	=	true;
	}	
	save(data){
		this.formControlDataService.store('consulta', data)
		.subscribe(
			 response  => {
						console.log('<-- cRud consulta');
						console.log(response);
						this.formControlDataService.setSelectedConsuta(response['data']);
						if(response['va'])
							this.formControlDataService.getFormControlData().setLastValuesFormValoracionAntropometrica(response['va']);
						
						this.router.navigate(['/valoracion']);
						},
			error =>  console.log(<any>error)
		);
	}
}
