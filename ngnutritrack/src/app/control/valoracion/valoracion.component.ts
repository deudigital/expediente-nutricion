import { Component, OnInit } from '@angular/core';
/*import { Router }              from '@angular/router';*/

import { Analisis,ValoracionAntropometrica } from '../data/formControlData.model';
import { FormControlDataService }     from '../data/formControlData.service';

@Component({
  selector: 'app-valoracion',
  templateUrl: './valoracion.component.html',
  styles: []
})
export class ValoracionComponent implements OnInit {
	model:any;
	analisis=new Analisis();
	valoracion=new ValoracionAntropometrica();
	sexo:string='M';
	titulo_pagina:string='Expediente: Jorge Lpez';
	
	showModalDatos:boolean=false;
	showModalTabDatos:boolean=true;
	showModalTabGrafico:boolean=false;
	
	
	tab_class_datos:string='active';
	tab_class_graficos:string='';

	constructor(private formControlDataService: FormControlDataService) {
		this.model	=	formControlDataService.getFormControlData();
		this.valoracion	=	this.model.valoracionAntropometrica;
		
		var mng	=	this.model.getManejadorDatos();
		console.log('---this.model---');
		console.log('this.model.consulta.id-> ' + this.model.consulta.id );
		/*console.log(this.model);*/
		/*if(mng.operacion=='continuar-consulta'){*/
			this.formControlDataService.getConsultaSelected(this.model.consulta.id).subscribe(
				data => {
					console.log(data);
				this.model.fill(data);
				},
				error => console.log(<any>error));
		/*}else{
			this.model.clear('nueva-consulta');
		}*/
    }
	ngOnInit() { 
		/*console.log('ValoracionComponent: ngOnInit');*/
	}
	ngOnDestroy() {
		/*console.log('ngOnDestroy');*/
/*
		this.formControlDataService.setFormControlData(this.model);		
		console.log(this.model);
*/
		this.model.getFormValoracionAntropometrica().set(this.valoracion)
		console.log(this.model);
		
		/*
		this.valoracion.estatura	=	this.model.estatura;
		this.valoracion.circunferencia_muneca		=	this.model.muneca;
		this.valoracion.peso		=	this.model.peso;
		this.valoracion.grasa		=	this.model.grasa;
		this.valoracion.musculo		=	this.model.musculo;
		this.valoracion.agua		=	this.model.agua;
		this.valoracion.grasa_viceral		=	this.model.viceral;
		this.valoracion.hueso		=	this.model.hueso;
		this.valoracion.edad_metabolica	=	this.model.edad_metabolica;
		this.valoracion.circunferencia_cintura		=	this.model.cintura;
		this.valoracion.circunferencia_cadera		=	this.model.cadera;
		
		
		
		
		this.createValoracionAntropometrica(this.valoracion);
		*/
		
	}
	
	createValoracionAntropometrica(valoracionAntropometrica) {
		this.formControlDataService.addValoracionAntropometrica(valoracionAntropometrica)
			.subscribe(
				valoracionAntropometrica => {
					console.log(valoracionAntropometrica);
				},
				error => console.log(<any>error)
			);
	}
	
	openModalDatos() {
		this.showModalDatos	=	!this.showModalDatos;
		let body = document.getElementsByTagName('body')[0];
		if(this.showModalDatos)
			body.classList.add('open-modal');
		else
			body.classList.remove('open-modal');
	}
	
   tabSelected(tab:string){
     console.log(tab);
      if(tab=='graficos'){
        this.showModalTabDatos = false;
        this.showModalTabGrafico=true;
        this.tab_class_graficos = 'active';
        this.tab_class_datos = '';
      }else{
        this.showModalTabDatos = true;
        this.showModalTabGrafico=false;
        this.tab_class_datos = 'active';
        this.tab_class_graficos = '';
      }
   }
	
