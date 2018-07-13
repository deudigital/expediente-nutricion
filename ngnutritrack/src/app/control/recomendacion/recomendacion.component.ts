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
	helpers:any;
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
	disableButtonHistorial:boolean;
	
	esAdulto:boolean;
	esMenor:boolean;
	displaySchofield:boolean;
	displayBenedict:boolean;
	displayRDA:boolean;
	displayFactor:boolean;
	mostrarFilaPeso:boolean;
	
	_tasa_basal:number;
	_gasto_calorico_real:number;
	_ingesta_calorica_recomendada:number;
	historialParentWidth:number;

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.model	=	formControlDataService.getFormControlData();
		this.mng	=	this.model.getManejadorDatos();
		this.helpers	=	this.model.getHelpers();
		this.recomendacion	=	this.model.getFormRdd();
		/*console.log(this.recomendacion);*/
		this.paciente	=	this.model.getFormPaciente();
		this.va	=	this.model.getFormValoracionAntropometrica();
		this.setInfoInit();
		this.disableButtonHistorial	=	false;
		this.va.setPesos(this.va.peso, this.va.estatura, this.paciente.genero);
		/*console.log(this.va);*/
		this._tasa_basal	=	0;
		this._gasto_calorico_real	=	0;
		this._ingesta_calorica_recomendada	=	0;
		
		window.onresize = ( e ) => {
			this.createGraphs();
		}
	}
	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		/*
		rda  0 - 18a
		*/
		var _edad_min_adulto	=	18;
		var _metodo			=	'benedict';
		
		if(this.va.metodo_valoracion=='adulto'){
			this.esAdulto		=	true;
			this.displayFactor	=	true;
		}else
			this.esAdulto	=	this.paciente.edad>_edad_min_adulto;/*18;/*20;*/
		
		
		if(!this.esAdulto){
			this.esMenor			=	true;			
			this.displayBenedict	=	true;
			this.displaySchofield	=	true;
			this.displayRDA			=	true;
			_metodo	=	'rda';
			this.displayFactor	=	false;
/*
*Excepciones:
*/
/*edad < a 3 años O > 18 - ocultar opcion de schofield*/
			if( ( this.paciente.edad < 3 ) || ( this.paciente.edad > 18 ) )
				this.displaySchofield	=	false;
/*edad > 18 años - ocultar RDA (en este caso únicamente quedaría harris benedict.*/
			if( this.paciente.edad > 18 ){
				this.displayRDA	=	false;
				//this.displayBenedict	=	true;
				_metodo			=	'benedict-child';
			}

			
/*
si se tiene seleccionado OMS o CDC en la pantalla de VA:
edad > a 3 años O < 18
por defecto debe estar preseleccionado Schofield
*/
			/*if( ( this.paciente.edad > 3 ) || ( this.paciente.edad < 18 ) )*/
			if( ( this.paciente.edad > 2 ) && ( this.paciente.edad < 19 ) )
				_metodo	=	'schofield';
/*
edad < a 3 años
por defecto debe estar preseleccionado RDA Y oculto Schofield
*/
			/*if( this.paciente.edad < 3 ){
				_metodo	=	'rda';
				this.displaySchofield	=	false;
			}*/
			
/*
si se selecciona RDA, se debe ocultar el factor termico de los alimentos y su valor debe ser 0
el resto es igual a los adultos
*/
			/*if( _metodo=='rda')*/
			if( _metodo=='benedict-child' || _metodo=='benedict' )
				this.displayFactor	=	true;
			
			this.mostrarFilaPeso	=	true;
			if(_metodo=='schofield' || _metodo=='rda')
				this.mostrarFilaPeso	=	false;
		}
		/*console.log('_metodo: ' + _metodo);*/
		if(!this.recomendacion.metodo_calculo_gc || this.recomendacion.metodo_calculo_gc=='benedict' )
			this.recomendacion.metodo_calculo_gc	=	_metodo;

		this.habitosEjercicios	=	this.model.getFormPacienteHabitosEjercicios();
		/*console.log(this.habitosEjercicios);*/
		this.setGastoCaloricoActividadFisica();
		this.getHistorial();
		
		this._analisis();
	}
	ngOnInit__old() {
		this.tagBody = document.getElementsByTagName('body')[0];
		this.esAdulto	=	this.paciente.edad>20;
		this.esMenor	=	!this.esAdulto;
		/*console.log(this.recomendacion.metodo_calculo_gc);*/
		this.displaySchofield	=	(this.paciente.edad>2) && (this.paciente.edad<19);
		this.displayBenedict	=	(this.paciente.edad>9);
		this.displayRDA			=	(this.paciente.edad<19);
		this.displayFactor		=	this.recomendacion.metodo_calculo_gc!='rda';
		if(this.displayBenedict && !this.displaySchofield && !this.displayRDA)
			this.recomendacion.metodo_calculo_gc	=	'benedict-child';
		
		/*console.log(this.recomendacion.metodo_calculo_gc);*/
		
		this.habitosEjercicios	=	this.model.getFormPacienteHabitosEjercicios();
		/*console.log(this.habitosEjercicios);*/
		this.setGastoCaloricoActividadFisica();
		this.getHistorial();
	}
	ngOnDestroy() {
		this.saveForm();
	}
	getWidthContainerChildrenGraph(){
		try {
			var _width	=	this.tagBody.offsetWidth;
			if(_width>1250)
				_width	=	1200;
			else
				_width	=	this.tagBody.offsetWidth - 30;

			if(document.getElementById('container_historial_children_graphics'))
				_width	=	document.getElementById('container_historial_children_graphics').offsetWidth;

			this.historialParentWidth	=	_width;
			/*console.log( 'historialParentWidth-> ' +  this.historialParentWidth );*/
		}
		catch(err) {
				console.log( 'ERROR: getWidthContainerChildrenGraph-> ' + err.message );
		}
	}
	changeMethod(){
		//this.displayFactor	=	this.recomendacion.metodo_calculo_gc!='rda';
		this.displayFactor	=	this.recomendacion.metodo_calculo_gc=='benedict-child';
		if(!this.displayFactor)
			this.recomendacion.factor_actividad_sedentaria	=	0;
		this.mostrarFilaPeso	=	true;
		if( this.recomendacion.metodo_calculo_gc=='schofield' || this.recomendacion.metodo_calculo_gc=='rda')
				this.mostrarFilaPeso	=	false;
		this._analisis();
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
		//console.log('gasto_calorico_total_semanal: ' + gasto_calorico_total_semanal);
		gasto_calorico_total_semanal	=	gasto_calorico_total_semanal / 7;
		//console.log('gasto_calorico_total_semanal / 7: ' + gasto_calorico_total_semanal);
		this.recomendacion.promedio_gc_diario	=	Math.round(gasto_calorico_total_semanal);
	}
	getHistorial(){
		var paciente_id	=	this.paciente.persona_id;
		this.formControlDataService.select('rdds', paciente_id)
		.subscribe(
			 response  => {
						/*console.log('<-- cRud RDDs');*/
						/*console.log(response);*/
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
		this.disableButtonHistorial	=	this.historial.length==0;
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

		this.getWidthContainerChildrenGraph();
		var _va	=	this.historial[0];
		for(var i in _va) {
			if(!this.helpers.in_array(_h, i))
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
/*				width: 1100,
				height:350,*/
				width: this.historialParentWidth,
				legend: { position: 'bottom' },
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
		/*console.log('-->Crud RDDs');
		console.log(recomendacion);*/
		this.formControlDataService.addRdds(recomendacion)
		.subscribe(
			 response  => {
						/*console.log('<!--Crud rdds');
						console.log(response);*/
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
		window.scrollTo(0, 0);
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
			case 'benedict-child':
			case 'benedict':
				result	=	this.tmbBenedict()*this.recomendacion.factor_actividad_sedentaria+this.recomendacion.promedio_gc_diario;
				break;
			case 'mifflin':
				result	=	this.tmbMifflin()*this.recomendacion.factor_actividad_sedentaria+this.recomendacion.promedio_gc_diario;
				break;
			case 'promedio':
				result	=	this.tmbPromedio()*this.recomendacion.factor_actividad_sedentaria+this.recomendacion.promedio_gc_diario;
				break;
			case 'rda':
				/*this.recomendacion.factor_actividad_sedentaria	=	0;*/
				/*result	=	this.tmbRda()*this.recomendacion.factor_actividad_sedentaria+this.recomendacion.promedio_gc_diario;
				console.log('G.C.R:' + this.tmbRda() + '*' + this.recomendacion.factor_actividad_sedentaria + '+' + this.recomendacion.promedio_gc_diario + '=' + result );*/
				result	=	(this._tasa_basal*this.va.peso)+this.recomendacion.promedio_gc_diario;
				console.log('G.C.R: ( ' + this.tmbRda() + '*' + this.va.peso + ' ) +' + this.recomendacion.promedio_gc_diario + '=' + result );
				break;
			case 'schofield':
				//result	=	this.tmbSchofield()*this.recomendacion.factor_actividad_sedentaria+this.recomendacion.promedio_gc_diario;
				result	=	this._tasa_basal+this.recomendacion.promedio_gc_diario;
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
/*			case 'rda':
			case 'schofield':
				result	=	_get_tasa_basal()+promedio_gc_diario;
				break;*/
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
		//console.log('this.recomendacion.peso_calculo->' + this.recomendacion.peso_calculo);
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
		//console.log('this.current_peso-> ' + this.current_peso);
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
		var _estatura	=	this.va.estatura*100;
		if(this.paciente.genero=='M')
			result	=	66.5+(13.75*this.current_peso)+(5.003*_estatura)-(6.755*this.paciente.edad);
		else{
			/*result	=	655.1+(9.563*this.current_peso)+(1.85*_estatura-(4.676*this.paciente.edad);*/
			var _peso		=	9.563*this.current_peso;
			if(isNaN(_peso))
				_peso	=	0;
			//console.log(_peso);
			var _edad		=	4.676*this.paciente.edad;
			//console.log(_edad);
			var _estatura	=	1.85*_estatura;
			//console.log(_estatura);
			result	=	655.1 + _peso + ( _estatura - _edad );
			//console.log(result);
		}
		
		
		return result;
			
	}
	tmbRda(){
		var value	=	0;
		if(this.paciente.edad<=1){
/*
 *Infantes	0 - 0.5	108
 *			0.5 - 1	98
*/
			value	=	108;
			if(this.paciente.edad_meses >=6)
				value	=	98;
		}else{
/*
 *Niños		1 - 3	102
 *			4 - 6	90
 *			7 - 10	70
 */
			if(this.paciente.edad>1){
				value	=	102;
				if(this.paciente.edad>=4){
					value	=	90;
					if(this.paciente.edad>=7 && this.paciente.edad<=10 )
						value	=	70;
/* 
 *Hombres	11 - 14	55
 *			15 -18	45
 * Mujeres	11 - 14	47
 *			15 -18	40
 */
					if(this.paciente.edad>=11 && this.paciente.edad<=14 ){
						value	=	55;
						if(this.paciente.genero=='F')
							value	=	47;
					}
					if(this.paciente.edad>=15 && this.paciente.edad<=18 ){
						value	=	45;
						if(this.paciente.genero=='F')
							value	=	40;
					}
					
				}
			}
		}
		console.log('tmbRda:' + value);
		return value;
	}
	tmbRda__original(){
		var value	=	0;

/* 
Infantes	0 - 0.5	108
			0.5 - 1	98
Niños		1 - 3	102
			4 - 6	90
			7 - 10	70
Hombres		11 - 14	55
			15 -18	45
Mujeres		11 - 14	47
			15 -18	40
*/
		if(this.paciente.edad>1){
			if(this.paciente.edad<11){
				value	=	70;
				if(this.paciente.edad<4)
					value	=	102;
				else{
					if(this.paciente.edad<7)
						value	=	90;					
				}
			}else{
				if(this.paciente.edad<15){
					value	=	55;
					if(this.paciente.genero=='F')
						value	=	47;
				}else{
					value	=	45;
					if(this.paciente.genero=='F')
						value	=	40;
				}
			}
		}else{
			value	=	108;
			if(this.paciente.edad_meses >6)
				value	=	98;
		}
		
		
		return value;
	}
	tmbSchofield(){
		var value	=	0;
		this.current_peso	=	this.va.peso;
		/*switch(this.recomendacion.peso_calculo){
			case 'actual':
				this.current_peso	=	this.va.peso;
				break;
			case 'ideal':
				this.current_peso	=	this.va.pesoIdeal;
				break;
			case 'ideal-ajustado':
				this.current_peso	=	this.va.pesoIdealAjustado;
				break;
		}*/
/*
		Edad	Formula
Hombres	3-10	(19.6 x Peso) + (130.3 x Estatura) + 414.9
		10-18	(16.25 x Peso) + (137.2 x Estatura) + 515.5

Mujeres	3-10	(8.365 x Peso) + (130.3 x Estatura) + 414.11
		10-18	(19.6 x Peso) + (130.3 x Estatura) + 414.12
*/
		//var result	=	(10*this.current_peso)+(6.25*(this.va.estatura*100))-(5*this.paciente.edad)+variable_msj;
		
		if( this.paciente.edad<3 || this.paciente.edad>18 )
			return value;
			
		if(this.paciente.edad<11){
			if(this.paciente.genero=='M')
				value	=	(19.6*this.current_peso) + (130.3*this.va.estatura) + 414.9;
			else
				value	=	(8.365*this.current_peso) + (130.3*this.va.estatura) + 414.11;
		}else{
			if(this.paciente.genero=='M')
				value	=	(16.25*this.current_peso) + (137.2*this.va.estatura) + 515.5;
			else
				value	=	(19.6*this.current_peso) + (130.3 *this.va.estatura) + 414.12;
			
		}		
		return value;
	}
	tmbSchofield__original(){
		var value	=	0;
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
		Edad	Formula
Hombres	3-10	(19.6 x Peso) + (130.3 x Estatura) + 414.9
		10-18	(16.25 x Peso) + (137.2 x Estatura) + 515.5

Mujeres	3-10	(8.365 x Peso) + (130.3 x Estatura) + 414.11
		10-18	(19.6 x Peso) + (130.3 x Estatura) + 414.12
*/
		//var result	=	(10*this.current_peso)+(6.25*(this.va.estatura*100))-(5*this.paciente.edad)+variable_msj;
		if(this.paciente.edad<11){
			if(this.paciente.genero=='M')
				value	=	(19.6*this.current_peso) + (130.3*this.va.estatura) + 414.9;
			else
				value	=	(8.365*this.current_peso) + (130.3*this.va.estatura) + 414.11;
		}else{
			if(this.paciente.genero=='M')
				value	=	(16.25*this.current_peso) + (137.2*this.va.estatura) + 515.5;
			else
				value	=	(19.6*this.current_peso) + (130.3 *this.va.estatura) + 414.12;
			
		}		
		return value;
	}
	get tasa_basall(){
		var result	=	0;
		switch(this.recomendacion.metodo_calculo_gc){
			case 'benedict-child':
			case 'benedict':
				result	=	this.tmbBenedict();
				break;
			case 'mifflin':
				result	=	this.tmbMifflin();
				break;
			case 'promedio':
				result	=	this.tmbPromedio();
				break;
			case 'rda':
				result	=	this.tmbRda();
				break;
			case 'schofield':
				result	=	this.tmbSchofield();
				break;
			default:
				result	=	0;
		}
		this._tasa_basal	=	result;
	   return result;
   }
   _get_tasa_basal(){
		var result	=	0;
		switch(this.recomendacion.metodo_calculo_gc){
			case 'benedict-child':
			case 'benedict':
				result	=	this.tmbBenedict();
				break;
			case 'mifflin':
				result	=	this.tmbMifflin();
				break;
			case 'promedio':
				result	=	this.tmbPromedio();
				break;
			case 'rda':
				result	=	this.tmbRda();
				break;
			case 'schofield':
				result	=	this.tmbSchofield();
				break;
			default:
				result	=	0;
		}
		this._tasa_basal	=	result;
	   return result;
   }
   
   _analisis(){
	   this._get_tasa_basal();
	   this.recomendacion.gcr				=	this.gastoCaloricoReal();
	   this._gasto_calorico_real			=	this.recomendacion.gcr;
	   this._ingesta_calorica_recomendada	=	this.ingestaCaloricaRecomendada();
	   this.recomendacion.icr				=	this._ingesta_calorica_recomendada;
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
