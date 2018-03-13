import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Analisis,ValoracionAntropometrica, Paciente, DetalleMusculo, DetalleGrasa } from '../data/formControlData.model';
import { FormControlDataService }     from '../data/formControlData.service';
import { LineChartConfig } from '../../models/LineChartConfig';

import { FileService } from '../../services/file.service';
@Component({
  selector: 'app-valoracion',
  templateUrl: './valoracion.component.html',
  styles: []
})
export class ValoracionComponent implements OnInit {
	model:any;
	mng:any;
	helpers:any;
	analisis	=	new Analisis();
	valoracion	=	new ValoracionAntropometrica();
	oValoracion	=	new ValoracionAntropometrica();
	lValoracion	=	new ValoracionAntropometrica();
	
	detalleMusculo:DetalleMusculo	=	new DetalleMusculo();
	detalleGrasa:DetalleGrasa		=	new DetalleGrasa();
	oDetalleMusculo:any;
	oDetalleGrasa:any;
	
	grasa		=	new DetalleGrasa();
	paciente	=	new Paciente();
	musculo_tronco:number;
	musculo_pierna_derecha:number;
	musculo_pierna_izquierda:number;
	musculo_brazo_derecho:number;
	musculo_brazo_izquierdo:number;
	
	historial:any[];
	
	sexo:string='M';
	genero:string='M';
	titulo_pagina:string='Expediente: Jorge Lpez';
	
	hideModalDatos:boolean=true;
	hideModalGrasa:boolean=true;
	hideModalMusculo:boolean=true;
	
	showModalDatos:boolean=true;
	showModalTabDatos:boolean=true;
	showModalTabGrafico:boolean=false;
	currentModal:string;
	
	showModalGrasa:boolean=false;
	showModalGrasaTabSegmentado:boolean=true;
	showModalGrasaTabPliegues:boolean=false;
	
	showModalMusculo:boolean=false;
	showModalMusculoTabSegmentado:boolean=true;
	
	tagBody:any;
	
	tab_class_datos:string='active';
	tab_class_graficos:string='';
	
	tab_grasa_class_segmentado:string='active';
	tab_grasa_class_pliegues:string='';

	graficos_by_x: any;
	graficos_by_x_H: any;
	graficos: any;
	graficosH: any;
	data4: any[];
	config4: LineChartConfig;
	elementId4: String;
	
	hideimc:boolean=false;
	hidepeso:boolean=true;
	hideestatura:boolean=true;
	hidegrasa:boolean=true;
	hidegrasa_viceral:boolean=true;
	hidemusculo:boolean=true;
	hideagua:boolean=true;
	hidehueso:boolean=true;
	hideedad_metabolica:boolean=true;
	hidecircunferencia_cintura:boolean=true;
	hidecircunferencia_cadera:boolean=true;
	hidecircunferencia_muneca:boolean=true;
	allowCalculate:boolean=false;
	nuevaConsulta:boolean=false;

	errorMessage: string;
	images: Array<any>= [];
  
	btnNavigation_pressed:boolean;
	page:string;
	aPendientes:any[];
	aPendientess:{ [id: string]: any; }	=	{'0':''};
	countPendientes:number=0;

	valorGrasaPliegues:number;
	disableButtonHistorial:boolean;
	loading_data_form:boolean;
	
	esAdulto:boolean;
	displayoptionsForMenor:boolean;
	esMenor:boolean;
	displayOms:boolean;
  
