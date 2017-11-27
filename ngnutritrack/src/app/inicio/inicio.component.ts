import { Component, OnInit } from '@angular/core';
import { Router }              from '@angular/router';

/*import { FormControlData, Consulta } from '../control/data/formControlData.model';*/
import { Consulta } from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
	consultas: any;
	selectedConsulta: Consulta;
	showBoxConsultasPendientes:boolean=false;
	showLoading:boolean=true;
	tagBody:any;
	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		
	}
	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		this.tagBody.classList.add('with-bg');
		this.tagBody.classList.add('page-inicio');
		this.getConsultasPendientes();
	}
	ngOnDestroy(){
		this.tagBody.classList.remove('with-bg');
		this.tagBody.classList.remove('page-inicio');
	}
	onSelect(consulta: Consulta) {
		this.selectedConsulta = consulta;
		this.formControlDataService.resetFormControlData();
		this.formControlDataService.setSelectedConsuta(consulta);
		var mng	=	this.formControlDataService.getFormControlData().getManejadorDatos();
		mng.setOperacion('continuar-consulta');
		mng.setMenuPacienteStatus(false);
		this.router.navigate(['/valoracion']);
	}	
	setConsultas(consultas){
		this.consultas = consultas;
	}
	getConsultasPendientes() {
		this.formControlDataService.getConsultasPendientes()
		.subscribe(
			 response  => {					
						this.setConsultas(response);
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
