import { Component, OnInit } from '@angular/core';
/*import { Router }              from '@angular/router';*/

import { Analisis,ValoracionAntropometrica, Grasa, Paciente } from '../data/formControlData.model';
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
	oValoracion=new ValoracionAntropometrica();
	grasa=new Grasa();
	paciente=new Paciente();
	
	sexo:string='M';
	titulo_pagina:string='Expediente: Jorge Lpez';
	
	showModalDatos:boolean=false;
	showModalTabDatos:boolean=true;
	showModalTabGrafico:boolean=false;
	
	showModalGrasa:boolean=false;
	showModalGrasaTabSegmentado:boolean=true;
	showModalGrasaTabPliegues:boolean=false;
	
	tagBody:any;
	
	tab_class_datos:string='active';
	tab_class_graficos:string='';
	
	tab_grasa_class_segmentado:string='active';
	tab_grasa_class_pliegues:string='';
	

	constructor(private formControlDataService: FormControlDataService) {
		this.model	=	formControlDataService.getFormControlData();
		var mng	=	this.model.getManejadorDatos();

		this.formControlDataService.getConsultaSelected(this.model.consulta.id).subscribe(
			data => {
				/*console.log(data);*/
				this.model.fill(data);
				this.valoracion	=	this.model.getFormValoracionAntropometrica();
				/*console.log(this.valoracion);*/
				this.setInfoInit();
			},
			error => console.log(<any>error));
    }
	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
	}
	ngOnDestroy() {
		this.formControlDataService.setFormControlData(this.model);
		this.model.getFormValoracionAntropometrica().set(this.valoracion);
		if(this.infoEdited())
			this.createValoracionAntropometrica(this.valoracion);
	}
	setInfoInit(){
		this.oValoracion.estatura				=	this.valoracion.estatura;
		this.oValoracion.circunferencia_muneca	=	this.valoracion.circunferencia_muneca;
		this.oValoracion.peso					=	this.valoracion.peso;
		this.oValoracion.grasa					=	this.valoracion.grasa;
		this.oValoracion.musculo				=	this.valoracion.musculo;
		this.oValoracion.agua					=	this.valoracion.agua;
		this.oValoracion.grasa_viceral			=	this.valoracion.grasa_viceral;
		this.oValoracion.hueso					=	this.valoracion.hueso;
		this.oValoracion.edad_metabolica		=	this.valoracion.edad_metabolica;
		this.oValoracion.circunferencia_cintura	=	this.valoracion.circunferencia_cintura;
		this.oValoracion.circunferencia_cadera	=	this.valoracion.circunferencia_cadera;
	}
	
	infoEdited(){
		return 	(
			this.oValoracion.estatura				!==	Number(this.valoracion.estatura) || 
			this.oValoracion.circunferencia_muneca	!==	Number(this.valoracion.circunferencia_muneca) || 
			this.oValoracion.peso					!==	Number(this.valoracion.peso) || 
			this.oValoracion.grasa					!==	Number(this.valoracion.grasa) || 
			this.oValoracion.musculo				!==	Number(this.valoracion.musculo) || 
			this.oValoracion.agua					!==	Number(this.valoracion.agua) || 
			this.oValoracion.grasa_viceral			!==	Number(this.valoracion.grasa_viceral) || 
			this.oValoracion.hueso					!==	Number(this.valoracion.hueso) || 
			this.oValoracion.edad_metabolica		!==	Number(this.valoracion.edad_metabolica) || 
			this.oValoracion.circunferencia_cintura	!==	Number(this.valoracion.circunferencia_cintura) || 
			this.oValoracion.circunferencia_cadera	!==	Number(this.valoracion.circunferencia_cadera)
		);

	}
		
	createValoracionAntropometrica(valoracionAntropometrica) {
		console.log(valoracionAntropometrica);
		this.tagBody.classList.add('sending');
		this.formControlDataService.addValoracionAntropometrica(valoracionAntropometrica)
		.subscribe(
			 response  => {
						console.log('va receiving...');
						console.log(response);
						this.tagBody.classList.remove('sending');
						},
			error =>  console.log(<any>error)
		);
	}
	closeModal(){
		this.tagBody.classList.remove('open-modal');
		this.showModalDatos	=	false;
		this.showModalGrasa	=	false;
	}
	openModalDatos() {
		this.showModalDatos	=	!this.showModalDatos;
		let body = document.getElementsByTagName('body')[0];
		if(this.showModalDatos)
			body.classList.add('open-modal');
		else
			body.classList.remove('open-modal');
	}
	openModalGrasa() {
		this.showModalGrasa	=	!this.showModalGrasa;
		//let body = document.getElementsByTagName('body')[0];
		if(this.showModalGrasa)
			this.tagBody.classList.add('open-modal');
		else
			this.tagBody.classList.remove('open-modal');
	}	
   tabSelected(tab:string){
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
   tabGrasaSelected(tab:string){
	   console.log(tab);
      if(tab=='pliegues'){
        this.showModalGrasaTabSegmentado = false;
		this.tab_grasa_class_segmentado = '';
		
        this.showModalGrasaTabPliegues=true;
        this.tab_grasa_class_pliegues = 'active';
        
      }else{
        this.showModalGrasaTabSegmentado = true;
        this.showModalGrasaTabPliegues=false;
        this.tab_grasa_class_segmentado = 'active';
        this.tab_grasa_class_pliegues = '';
      }
   }
	
	get grasaSegmentado(){
		var i=0;
		this.grasa.valorGrasaSegmentado	=	0;
		if(this.grasa.abdominal)
			i++;
		if(this.grasa.piernaIzquierda)
			i++;
		if(this.grasa.piernaDerecha)
			i++;
		if(this.grasa.brazoIzquierdo)
			i++;
		if(this.grasa.brazoDerecho)
			i++;
		if(i==0)
			return this.grasa.valorGrasaSegmentado;
		
		var sumatoria	=	Number(this.grasa.abdominal) + Number(this.grasa.piernaIzquierda) + Number(this.grasa.piernaDerecha) + Number(this.grasa.brazoIzquierdo) + Number(this.grasa.brazoDerecho);
		this.grasa.valorGrasaSegmentado	=	sumatoria/i;
		
		return this.grasa.valorGrasaSegmentado;
	}
	get grasaPiegues(){
		/*	pliegues	*/
		this.grasa.valorGrasaPliegues	=	0;
		var edad	=	31;//this.paciente.edad;
		var esMasculino	=	true;//this.paciente.genero=='M';
/*
	D= Densidad del cuerpo; 
	L= Suma de pliegues cutáneos
*/
		var D	=	0;
		var L	=	Number(this.grasa.tricipital) + Number(this.grasa.bicipital) + Number(this.grasa.subescapular) + Number(this.grasa.suprailiaco);
		console.log(L);
		
	
/*	Años	Ecuación para Hombres		Ecuación para mujeres		*/
		if(edad<17){
/*	< 17	D = 1.1533-(0.0643 X L)	D = 1.1369-(0.0598 X L)	*/
			if(esMasculino)
				D	=	1.1533 - (0.0643*L)
			else
				D = 1.1369 - (0.0598*L);
		}else if(edad<20){
/*	17-19	D = 1.1620-(0.0630 X L)	D = 1.1549-(0.0678 X L)	*/
				if(esMasculino)
					D = 1.1620-(0.0630*L);
				else
					D = 1.1549-(0.0678*L);
			}else if(edad<30){
/*	20-29	D = 1.1631-(0.0632 X L)	D = 1.1599-(0.0717 X L)	*/
					if(esMasculino)
						D = 1.1631-(0.0632*L);
					else
						D = 1.1599-(0.0717*L);
				}else if(edad<40){
/*	30-39	D = 1.1422-(0.0544 X L)	D = 1.1423-(0.0632 X L)	*/
						if(esMasculino)
							D = 1.1422-(0.0544*L);
						else
							D = 1.1423-(0.0632*L);
					}else if(edad<50){
/*	40 -49	D = 1.1620-(0.0700 X L)	D = 1.1333-(0.0612 X L)	*/
							if(esMasculino)
								D = 1.1620-(0.0700*L);
							else
								D = 1.1333-(0.0612*L);
						}else{
/*	> 50	D = 1.1715-(0.0779 X L)	D = 1.1339-(0.0645 X L)	*/
							if(esMasculino)
								D = 1.1715-(0.0779*L);
							else
								D = 1.1339-(0.0645*L);
						}
		console.log(D);
/*	Porcentage de grasa (%) = (495 / D) – 450	*/
		console.log('(495' + '/' + D + ')-450');
		this.grasa.valorGrasaPliegues	=	(495/D)-450;
		return this.grasa.valorGrasaPliegues;
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