	get	imc(){
		if(!this.valoracion.peso)
			return 0;
/*
=PESO/(ESTATURA*ESTATURA)
*/
		this.analisis.imc	=	this.valoracion.peso / ( this.valoracion.estatura *  this.valoracion.estatura );
		return this.analisis.imc;
	}
	get	pesoIdeal(){
		if(!this.valoracion.peso)
			return 0;
/*
=SI(SEXO="M";(ESTATURA*100-152)*2,72/2,5+47,7;(ESTATURA*100-152)*2,27/2,5+45,5)
*/
		var factor_1	=	45.5;
		var factor_2	=	2.27;
		if(this.sexo=='M'){
			factor_1	=	47.7;
			factor_2	=	2.72;
		}
		this.analisis.pesoIdeal	=	(this.valoracion.estatura*100-152)*factor_2/2.5+factor_1;
		return this.analisis.pesoIdeal;
	}
	get pesoIdealAjustado(){
		if(!this.valoracion.peso)
			return 0;		
/*
=(PESO-PESO_IDEAL)/(4)+(PESO_IDEAL)
*/
		this.analisis.pesoIdealAjustado	=(this.valoracion.peso-this.analisis.pesoIdeal)/(4)+(this.analisis.pesoIdeal);
		return this.analisis.pesoIdealAjustado;
	}
	get diferenciaPeso(){
		if(!this.valoracion.peso)
			return 0;		
/*
=PESO-PESO_IDEAL_AJUSTADO
*/
		this.analisis.diferenciaPeso	=	this.valoracion.peso - this.analisis.pesoIdealAjustado;
		return this.analisis.diferenciaPeso;
	}
	get adecuacion(){
		if(!this.valoracion.peso)
			return 0;		
/*
=PESO/PESO_IDEAL_AJUSTADO
*/
		this.model.adecuacion	=this.valoracion.peso/this.analisis.pesoIdealAjustado
		return this.model.adecuacion;
	}
	get relacionCinturaCadera(){
		if(!this.valoracion.circunferencia_cintura || !this.valoracion.circunferencia_cadera)
			return 0;		
/*
=CINTURA/CADERA
*/
		this.model.relacionCinturaCadera	=	this.valoracion.circunferencia_cintura/this.valoracion.circunferencia_cadera;
		return this.model.relacionCinturaCadera;
	}
	get gradoSobrepeso(){
		if(!this.valoracion.peso)
			return 0;		
/*
NP				=SI(GRADO_SOBREPESO_VALOR>40;"OB GRAVE";SI(GRADO_SOBREPESO_VALOR>20;"OB MEDIA";SI(GRADO_SOBREPESO_VALOR>10;"SOBREP";"NP")))	
3,793658207		=(PESO-PESO_IDEAL)/PESO_IDEAL*100
*/
		this.model.gradoSobrepeso	=this.valoracion.peso/this.analisis.pesoIdeal*100;
		return this.model.gradoSobrepeso;
	}
	get porcentajePeso(){
		if(!this.valoracion.peso)
			return 0;		
/*
104%	=PESO/PESO_IDEAL
Nl		=SI(PORCENTAJE_PESO<75%;"DN SEVERA";SI(PORCENTAJE_PESO<85%;"DN MOD";SI(PORCENTAJE_PESO<90%;"DN LEVE";SI(
*/
		this.analisis.porcentajePeso	=	this.valoracion.peso/this.analisis.pesoIdeal;
		return this.analisis.porcentajePeso;
	}

	get pesoMetaMaximo(){
		if(!this.valoracion.peso)
			return 0;		
/*
80,1025		=(PESO*25)/IMC
*/
		this.analisis.pesoMetaMaximo	=	(this.valoracion.peso*25)/this.analisis.imc;
		return this.analisis.pesoMetaMaximo;
	}
	get pesoMetaMinimo(){
		if(!this.valoracion.peso)
			return 0;		
/*
=(PESO*18,9)/IMC
*/
		this.analisis.pesoMetaMinimo	=	(this.valoracion.peso*18.9)/this.analisis.imc;
		return this.analisis.pesoMetaMinimo;
	}
	

	get currentModel() {
		return JSON.stringify(this.model);
		/*return JSON.stringify(this.analisis);*/
	}
}
