import { Component, OnInit } from '@angular/core';
import { Router }              from '@angular/router';

import { Consulta } from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';
import { Observable } from 'rxjs/Observable';
import { CommonService } from '../services/common.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: []
})
export class InicioComponent implements OnInit {
	factura_pic_on:string = "assets/images/factura-on.png";
	factura_pic_off:string =  "assets/images/factura-off.png";
	factura_pic:string;	
	consultas: any;
	selectedConsulta: Consulta;
	showBoxConsultasPendientes:boolean=false;
	showLoading:boolean=true;
	tagBody:any;
	mng:any;

	hidePrompt : boolean=false;
	hidenFactura: boolean =false;
	agregadoAPI:number;

	constructor(private auth: AuthService, private router: Router, private formControlDataService: FormControlDataService, private commonService: CommonService ) {
		this.mng	=	this.formControlDataService.getFormControlData().getManejadorDatos();
	}
	ngOnInit() {
		this.factura_pic = this.factura_pic_off;
		this.tagBody = document.getElementsByTagName('body')[0];
		this.tagBody.className = '';
		this.tagBody.classList.add('with-bg');
		this.tagBody.classList.add('page-inicio');
		this.hidePrompt	=	false;
		this.getConsultasPendientes();
		this.getAgregadoAPI();
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
		this.hidePrompt	=	false;
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
		this.hidePrompt	=	true;
		this.remove( this.selectedConsulta );
		this.promptCancelar();
	}
	promptCancelar(){
		this.tagBody.classList.remove('open-modal');
	}
	setConsultas(consultas){
		this.consultas = consultas;
	}
	focusOut(){
		this.factura_pic = this.factura_pic_off;
	}

	onHover(){
		this.factura_pic = this.factura_pic_on;
	}

	openFactura(){
		this.hidePrompt = true;
		this.commonService.notifyOther({option: 'openModalDatosVacia', prompt: this.hidePrompt});
	}

	getAgregadoAPI(){
		this.formControlDataService.getNutricionista()
		.subscribe(
			response => {
				localStorage.setItem("agregadoAPI", response[0].agregadoAPI);
				this.agregadoAPI = response[0].agregadoAPI;
			}, 
			error => {
				console.log(<any>error);
			}
		);
	}

	getConsultasPendientes() {
		//console.log('get Consultas Pendientes');
		this.auth.verifyUser(localStorage.getItem('nutricionista_id'))
			.then((response) => {
				var response	=	response.json();
				console.log(response);
				if(!response.valid){
					localStorage.clear();
					this.formControlDataService.getFormControlData().message_login	=	response.message;
					this.router.navigateByUrl('/login');
					return false;
				}
				this.formControlDataService.getConsultasPendientes()
					.subscribe(
						 response  => {
									console.log('Consultas Pendientes');
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
				
			})
			.catch((err) => {
				console.log(JSON.parse(err._body));
				this.showLoading	=	false;
			});
	}
	getConsultasPendientes__original() {
		//console.log('get Consultas Pendientes');
		this.formControlDataService.getConsultasPendientes()
		.subscribe(
			 response  => {
						console.log('Consultas Pendientes');
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
}