	constructor(private router: Router, private formControlDataService: FormControlDataService, private fileService: FileService) {
		this.model		=	formControlDataService.getFormControlData();
		this.helpers	=	this.model.getHelpers();
		this.mng	=	this.model.getManejadorDatos();
		this.mng.setMenuPacienteStatus(false);
		this.nuevaConsulta	=	false;
		this.disableButtonHistorial	=	true;
		this.loading_data_form	=	true;
		this.esAdulto			=	false;
		this.esMenor			=	false;
		this.displayoptionsForMenor		=	false;
		this.getDatosDeConsulta(this.model.consulta.id);
    }
	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		/*this.aPendientes		=	[];
		this.aPendientess		=	[];*/
		this.countPendientes	=	0;
		this.btnNavigation_pressed	=	false;
		
	}
	ngOnDestroy() {
		if(!this.btnNavigation_pressed)
			this.saveForm();
	}
	changeMethod(){
		this.esAdulto	=	this.valoracion.metodo_valoracion=='adulto';
		this.esMenor	=	!this.esAdulto;
	}
	setInfoInit(){
/*		this.oValoracion.estatura				=	Number(this.valoracion.estatura);
		this.oValoracion.circunferencia_muneca	=	Number(this.valoracion.circunferencia_muneca);
		this.oValoracion.peso					=	Number(this.valoracion.peso);
		this.oValoracion.grasa					=	Number(this.valoracion.grasa);
		this.oValoracion.musculo				=	Number(this.valoracion.musculo);
		this.oValoracion.agua					=	Number(this.valoracion.agua);
		this.oValoracion.grasa_viceral			=	Number(this.valoracion.grasa_viceral);
		this.oValoracion.hueso					=	Number(this.valoracion.hueso);
		this.oValoracion.edad_metabolica		=	Number(this.valoracion.edad_metabolica);
		this.oValoracion.circunferencia_cintura	=	Number(this.valoracion.circunferencia_cintura);
		this.oValoracion.circunferencia_cadera	=	Number(this.valoracion.circunferencia_cadera);*/
		
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

		this.oValoracion.metodo_valoracion	=	this.valoracion.metodo_valoracion;
		this.oValoracion.percentil_analisis	=	this.valoracion.percentil_analisis;
		
		
		if(this.mng.operacion=='nueva-consulta' && !this.valoracion.id){
			this.nuevaConsulta	=	true;
			/*this.valoracion.estatura				=	Number(this.valoracion.lastEstatura);
			this.valoracion.circunferencia_muneca	=	Number(this.valoracion.lastCircunferencia_muneca);*/
			this.valoracion.estatura				=	String(this.valoracion.lastEstatura);
			this.valoracion.circunferencia_muneca	=	String(this.valoracion.lastCircunferencia_muneca);
		}		
	}
	infoEdited(){
		if(!this.valoracion.id && this.countPendientes>0){
			return true;
		}
		console.log(Number(this.oValoracion.estatura) + '!==' + Number(this.valoracion.estatura));
		console.log(Number(this.oValoracion.circunferencia_muneca) + '!==' + Number(this.valoracion.circunferencia_muneca));
		console.log(Number(this.oValoracion.peso)	 + '!==' + Number(this.valoracion.peso));
		console.log(Number(this.oValoracion.grasa)	 + '!==' + Number(this.valoracion.grasa));
		console.log(Number(this.oValoracion.musculo) + '!==' + Number(this.valoracion.musculo));
		console.log(Number(this.oValoracion.agua)	 + '!==' + Number(this.valoracion.agua));
		console.log(Number(this.oValoracion.grasa_viceral) + '!==' + Number(this.valoracion.grasa_viceral));
		console.log(Number(this.oValoracion.hueso)	 + '!==' + Number(this.valoracion.hueso));
		console.log(Number(this.oValoracion.edad_metabolica)	 + '!==' + Number(this.valoracion.edad_metabolica));
		console.log(Number(this.oValoracion.circunferencia_cintura) + '!==' + Number(this.valoracion.circunferencia_cintura));
		console.log(Number(this.oValoracion.circunferencia_cadera) + '!==' + Number(this.valoracion.circunferencia_cadera));
		console.log(String(this.oValoracion.metodo_valoracion) + '!==' + String(this.valoracion.metodo_valoracion));
		console.log(Number(this.oValoracion.percentil_analisis) + '!==' + Number(this.valoracion.percentil_analisis));
		return 	(
			Number(this.oValoracion.estatura)				!==	Number(this.valoracion.estatura) || 
			Number(this.oValoracion.circunferencia_muneca)	!==	Number(this.valoracion.circunferencia_muneca) || 
			Number(this.oValoracion.peso)					!==	Number(this.valoracion.peso) || 
			Number(this.oValoracion.grasa)					!==	Number(this.valoracion.grasa) || 
			Number(this.oValoracion.musculo)				!==	Number(this.valoracion.musculo) || 
			Number(this.oValoracion.agua)					!==	Number(this.valoracion.agua) || 
			Number(this.oValoracion.grasa_viceral)			!==	Number(this.valoracion.grasa_viceral) || 
			Number(this.oValoracion.hueso)					!==	Number(this.valoracion.hueso) || 
			Number(this.oValoracion.edad_metabolica)		!==	Number(this.valoracion.edad_metabolica) || 
			Number(this.oValoracion.circunferencia_cintura)	!==	Number(this.valoracion.circunferencia_cintura) || 
			Number(this.oValoracion.circunferencia_cadera)	!==	Number(this.valoracion.circunferencia_cadera) || 
			String(this.oValoracion.metodo_valoracion)		!==	String(this.valoracion.metodo_valoracion) || 
			Number(this.oValoracion.percentil_analisis)		!==	Number(this.valoracion.percentil_analisis)
		);
	}
	getDatosDeConsulta(consulta_id){
		if(!consulta_id)
			return ;
		
		this.allowCalculate	=	false;
		this.formControlDataService.getConsultaSelected(consulta_id).subscribe(
			data => {
				this.model.fill(data);
				this.valoracion		=	this.model.getFormValoracionAntropometrica();				
				this.detalleMusculo	=	this.model.getFormDetalleMusculo();
				this.grasa			=	this.model.getFormDetalleGrasa();
				this.paciente		=	this.model.getFormPaciente();
				console.log(this.valoracion);
				this.esAdulto	=	this.paciente.edad>20;
				this.esMenor	=	!this.esAdulto;
				if(this.esMenor){
					this.displayoptionsForMenor	=	true;
				
					this.displayOms	=	this.paciente.edad<19;
					if(!this.valoracion.metodo_valoracion)
						this.valoracion.metodo_valoracion	=	this.displayOms? 'oms':'cdc';
				}
				this.setInfoInit();
				this.loading_data_form	=	false;
				this.getHistorial();
				this.getGraphic();
				setTimeout(() => {
					      this.allowCalculate	=	true;
					    }, 500);
				
			},
			error => console.log(<any>error)
		);
	}
	getHistorial(){
		var paciente_id	=	this.model.consulta.paciente_id;
		this.formControlDataService.select('valoracionAntropometrica', paciente_id)
		.subscribe(
			 response  => {
						this.historial	=	response;
						this.disableButtonHistorial	=	this.historial.length==0;
						this.createGraphs();
						},
			error =>  console.log(<any>error)
		);
	}
	createGraphs(){
		if(this.historial.length==0)
			return ;

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
		headerGraficos['imc']					=	'IMC';
		headerGraficos['peso']					=	'Peso';
		headerGraficos['estatura']				=	'Estatura';
		headerGraficos['grasa']					=	'Grasa';
		headerGraficos['grasa_viceral']			=	'Grasa Viceral';
		headerGraficos['musculo']				=	'Músculo';
		headerGraficos['agua']					=	'Agua';
		headerGraficos['hueso']					=	'Hueso';
		headerGraficos['edad_metabolica']		=	'Edad';
		headerGraficos['circunferencia_cintura']=	'Cintura';
		headerGraficos['circunferencia_cadera']	=	'Cadera';
		headerGraficos['circunferencia_muneca']	=	'Muñeca';

		var k=0;		
		var _va	=	this.historial[0];

		for(var i in _va) {
			if(i=='fecha' || i=='date')
				continue ;

			data	=	[];
			for(var j in this.historial){
				var d	= this.historial[j].fecha.split('-');
				var anho	=	d[0];
				var mes		=	d[1];
				var dia		=	d[2];
				new_date	=	new Date( anho, (mes-1), dia);
				new_date_format	=	dia + '/' + mes + '/' + anho;
				value	=	this.historial[j][i];
				toolTipHtml	=	'<ul class="grafico-lista">';
				toolTipHtml	+=	'	<li>Fecha: <strong>' + new_date_format + '</strong></li>';
				toolTipHtml	+=	'	<li>' + headerGraficos[i] + ': <strong>' + value + '</strong></li>';
				toolTipHtml	+=	'</ul>';
				data.push([new_date,parseInt(value), toolTipHtml]);
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
			item	=	{'data':data, 'config': config, 'elementId':'element_' + i, 'key': 'container_' + i, 'class':i=='imc'? 'active':''};
			items.push(item);
		}
		this.graficosH	=	headers;
		this.graficos	=	items;
		this.tagBody.classList.add('grafico-selected-imc');
	}

	getGraphic(){
		var data		=	Object();
		data.method		=	this.valoracion.metodo_valoracion;
		if( data.method=='adulto' )
			data.method	=	'oms';
		
		//data.indicator	=	'peso-edad';
		
		//data.indicator	=	'estatura-peso';
		data.indicator	=	'estatura-edad';
		data.paciente_id=	this.paciente.persona_id;

		this.formControlDataService.select('graphic', data)
		.subscribe(
			 response  => {
						/*console.log(response);*/
						this.processGraphic(response);
/*
for(var indicador in response) {
	console.log('indicador');
	console.log(JSON.parse(response[indicador]));
}
*/
						},
			error =>  console.log(<any>error)
		);
	}
	processGraphic( aChartData ){
		var toGraph = '';
		var data;
		var item;
		var items			=	[];
		var headers			=	[];
		var headerGraficos	=	[];
		var config;
		var options:any;
		var columns;
		var chartData:any;
		var rangoEdad:any;
		var alturaPaciente:number	=	Math.round(Number(this.valoracion.estatura)*100);
		var pesoPaciente:number		=	Number(this.valoracion.peso);
		var edadPaciente:number		=	Number(this.paciente.edad);
		var edadPaciente_dias:number=	Math.round(edadPaciente*365);
		var edadPaciente_meses:number=	Math.round(edadPaciente*12);
		var x_label			=	'';
		var y_label			=	'';
		var graph_title		=	'';
		/*alturaPaciente	=	115;pesoPaciente	=	35;edadPaciente	=	2;*/
		console.log(alturaPaciente + ' - ' + pesoPaciente + ' - ' + edadPaciente + ' - ' + edadPaciente_dias + ' - ' + edadPaciente_meses);
		var _row_first:any;
		var _row_first_keys:any;
		var _row_first_fk:any;/*	X, Age	*/
		var _row_first_sk:any;/*	P10	*/

		var _row_last:any;
		var _row_last_keys:any;
		var _row_last_fk:any;
		var _row_last_lk:any;

		var x:number;
		var y:number;
		
		var _text:string='';

		var _push_data:any	=	null;
		var _aux:any	=	0;

		var _data_i:any;
		var _data_i_keys:any;
		var _data_i_fk:any;

		var _chartData_i_keys:any;
		var _chartData_i_fk:any;

		var chartWithToolTips = new Array();
		
		var _x_2:number			=	0;
		var _value:number		=	0;
		var _value_last:number	=	0;
		
		var _min_hAxis:number;
		var _max_hAxis:number;
		var _min_vAxis:number;
		var _max_vAxis:number;
		

		for(var indicador in aChartData) {
			chartData	=	JSON.parse(aChartData[indicador])
				rangoEdad		=	'0-5';
				if(this.paciente.edad>5)
					rangoEdad		=	'5-19';
				switch(indicador){
					case 'estatura-peso':
						x_label		=	'Estatura (cm)';
						y_label		=	'Peso (Kg)';
						graph_title	=	'Peso para Estatura';						
						break;
					case 'estatura-edad':
						x_label		=	'Edad (días)';
						if(this.paciente.edad>5)
							x_label		=	'Edad (Meses)';
						
						y_label		=	'Estatura (cm)';
						graph_title	=	'Edad para Estatura';
						break;
					case 'imc-edad':
						x_label		=	'Edad';						
						if(this.paciente.edad>5)
							x_label		=	'Edad (Meses)';
						y_label		=	'IMC';
						graph_title	=	'Edad para Imc';
						break;
					case 'peso-edad':
						x_label		=	'Edad (días)';
						if(this.paciente.edad>5)
							x_label		=	'Edad (Meses)';
						y_label		=	'Peso (Kg)';
						graph_title	=	'Edad para Peso';				
						break;
				}
				headerGraficos.push({'id': indicador, 'nombre':graph_title, 'class': 'grafico-' + indicador + (indicador=='estatura-edad'? ' active':'')})		

				_row_first		=	chartData[0];
				_row_first_keys	=	Object.keys(_row_first);
				_row_first_fk	=	_row_first_keys[0];/*	X, Age	*/
				_row_first_sk	=	_row_first_keys[1];/*	P10	*/

				_row_last		=	chartData[chartData.length-1];
				_row_last_keys	=	Object.keys(_row_last);
				_row_last_fk	=	_row_last_keys[0];
				_row_last_lk	=	_row_last_keys[_row_last_keys.length-1];

				x	=	Math.ceil((_row_last[_row_last_fk] - _row_first[_row_first_fk])/14);;
				y	=	Math.ceil((_row_last[_row_last_lk] - _row_first[_row_first_sk])/10);;
				
				_text	=	'';
				data	=	[];
				columns	=	[];
				for(var key in _row_first) {
					columns.push({label: key, type: 'number'});
					if(key!=_row_first[_row_first_fk])
						columns.push({type: 'string', role: 'tooltip', 'p': {'html': true}});
				}
				columns.push({label: 'Paciente', type: 'number'});
				columns.push({type: 'string', role: 'tooltip', 'p': {'html': true}});
				_push_data	=	null;
				_aux		=	0;
				for(var i=0; i<chartData.length; i++) {
					chartWithToolTips = new Array();
					for(var key in chartData[i]) {
						_data_i	=	chartData[i];
						chartWithToolTips.push(parseFloat(_data_i[key]));

						if (key!=_row_first[_row_first_fk]){					
							_data_i_keys	=	Object.keys(_data_i);
							_data_i_fk		=	_data_i_keys[0];

							_text	=	'<ul class="grafico-lista">';
							_text	+=	'	<li><strong>' + key + '</strong></li>';
							switch(indicador){
								case 'estatura-peso':
									_text	+=	'<li>Peso: ' + _data_i[key] + ' kg';
									_text	+=	' | ';
									_text	+=	'Estatura: ' + _data_i[_data_i_fk] + ' (cm)</li>';
									break;
								case 'estatura-edad':
									_text	+=	'<li>Estatura: ' + _data_i[key] + ' (cm)';
									_text	+=	' | ';
									_text	+=	'Edad: ' + _data_i[_data_i_fk];
									if(this.paciente.edad>5)
										_text	+=	' meses';
									else
										_text	+=	' dias';
									
									_text	+=	'</li>';									
									break;
								case 'imc-edad':
									_text	+=	'<li>Edad: ' + _data_i[_data_i_fk];
									
									if(this.paciente.edad>5)
										_text	+=	' meses';
									else
										_text	+=	' dias';
																		
									_text	+=	' | ';
									_text	+=	'Imc: ' + _data_i[key] + ' </li>';
									break;
								case 'peso-edad':
									_text	+=	'<li>Peso: ' + _data_i[key] + ' kg';
									_text	+=	' | ';
									_text	+=	'Edad: ' + _data_i[_data_i_fk];
									if(this.paciente.edad>5)
										_text	+=	' meses';
									else
										_text	+=	' dias';
									
									_text	+=	'</li>';
									break;
							}
							_text	+=	'</ul>';
							chartWithToolTips.push( _text );
						}
					}
					
					_chartData_i_keys	=	Object.keys(chartData[i]);
					_chartData_i_fk		=	_chartData_i_keys[0];
					
					_text	=	'<ul class="grafico-lista">';
					_text	+=	'	<li><strong>Paciente</strong></li>';
					switch(indicador){
						case 'estatura-peso':				
							_text	+=	'	<li>Peso: ' + pesoPaciente + ' kg';
							_text	+=	' | ';
							_text	+=	'Estatura: ' + alturaPaciente + ' (cm)</li>';					
							_push_data	=	chartData[i][_chartData_i_fk] == alturaPaciente ? pesoPaciente : null;
							break;
						case 'estatura-edad':													
							_text	+=	'	<li>Edad: ';
							if(this.paciente.edad>5)
								_text	+=	edadPaciente_meses + ' meses';
							else
								_text	+=	edadPaciente_dias + ' dias';
							
							_text	+=	' | ';
							_text	+=	'Estatura: ' + alturaPaciente + ' (cm)</li>';					

							if(this.paciente.edad>5)
								_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_meses ? alturaPaciente : null;
							else
								_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_dias ? alturaPaciente : null;
							break;
						case 'imc-edad':													
							_text	+=	'	<li>Edad: ';
							if(this.paciente.edad>5)
								_text	+=	edadPaciente_meses + ' meses';
							else
								_text	+=	edadPaciente_dias + ' dias';

							_text	+=	' | ';
							_text	+=	'Imc: ' + this.analisis.imc + ' </li>';					
							
							if(this.paciente.edad>5)
								_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_meses ? this.analisis.imc : null;
							else
								_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_dias ? this.analisis.imc : null;

							break;
						case 'peso-edad':
							_text	+=	'	<li>Peso: ' + pesoPaciente + ' kg';
							_text	+=	' | ';
							_text	+=	'Edad: ';
							if(this.paciente.edad>5)
								_text	+=	edadPaciente_meses + ' meses';
							else
								_text	+=	edadPaciente_dias + ' días';
							_text	+=	'</li>';
								
							if(this.paciente.edad>5)
								_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_meses ? pesoPaciente : null;
							else
								_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_dias ? pesoPaciente : null;
							break;
					}
					_text	+=	'</ul>';

					chartWithToolTips.push( _push_data );
					chartWithToolTips.push( _text );
					data.push( chartWithToolTips );
				}
				
				_x_2		=	0;
				_value		=	0;
				_value_last	=	0;
				_value		=	Math.floor (parseFloat( _row_first[_row_first_fk] ));
				_value_last	=	Math.floor (parseFloat( _row_last[_row_last_fk] ));
				_x_2		=	x*2;

				_min_hAxis	=	Math.floor(_row_first[_row_first_fk]);
				_max_hAxis	=	Math.ceil(_row_last[_row_last_fk]);
				_min_vAxis	=	Math.floor(_row_first[_row_first_sk]);
				_max_vAxis	=	Math.ceil(_row_last[_row_last_lk]);
				graph_title	+=	' (' + this.valoracion.metodo_valoracion + '-' + indicador + '-' + rangoEdad + '-' + (this.paciente.genero=='F'? 'mujer':'hombre') + '):' + _row_first_fk;
				options	=	this.getOptionsGraphChildren(graph_title, x, y, x_label, y_label, _min_hAxis, _max_hAxis, _value, _min_vAxis, _max_vAxis, _row_first[_row_first_sk]);
				config	=	new LineChartConfig('title ' + toGraph, options, columns);
				item	=	{'data':data, 'config': config, 'elementId':'element_' + indicador, 'key': 'container_' + indicador, 'class':indicador=='estatura-edad'? 'active':''};
				items.push(item);
				headers.push({'id':'id_' + indicador, 'nombre':toGraph, 'class': 'grafico-' + i});				
		}
		this.graficos_by_x_H	=	headerGraficos;
		this.graficos_by_x		=	items;

		this.tagBody.classList.add('grafico-selected-estatura-edad');
	}
	processGraphic__oms( aChartData ){
		var toGraph = '';
		var data;
		var item;
		var items			=	[];
		var headers			=	[];
		var headerGraficos	=	[];
		var config;
		var options:any;
		var columns;
		var chartData:any;
		var rangoEdad:any;
		var alturaPaciente:number	=	Math.round(Number(this.valoracion.estatura)*100);
		var pesoPaciente:number		=	Number(this.valoracion.peso);
		var edadPaciente:number		=	Number(this.paciente.edad);
		var edadPaciente_dias:number=	Math.round(edadPaciente*365);
		var edadPaciente_meses:number=	Math.round(edadPaciente*12);
		var x_label			=	'';
		var y_label			=	'';
		var graph_title		=	'';
		/*alturaPaciente	=	115;pesoPaciente	=	35;edadPaciente	=	2;*/
		console.log(alturaPaciente + ' - ' + pesoPaciente + ' - ' + edadPaciente + ' - ' + edadPaciente_dias + ' - ' + edadPaciente_meses);
		var _row_first:any;
		var _row_first_keys:any;
		var _row_first_fk:any;/*	X, Age	*/
		var _row_first_sk:any;/*	P10	*/

		var _row_last:any;
		var _row_last_keys:any;
		var _row_last_fk:any;
		var _row_last_lk:any;

		var x:number;
		var y:number;
		
		var _text:string='';

		var _push_data:any	=	null;
		var _aux:any	=	0;

		var _data_i:any;
		var _data_i_keys:any;
		var _data_i_fk:any;

		var _chartData_i_keys:any;
		var _chartData_i_fk:any;

		var chartWithToolTips = new Array();
		
		var _x_2:number			=	0;
		var _value:number		=	0;
		var _value_last:number	=	0;
		
		var _min_hAxis:number;
		var _max_hAxis:number;
		var _min_vAxis:number;
		var _max_vAxis:number;
		

		for(var indicador in aChartData) {
			chartData	=	JSON.parse(aChartData[indicador])
				rangoEdad		=	'0-5';
				if(this.paciente.edad>5)
					rangoEdad		=	'5-19';
				switch(indicador){
					case 'estatura-peso':
						x_label		=	'Estatura (cm)';
						y_label		=	'Peso (Kg)';
						graph_title	=	'Peso para Estatura';						
						break;
					case 'estatura-edad':
						x_label		=	'Edad (días)';
						if(this.paciente.edad>5)
							x_label		=	'Edad (Meses)';
						
						y_label		=	'Estatura (cm)';
						graph_title	=	'Edad para Estatura';
						break;
					case 'imc-edad':
						x_label		=	'Edad';						
						if(this.paciente.edad>5)
							x_label		=	'Edad (Meses)';
						y_label		=	'IMC';
						graph_title	=	'Edad para Imc';
						break;
					case 'peso-edad':
						x_label		=	'Edad (días)';
						if(this.paciente.edad>5)
							x_label		=	'Edad (Meses)';
						y_label		=	'Peso (Kg)';
						graph_title	=	'Edad para Peso';				
						break;
				}
				headerGraficos.push({'id': indicador, 'nombre':graph_title, 'class': 'grafico-' + indicador + (indicador=='estatura-edad'? ' active':'')})		

				_row_first		=	chartData[0];
				_row_first_keys	=	Object.keys(_row_first);
				_row_first_fk	=	_row_first_keys[0];/*	X, Age	*/
				_row_first_sk	=	_row_first_keys[1];/*	P10	*/

				_row_last		=	chartData[chartData.length-1];
				_row_last_keys	=	Object.keys(_row_last);
				_row_last_fk	=	_row_last_keys[0];
				_row_last_lk	=	_row_last_keys[_row_last_keys.length-1];

				x	=	Math.ceil((_row_last[_row_last_fk] - _row_first[_row_first_fk])/14);;
				y	=	Math.ceil((_row_last[_row_last_lk] - _row_first[_row_first_sk])/10);;
				
				_text	=	'';
				data	=	[];
				columns	=	[];
				for(var key in _row_first) {
					columns.push({label: key, type: 'number'});
					if(key!=_row_first[_row_first_fk])
						columns.push({type: 'string', role: 'tooltip', 'p': {'html': true}});
				}
				columns.push({label: 'Paciente', type: 'number'});
				columns.push({type: 'string', role: 'tooltip', 'p': {'html': true}});
				_push_data	=	null;
				_aux		=	0;
				for(var i=0; i<chartData.length; i++) {
					chartWithToolTips = new Array();
					for(var key in chartData[i]) {
						_data_i	=	chartData[i];
						chartWithToolTips.push(parseFloat(_data_i[key]));

						if (key!=_row_first[_row_first_fk]){					
							_data_i_keys	=	Object.keys(_data_i);
							_data_i_fk		=	_data_i_keys[0];

							_text	=	'<ul class="grafico-lista">';
							_text	+=	'	<li><strong>' + key + '</strong></li>';
							switch(indicador){
								case 'estatura-peso':
									_text	+=	'<li>Peso: ' + _data_i[key] + ' kg';
									_text	+=	' | ';
									_text	+=	'Estatura: ' + _data_i[_data_i_fk] + ' (cm)</li>';
									break;
								case 'estatura-edad':
									_text	+=	'<li>Estatura: ' + _data_i[key] + ' (cm)';
									_text	+=	' | ';
									_text	+=	'Edad: ' + _data_i[_data_i_fk];
									if(this.paciente.edad>5)
										_text	+=	' meses';
									else
										_text	+=	' dias';
									
									_text	+=	'</li>';									
									break;
								case 'imc-edad':
									_text	+=	'<li>Edad: ' + _data_i[_data_i_fk];
									
									if(this.paciente.edad>5)
										_text	+=	' meses';
									else
										_text	+=	' dias';
																		
									_text	+=	' | ';
									_text	+=	'Imc: ' + _data_i[key] + ' </li>';
									break;
								case 'peso-edad':
									_text	+=	'<li>Peso: ' + _data_i[key] + ' kg';
									_text	+=	' | ';
									_text	+=	'Edad: ' + _data_i[_data_i_fk];
									if(this.paciente.edad>5)
										_text	+=	' meses';
									else
										_text	+=	' dias';
									
									_text	+=	'</li>';
									break;
							}
							_text	+=	'</ul>';
							chartWithToolTips.push( _text );
						}
					}
					
					_chartData_i_keys	=	Object.keys(chartData[i]);
					_chartData_i_fk		=	_chartData_i_keys[0];
					
					_text	=	'<ul class="grafico-lista">';
					_text	+=	'	<li><strong>Paciente</strong></li>';
					switch(indicador){
						case 'estatura-peso':				
							_text	+=	'	<li>Peso: ' + pesoPaciente + ' kg';
							_text	+=	' | ';
							_text	+=	'Estatura: ' + alturaPaciente + ' (cm)</li>';					
							_push_data	=	chartData[i][_chartData_i_fk] == alturaPaciente ? pesoPaciente : null;
							break;
						case 'estatura-edad':													
							_text	+=	'	<li>Edad: ';
							if(this.paciente.edad>5)
								_text	+=	edadPaciente_meses + ' meses';
							else
								_text	+=	edadPaciente_dias + ' dias';
							
							_text	+=	' | ';
							_text	+=	'Estatura: ' + alturaPaciente + ' (cm)</li>';					

							if(this.paciente.edad>5)
								_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_meses ? alturaPaciente : null;
							else
								_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_dias ? alturaPaciente : null;
							break;
						case 'imc-edad':													
							_text	+=	'	<li>Edad: ';
							if(this.paciente.edad>5)
								_text	+=	edadPaciente_meses + ' meses';
							else
								_text	+=	edadPaciente_dias + ' dias';

							_text	+=	' | ';
							_text	+=	'Imc: ' + this.analisis.imc + ' </li>';					
							
							if(this.paciente.edad>5)
								_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_meses ? this.analisis.imc : null;
							else
								_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_dias ? this.analisis.imc : null;

							break;
						case 'peso-edad':
							_text	+=	'	<li>Peso: ' + pesoPaciente + ' kg';
							_text	+=	' | ';
							_text	+=	'Edad: ';
							if(this.paciente.edad>5)
								_text	+=	edadPaciente_meses + ' meses';
							else
								_text	+=	edadPaciente_dias + ' días';
							_text	+=	'</li>';
								
							if(this.paciente.edad>5)
								_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_meses ? pesoPaciente : null;
							else
								_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_dias ? pesoPaciente : null;
							break;
					}
					_text	+=	'</ul>';

					chartWithToolTips.push( _push_data );
					chartWithToolTips.push( _text );
					data.push( chartWithToolTips );
				}
				
				_x_2		=	0;
				_value		=	0;
				_value_last	=	0;
				_value		=	Math.floor (parseFloat( _row_first[_row_first_fk] ));
				_value_last	=	Math.floor (parseFloat( _row_last[_row_last_fk] ));
				_x_2		=	x*2;

				_min_hAxis	=	Math.floor(_row_first[_row_first_fk]);
				_max_hAxis	=	Math.ceil(_row_last[_row_last_fk]);
				_min_vAxis	=	Math.floor(_row_first[_row_first_sk]);
				_max_vAxis	=	Math.ceil(_row_last[_row_last_lk]);
				graph_title	+=	' (' + this.valoracion.metodo_valoracion + '-' + indicador + '-' + rangoEdad + '-' + (this.paciente.genero=='F'? 'mujer':'hombre') + '):' + _row_first_fk;
				options	=	this.getOptionsGraphChildren(graph_title, x, y, x_label, y_label, _min_hAxis, _max_hAxis, _value, _min_vAxis, _max_vAxis, _row_first[_row_first_sk]);
				config	=	new LineChartConfig('title ' + toGraph, options, columns);
				item	=	{'data':data, 'config': config, 'elementId':'element_' + indicador, 'key': 'container_' + indicador, 'class':indicador=='estatura-edad'? 'active':''};
				items.push(item);
				headers.push({'id':'id_' + indicador, 'nombre':toGraph, 'class': 'grafico-' + i});				
		}
		this.graficos_by_x_H	=	headerGraficos;
		this.graficos_by_x		=	items;

		this.tagBody.classList.add('grafico-selected-estatura-edad');
	}
	
	processGraphic__simple( chartData ){
		var toGraph = '';
		var data;
		var item;
		var items	=	[];
		var headers	=	[];
		var headerGraficos	=	[];
		var config;
		var options:any;
		var columns;
		
		headerGraficos.push({'nombre':'Estatura para Peso', 'class': ''});
		headerGraficos.push({'nombre':'Estatura para Edad', 'class': ''});
		headerGraficos.push({'nombre':'IMC para Edad', 'class': ''});
		headerGraficos.push({'nombre':'Peso para Edad', 'class': ''});
		
		//var indicador		=	'peso-edad';
		//var indicador		=	'estatura-peso';
		//var indicador		=	'estatura-edad';
		var indicador		=	'imc-edad';
		
		var x_label		=	'';
		var y_label		=	'';
		var graph_title	=	'';
		
		switch(indicador){
			case 'estatura-peso':
				x_label		=	'Estatura';
				y_label		=	'Peso (Kg)';
				graph_title	=	'Peso para Estatura';
				break;
			case 'estatura-edad':
				x_label	=	'Edad (días)';
				y_label	=	'Estatura';
				graph_title	=	'Edad para Estatura';
				break;
			case 'imc-edad':
				x_label	=	'Imc';
				y_label	=	'Edad';
				graph_title	=	'Edad para Imc';
				break;
			case 'peso-edad':
				x_label	=	'Edad (días)';
				y_label	=	'Peso (Kg)';
				graph_title	=	'Edad para Peso';				
				break;
		}
		
		var rangoEdad		=	'0-5';
		if(this.paciente.edad>5)
			rangoEdad		=	'5-19';

		var alturaPaciente:number	=	Math.round(Number(this.valoracion.estatura)*100);/*115;*/;
		var pesoPaciente:number		=	Number(this.valoracion.peso);/*25;*/
		var edadPaciente:number		=	Number(this.paciente.edad);/*2;*/
		var edadPaciente_dias:number=	Math.round(edadPaciente*365);
		/*alturaPaciente	=	115;pesoPaciente	=	35;edadPaciente	=	2;*/
		console.log(alturaPaciente + ' - ' + pesoPaciente + ' - ' + edadPaciente + ' - ' + edadPaciente_dias);

		var _row_first:any		=	chartData[0];
		var _row_first_keys:any	=	Object.keys(_row_first);
		var _row_first_fk:any	=	_row_first_keys[0];/*	X, Age	*/
		var _row_first_sk:any	=	_row_first_keys[1];/*	P10	*/

		var _row_last:any		=	chartData[chartData.length-1];
		var _row_last_keys:any	=	Object.keys(_row_last);
		var _row_last_fk:any	=	_row_last_keys[0];
		var _row_last_lk:any	=	_row_last_keys[_row_last_keys.length-1];

		var x:number	=	Math.ceil((_row_last[_row_last_fk] - _row_first[_row_first_fk])/14);;
		var y:number	=	Math.ceil((_row_last[_row_last_lk] - _row_first[_row_first_sk])/10);;
		
		var _text:string='';
		var _data_i:any;
		data	=	[];
		columns	=	[];
		for(var key in _row_first) {
			columns.push({label: key, type: 'number'});
			if(key!=_row_first[_row_first_fk])
				columns.push({type: 'string', role: 'tooltip', 'p': {'html': true}});
		}
		columns.push({label: 'Paciente', type: 'number'});
		columns.push({type: 'string', role: 'tooltip', 'p': {'html': true}});
		var _push_data:any	=	null;
		var _aux:any	=	0;
		for(var i=0; i<chartData.length; i++) {
			var chartWithToolTips = new Array();
			for(var key in chartData[i]) {
				_data_i	=	chartData[i];
				chartWithToolTips.push(parseFloat(_data_i[key]));

				if (key!=_row_first[_row_first_fk]){					
					var _data_i_keys:any		=	Object.keys(_data_i);
					var _data_i_fk:any		=	_data_i_keys[0];

					_text	=	'<ul class="grafico-lista">';
					_text	+=	'	<li><strong>' + key + '</strong></li>';
					switch(indicador){
						case 'estatura-peso':
							_text	+=	'<li>Peso: ' + _data_i[key] + ' kg';
							_text	+=	' | ';
							_text	+=	'Estatura: ' + _data_i[_data_i_fk] + ' </li>';
							break;
						case 'estatura-edad':
							_text	+=	'<li>Estatura: ' + _data_i[key];
							_text	+=	' | ';
							_text	+=	'Edad: ' + _data_i[_data_i_fk] + ' dias</li>';
							break;
						case 'imc-edad':
							_text	+=	'<li>Edad: ' + _data_i[key] + ' días';
							_text	+=	' | ';
							_text	+=	'Imc: ' + _data_i[_data_i_fk] + ' </li>';
							break;
						case 'peso-edad':
							_text	+=	'<li>Peso: ' + _data_i[key] + ' kg';
							_text	+=	' | ';
							_text	+=	'Edad: ' + _data_i[_data_i_fk] + ' días</li>';
							break;
					}
					_text	+=	'</ul>';
					chartWithToolTips.push( _text );
				}
			}
			var _chartData_i_keys:any		=	Object.keys(chartData[i]);
			var _chartData_i_fk:any		=	_chartData_i_keys[0];
			
			_text	=	'<ul class="grafico-lista">';
			_text	+=	'	<li><strong>Paciente</strong></li>';
			switch(indicador){
				case 'estatura-peso':				
					_text	+=	'	<li>Peso: ' + pesoPaciente + ' kg';
					_text	+=	' | ';
					_text	+=	'Estatura: ' + alturaPaciente + ' </li>';					
					_push_data	=	chartData[i][_chartData_i_fk] == alturaPaciente ? pesoPaciente : null;
					break;
				case 'estatura-edad':
					_text	+=	'	<li>Edad: ' + edadPaciente_dias + ' dias';
					_text	+=	' | ';
					_text	+=	'Estatura: ' + alturaPaciente + ' </li>';
					_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_dias ? alturaPaciente : null;
					break;
				case 'imc-edad':
					_text	+=	'	<li>Edad: ' + edadPaciente_dias + ' dias';
					_text	+=	' | ';
					_text	+=	'Imc: ' + alturaPaciente + ' </li>';					
					_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_dias ? alturaPaciente : null;
					break;
				case 'peso-edad':					
					_text	+=	'	<li>Peso: ' + pesoPaciente + ' kg';
					_text	+=	' | ';
					_text	+=	'Edad: ' + edadPaciente_dias + ' días</li>';					
					_push_data	=	chartData[i][_chartData_i_fk] == edadPaciente_dias ? pesoPaciente : null;
					break;
			}
			_text	+=	'</ul>';
			chartWithToolTips.push( _push_data );
			chartWithToolTips.push( _text );
			data.push( chartWithToolTips );
		}
		var _x_2:number=	0;
		var _value:number=	0;
		var _value_last:number=	0;
		_value		=	Math.floor (parseFloat( _row_first[_row_first_fk] ));
		_value_last	=	Math.floor (parseFloat( _row_last[_row_last_fk] ));
		_x_2	=	x*2;
/*
		var _min_hAxis:number	=	alturaPaciente <= ( _value + _x_2 ) ? _value: alturaPaciente - _x_2;
		var _max_hAxis:number	=	alturaPaciente >= ( _value_last - _x_2 ) ? _value_last: alturaPaciente + _x_2;
		var _min_vAxis:number	=	pesoPaciente <= ( _row_first[_row_first_sk] + y) ? Math.floor ( _row_first[_row_first_sk]) : pesoPaciente - y;
		var _max_vAxis:number	=	pesoPaciente >= ( _row_last[_row_last_lk] - y ) ? Math.ceil ( _row_last[_row_last_lk]) : pesoPaciente + y;
*/		
		var _min_hAxis:number	=	Math.floor(_row_first[_row_first_fk]);
		var _max_hAxis:number	=	Math.ceil(_row_last[_row_last_fk]);
		var _min_vAxis:number	=	Math.floor(_row_first[_row_first_sk]);
		var _max_vAxis:number	=	Math.ceil(_row_last[_row_last_lk]);		
		/*console.log(graph_title + '-> ' + x_label + ' - ' + y_label);*/
		options	=	this.getOptionsGraphChildren(graph_title, x, y, x_label, y_label, _min_hAxis, _max_hAxis, _value, _min_vAxis, _max_vAxis, _row_first[_row_first_sk]);
		config	=	new LineChartConfig('title ' + toGraph, options, columns);
		item	=	{'data':data, 'config': config, 'elementId':'element_' + i, 'key': 'container_' + i, 'class':''};
		items.push(item);

		headers.push({'id':i, 'nombre':toGraph, 'class': 'grafico-' + i});		
		this.graficos_by_x_H	=	headerGraficos;
		this.graficos_by_x		=	items;
		console.log(this.graficos_by_x_H);
	}
	getOptionsGraphChildren(graph_title, x, y, x_label, y_label, _min_hAxis, _max_hAxis, _hAxis_value, _min_vAxis, _max_vAxis, _vAxis_value){
		
		var options = {
			height:350,
			title: graph_title,
			animation: {
				duration: 1000,
				easing: 'out'
			},
			tooltip: {isHtml: true},
			titleTextStyle: {
				color: 'red',
				fontName: 'Verdana',
				fontSize: 12, 
				bold: true,   
				italic: false
			},
			series: {5:{pointShape: 'circle', pointSize: 15}},
			hAxis: {
				title: x_label,/*'Estatura(cm)'*/
				viewWindow: { min: _min_hAxis, max: _max_hAxis},
				ticks: this.calcRange( _hAxis_value, x, 14 )
			},
			vAxis: {
				title: y_label,/*'Peso (kg)'*/
				viewWindow: {min: _min_vAxis ,max: _max_vAxis},
				ticks: this.calcRange( _vAxis_value, y, 50 )
			},

			colors: ['#868684', '#90c445','#cc1f25', '#90c445','#868684', '#DAA520'],
			crosshair: {
				color: '#dadada',
				trigger: 'selection'
			}
		};	
		return options;
	}
	calcRange(ini, periodicity, fractions){
		var range = new Array();
		range.push (Math.floor(ini));
		for (var i = 1; i <= fractions; i++){
			ini = parseInt(ini)+parseInt(periodicity); 
			range.push(ini);
		}
		return range;
	}
	
	graficoxSelected(header, event){console.log(header);
		try {
				this.tagBody.classList.remove('grafico-by-selected-estatura-edad');
				this.tagBody.classList.remove('grafico-by-selected-imc-edad');
				this.tagBody.classList.remove('grafico-by-selected-peso-edad');
				this.tagBody.classList.remove('grafico-by-selected-estatura-peso');
				
				this.tagBody.classList.add('grafico-by-selected-' + header.id + '');

				if(document.getElementById('container_estatura-edad') !== null)
					document.getElementById('container_estatura-edad').className = '';;
				if(document.getElementById('container_imc-edad') !== null)
					document.getElementById('container_imc-edad').className = '';;
				if(document.getElementById('container_peso-edad') !== null)
					document.getElementById('container_peso-edad').className = '';;
				if(document.getElementById('container_estatura-peso') !== null)
					document.getElementById('container_estatura-peso').className = '';;

				if(document.getElementById('estatura-edad') !== null)
					document.getElementById('estatura-edad').className = '';
				if(document.getElementById('imc-edad') !== null)
					document.getElementById('imc-edad').className = '';
				if(document.getElementById('peso-edad') !== null)
					document.getElementById('peso-edad').className = '';
				if(document.getElementById('estatura-peso') !== null)
					document.getElementById('estatura-peso').className = '';
				/*(<HTMLInputElement>event.target).parentElement.className='active';*/
				document.getElementById(header.id).className = 'active';
				document.getElementById('container_' + header.id).className = 'active';
		}
		catch(err) {
				console.log( err.message );
		}
		
	}
	graficoSelected(header){
		this.tagBody.classList.remove('grafico-selected-imc');
		this.tagBody.classList.remove('grafico-selected-peso');
		this.tagBody.classList.remove('grafico-selected-estatura');
		this.tagBody.classList.remove('grafico-selected-grasa');
		this.tagBody.classList.remove('grafico-selected-grasa_viceral');
		this.tagBody.classList.remove('grafico-selected-musculo');
		this.tagBody.classList.remove('grafico-selected-agua');
		this.tagBody.classList.remove('grafico-selected-hueso');
		this.tagBody.classList.remove('grafico-selected-edad_metabolica');
		this.tagBody.classList.remove('grafico-selected-circunferencia_cintura');
		this.tagBody.classList.remove('grafico-selected-circunferencia_cadera');
		this.tagBody.classList.remove('grafico-selected-circunferencia_muneca');

		this.tagBody.classList.add('grafico-selected-' + header.id + '');
		
		document.getElementById('container_imc').className = '';;
		document.getElementById('container_peso').className = '';;
		document.getElementById('container_estatura').className = '';;
		document.getElementById('container_grasa').className = '';;
		document.getElementById('container_grasa_viceral').className = '';;
		document.getElementById('container_musculo').className = '';;
		document.getElementById('container_agua').className = '';;
		document.getElementById('container_hueso').className = '';;
		document.getElementById('container_edad_metabolica').className = '';;
		document.getElementById('container_circunferencia_cintura').className = '';;
		document.getElementById('container_circunferencia_cadera').className = '';;
		document.getElementById('container_circunferencia_muneca').className = '';;

		document.getElementById('container_' + header.id).className = 'active';
		
		
	}
	createValoracionAntropometrica(valoracionAntropometrica){
		var data	=	valoracionAntropometrica;
		if(!this.valoracion.id && this.countPendientes>0){
			this.aPendientess['va']		=	valoracionAntropometrica;
			data	=	this.aPendientess;
		}
		console.log('-->Crud VA');
		console.log(data);
		this.formControlDataService.addValoracionAntropometrica(data)
		.subscribe(
			 response  => {
						console.log('<--Crud VA');
						console.log(response);
						this.goTo(this.page);
						this.btnNavigation_pressed	=	false;
						},
			error =>  console.log(<any>error)
		);
	}
	showModal(modal){
		this.hideModalDatos		=	true;
		this.hideModalGrasa		=	true;
		this.hideModalMusculo	=	true;

		this.showModalDatos		=	false;
		this.showModalGrasa		=	false;
		this.showModalMusculo	=	false;
		switch(modal){
			case 'datos':
				this.hideModalDatos	=	false;
				break;
			case 'grasa':
				this.hideModalGrasa	=	false;
				this.oDetalleGrasa	=	this.helpers.clone(this.grasa);
				break;
			case 'musculo':
				this.hideModalMusculo	=	false;
				this.oDetalleMusculo	=	this.helpers.clone(this.detalleMusculo);
				break;
		}
		this.tagBody.classList.add('open-modal');
		this.currentModal	=	modal;
		window.scrollTo(0, 0);
	}
	hideModal(modal=''){
		if(modal.length==0)
			modal	=	this.currentModal;
		switch(modal){
			case 'datos':
				this.hideModalDatos	=	true;
				break;
			case 'grasa':				
				this.hideModalGrasa	=	true;
				if(!this.helpers.equals(this.oDetalleGrasa, this.grasa))
					this.saveInfoGrasa(this.grasa);
				
				if(this.showModalGrasaTabPliegues){
					if(this.valorGrasaPliegues)
						this.valoracion.grasa	=	String(this.valorGrasaPliegues);
					else
						this.valoracion.grasa	=	'';
						
				}
				/*if(this.showModalGrasaTabSegmentado)
					this.valoracion.grasa	=	this.grasa.valorGrasaSegmentado;
				else
					this.valoracion.grasa	=	this.grasa.valorGrasaPliegues;
				*/
				break;
			case 'musculo':
				/*this.valoracion.musculo	=	this.calcularMusculoSegmentado()*/
				this.hideModalMusculo	=	true;
				if(!this.helpers.equals(this.oDetalleMusculo, this.detalleMusculo))
					this.saveInfoMusculo(this.detalleMusculo);
				break;
		}
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
	
	setInfoMusculo(){
		var valor	=	Number(this.detalleMusculo.tronco) + Number(this.detalleMusculo.pierna_derecha) + Number(this.detalleMusculo.pierna_izquierda) + Number(this.detalleMusculo.brazo_derecho) + Number(this.detalleMusculo.brazo_izquierdo);
		this.valoracion.musculo	=	String(valor/5);
	}
	saveInfoGrasa(data){
		if(!this.valoracion.id){
			this.aPendientess['detalle_grasa']	=	data;
			this.countPendientes++;
			return ;
		}
		console.log('-->Crud Grasa');
		this.formControlDataService.saveDatosGrasa(data)
		.subscribe(
			 response  => {
						console.log('<--Crud Grasa');
						this.grasa.id	=	response['id'];
						},
			error =>  console.log(<any>error)
		);
	}
	saveInfoMusculo(data){
		if(!this.valoracion.id){
			this.aPendientess['detalle_musculo']	=	data;
			this.countPendientes++;
			return ;
		}
		console.log('-->Crud Musculo');
		this.formControlDataService.saveDatosMusculo(data)
		.subscribe(
			 response  => {
						console.log('<--Crud Musculo');
						this.detalleMusculo.id	=	response['id'];
						},
			error =>  console.log(<any>error)
		);
	}
	calcularMusculoSegmentado(){
		var valor	=	Number(this.detalleMusculo.tronco) + Number(this.detalleMusculo.pierna_derecha) + Number(this.detalleMusculo.pierna_izquierda) + Number(this.detalleMusculo.brazo_derecho) + Number(this.detalleMusculo.brazo_izquierdo);
		//this.valoracion.musculo	=	valor/5;
		//return this.valoracion.musculo;
		return valor/5;
	}
	restarSumarAlPesoIdeal(pesoIdeal, esMasculino){
/*
=SI(GENERO="M";SI(ESTRUCTURA_OSEA>10,4;"PEQUEÑA";SI(ESTRUCTURA_OSEA>9,6;"MEDIANA";"GRANDE"));SI(ESTRUCTURA_OSEA>11;"PEQUEÑA";SI(ESTRUCTURA_OSEA>10,1;"MEDIANA";"GRANDE")))
*/
		var valor	=	'';
		var valor_porcentaje_10	=	pesoIdeal*0.10;/*	10%	*/
		var estructura_osea	=	this.calcularEstructuraOsea();
/*
=	SI(GENERO="M";SI_GENERO_M;SINO_GENERO_M)

SI_GENERO_M->	SI(ESTRUCTURA_OSEA>10,4;SI_ESTRUCTURA_OSEA;SINO_ESTRUCTURA_OSEA)

			SI_ESTRUCTURA_OSEA		->	"PEQUEÑA"
			SINO_ESTRUCTURA_OSEA	->	SI(ESTRUCTURA_OSEA>9,6;"MEDIANA";"GRANDE")

SINO_GENERO_M->	SI(ESTRUCTURA_OSEA>11;SI_ESTRUCTURA_OSEA;SINO_ESTRUCTURA_OSEA)

			SI_ESTRUCTURA_OSEA		->	"PEQUEÑA"
			SINO_ESTRUCTURA_OSEA	->	SI(ESTRUCTURA_OSEA>10,1;"MEDIANA";"GRANDE")
*/
		if( esMasculino ){
//			SI(ESTRUCTURA_OSEA>10,4;SI_ESTRUCTURA_OSEA;SINO_ESTRUCTURA_OSEA)
			if(estructura_osea>10.4){
				valor	=	'PEQUEÑA';
				pesoIdeal	-=	valor_porcentaje_10;
			}else{
//				SI(ESTRUCTURA_OSEA>9,6;"MEDIANA";"GRANDE")
				if(estructura_osea>9.6)
					valor	=	'MEDIANA';
				else{
					valor	=	'GRANDE';
					pesoIdeal	+=	valor_porcentaje_10;
				}
			}
		}else{
//			SI(ESTRUCTURA_OSEA>11;SI_ESTRUCTURA_OSEA;SINO_ESTRUCTURA_OSEA)
			if(estructura_osea>11){
				valor	=	'PEQUEÑA';
				pesoIdeal	-=	valor_porcentaje_10;
			}else{
//				SI(ESTRUCTURA_OSEA>10,1;"MEDIANA";"GRANDE")
				if(estructura_osea>10.1)
					valor	=	'MEDIANA';
				else{
					valor	=	'GRANDE';
					pesoIdeal	+=	valor_porcentaje_10;
				}
			}			
		}
		return pesoIdeal;
	}
	calcularEstructuraOsea(){
		if(!this.allowCalculate)
			return 0;
		if(!this.valoracion.circunferencia_muneca)
			return 0;
/*
=ESTATURA*100/MUÑECA
*/
		var valor	=	0;
		
		valor	=	Math.round( Number(this.valoracion.estatura) *100/Number(this.valoracion.circunferencia_muneca) );
		
		return valor;
	}
	get musculoSegmentado(){
		return this.calcularMusculoSegmentado();
	}
	get grasaSegmentado(){
		var i=0;
		this.grasa.valorGrasaSegmentado	=	0;
		if(this.grasa.segmentado_abdominal)
			i++;
		if(this.grasa.segmentado_pierna_izquierda)
			i++;
		if(this.grasa.segmentado_pierna_derecha)
			i++;
		if(this.grasa.segmentado_brazo_izquierdo)
			i++;
		if(this.grasa.segmentado_brazo_derecho)
			i++;
		if(i==0)
			return this.grasa.valorGrasaSegmentado;
		
		var sumatoria	=	Number(this.grasa.segmentado_abdominal) + Number(this.grasa.segmentado_pierna_izquierda) + Number(this.grasa.segmentado_pierna_derecha) + Number(this.grasa.segmentado_brazo_izquierdo) + Number(this.grasa.segmentado_brazo_derecho);
		this.grasa.valorGrasaSegmentado	=	sumatoria/i;
		
		return this.grasa.valorGrasaSegmentado;
	}
	get grasaPiegues(){
		this.valorGrasaPliegues	=	0;
		if(!this.grasa.pliegue_tricipital && !this.grasa.pliegue_bicipital && !this.grasa.pliegue_subescapular && !this.grasa.pliegue_supraliaco)
			return '';

		/*	pliegues	*/
		//this.grasa.valorGrasaPliegues	=	0;
		var edad	=	this.paciente.edad;/*	31;	*/
		var esMasculino	=	this.paciente.genero=='M';/*	true;	*/
/*
	D= Densidad del cuerpo; 
	L= Suma de pliegues cutáneos
*/
		var D	=	0;
		var L	=	Number(this.grasa.pliegue_tricipital) + Number(this.grasa.pliegue_bicipital) + Number(this.grasa.pliegue_subescapular) + Number(this.grasa.pliegue_supraliaco);		
			L	=	Math.log(L);
			
			if(isNaN(L))
				L	=	0;
		/*console.log(L);*/
		
	
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
		/*console.log(D);*/
/*	Porcentage de grasa (%) = (495 / D) – 450	*/
		this.valorGrasaPliegues	=	Math.round((495/D)-450);
		return this.valorGrasaPliegues;
	}
	get	imc(){
		if(!this.allowCalculate)
			return '';

		if(!this.valoracion.peso)
			return '';
/*
=PESO/(ESTATURA*ESTATURA)

=SI(B10<18,5;"BAJO PESO";SI(B10<24,9;"NORMAL";SI(B10<30;"SOBREPESO 1";SI(B10<40;"SOBREPESO 2";"SOBREPESO 3"))))

*/
		this.analisis.imc	=	Number(this.valoracion.peso) / ( Number(this.valoracion.estatura) * Number(this.valoracion.estatura) );
		
		var _print	=	'';
		if(this.analisis.imc<18)
			_print	=	'BAJO PESO';
		else{
			if(this.analisis.imc<24)
				_print	=	'NORMAL';
			else{
				if(this.analisis.imc<30)
					_print	=	'SOBREPESO 1';
				else{
					if(this.analisis.imc<40)
						_print	=	'SOBREPESO 2';
					else
						_print	=	'SOBREPESO 2';
				}
				
			}
		}
		return _print;
	}
	get	pesoIdeal(){
		if(!this.allowCalculate)
			return 0;
		if(!this.valoracion.peso)
			return 0;
		var esMasculino	=	this.paciente.genero=='M';
		//var	esMasculino	=	this.sexo=='M';
/*
=SI(SEXO="M";(ESTATURA*100-152)*2,72/2,5+47,7;(ESTATURA*100-152)*2,27/2,5+45,5)
*/
		var factor_1	=	45.5;
		var factor_2	=	2.27;
		if( esMasculino ){
			factor_1	=	47.7;
			factor_2	=	2.72;
		}
		var pesoIdeal			=	(Number(this.valoracion.estatura)*100-152)*factor_2/2.5+factor_1;
		/*console.log(pesoIdeal)*/
		this.analisis.pesoIdeal	=	this.restarSumarAlPesoIdeal( pesoIdeal, esMasculino );
		
		return this.analisis.pesoIdeal;
	}
	get pesoIdealAjustado(){
		if(!this.allowCalculate)
			return 0;
		if(!this.valoracion.peso)
			return 0;		
/*
=(PESO-PESO_IDEAL)/(4)+(PESO_IDEAL)
*/
		this.analisis.pesoIdealAjustado	=(Number(this.valoracion.peso)-this.analisis.pesoIdeal)/(4)+(this.analisis.pesoIdeal);
		return this.analisis.pesoIdealAjustado;
	}
	get diferenciaPeso(){
		if(!this.allowCalculate)
			return 0;
		if(!this.valoracion.peso)
			return 0;		
/*
=PESO-PESO_IDEAL_AJUSTADO
*/
		this.analisis.diferenciaPeso	=	Number(this.valoracion.peso) - Number(this.analisis.pesoIdealAjustado);
		return this.analisis.diferenciaPeso;
	}
	get adecuacion(){
		if(!this.allowCalculate)
			return 0;
		if(!this.valoracion.peso)
			return 0;		
/*
=PESO/PESO_IDEAL_AJUSTADO
*/
		this.model.adecuacion	=	(Number(this.valoracion.peso)/this.analisis.pesoIdealAjustado) * 100;
		return this.model.adecuacion;
	}
	get relacionCinturaCadera(){
		if(!this.allowCalculate)
			return 0;
		if(!Number(this.valoracion.circunferencia_cintura) || !Number(this.valoracion.circunferencia_cadera))
			return 0;		
/*
=CINTURA/CADERA
*/
		this.model.relacionCinturaCadera	=	Number(this.valoracion.circunferencia_cintura)/Number(this.valoracion.circunferencia_cadera);
		var perc	=	this.model.relacionCinturaCadera*100;
		/*return this.model.relacionCinturaCadera;*/
		return perc;
	}
	get gradoSobrepeso(){
		if(!this.allowCalculate)
			return 0;
		/*if(!this.valoracion.peso)
			return 0;*/
		if(!this.valoracion.peso)
			return '';
/*
/*
NP				=SI(GRADO_SOBREPESO_VALOR>40;"OB GRAVE";SI(GRADO_SOBREPESO_VALOR>20;"OB MEDIA";SI(GRADO_SOBREPESO_VALOR>10;"SOBREP";"NP")))	
3,793658207		=(PESO-PESO_IDEAL)/PESO_IDEAL*100
*/
		this.model.gradoSobrepeso	=	(Number(this.valoracion.peso)-this.analisis.pesoIdeal)/this.analisis.pesoIdeal*100;
		var _print	=	'NP';
		if(this.model.gradoSobrepeso>40)
			_print	=	'OB GRAVE';
		else{
			if(this.model.gradoSobrepeso>20)
				_print	=	'OB MEDIA';
			else{
				if(this.model.gradoSobrepeso>10)
					_print	=	'SOBREPESO';
				/*else{_print	=	'NP';
				}*/
			}
		}		
		/*return this.model.gradoSobrepeso;*/
		return _print;
	}
	get porcentajePeso(){
		if(!this.allowCalculate)
			return 0;
		if(!this.valoracion.peso)
			return 0;
/*
104%	=PESO/PESO_IDEAL
Nl		=SI(PORCENTAJE_PESO<75%;"DN SEVERA";SI(PORCENTAJE_PESO<85%;"DN MOD";SI(PORCENTAJE_PESO<90%;"DN LEVE";SI(
*/
		this.analisis.porcentajePeso	=	(Number(this.valoracion.peso)/this.analisis.pesoIdeal) * 100;
		return this.analisis.porcentajePeso;
	}
	get pesoMetaMaximo(){
		if(!this.allowCalculate)
			return 0;
		if(!this.valoracion.peso)
			return 0;		
/*
80,1025		=(PESO*25)/IMC
*/
		this.analisis.pesoMetaMaximo	=	(Number(this.valoracion.peso)*25)/this.analisis.imc;
		if(isNaN(this.analisis.pesoMetaMaximo))
			this.analisis.pesoMetaMaximo	=	0;
		return this.analisis.pesoMetaMaximo;
	}
	get pesoMetaMinimo(){
		if(!this.allowCalculate)
			return 0;
		if(!this.valoracion.peso)
			return 0;		
/*
=(PESO*18,9)/IMC
*/
		this.analisis.pesoMetaMinimo	=	(Number(this.valoracion.peso)*18.9)/this.analisis.imc;
		if(isNaN(this.analisis.pesoMetaMinimo))
			this.analisis.pesoMetaMinimo	=	0;
		return this.analisis.pesoMetaMinimo;
	}
	get currentModel() {
		return JSON.stringify(this.model);
		/*return JSON.stringify(this.analisis);*/
	}
	saveForm(){
		this.formControlDataService.setFormControlData(this.model);
		this.model.getFormValoracionAntropometrica().set(this.valoracion);
		if(this.infoEdited())
			this.createValoracionAntropometrica(this.valoracion);
		else
			this.goTo(this.page);		
	}
/*	Previous(){
		this.saveForm();
		this.router.navigate(['/personales']);
	}*/
/*	Next(){
		this.saveForm();
		this.router.navigate(['/recomendacion']);
	}*/
	Next(){
		if(this.nuevaConsulta){
			this.btnNavigation_pressed	=	true;
			this.page	=	'/recomendacion';
			this.saveForm();
		}else
			this.router.navigate(['/recomendacion']);
		
	}
	goTo(page){
		if(this.btnNavigation_pressed)
			this.router.navigate([page]);
	}
	
	/*get devInfo(){
		var info	=	'';
		info	+=	'Navigation_pressed=' + this.btnNavigation_pressed + "\n";
		info	+=	' - operacion=' + this.mng.operacion + "\n";
		info	+=	' - nueva-consulta=' + this.nuevaConsulta;
		
		return info;
	}*/
}
