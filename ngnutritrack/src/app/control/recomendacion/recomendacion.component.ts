import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Rdd } from '../data/formControlData.model';
import { FormControlDataService }     from '../data/formControlData.service';
import { LineChartConfig } from '../../models/LineChartConfig';

@Component({
  selector: 'app-recomendacion',
  templateUrl: './recomendacion.component.html',
  styles: []
})
export class RecomendacionComponent implements OnInit {
	oRdd=new Rdd();
	recomendacion=new Rdd();
	model:any;
	mng:any;
	jarvis:any;
	va:any;
	paciente:any;
	showModalRdds:boolean=false;
	showModalTabDatos:boolean=true;
	showModalTabGrafico:boolean=false;

	historial:any[];
	graficos: any;
	graficosH: any;
	tab_class_datos:string='active';
	tab_class_graficos:string='';
	
	current_peso:number;
	tmb:number;
	gcr:number;
	tagBody:any;
	hideModalDatos:boolean=true;
	habitosEjercicios:any[];

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.model	=	formControlDataService.getFormControlData();
		this.mng	=	this.model.getManejadorDatos();
		this.jarvis	=	this.model.getHelpers();
		this.recomendacion	=	this.model.getFormRdd();
		this.paciente	=	this.model.getFormPaciente();
		this.va	=	this.model.getFormValoracionAntropometrica();
		this.setInfoInit();
		this.va.setPesos(this.va.peso, this.va.estatura, this.paciente.genero);
		console.log(this.va);
	}
	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		this.habitosEjercicios	=	this.model.getFormPacienteHabitosEjercicios();
		console.log(this.habitosEjercicios);
		this.setGastoCaloricoActividadFisica();
		this.getHistorial();
	}
	ngOnDestroy() {
		this.saveForm();
	}
	setGastoCaloricoActividadFisica(){
		//if(this.recomendacion.promedio_gc_diario>0)
		if(this.mng.operacion!='nueva-consulta')
			return ;

		var gasto_calorico_total_semanal	=	0;
		var ejercicio;
		for(var i in this.habitosEjercicios) {
			ejercicio	=	this.habitosEjercicios[i];
			gasto_calorico_total_semanal		+=	(ejercicio.mets*0.0175*this.va.peso)*(ejercicio.horas_semanales*60);
		}
		console.log('gasto_calorico_total_semanal: ' + gasto_calorico_total_semanal);
		gasto_calorico_total_semanal	=	gasto_calorico_total_semanal / 7;
		console.log('gasto_calorico_total_semanal / 7: ' + gasto_calorico_total_semanal);
		this.recomendacion.promedio_gc_diario	=	Math.round(gasto_calorico_total_semanal);
	}
	getHistorial(){
		var paciente_id	=	this.paciente.persona_id;
		this.formControlDataService.select('rdds', paciente_id)
		.subscribe(
			 response  => {
						console.log('GET rdds response');
						console.log(response);
						this.processHistorial(response);
						this.createGraphs();
						},
			error =>  console.log(<any>error)
		);
	}
	processHistorial(data){//console.log('processing historial rdds');
		var _rdds	=	[];
		var _rdd;
		var item;
		var tmbBenedict;
		var tmbMifflin;
		for(var i in data){//console.log(item);
			item	=	data[i];
			/*tmbBenedict			=	this._tmbBenedict(this.paciente.genero, item.peso, item.estatura, item.edad_metabolica);
			tmbMifflin			=	this._tmbMifflin(this.paciente.genero, item.peso, item.estatura, item.edad_metabolica);*/
			tmbBenedict			=	this._tmbBenedict(this.paciente.genero, item.peso, item.estatura, item.edad);
			tmbMifflin			=	this._tmbMifflin(this.paciente.genero, item.peso, item.estatura, item.edad);
			item.tmb			=	this._tmbPromedio(tmbBenedict,tmbMifflin);
			item.gc_real		=	this._gastoCaloricoReal(item.metodo_calculo_gc, tmbBenedict, tmbMifflin, item.tmb, item.factor_actividad_sedentaria, item.promedio_gc_diario );
			item.gc_recomendado	=	this._ingestaCaloricaRecomendada(item.gc_real, item.variacion_calorica)
			_rdds.push(item);
		}
		this.historial	=	_rdds;
	}
	createGraphs(){//console.log('processing graphics');
		var toGraph = '';
		var date;
		var new_date;
		var new_date_format;
		var toolTipHtml;
		var va;
		var data;
		var item;
		var items	=	[];
		var headers	=	[];
		var headerGraficos	=	[];
		var config;
		var options;
		var columns;
		var value;
		headerGraficos['promedio_gc_diario']	=	'Gasto Calórico Actividad Física';
		headerGraficos['tmb']					=	'TMB';
		headerGraficos['gc_real']				=	'Gasto Calórico Real';
		headerGraficos['variacion_calorica']	=	'Variación Calórica';
		headerGraficos['gc_recomendado']		=	'Gasto Calórico Recomendado';
		
		var k=0;
		var _h	=	['promedio_gc_diario', 'tmb', 'gc_real','variacion_calorica','gc_recomendado'];
		
		var _va	=	this.historial[0];
		for(var i in _va) {
			if(!this.jarvis.in_array(_h, i))
				continue ;
				
			data	=	[];			
			for(var j in this.historial) {
				var d	= this.historial[j].fecha.split('-');
				var anho	=	d[0];
				var mes		=	d[1];
				var dia		=	d[2];
				new_date	=	new Date( anho, (mes-1), dia);				
				new_date_format	=	dia + '/' + mes + '/' + anho;
				value	=	this.historial[j][i].toFixed(0);
				toolTipHtml	=	'<ul class="grafico-lista">';
				toolTipHtml	+=	'	<li>Fecha: <strong>' + new_date_format + '</strong></li>';
				toolTipHtml	+=	'	<li>' + headerGraficos[i] + ': <strong>' + value + '</strong></li>';
				toolTipHtml	+=	'</ul>';
				data.push([new_date,parseInt(value),toolTipHtml]);
			}
			toGraph	=	headerGraficos[i];
			options = {
				width: 1100,
				height:350,
				animation: {
					duration: 1000,
					easing: 'out'
				},
				tooltip: {isHtml: true},
				titleTextStyle: {
					color: '#cc1f25',
					fontName: 'Verdana',
					fontSize: 20, 
					bold: true,   
					italic: false
				},
				pointShape: 'circle', pointSize: 10,
				hAxis: {
					title: 'Fecha'
				},
				vAxis: {
					title: toGraph
				},
				colors: ['#cc1f25']
			};
			columns	= [
							{label: 'date', type: 'date'},
							{label: toGraph, type: 'number'},
							{type: 'string', role: 'tooltip', 'p': {'html': true}}
						];

			config	=	new LineChartConfig('title ' + toGraph, options, columns);
			headers.push({'id':i, 'nombre':toGraph, 'class': 'grafico-' + i});
			item	=	{'data':data, 'config': config, 'elementId':'element_' + i, 'key': 'container_' + i, 'class':i=='promedio_gc_diario'? 'active':''};
			items.push(item);
		}
		this.graficosH	=	headers;
		this.graficos	=	items;
		this.tagBody.classList.add('grafico-selected-promedio_gc_diario');
	}
	graficoSelected(header){
		this.tagBody.classList.remove('grafico-selected-promedio_gc_diario');
		this.tagBody.classList.remove('grafico-selected-tmb');
		this.tagBody.classList.remove('grafico-selected-gc_real');
		this.tagBody.classList.remove('grafico-selected-variacion_calorica');
		this.tagBody.classList.remove('grafico-selected-gc_recomendado');

		this.tagBody.classList.add('grafico-selected-' + header.id + '');
		
		document.getElementById('container_promedio_gc_diario').className = '';
		document.getElementById('container_tmb').className = '';
		document.getElementById('container_gc_real').className = '';
		document.getElementById('container_variacion_calorica').className = '';
		document.getElementById('container_gc_recomendado').className = '';

		document.getElementById('container_' + header.id).className = 'active';
		
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
		console.log('save rdds...');
		console.log(recomendacion);

		this.formControlDataService.addRdds(recomendacion)
		.subscribe(
			 response  => {
						console.log('<!--Crud rdds');
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
	showModal(modal){
		this.hideModalDatos		=	true;

		switch(modal){
			case 'datos':
				this.hideModalDatos	=	false;
				break;
		}
		this.tagBody.classList.add('open-modal');		
	}
	hideModal(modal){
		switch(modal){
			case 'datos':
				this.hideModalDatos	=	true;
				break;
		}
		this.tagBody.classList.remove('open-modal');		
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
/*	Ingesta calórica Recomendada
	=GASTO_CALORICO_REAL+VARIACION_CALORICA
*/
		var result	=	this.gastoCaloricoReal()+this.recomendacion.variacion_calorica;
		return result;
	}
	gastoCaloricoReal(){
/*		Gasto Calórico Real
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
	_ingestaCaloricaRecomendada(gastoCaloricoReal, variacion_calorica){
/*
	Ingesta calórica Recomendada
	=GASTO_CALORICO_REAL+VARIACION_CALORICA
*/
		var result	=	gastoCaloricoReal+variacion_calorica;
		return result;
	}
	_gastoCaloricoReal(metodo_calculo_gc, tmbBenedict, tmbMifflin, tmbPromedio, factor_actividad_sedentaria, promedio_gc_diario ){
/*		Gasto Calórico Real
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
		switch(metodo_calculo_gc){
			case 'benedict':
				result	=	tmbBenedict*factor_actividad_sedentaria+promedio_gc_diario;
				break;
			case 'mifflin':
				result	=	tmbMifflin*factor_actividad_sedentaria+promedio_gc_diario;
				break;
			case 'promedio':
				result	=	tmbPromedio*factor_actividad_sedentaria+promedio_gc_diario;
				break;
			default:
				result	=	0;
		}
	   return result;
	}
	_tmbPromedio(tmbBenedict,tmbMifflin){
/*		TMB Promedio
		=REDONDEAR(
			PROMEDIO(HARRIS;MIFFLIN)
		;0)
*/
		var result	=	(tmbBenedict+tmbMifflin)/2;
		return result;
	}	
	_tmbBenedict(genero, peso, estatura, edad_metabolica){//console.log('_tmbBenedict:' + genero + ' ' + peso + ' ' + estatura + ' ' + edad_metabolica);
/*	Tasa Metabolica Basal Harris Benedict
	=REDONDEAR(
		SI(	SEXO="M";
			(66,5+(13,75*PESO)+(5,003*ESTATURA*100)-(6,755*EDAD));
				SI(SEXO="F";
					(655,1+(9,563*PESO)+(1,85*ESTATURA*100)-(4,676*EDAD));)
		
		)
	;0)
*/
		var result	=	0;
		if(genero=='M')
			result	=	66.5+(13.75*peso)+(5.003*estatura*100)-(6.755*edad_metabolica);
		else
			result	=	655.1+(9.563*peso)+(1.85*estatura*100)-(4.676*edad_metabolica);
		
		return result;
			
	}
	_tmbMifflin(genero, peso, estatura, edad_metabolica){//console.log('_tmbMifflin:' + genero + ' ' + peso + ' ' + estatura + ' ' + edad_metabolica);
/*	Tasa Metabolica Basal Mifflin - St Jeor
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
		if(genero=='M')
			variable_msj	=	5;
		else
			variable_msj	=	-161;

		var result	=	(10*peso)+(6.25*(estatura*100))-(5*edad_metabolica)+variable_msj;
		return result;

	}
	tmbPromedio(){
/*		TMB Promedio
		=REDONDEAR(
			PROMEDIO(HARRIS;MIFFLIN)
		;0)
*/
		var result	=	(this.tmbBenedict()+this.tmbMifflin())/2;
		return result;
	}
	tmbMifflin(){
		this.current_peso	=	0;
		switch(this.recomendacion.peso_calculo){
			case 'actual':
				this.current_peso	=	this.va.peso;
				break;
			case 'ideal':
				this.current_peso	=	this.va.pesoIdeal;
				break;
			case 'ideal-ajustado':
				this.current_peso	=	this.va.pesoIdealAjustado;
				break;
		}
/*		Tasa Metabolica Basal Mifflin - St Jeor
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
//console.log('Mifflin: peso=' + this.current_peso + ', estatura=' + this.va.estatura + ', edad=' + this.paciente.edad + ', variable_msj=' + variable_msj);
		//var result	=	(10*this.current_peso)+(6.25*(this.va.estatura*100))-(5*this.va.edad_metabolica)+variable_msj;
		var result	=	(10*this.current_peso)+(6.25*(this.va.estatura*100))-(5*this.paciente.edad)+variable_msj;
		return result;
	}
	tmbBenedict(){
		this.current_peso	=	0;
		switch(this.recomendacion.peso_calculo){
			case 'actual':
				this.current_peso	=	this.va.peso;
				break;
			case 'ideal':
				this.current_peso	=	this.va.pesoIdeal;
				break;
			case 'ideal-ajustado':
				this.current_peso	=	this.va.pesoIdealAjustado;
				break;
		}
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
		/*if(this.paciente.genero=='M')
			result	=	66.5+(13.75*this.current_peso)+(5.003*this.va.estatura*100)-(6.755*this.va.edad_metabolica);
		else
			result	=	655.1+(9.563*this.current_peso)+(1.85*this.va.estatura*100)-(4.676*this.va.edad_metabolica);
		*/
		//console.log('BENEDICT: peso=' + this.current_peso + ', estatura=' + this.va.estatura + ', edad=' + this.paciente.edad);
		if(this.paciente.genero=='M')
			result	=	66.5+(13.75*this.current_peso)+(5.003*this.va.estatura*100)-(6.755*this.paciente.edad);
		else
			result	=	655.1+(9.563*this.current_peso)+(1.85*this.va.estatura*100)-(4.676*this.paciente.edad);
		
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
	saveForm(){
		this.model.getFormRdd().set(this.recomendacion);
		this.formControlDataService.setFormControlData(this.model);
		if(this.infoEdited())
			this.createRdds(this.recomendacion);
	}
	Previous(){
		this.router.navigate(['/valoracion']);
	}
	Next(){
		this.router.navigate(['/dieta']);
	}
}
