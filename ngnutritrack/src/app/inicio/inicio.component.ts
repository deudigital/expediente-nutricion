import { Component, OnInit } from '@angular/core';
import { Router }              from '@angular/router';

/*import { FormControlData, Consulta } from '../control/data/formControlData.model';*/
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
		this.tagBody.classList.add('with-bg');
		this.tagBody.classList.add('page-inicio');
		this.getConsultasPendientes();
		this.loadDataForm();
	}
	ngOnDestroy(){
		this.tagBody.classList.remove('with-bg');
		this.tagBody.classList.remove('page-inicio');
	}
	onSelect(consulta: Consulta) {
		this.selectedConsulta = consulta;
		this.formControlDataService.resetFormControlData();
		this.formControlDataService.setSelectedConsuta(consulta);
		
		this.mng.setOperacion('continuar-consulta');
		this.mng.setMenuPacienteStatus(false);
		this.router.navigate(['/valoracion']);
	}	
	setConsultas(consultas){
		this.consultas = consultas;
	}
	getConsultasPendientes() {
		this.formControlDataService.getConsultasPendientes()
		.subscribe(
			 response  => {
						console.log(response);
						this.showLoading	=	false;
							if(response){
								this.setConsultas(response);
								this.showBoxConsultasPendientes	=	true;
							}
						
						},
			error =>  {
					this.showLoading	=	false;
					console.log(<any>error)
				}
		);
	}
	loadDataForm(){
		this.formControlDataService.getDataForm()
		.subscribe(
			 response  => {
						this.mng.fillDataForm(response);
						console.log(response);
						},
			error =>  console.log(<any>error)
		);
	}
	fillDataForm(data){
		this.mng.fillDataForm(data);
	}
	
}
