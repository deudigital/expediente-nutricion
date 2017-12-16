import { Component, OnInit } from '@angular/core';

import { Rdd } from '../data/formControlData.model';
import { FormControlDataService }     from '../data/formControlData.service';

@Component({
  selector: 'app-recomendacion',
  templateUrl: './recomendacion.component.html',
  styles: []
})
export class RecomendacionComponent implements OnInit {
	oRdd=new Rdd();
	recomendacion=new Rdd();
	model:any;
	va:any;
	paciente:any;
	showModalRdds:boolean=false;
	showModalTabDatos:boolean=true;
	showModalTabGrafico:boolean=false;

	historial:any[];
	
	tab_class_datos:string='active';
	tab_class_graficos:string='';
	
	tmb:number;
	gcr:number;

  constructor(private formControlDataService: FormControlDataService) {
	  this.model	=	formControlDataService.getFormControlData();
	  this.recomendacion	=	this.model.getFormRdd();
	  this.paciente	=	this.model.getFormPaciente();
	  this.va	=	this.model.getFormValoracionAntropometrica();
	  this.setInfoInit();
   }
  ngOnInit() {
	  this.getHistorial();
  }
	ngOnDestroy() {
		this.model.getFormRdd().set(this.recomendacion);
		this.formControlDataService.setFormControlData(this.model);
		if(this.infoEdited())
			this.createRdds(this.recomendacion);
	}
	
	getHistorial(){
		var paciente_id	=	this.paciente.persona_id;
		this.formControlDataService.select('rdds', paciente_id)
		.subscribe(
			 response  => {
						console.log('saveInfo:receiving...');
						console.log(response);
						this.processHistorial(response);
						},
			error =>  console.log(<any>error)
		);
	}
	processHistorial(data){
		console.log('processing');
		var _rdds;
		for(var i in data){
			var rdd	=	data[i];
			
			
			
			
		}
		this.historial	=	_rdds;
	}
	
	setInfoInit(){
		this.oRdd.metodo_calculo_gc				=	this.recomendacion.metodo_calculo_gc;
		this.oRdd.peso_calculo					=	this.recomendacion.peso_calculo;
		this.oRdd.factor_actividad_sedentaria	=	this.recomendacion.factor_actividad_sedentaria;
		this.oRdd.promedio_gc_diario			=	this.recomendacion.promedio_gc_diario;
		this.oRdd.variacion_calorica			=	this.recomendacion.variacion_calorica;
	}
	infoEdited(){
		return 	(
			this.oRdd.metodo_calculo_gc				!==	this.recomendacion.metodo_calculo_gc || 
			this.oRdd.peso_calculo					!==	this.recomendacion.peso_calculo || 
			this.oRdd.factor_actividad_sedentaria	!==	this.recomendacion.factor_actividad_sedentaria || 
			this.oRdd.promedio_gc_diario			!==	this.recomendacion.promedio_gc_diario || 
			this.oRdd.variacion_calorica			!==	this.recomendacion.variacion_calorica
		);
	}
	createRdds(recomendacion) {
		console.log('rdds sending...');
		console.log(recomendacion);
		this.formControlDataService.addRdds(recomendacion)
		.subscribe(
			 response  => {
						console.log('rdds receiving...');
						console.log(response);
						},
			error =>  console.log(<any>error)
		);
	}
	toggleModalRdds() {
		this.showModalRdds	=	!this.showModalRdds;
		let body = document.getElementsByTagName('body')[0];
		if(this.showModalRdds)
			body.classList.add('open-modal');
		else
			body.classList.remove('open-modal');
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
   

	get ingesta_calorica_recomendada(){
		this.recomendacion.icr	=	this.ingestaCaloricaRecomendada();
		return this.recomendacion.icr;
	}
	get gasto_calorico_real(){
		this.recomendacion.gcr	=	this.gastoCaloricoReal();
		return this.recomendacion.gcr;
	}
	ingestaCaloricaRecomendada(){
/*
	Ingesta calórica Recomendada
	=GASTO_CALORICO_REAL+VARIACION_CALORICA
*/
		var result	=	this.gastoCaloricoReal()+this.recomendacion.variacion_calorica;
		return result;
	}
	gastoCaloricoReal(){
		/*
		Gasto Calórico Real
		=REDONDEAR(
			SI(METODO="HARRIS BENEDICT";
				TMB_HARRIS_BENEDICT*FACTOR_ACT_SEDENT+PROM_GASTO_CAL_DIARIO;
				SI(METODO="MIFFLIN-ST-JEOR";
					TMB_MIFFLIN*FACTOR_ACT_SEDENT+PROM_GASTO_CAL_DIARIO;
					SI(METODO="PROMEDIO";
						TMB_PROMEDIO*FACTOR_ACT_SEDENT+PROM_GASTO_CAL_DIARIO;

			"Método Inválido")));0)
*/		
		var result	=	0;
		switch(this.recomendacion.metodo_calculo_gc){
			case 'benedict':
				result	=	this.tmbBenedict()*this.recomendacion.factor_actividad_sedentaria+this.recomendacion.promedio_gc_diario;
				break;
			case 'mifflin':
				result	=	this.tmbMifflin()*this.recomendacion.factor_actividad_sedentaria+this.recomendacion.promedio_gc_diario;
				break;
			case 'promedio':
				result	=	this.tmbPromedio()*this.recomendacion.factor_actividad_sedentaria+this.recomendacion.promedio_gc_diario;
				break;
			default:
				result	=	0;
		}
	   return result;
	}
	
	tmbPromedio(){
/*
		TMB Promedio
		=REDONDEAR(
			PROMEDIO(HARRIS;MIFFLIN)
		;0)
*/
		var result	=	(this.tmbBenedict()+this.tmbMifflin())/2;
		return result;
	}
	tmbMifflin(){
/*
		Tasa Metabolica Basal Mifflin - St Jeor
		=REDONDEAR(
			(10*PESO)+(6,25*(ESTATURA*100))-(5*EDAD)+VARIABLE_MSJ
		;0)
		
		Variable MSJ:
		=SI(SEXO="F";
			-161;
				SI(SEXO="M";
				5;0))
*/
		var variable_msj	=	0;
		if(this.paciente.genero=='M')
			variable_msj	=	5;
		else
			variable_msj	=	-161;

		var result	=	(10*this.va.peso)+(6.25*(this.va.estatura*100))-(5*this.va.edad_metabolica)+variable_msj;
		return result;
					
	}
	tmbBenedict(){
/*
	Tasa Metabolica Basal Harris Benedict
	=REDONDEAR(
		SI(	SEXO="M";
			(66,5+(13,75*PESO)+(5,003*ESTATURA*100)-(6,755*EDAD));
				SI(SEXO="F";
					(655,1+(9,563*PESO)+(1,85*ESTATURA*100)-(4,676*EDAD));)
		
		)
	;0)
*/
		var result	=	0;
		if(this.paciente.genero=='M')
			result	=	66.5+(13.75*this.va.peso)+(5.003*this.va.estatura*100)-(6.755*this.va.edad_metabolica);
		else
			result	=	655.1+(9.563*this.va.peso)+(1.85*this.va.estatura*100)-(4.676*this.va.edad_metabolica);
		
		return result;
			
	}
	get tasa_basal(){
		var result	=	0;
		switch(this.recomendacion.metodo_calculo_gc){
			case 'benedict':
				result	=	this.tmbBenedict();
				break;
			case 'mifflin':
				result	=	this.tmbMifflin();
				break;
			case 'promedio':
				result	=	this.tmbPromedio();
				break;
			default:
				result	=	0;
		}
	   return result;
   }

}
