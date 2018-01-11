import { Component, OnInit } from '@angular/core';
import { Router }              from '@angular/router';

import { Consulta } from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: []
})
export class InicioComponent implements OnInit {
	consultas: any;
	selectedConsulta: Consulta;
	showBoxConsultasPendientes:boolean=false;
	showLoading:boolean=true;
	tagBody:any;
	mng:any;
	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.mng	=	this.formControlDataService.getFormControlData().getManejadorDatos();
	}
	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		this.tagBody.className = '';
		this.tagBody.classList.add('with-bg');
		this.tagBody.classList.add('page-inicio');
		this.getConsultasPendientes();
	}
	ngOnDestroy(){
		this.tagBody.classList.remove('with-bg');
		this.tagBody.classList.remove('page-inicio');
		this.tagBody.classList.remove('open-modal');
	}
	onSelect(consulta: Consulta) {
		this.selectedConsulta = consulta;
		
		this.mng.setEnableLink(true);
		
		this.formControlDataService.resetFormControlData();
		this.formControlDataService.setSelectedConsuta(consulta);
		
		this.mng.setOperacion('continuar-consulta');
		this.mng.setCurrentStepConsulta('');
		this.mng.setMenuPacienteStatus(false);
		this.router.navigate(['/valoracion']);
	}
	onDelete(consulta){
		this.selectedConsulta = consulta;
		this.tagBody.classList.add('open-modal');
		/*this.remove(consulta)*/
	}
	remove(consulta){
		var index	=	this.consultas.indexOf(consulta);
		this.formControlDataService.delete('consultas', consulta).subscribe(
			 response  => {
						console.log('Service:Consultas Delete...');
						console.log(response);
						//if(response.code==204)
							this.consultas.splice(index,1);
						},
			error =>  console.log(<any>error)
		);
	}
	promptYes(){
		this.remove( this.selectedConsulta );
		this.promptCancelar();
	}
	promptCancelar(){
		this.tagBody.classList.remove('open-modal');
	}
	setConsultas(consultas){
		this.consultas = consultas;
	}
	getConsultasPendientes() {
		//console.log('get Consultas Pendientes');
		this.formControlDataService.getConsultasPendientes()
		.subscribe(
			 response  => {
						/*console.log('Consultas Pendientes');
						console.log(response);*/
						this.showLoading	=	false;
						this.showBoxConsultasPendientes	=	true;						
						/*console.log(response);*/
						},
			error =>  {
					this.showLoading	=	false;
					console.log(<any>error)
				}
		);
	}
}
