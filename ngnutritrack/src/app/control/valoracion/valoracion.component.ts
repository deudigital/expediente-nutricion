import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Analisis,ValoracionAntropometrica, Paciente, DetalleMusculo, DetalleGrasa } from '../data/formControlData.model';
import { FormControlDataService }     from '../data/formControlData.service';
import { LineChartConfig } from '../../models/LineChartConfig';

import { FileService } from '../../services/file.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-valoracion',
  templateUrl: './valoracion.component.html',
  styles: []
})
export class ValoracionComponent implements OnInit {
	model:any;
	mng:any;
	helpers:any;
	json:any;
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

	grafico_items: any;
	grafico_indicator: any;
	grafico_children_items: any;
	grafico_children_indicator: any;
	grafico_children_indicator_current: string='';
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
	loading_section_analisis:boolean;
	
	esAdulto:boolean;
	displayMethods:boolean;
	displayGraphicChildren:boolean;
	displayoptionsForMenor:boolean;
	displayoptionsForAdulto:boolean;
	esMenor:boolean;
	displayMethodOms:boolean;
	
	graficando:boolean;
	graficandoChildren:boolean;
	graficandoHistorialChildren:boolean;
	solicitando:boolean;
	mostrarErrorEstatura:boolean;
	mostrarErrorPeso:boolean;

	showBoxIndicadorImcEdad:boolean;
	showBoxIndicadorEstaturaEdad:boolean;
	showBoxIndicadorPesoEdad:boolean;
	showBoxIndicadorPesoEstatura:boolean;
	
	displayAnalisisPesoIdeal:boolean;
	
	zoom:boolean=false;
	
	withChildrenGraphic:Number;
	withHistorialChildrenGraphic:Number;
	historialParentWidth:Number;
	
	analisis_imc:Number;
	analisis_gradoSobrepeso:String;
	
	_container_modal_tab_graphic:any;
	infoIdeal:{ [id: string]: any; }	=	{'oms':{},'cdc':{}};
	displayNavigation:boolean;
	chartChildrenVisible:boolean;
	doit:any;
	
	data_chart:any;
	
	constructor(private auth: AuthService, private router: Router, private formControlDataService: FormControlDataService, private fileService: FileService) {
		this.model		=	formControlDataService.getFormControlData();
		this.helpers	=	this.model.getHelpers();
		this.mng		=	this.model.getManejadorDatos();
		this.mng.setMenuPacienteStatus(false);
		this.nuevaConsulta				=	false;
		this.disableButtonHistorial		=	true;
		this.loading_data_form			=	true;
		this.loading_section_analisis	=	false;
		this.esAdulto					=	false;
		this.esMenor					=	false;
		this.displayoptionsForMenor		=	false;
		this.displayoptionsForAdulto	=	false;
		this.displayMethods				=	false;
		this.displayGraphicChildren		=	false;
		
		this.mostrarErrorPeso			=	false;
		this.mostrarErrorEstatura		=	false;
		
		this.displayNavigation			=	false;
		this.chartChildrenVisible		=	false;
    }
	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		this.countPendientes	=	0;
		this.btnNavigation_pressed	=	false;
		this.graficando				=	false;
		this.graficandoChildren		=	false;
		this.graficandoHistorialChildren		=	false;
		this.solicitando			=	false;
		this.showBoxIndicadorEstaturaEdad	=	false;
		this.showBoxIndicadorPesoEdad		=	false;
		this.showBoxIndicadorPesoEstatura	=	false;
		this.displayAnalisisPesoIdeal		=	false;
		console.clear();
		this.init();
		
	}
	ngOnDestroy() {
		if(!this.btnNavigation_pressed)
			this.saveForm();
		this.grafico_items			=	null;
		this.grafico_children_items	=	null;
		this.helpers.scrollToForm(true);
	}
	init(){
		this.allowCalculate	=	false;
		this.auth.verifyUser(localStorage.getItem('nutricionista_id'))
			.then((response) => {
				var response	=	response.json();
				if(!response.valid){
					localStorage.clear();
					this.formControlDataService.getFormControlData().message_login	=	response.message;
					this.router.navigateByUrl('/login');
					return false;
				}
				this._getDatosConsulta(this.model.consulta.id);
			})
			.catch((err) => {
				console.log(JSON.parse(err._body));
			});
	}
	_setInfoIdeal(){
		if(!this.valoracion.estatura)
			return 0;

		var alturaPaciente:number		=	Math.round(Number(this.valoracion.estatura)*100);
		var chartData:any;
		var _chartData_i_keys:any;
		var _chartData_i_fk:any;
		var _row:any=[];
		var _data:any;
		try{
			for(var metodo in this.json) {
				if(metodo=='debug')
					continue;

				_data	=	this.json[metodo];
				for(var indicador in _data) {
					chartData	=	JSON.parse( _data[indicador] );
					_chartData_i_keys	=	Object.keys(chartData[0]);
					_chartData_i_fk		=	_chartData_i_keys[0];
					switch(indicador){
						case 'estatura-peso':
							_row	=	chartData.filter(x => Number(x[_chartData_i_fk]) >= Number(alturaPaciente));
							break;
						case 'estatura-edad':
						case 'imc-edad':
						case 'peso-edad':
							if( metodo=='cdc' || this.paciente.edad>5){
								_row	=	chartData.filter(x => Number(x[_chartData_i_fk]) >= Number(this.paciente.edad_meses));
							}
							else{
								_row	=	chartData.filter(x => Number(x[_chartData_i_fk]) >= this.paciente.edad_dias);
							}
							break;
					}
					if(_row){
						if(_row.length>0)
							this.infoIdeal[metodo][indicador]	=	_row[0];
						else
							this.infoIdeal[metodo][indicador]	=	{};
					}
				}
			}
		}catch(err) {
			console.log( 'E:_setInfoIdeal(' + err.message + ')' );
		}
	}
	
	_getJsonData(){
		var data			=	Object();
		data.paciente_id	=	this.paciente.persona_id;
		this.solicitando	=	true;
		this.formControlDataService.select('data-graphic', data)
		.subscribe(
			 response  => {
				this.json		=	response;
				this.solicitando=	false;
				var _method		=	this.valoracion.metodo_valoracion;
				if( _method=='adulto' )
					_method	=	'oms';

				this.disableButtonHistorial	=	!this.historial;
				this.allowCalculate	=	true;
				this._setInfoIdeal();
				this._analisis();

				if( !this.valoracion.peso || !this.valoracion.estatura)
					return false;

				this._graficarChildren( this.json[_method] );
			},
			error =>  console.log('_getJsonData: ' + <any>error)
		);
	}
	_getScreenSize(){
		try {
			if(document.getElementById('content-form'))
				this.withChildrenGraphic			=	document.getElementById('content-form').offsetWidth - 100;
			var _width	=	this.tagBody.offsetWidth;
			if(_width>1250)
				_width	=	1200;
			else
				_width	=	this.tagBody.offsetWidth - 15;

			if(document.getElementById('modal-dato-grafico'))
				_width	=	document.getElementById('modal-dato-grafico').offsetWidth - 15;

			this.historialParentWidth	=	_width;
		}
		catch(err) {
				console.log( 'E:_getScreenSize(' + err.message + ')' );
		}
	}
	displayErrorPesoEstatura(){
		if(!this.displayGraphicChildren)
			return ;
		
		this.mostrarErrorPeso		=	this.valoracion.peso.length==0;
		this.mostrarErrorEstatura	=	this.valoracion.estatura.length==0;
		
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
		this.oValoracion.metodo_valoracion		=	this.valoracion.metodo_valoracion;
		this.oValoracion.percentil_analisis		=	this.valoracion.percentil_analisis;		
		
		if(this.mng.operacion=='nueva-consulta' && !this.valoracion.id){
			this.nuevaConsulta	=	true;
			this.valoracion.estatura				=	String(this.valoracion.lastEstatura);
			this.valoracion.circunferencia_muneca	=	String(this.valoracion.lastCircunferencia_muneca);
		}
		
	}
	_prepopulateForm(){
		
		this.esMenor				=	false;
		this.esAdulto				=	false;
		this.displayMethods			=	false;		
		this.displayoptionsForMenor	=	false;
		this.displayAnalisisPesoIdeal	=	true;
		
		if( this.paciente.edad > 20 ){
			this.esAdulto	=	true;
			this.esMenor=	false;
		}else{
			this.esMenor			=	true;
			this.displayMethods		=	true;
			this.displayMethodOms	=	this.paciente.edad<19;
			var _metodo;
			if(!this.valoracion.metodo_valoracion){
				if( this.paciente.edad > 18 )
					_metodo	=	'adulto';
				else
					_metodo	=	this.displayMethodOms? 'oms':'cdc';

				this.valoracion.metodo_valoracion	=	_metodo;
			}
			this.displayoptionsForMenor	=	true;
			this.displayAnalisisPesoIdeal	=	( this.paciente.edad < 11 );
		}
		this.displayoptionsForAdulto	=	this.valoracion.metodo_valoracion=='adulto' || this.esAdulto;
		this.displayGraphicChildren		=	this.esMenor && !this.displayoptionsForAdulto;
	}	
	infoEdited(){
		if(!this.valoracion.id && this.countPendientes>0){
			return true;
		}
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
	_getDatosConsulta__login(consulta_id){
		if(!consulta_id)
			return ;
		
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
				
				this.allowCalculate	=	false;
				this.loading_section_analisis	=	true;
				this.formControlDataService.getConsultaSelected(consulta_id).subscribe(
					data => {
						this.model.fill(data);
						this.valoracion		=	this.model.getFormValoracionAntropometrica();				
						this.detalleMusculo	=	this.model.getFormDetalleMusculo();
						this.grasa			=	this.model.getFormDetalleGrasa();
						this.paciente		=	this.model.getFormPaciente();
						this._prepopulateForm();
						this.setInfoInit();
						this.loading_data_form	=	false;
						this.historial	=	this.valoracion.historial;				
						if(!this.valoracion.id)
							this.valoracion.consulta_id	=	this.model.consulta.id;

						 this._getJsonData();
						 this.loading_section_analisis	=	false;
						 this.displayNavigation			=	true;				
					},
					error => console.log(<any>error)
				);
				
			})
			.catch((err) => {
				console.log(JSON.parse(err._body));
			});
	}
	_getDatosConsulta(consulta_id){
		if(!consulta_id)
			return ;
		
		this.allowCalculate	=	false;
		this.loading_section_analisis	=	true;
		this.formControlDataService.getConsultaSelected(consulta_id).subscribe(
			data => {
				this.model.fill(data);
				this.valoracion		=	this.model.getFormValoracionAntropometrica();				
				this.detalleMusculo	=	this.model.getFormDetalleMusculo();
				this.grasa			=	this.model.getFormDetalleGrasa();
				this.paciente		=	this.model.getFormPaciente();
				this._prepopulateForm();
				this.setInfoInit();
				this.loading_data_form	=	false;
				this.historial	=	this.valoracion.historial;				
				if(!this.valoracion.id)
					this.valoracion.consulta_id	=	this.model.consulta.id;

				 this._getJsonData();
				 this.loading_section_analisis	=	false;
				 this.displayNavigation			=	true;
				 
				 window.onresize = ( e ) => {
					clearTimeout(this.doit);
					this.doit	=	setTimeout(() => {
										this._getScreenSize();
										this.graficar();
										this.graficarEnModal();
									}, 1000);
				}
		
			},
			error => console.log(<any>error)
		);
	}
	graficarEnModal(){
		if(this.displayoptionsForAdulto)
			this._graficarModalAdulto();
		else
			this._graficarHistorialChildren();
		
	}
	_graficarModalAdulto(){
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

		
		this._getScreenSize();
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
				width: this.historialParentWidth,
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
				chartArea: {width: '90%',height: '80%'},
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

	puedeGraficar(){
		if(this.graficando)
			return false;
		try {
			if(this.valoracion.peso.length==0 || this.valoracion.estatura.length==0){
				this.displayErrorPesoEstatura();
				this.graficando				=	false;
				return false;
			}
			return true;
		}
		catch(err) {
				return false;
		}		
	}
	
	graficar(){
		if( this.graficandoChildren )
			return ;

		this.displayErrorPesoEstatura();
		if(this.valoracion.peso.length==0 || this.valoracion.estatura.length==0){
				this.graficandoChildren				=	false;
			return ;
		}
		this.graficandoChildren		=	true;
		this.valoracion.graficando	=	true;
		this.formControlDataService.addValoracionAntropometrica(this.valoracion)
		.subscribe(
			 response  => {
						this.cleanGraficoChildren();
						var _method		=	this.valoracion.metodo_valoracion;
						if( _method=='adulto' )
							_method	=	'oms';

						this.allowCalculate	=	true;
						this._setInfoIdeal();
						this._analisis();
						this._graficarChildren( this.json[_method] );
					},
			error =>  {
					console.log(<any>error)
					this.graficandoChildren		=	false;
					}
		);
	}
	_graficarChildren( aChartData ){
		this.data_chart				=	null;
		this.grafico_items			=	null;
		this.grafico_indicator		=	null;
		this.graficandoChildren		=	true;
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
		var args:any[]		=	[];
		var rangoEdad:any;
		var alturaPaciente:number	=	Math.round(Number(this.valoracion.estatura)*100);
		var _alturaPaciente:any		=	parseFloat(this.valoracion.estatura)*100;
		
		_alturaPaciente	=	Math.trunc(_alturaPaciente * 100) / 100;
		
		var pesoPaciente:number		=	Number(this.valoracion.peso);
		var edadPaciente:number		=	Number(this.paciente.edad.toFixed(2));
		var edadPaciente_dias:number=	Number(this.paciente.edad_dias);
		var edadPaciente_meses:number=	Number(this.paciente.edad_meses.toFixed(2));
		var _label	=	{};
		var x_label			=	'';
		var y_label			=	'';
		var graph_title		=	'';
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
		var _aux_altura:any	=	0;
		var _aux_peso:any	=	0;
		var _aux_imc:any	=	0;
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
		var _round_paciente_printed	=	false;
		var _point:any;
		this._getScreenSize();
		for(var indicador in aChartData) {
			if( !aChartData[indicador] )
				continue;

			if(indicador=='estatura-peso' && _alturaPaciente>121.5)
				continue;
				
			
			chartData	=	JSON.parse(aChartData[indicador]);
			switch(this.valoracion.metodo_valoracion){
				case 'cdc':
					rangoEdad		=	'0-2';
					if(this.paciente.edad>2)
						rangoEdad		=	'2-20';
					break;
				case 'oms':
				default:
					rangoEdad		=	'0-5';
					if(this.paciente.edad>5)
						rangoEdad		=	'5-19';
			}	
			switch(indicador){
				case 'estatura-peso':
					x_label		=	'Estatura (cm)';
					y_label		=	'Peso (Kg)';
					graph_title	=	'Peso para Estatura';						
					break;
				case 'estatura-edad':
					x_label		=	'Edad (días)';
					if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
						x_label		=	'Edad (Meses)';
					
					y_label		=	'Estatura (cm)';
					graph_title	=	'Estatura para Edad';
					if(this.valoracion.metodo_valoracion=='oms'){
						if(this.paciente.edad>2)
							rangoEdad		=	'2-5';
					}						
					break;
				case 'imc-edad':
					x_label		=	'Edad';						
					if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
						x_label		=	'Edad (Meses)';
					y_label		=	'IMC';
					graph_title	=	'IMC para Edad';
					break;
				case 'peso-edad':
					x_label		=	'Edad (días)';
					if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
						x_label		=	'Edad (Meses)';
					y_label		=	'Peso (Kg)';
					graph_title	=	'Peso para Edad';				
					break;
			}
			headerGraficos.push({'id': indicador, 'nombre':graph_title, 'class': 'grafico-' + indicador + (indicador=='estatura-edad'? ' active':'')})
			graph_title	=	'';
			_label['title']	=	'';
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
			this.data_chart	=	[];
			columns	=	[];
			for(var key in _row_first) {
				columns.push({label: key, type: 'number'});
				if(key!=_row_first[_row_first_fk])
					columns.push({type: 'string', role: 'tooltip', 'p': {'html': true}});
			}
			columns.push({label: 'Paciente', type: 'number'});
			columns.push({type: 'string', role: 'tooltip', 'p': {'html': true}});
				
			_aux		=	0;
			
			_aux_altura	=	0;
			_aux_peso	=	0;
			_aux_imc	=	0;
			
			_round_paciente_printed	=	false;
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
						_data_i[key]	=	Number(_data_i[key]).toFixed(2);
						_data_i[_data_i_fk]	=	Number(_data_i[_data_i_fk]).toFixed(2)						
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
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
									_text	+=	' meses';
								else
									_text	+=	' dias';
								
								_text	+=	'</li>';									
								break;
							case 'imc-edad':
								_text	+=	'<li>Edad: ' + _data_i[_data_i_fk];
								
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
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
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
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
				_text		=	'';
				_push_data	=	null;
				if(!_round_paciente_printed){
					_chartData_i_keys	=	Object.keys(chartData[i]);
					_chartData_i_fk		=	_chartData_i_keys[0];
					switch(indicador){
						case 'estatura-peso':				
							_push_data	=	chartData[i][_chartData_i_fk] >= alturaPaciente ? pesoPaciente : null;
							if(_push_data){
								_text	+=	'	<li>Peso: ' + pesoPaciente + ' kg';
								_text	+=	' | ';
								_text	+=	'Estatura: ' + alturaPaciente + ' (cm)</li>';
							}
							break;
						case 'estatura-edad':
							
							if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
								_push_data	=	chartData[i][_chartData_i_fk] >= edadPaciente_meses ? alturaPaciente : null;
							else
								_push_data	=	chartData[i][_chartData_i_fk] >= edadPaciente_dias ? alturaPaciente : null;
							if(_push_data){
								_text	+=	'	<li>Edad: ';
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
									_text	+=	edadPaciente_meses + ' meses';
								else
									_text	+=	edadPaciente_dias + ' dias';
								
								_text	+=	' | ';
								_text	+=	'Estatura: ' + alturaPaciente + ' (cm)</li>';					
							}							
							break;
						case 'imc-edad':
							if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
								_push_data	=	chartData[i][_chartData_i_fk] >= edadPaciente_meses ? this.analisis.imc : null;
							else
								_push_data	=	chartData[i][_chartData_i_fk] >= edadPaciente_dias ? this.analisis.imc : null;
							
							if(_push_data){
								_text	+=	'	<li>Edad: ';
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
									_text	+=	edadPaciente_meses + ' meses';
								else
									_text	+=	edadPaciente_dias + ' dias';

								_text	+=	' | ';
								_text	+=	'Imc: ' + this.analisis.imc + ' </li>';					
							}							
							break;
						case 'peso-edad':
							if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
								_push_data	=	chartData[i][_chartData_i_fk] >= edadPaciente_meses ? pesoPaciente : null;
							else
								_push_data	=	chartData[i][_chartData_i_fk] >= edadPaciente_dias ? pesoPaciente : null;
							
							if(_push_data){
								_text	+=	'	<li>Peso: ' + pesoPaciente + ' kg';
								_text	+=	' | ';
								_text	+=	'Edad: ';
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
									_text	+=	edadPaciente_meses + ' meses';
								else
									_text	+=	edadPaciente_dias + ' días';
								_text	+=	'</li>';								
							}
							break;
					}
					if(_push_data){
						_text	=	'	<li><strong>Paciente</strong></li>' + _text;
						_text	=	'<ul class="grafico-lista">' + _text + '</ul>';
						_point	=	_push_data;
						_round_paciente_printed	=	true;
					}
				}
				chartWithToolTips.push( _push_data );
				chartWithToolTips.push( _text );
				this.data_chart.push( chartWithToolTips );
			}
			_x_2		=	0;
			_value		=	0;
			_value_last	=	0;
			_value		=	Math.floor (parseFloat( _row_first[_row_first_fk] ));
			_value_last	=	Math.floor (parseFloat( _row_last[_row_last_fk] ));
			_x_2		=	x*2;

			if( this.zoom ) {
				switch(indicador){
					case 'estatura-peso':
/*				Peso |___
				    Estatura	*/
						_min_hAxis	=	alturaPaciente <= ( _row_first[_row_first_fk] + _x_2 )? Math.floor(_row_first[_row_first_fk]) : ( alturaPaciente - _x_2 );
						_max_hAxis	=	alturaPaciente >= ( _row_last[_row_last_fk]   - _x_2 )? Math.floor(_row_last[_row_last_fk]) : ( alturaPaciente + _x_2 );

						_min_vAxis	=	pesoPaciente <= ( _row_first[_row_first_sk] + y)? Math.floor(_row_first[_row_first_sk]) : pesoPaciente - y ;
						_max_vAxis	=	pesoPaciente >= ( _row_last[_row_last_lk] - y )? Math.ceil(_row_last[_row_last_lk]) : pesoPaciente + y;
						break;
					case 'estatura-edad':
/*				  Esta |___
				  tura  Edad	*/
						if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5){
							_min_hAxis	=	edadPaciente_meses <= ( (_row_first[_row_first_fk]) + ((_x_2)) ) ? Math.floor (_row_first[_row_first_fk]) : edadPaciente_meses - (_x_2);
							_max_hAxis	=	edadPaciente_meses >= ( (_row_last[_row_last_fk]) - (_x_2)) ? Math.floor (_row_last[_row_last_fk]) : edadPaciente_meses+(_x_2);

							_min_vAxis	=	alturaPaciente <= (_row_first[_row_first_sk] + y) ? Math.floor (_row_first[_row_first_sk]) : alturaPaciente - y ;
							_max_vAxis	=	alturaPaciente >= (_row_last[_row_last_lk] - y ) ? Math.ceil (_row_last[_row_last_lk]) : alturaPaciente + y;
						}
						else{
							_min_hAxis	=	edadPaciente_dias <= ( (_row_first[_row_first_fk]) + ((_x_2)) ) ? Math.floor (_row_first[_row_first_fk]) : edadPaciente_dias - (_x_2);
							_max_hAxis	=	edadPaciente_dias >= ( (_row_last[_row_last_fk]) - (_x_2)) ? Math.floor (_row_last[_row_last_fk]) : edadPaciente_dias+(_x_2);

							_min_vAxis	=	alturaPaciente <= (_row_first[_row_first_sk] + y) ? Math.floor (_row_first[_row_first_sk]) : alturaPaciente - y ;
							_max_vAxis	=	alturaPaciente >= (_row_last[_row_last_lk] - y ) ? Math.ceil (_row_last[_row_last_lk]) : alturaPaciente + y;			
						}
						break;
					case 'imc-edad':
/*				 IMC |___
				      Edad	*/
						if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5){
							_min_hAxis	=	edadPaciente_meses <= ( (_row_first[_row_first_fk]) + ((_x_2)) ) ? Math.floor (_row_first[_row_first_fk]) : edadPaciente_meses - (_x_2);
							_max_hAxis	=	edadPaciente_meses >= ( (_row_last[_row_last_fk]) - (_x_2)) ? Math.floor (_row_last[_row_last_fk]) : edadPaciente_meses+(_x_2);

							_min_vAxis	=	this.analisis.imc <= (_row_first[_row_first_sk] + y) ? Math.floor (_row_first[_row_first_sk]) : this.analisis.imc - y ;
							_max_vAxis	=	this.analisis.imc >= (_row_last[_row_last_lk] - y ) ? Math.ceil (_row_last[_row_last_lk]) : this.analisis.imc + y;
						}
						else{
							_min_hAxis	=	edadPaciente_dias <= ( (_row_first[_row_first_fk]) + ((_x_2)) ) ? Math.floor (_row_first[_row_first_fk]) : edadPaciente_dias - (_x_2);
							_max_hAxis	=	edadPaciente_dias >= ( (_row_last[_row_last_fk]) - (_x_2)) ? Math.floor (_row_last[_row_last_fk]) : edadPaciente_dias+(_x_2);

							_min_vAxis	=	this.analisis.imc <= (_row_first[_row_first_sk] + y) ? Math.floor (_row_first[_row_first_sk]) : this.analisis.imc - y ;
							_max_vAxis	=	this.analisis.imc >= (_row_last[_row_last_lk] - y ) ? Math.ceil (_row_last[_row_last_lk]) : this.analisis.imc + y;			
						}
						break;
					case 'peso-edad':
/*					 Peso |___
							Edad	*/
						if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5){
							_min_hAxis	=	edadPaciente_meses <= ( (_row_first[_row_first_fk]) + ((_x_2)) ) ? Math.floor (_row_first[_row_first_fk]) : edadPaciente_meses - (_x_2);
							_max_hAxis	=	edadPaciente_meses >= ( (_row_last[_row_last_fk]) - (_x_2)) ? Math.floor (_row_last[_row_last_fk]) : edadPaciente_meses+(_x_2);

							_min_vAxis	=	pesoPaciente <= (_row_first[_row_first_sk] + y) ? Math.floor (_row_first[_row_first_sk]) : pesoPaciente - y ;
							_max_vAxis	=	pesoPaciente >= (_row_last[_row_last_lk] - y ) ? Math.ceil (_row_last[_row_last_lk]) : pesoPaciente + y;
						}
						else{
							_min_hAxis	=	edadPaciente_dias <= ( (_row_first[_row_first_fk]) + ((_x_2)) ) ? Math.floor (_row_first[_row_first_fk]) : edadPaciente_dias - (_x_2);
							_max_hAxis	=	edadPaciente_dias >= ( (_row_last[_row_last_fk]) - (_x_2)) ? Math.floor (_row_last[_row_last_fk]) : edadPaciente_dias+(_x_2);

							_min_vAxis	=	pesoPaciente <= (_row_first[_row_first_sk] + y) ? Math.floor (_row_first[_row_first_sk]) : pesoPaciente - y ;
							_max_vAxis	=	pesoPaciente >= (_row_last[_row_last_lk] - y ) ? Math.ceil (_row_last[_row_last_lk]) : pesoPaciente + y;			
						}
						break;
				}
			} else {
				_min_hAxis	=	Math.floor(_row_first[_row_first_fk]);
				_max_hAxis	=	Math.ceil(_row_last[_row_last_fk]);
				_min_vAxis	=	Math.floor(_row_first[_row_first_sk]);
				_max_vAxis	=	Math.ceil(_row_last[_row_last_lk]);
			}

			_label['title']		=	graph_title;
			args['title']		=	_label['title'];
			args['x']			=	x;
			args['y']			=	y;
			args['label_x']		=	x_label;
			args['label_y']		=	y_label;
			args['hAxis_min']	=	_min_hAxis;
			args['hAxis_max']	=	_max_hAxis;
			args['hAxis_value']	=	_value;
			args['vAxis_min']	=	_min_vAxis;
			args['vAxis_max']	=	_max_vAxis;
			args['vAxis_value']	=	_row_first[_row_first_sk];
			args['width']	=	this.withChildrenGraphic;
			options	=	this._getOptionsGraphChildren( args );
			config	=	new LineChartConfig('title ' + toGraph, options, columns);
			item	=	{'data':this.data_chart, 'config': config, 'elementId':'element_' + indicador, 'key': 'container_' + indicador, 'class':indicador=='estatura-edad'? 'active':''};
			items.push(item);
			headers.push({'id':'id_' + indicador, 'nombre':toGraph, 'class': 'grafico-' + i});				
		}
		this.grafico_indicator	=	headerGraficos;
		this.grafico_items		=	items;
		this.tagBody.classList.add('grafico-selected-estatura-edad');
		this.grafico_children_indicator_current	=	'estatura-edad'		
		this.graficandoChildren		=	false;
		
	}
	_graficarChildren__successfully( aChartData ){
		this.grafico_items			=	null;
		this.grafico_indicator		=	null;
		this.graficandoChildren		=	true;
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
		var args:any[]		=	[];
		var rangoEdad:any;
		var alturaPaciente:number	=	Math.round(Number(this.valoracion.estatura)*100);
		var _alturaPaciente:any		=	parseFloat(this.valoracion.estatura)*100;
		
		_alturaPaciente	=	Math.trunc(_alturaPaciente * 100) / 100;
		
		var pesoPaciente:number		=	Number(this.valoracion.peso);
		var edadPaciente:number		=	Number(this.paciente.edad);
		var edadPaciente_dias:number=	Math.round(edadPaciente*365);
		var edadPaciente_meses:number=	Math.round(edadPaciente*12);
		if(this.paciente.fecha_nac){
			var current_fecha = this.paciente.fecha_nac.split('/');
			var year	=	Number(current_fecha[2]);
			var month	=	Number(current_fecha[1]);
			var day		=	Number(current_fecha[0]);			
				var fechaInicio = new Date(year + '-' + month + '-' + day).getTime();
				var fechaFin    = new Date().getTime();
				var diff = fechaFin - fechaInicio;
				edadPaciente_dias	=	Math.round( diff/(1000*60*60*24) );
				var _anhos:any	=	Math.trunc( edadPaciente_dias/365.25 );
				edadPaciente_meses	=	_anhos * 12;
				_anhos	=	Math.trunc( edadPaciente_dias % 365.25 );
				if(_anhos>30)
					edadPaciente_meses	+=	Math.trunc( _anhos / 30 );
		}
		var _label	=	{};
		var x_label			=	'';
		var y_label			=	'';
		var graph_title		=	'';
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
		var _aux_altura:any	=	0;
		var _aux_peso:any	=	0;
		var _aux_imc:any	=	0;
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
		var _round_paciente_printed	=	false;
		var _point:any;
		this._getScreenSize();
		for(var indicador in aChartData) {
			if( !aChartData[indicador] )
				continue;

			if(indicador=='estatura-peso' && _alturaPaciente>122)
				continue;

			chartData	=	JSON.parse(aChartData[indicador]);
			switch(this.valoracion.metodo_valoracion){
				case 'cdc':
					rangoEdad		=	'0-2';
					if(this.paciente.edad>2)
						rangoEdad		=	'2-20';
					break;
				case 'oms':
				default:
					rangoEdad		=	'0-5';
					if(this.paciente.edad>5)
						rangoEdad		=	'5-19';
			}	
			switch(indicador){
				case 'estatura-peso':
					x_label		=	'Estatura (cm)';
					y_label		=	'Peso (Kg)';
					graph_title	=	'Peso para Estatura';						
					break;
				case 'estatura-edad':
					x_label		=	'Edad (días)';
					if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
						x_label		=	'Edad (Meses)';
					
					y_label		=	'Estatura (cm)';
					graph_title	=	'Estatura para Edad';
					if(this.valoracion.metodo_valoracion=='oms'){
						if(this.paciente.edad>2)
							rangoEdad		=	'2-5';
					}						
					break;
				case 'imc-edad':
					x_label		=	'Edad';						
					if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
						x_label		=	'Edad (Meses)';
					y_label		=	'IMC';
					graph_title	=	'IMC para Edad';
					break;
				case 'peso-edad':
					x_label		=	'Edad (días)';
					if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
						x_label		=	'Edad (Meses)';
					y_label		=	'Peso (Kg)';
					graph_title	=	'Peso para Edad';				
					break;
			}
			headerGraficos.push({'id': indicador, 'nombre':graph_title, 'class': 'grafico-' + indicador + (indicador=='estatura-edad'? ' active':'')})
			graph_title	=	'';
			_label['title']	=	'';
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
				
			_aux		=	0;
			
			_aux_altura	=	0;
			_aux_peso	=	0;
			_aux_imc	=	0;
			
			_round_paciente_printed	=	false;
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
						_data_i[key]	=	Number(_data_i[key]).toFixed(2);
						_data_i[_data_i_fk]	=	Number(_data_i[_data_i_fk]).toFixed(2)						
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
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
									_text	+=	' meses';
								else
									_text	+=	' dias';
								
								_text	+=	'</li>';									
								break;
							case 'imc-edad':
								_text	+=	'<li>Edad: ' + _data_i[_data_i_fk];
								
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
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
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
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
				_text		=	'';
				_push_data	=	null;
				if(!_round_paciente_printed){
					_chartData_i_keys	=	Object.keys(chartData[i]);
					_chartData_i_fk		=	_chartData_i_keys[0];
					switch(indicador){
						case 'estatura-peso':				
							_push_data	=	chartData[i][_chartData_i_fk] >= alturaPaciente ? pesoPaciente : null;
							if(_push_data){
								_text	+=	'	<li>Peso: ' + pesoPaciente + ' kg';
								_text	+=	' | ';
								_text	+=	'Estatura: ' + alturaPaciente + ' (cm)</li>';
							}
							break;
						case 'estatura-edad':
							
							if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
								_push_data	=	chartData[i][_chartData_i_fk] >= edadPaciente_meses ? alturaPaciente : null;
							else
								_push_data	=	chartData[i][_chartData_i_fk] >= edadPaciente_dias ? alturaPaciente : null;
							if(_push_data){
								_text	+=	'	<li>Edad: ';
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
									_text	+=	edadPaciente_meses + ' meses';
								else
									_text	+=	edadPaciente_dias + ' dias';
								
								_text	+=	' | ';
								_text	+=	'Estatura: ' + alturaPaciente + ' (cm)</li>';					
							}							
							break;
						case 'imc-edad':
							if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
								_push_data	=	chartData[i][_chartData_i_fk] >= edadPaciente_meses ? this.analisis.imc : null;
							else
								_push_data	=	chartData[i][_chartData_i_fk] >= edadPaciente_dias ? this.analisis.imc : null;
							
							if(_push_data){
								_text	+=	'	<li>Edad: ';
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
									_text	+=	edadPaciente_meses + ' meses';
								else
									_text	+=	edadPaciente_dias + ' dias';

								_text	+=	' | ';
								_text	+=	'Imc: ' + this.analisis.imc + ' </li>';					
							}							
							break;
						case 'peso-edad':
							if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
								_push_data	=	chartData[i][_chartData_i_fk] >= edadPaciente_meses ? pesoPaciente : null;
							else
								_push_data	=	chartData[i][_chartData_i_fk] >= edadPaciente_dias ? pesoPaciente : null;
							
							if(_push_data){
								_text	+=	'	<li>Peso: ' + pesoPaciente + ' kg';
								_text	+=	' | ';
								_text	+=	'Edad: ';
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
									_text	+=	edadPaciente_meses + ' meses';
								else
									_text	+=	edadPaciente_dias + ' días';
								_text	+=	'</li>';								
							}
							break;
					}
					if(_push_data){
						_text	=	'	<li><strong>Paciente</strong></li>' + _text;
						_text	=	'<ul class="grafico-lista">' + _text + '</ul>';
						_point	=	_push_data;
						_round_paciente_printed	=	true;
					}
				}
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

			if( this.zoom ) {
				switch(indicador){
					case 'estatura-peso':
/*					Peso |___
					    Estatura	*/
						_min_hAxis	=	alturaPaciente <= ( _row_first[_row_first_fk] + _x_2 )? Math.floor(_row_first[_row_first_fk]) : ( alturaPaciente - _x_2 );
						_max_hAxis	=	alturaPaciente >= ( _row_last[_row_last_fk]   - _x_2 )? Math.floor(_row_last[_row_last_fk]) : ( alturaPaciente + _x_2 );

						_min_vAxis	=	pesoPaciente <= ( _row_first[_row_first_sk] + y)? Math.floor(_row_first[_row_first_sk]) : pesoPaciente - y ;
						_max_vAxis	=	pesoPaciente >= ( _row_last[_row_last_lk] - y )? Math.ceil(_row_last[_row_last_lk]) : pesoPaciente + y;
						break;
					case 'estatura-edad':
/*				  Esta |___
				  tura  Edad	*/

						if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5){
							_min_hAxis	=	edadPaciente_meses <= ( (_row_first[_row_first_fk]) + ((_x_2)) ) ? Math.floor (_row_first[_row_first_fk]) : edadPaciente_meses - (_x_2);
							_max_hAxis	=	edadPaciente_meses >= ( (_row_last[_row_last_fk]) - (_x_2)) ? Math.floor (_row_last[_row_last_fk]) : edadPaciente_meses+(_x_2);

							_min_vAxis	=	alturaPaciente <= (_row_first[_row_first_sk] + y) ? Math.floor (_row_first[_row_first_sk]) : alturaPaciente - y ;
							_max_vAxis	=	alturaPaciente >= (_row_last[_row_last_lk] - y ) ? Math.ceil (_row_last[_row_last_lk]) : alturaPaciente + y;
						}
						else{
							_min_hAxis	=	edadPaciente_dias <= ( (_row_first[_row_first_fk]) + ((_x_2)) ) ? Math.floor (_row_first[_row_first_fk]) : edadPaciente_dias - (_x_2);
							_max_hAxis	=	edadPaciente_dias >= ( (_row_last[_row_last_fk]) - (_x_2)) ? Math.floor (_row_last[_row_last_fk]) : edadPaciente_dias+(_x_2);

							_min_vAxis	=	alturaPaciente <= (_row_first[_row_first_sk] + y) ? Math.floor (_row_first[_row_first_sk]) : alturaPaciente - y ;
							_max_vAxis	=	alturaPaciente >= (_row_last[_row_last_lk] - y ) ? Math.ceil (_row_last[_row_last_lk]) : alturaPaciente + y;			
						}
						break;
					case 'imc-edad':
/*				 IMC |___
				      Edad	*/
						if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5){
							_min_hAxis	=	edadPaciente_meses <= ( (_row_first[_row_first_fk]) + ((_x_2)) ) ? Math.floor (_row_first[_row_first_fk]) : edadPaciente_meses - (_x_2);
							_max_hAxis	=	edadPaciente_meses >= ( (_row_last[_row_last_fk]) - (_x_2)) ? Math.floor (_row_last[_row_last_fk]) : edadPaciente_meses+(_x_2);

							_min_vAxis	=	this.analisis.imc <= (_row_first[_row_first_sk] + y) ? Math.floor (_row_first[_row_first_sk]) : this.analisis.imc - y ;
							_max_vAxis	=	this.analisis.imc >= (_row_last[_row_last_lk] - y ) ? Math.ceil (_row_last[_row_last_lk]) : this.analisis.imc + y;
						}
						else{
							_min_hAxis	=	edadPaciente_dias <= ( (_row_first[_row_first_fk]) + ((_x_2)) ) ? Math.floor (_row_first[_row_first_fk]) : edadPaciente_dias - (_x_2);
							_max_hAxis	=	edadPaciente_dias >= ( (_row_last[_row_last_fk]) - (_x_2)) ? Math.floor (_row_last[_row_last_fk]) : edadPaciente_dias+(_x_2);

							_min_vAxis	=	this.analisis.imc <= (_row_first[_row_first_sk] + y) ? Math.floor (_row_first[_row_first_sk]) : this.analisis.imc - y ;
							_max_vAxis	=	this.analisis.imc >= (_row_last[_row_last_lk] - y ) ? Math.ceil (_row_last[_row_last_lk]) : this.analisis.imc + y;			
						}
						break;
					case 'peso-edad':
/*					 Peso |___
						Edad	*/
						if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5){
							_min_hAxis	=	edadPaciente_meses <= ( (_row_first[_row_first_fk]) + ((_x_2)) ) ? Math.floor (_row_first[_row_first_fk]) : edadPaciente_meses - (_x_2);
							_max_hAxis	=	edadPaciente_meses >= ( (_row_last[_row_last_fk]) - (_x_2)) ? Math.floor (_row_last[_row_last_fk]) : edadPaciente_meses+(_x_2);

							_min_vAxis	=	pesoPaciente <= (_row_first[_row_first_sk] + y) ? Math.floor (_row_first[_row_first_sk]) : pesoPaciente - y ;
							_max_vAxis	=	pesoPaciente >= (_row_last[_row_last_lk] - y ) ? Math.ceil (_row_last[_row_last_lk]) : pesoPaciente + y;
						}
						else{
							_min_hAxis	=	edadPaciente_dias <= ( (_row_first[_row_first_fk]) + ((_x_2)) ) ? Math.floor (_row_first[_row_first_fk]) : edadPaciente_dias - (_x_2);
							_max_hAxis	=	edadPaciente_dias >= ( (_row_last[_row_last_fk]) - (_x_2)) ? Math.floor (_row_last[_row_last_fk]) : edadPaciente_dias+(_x_2);

							_min_vAxis	=	pesoPaciente <= (_row_first[_row_first_sk] + y) ? Math.floor (_row_first[_row_first_sk]) : pesoPaciente - y ;
							_max_vAxis	=	pesoPaciente >= (_row_last[_row_last_lk] - y ) ? Math.ceil (_row_last[_row_last_lk]) : pesoPaciente + y;			
						}
						break;
				}
			} else {
				_min_hAxis	=	Math.floor(_row_first[_row_first_fk]);
				_max_hAxis	=	Math.ceil(_row_last[_row_last_fk]);
				_min_vAxis	=	Math.floor(_row_first[_row_first_sk]);
				_max_vAxis	=	Math.ceil(_row_last[_row_last_lk]);
			}

			_label['title']		=	graph_title;
			args['title']		=	_label['title'];
			args['x']			=	x;
			args['y']			=	y;
			args['label_x']		=	x_label;
			args['label_y']		=	y_label;
			args['hAxis_min']	=	_min_hAxis;
			args['hAxis_max']	=	_max_hAxis;
			args['hAxis_value']	=	_value;
			args['vAxis_min']	=	_min_vAxis;
			args['vAxis_max']	=	_max_vAxis;
			args['vAxis_value']	=	_row_first[_row_first_sk];
			args['width']	=	this.withChildrenGraphic;
			options	=	this._getOptionsGraphChildren( args );
			
			config	=	new LineChartConfig('title ' + toGraph, options, columns);
			item	=	{'data':data, 'config': config, 'elementId':'element_' + indicador, 'key': 'container_' + indicador, 'class':indicador=='estatura-edad'? 'active':''};
			items.push(item);
			headers.push({'id':'id_' + indicador, 'nombre':toGraph, 'class': 'grafico-' + i});				
		}
		this.grafico_indicator	=	headerGraficos;
		this.grafico_items		=	items;
		this.tagBody.classList.add('grafico-selected-estatura-edad');
		this.grafico_children_indicator_current	=	'estatura-edad'		
		this.graficandoChildren		=	false;		
	}
	

	_graficarHistorialChildren(){
		this.graficandoHistorialChildren		=	true;		
		this.grafico_children_items		=	null;
		{
		var _method		=	this.valoracion.metodo_valoracion;
		var aChartData	=	this.json[_method];
		var toGraph		=	'';
		var data;
		var item;
		var items			=	[];
		var headers			=	[];
		var indicatorsMenuItem	=	[];
		var config;
		var options:any;
		var columns;
		var chartData:any;
		var args:any[]	=	[];
		var alturaPaciente:number	=	Math.round(Number(this.valoracion.estatura)*100);
		var _alturaPaciente:any		=	(Number(this.valoracion.estatura)*100).toFixed(2);
		var pesoPaciente:number		=	Number(this.valoracion.peso);
		
		var edadPaciente:number		=	Number(this.paciente.edad);
		var edadPaciente_dias:number=	Number(this.paciente.edad_dias);
		var edadPaciente_meses:number=	Number(this.paciente.edad_meses);
		var _label	=	{};
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
		var _aux_altura:any	=	0;
		var _aux_peso:any	=	0;
		var _aux_imc:any	=	0;
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
		var _round_paciente_printed	=	false;
		var _edad_en_meses:boolean;
		var _classMenuItem	=	'';
	}
		this._getScreenSize();
		var _edad:any;
		var _hist:any;
		var h:any;
		var _elem:any;
		var data_historial_orig	=	[];
		var data_historial	=	[];
		for(var j in this.historial){
			_hist	=	this.historial[j];
			h	=	{'fecha':_hist.date_formatted, 'edad':_hist.edad.toFixed(2),  'dias':_hist.edad_dias, 'meses':_hist.edad_meses.toFixed(2), 'estatura':(_hist.estatura*100), 'peso':_hist.peso, 'imc':_hist.imc};
			data_historial_orig.unshift( h );
		}
try {
		for(var indicador in aChartData) {
			if( !aChartData[indicador] )
				continue;

			if(indicador=='estatura-peso' && _alturaPaciente>121.5)
				continue;
		{
			chartData		=	JSON.parse(aChartData[indicador]);
			data_historial	=	this.helpers.clone(	data_historial_orig );
			_label			=	this._getLabelForGraphic(indicador);			
			_classMenuItem	=	'grafico-children-' + indicador + (indicador=='estatura-edad'? ' active':'');
			indicatorsMenuItem.push({'id': 'children_' + indicador, 'nombre':_label['title'], 'class': _classMenuItem, 'indicador':indicador });
			
			_label['title']	=	'';
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

			_aux		=	0;			
			_aux_altura	=	0;
			_aux_peso	=	0;
			_aux_imc	=	0;
			_round_paciente_printed		=	false;
			var _hrow:any				=	null;
			var _hasHistorialDataRow	=	false;
			if(data_historial.length>0){
				_hrow	=	data_historial[0];
				_hasHistorialDataRow	=	true;
				data_historial.shift();
			}
		}
			for(var i=0; i<chartData.length; i++) {
				chartWithToolTips	=	new Array();				
				_text				=	'';
				_push_data			=	null;
				
				for(var key in chartData[i]) {
					_data_i	=	chartData[i];
					chartWithToolTips.push(parseFloat(_data_i[key]));
					if (key!=_row_first[_row_first_fk]){
						_data_i_keys	=	Object.keys(_data_i);
						_data_i_fk		=	_data_i_keys[0];
						_text	=	'<ul class="grafico-lista">';
						_text	+=	'	<li><strong>' + key + '</strong></li>';
						_data_i[key]	=	Number(_data_i[key]).toFixed(2)
						_data_i[_data_i_fk]	=	Number(_data_i[_data_i_fk]).toFixed(2);
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
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
									_text	+=	' meses';
								else
									_text	+=	' dias';
								
								_text	+=	'</li>';									
								break;
							case 'imc-edad':
								_text	+=	'<li>Edad: ' + _data_i[_data_i_fk];
								
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
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
								if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
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

				_text		=	'';
				_push_data	=	null;

				if(_hasHistorialDataRow){
					_chartData_i_keys	=	Object.keys(chartData[i]);
					_chartData_i_fk		=	_chartData_i_keys[0];
					_elem	=	Number(chartData[i][_chartData_i_fk]);
					
					switch(indicador){
						case 'estatura-peso':
							_push_data	=	_elem >= _hrow.estatura? _hrow.peso : null;
							if(_push_data){
								_text	+=	'	<li>Peso: ' + _hrow.peso + ' kg';
								_text	+=	' | ';
								_text	+=	'Estatura: ' + _hrow.estatura + ' (cm)</li>';
							}
							break;
						case 'estatura-edad':
							if(this.valoracion.metodo_valoracion=='cdc' || _hrow.edad>5){
								_push_data	=	_elem>=_hrow.meses? _hrow.estatura : null;
							}
							else{
								_push_data	=	_elem>=_hrow.dias? _hrow.estatura : null;
							}
							if(_push_data){
								_text	+=	'	<li>Edad: ';
								if(this.valoracion.metodo_valoracion=='cdc' || _hrow.edad>5)
									_text	+=	_hrow.meses + ' meses';
								else
									_text	+=	_hrow.dias + ' dias';
								
								_text	+=	' | ';
								_text	+=	'Estatura: ' + _hrow.estatura + ' (cm)</li>';					
							}
							break;
						case 'imc-edad':
							if(this.valoracion.metodo_valoracion=='cdc' || _hrow.edad>5){
								_push_data	=	_elem >= _hrow.meses ? _hrow.imc : null;
							}
							else{
								_push_data	=	_elem >= _hrow.dias ? _hrow.imc : null;
							}
							if(_push_data){
								_text	+=	'	<li>Edad: ';
								if(this.valoracion.metodo_valoracion=='cdc' || _hrow.edad>5)
									_text	+=	_hrow.meses + ' meses';
								else
									_text	+=	_hrow.dias + ' dias';

								_text	+=	' | ';
								_text	+=	'Imc: ' + _hrow.imc + ' </li>';					
							}							
							break;
						case 'peso-edad':
							if(this.valoracion.metodo_valoracion=='cdc' || _hrow.edad>5){
								_push_data	=	_elem >= _hrow.meses ? _hrow.peso : null;
							}
							else{
								_push_data	=	_elem >= _hrow.dias ? _hrow.peso : null;
							}							
							if(_push_data){
								_text	+=	'	<li>Peso: ' + _hrow.peso + ' kg';
								_text	+=	' | ';
								_text	+=	'Edad: ';
								if(this.valoracion.metodo_valoracion=='cdc' || _hrow.edad>5)
									_text	+=	_hrow.meses + ' meses';
								else
									_text	+=	_hrow.dias + ' días';
								_text	+=	'</li>';								
							}
							break;
					}
					if(_text){
						_text	=	'	<li><strong>Paciente</strong></li>' + _text;
						_text	+=	'	<li>Fecha:' + _hrow.fecha + '</li>';
						_text	=	'<ul class="grafico-lista">' + _text + '</ul>';
						if(data_historial.length>0){
							_hrow	=	this.helpers.clone(	data_historial[0] );
							_hasHistorialDataRow	=	true;
							data_historial.shift();
						}else
							_hasHistorialDataRow	=	false;
					}
				}
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
			args['title']		=	_label['title'];
			args['x']			=	x;
			args['y']			=	y;
			args['label_x']		=	_label['x'];
			args['label_y']		=	_label['y'];
			args['hAxis_min']	=	_min_hAxis;
			args['hAxis_max']	=	_max_hAxis;
			args['hAxis_value']	=	_value;
			args['vAxis_min']	=	_min_vAxis;
			args['vAxis_max']	=	_max_vAxis;
			args['vAxis_value']	=	_row_first[_row_first_sk];
			args['width']		=	this.historialParentWidth;
			options	=	this._getOptionsGraphChildren( args );
			config	=	new LineChartConfig('title ' + toGraph, options, columns);
			item	=	{'data':data, 'config': config, 'elementId':'element_children_' + indicador, 'key': 'container_children_' + indicador, 'class':indicador=='estatura-edad'? 'active':''};
			items.push(item);
		}
}
catch(err) {
	console.log( 'E:_graficarHistorialChildren(' + err.message + ')' );
}
		this.grafico_children_indicator	=	indicatorsMenuItem;
		this.grafico_children_items		=	items;
		this.tagBody.classList.add('grafico-children-selected-estatura-edad');
		this.graficandoHistorialChildren	=	false;
		
	}
	_getLabelForGraphic(indicador){
		var _label	=	{};
		switch(indicador){
			case 'estatura-peso':
				_label['x']	=	'Estatura (cm)';
				_label['y']	=	'Peso (Kg)';
				_label['title']	=	'Peso para Estatura';
				break;
			case 'estatura-edad':					
				_label['x']		=	'Edad (días)';
				if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
					_label['x']		=	'Edad (Meses)';
				
				_label['y']	=	'Estatura (cm)';
				_label['title']	=	'Estatura para Edad';
				
				break;
			case 'imc-edad':
				_label['x']		=	'Edad';						
				if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
					_label['x']		=	'Edad (Meses)';

				_label['y']	=	'IMC';
				_label['title']	=	'IMC para Edad';
				break;
			case 'peso-edad':
				_label['x']		=	'Edad (días)';
				if(this.valoracion.metodo_valoracion=='cdc' || this.paciente.edad>5)
					_label['x']		=	'Edad (Meses)';

				_label['y']	=	'Peso (Kg)';
				_label['title']	=	'Peso para Edad';					
				break;
		}
		return _label;
	}

	_getFirstLastRow(chartData){
		var keys:any;
		var data:{ [id: string]: any; }	=	{};
		
		data['first']			=	chartData[0];
		data['last']			=	chartData[chartData.length-1];
		keys					=	Object.keys(data['first']);

		data['first']['value']	=	data['first'][keys[0]];/*	X, Age	*/
		data['first']['P10']	=	data['first'][keys[1]];/*	P10	*/
		data['first']['P25']	=	data['first'][keys[2]];/*	P25	*/
		data['first']['P50']	=	data['first'][keys[3]];/*	P50	*/
		data['first']['P75']	=	data['first'][keys[4]];/*	P75	*/
		data['first']['P90']	=	data['first'][keys[5]];/*	P90	*/

		data['last']['value']	=	data['last'][keys[0]];/*	X, Age	*/
		data['last']['P10']		=	data['last'][keys[1]];/*	P10	*/
		data['last']['P25']		=	data['last'][keys[2]];/*	P25	*/
		data['last']['P50']		=	data['last'][keys[3]];/*	P50	*/
		data['last']['P75']		=	data['last'][keys[4]];/*	P75	*/
		data['last']['P90']		=	data['last'][keys[5]];/*	P90	*/
		return data;		
	}	
	
	_getOptionsGraphChildren(args){
		args['title']			=	typeof args['title'] !== 'undefined' ?  args['title'] : '';
		args['x']				=	typeof args['x'] !== 'undefined' ?  args['x'] : '';
		args['y']				=	typeof args['y'] !== 'undefined' ?  args['y'] : '';
		args['label_x']			=	typeof args['label_x'] !== 'undefined' ?  args['label_x'] : '';
		args['label_y']			=	typeof args['label_y'] !== 'undefined' ?  args['label_y'] : '';
		args['hAxis_min']		=	typeof args['hAxis_min'] !== 'undefined' ?  args['hAxis_min'] : '';
		args['hAxis_max']		=	typeof args['hAxis_max'] !== 'undefined' ?  args['hAxis_max'] : '';
		args['hAxis_value']		=	typeof args['hAxis_value'] !== 'undefined' ?  args['hAxis_value'] : '';
		args['vAxis_min']		=	typeof args['vAxis_min'] !== 'undefined' ?  args['vAxis_min'] : '';
		args['vAxis_max']		=	typeof args['vAxis_max'] !== 'undefined' ?  args['vAxis_max'] : '';
		args['vAxis_value']		=	typeof args['vAxis_value'] !== 'undefined' ?  args['vAxis_value'] : '';
		args['legend_position']	=	typeof args['legend_position'] !== 'undefined' ?  args['legend_position'] : 'top';
		args['series_pointsize']=	typeof args['series_pointsize'] !== 'undefined' ?  args['series_pointsize'] : 10;

		var options = {
			width: args['width'],
			title: args['title'],
			legend: { position: args['legend_position'] },
			animation: {duration: 1000,	easing: 'out'},
			tooltip: {isHtml: true},
			titleTextStyle: {color: 'red',fontName: 'Verdana',fontSize: 14, bold: true, italic: false},
			chartArea: {width: '90%',height: '80%'},
			series: {5:{pointShape: 'circle', pointSize: args['series_pointsize']}},
			hAxis: {
				title: args['label_x'],
				viewWindow: { min: args['hAxis_min'], max: args['hAxis_max']},
				ticks: this._calcRange( args['hAxis_value'], args['x'], 14 )
			},
			vAxis: {
				title: args['label_y'],
				viewWindow: {min: args['vAxis_min'] ,max: args['vAxis_max']},
				ticks: this._calcRange( args['vAxis_value'], args['y'], 50 )
			},
			colors: ['#868684', '#90c445','#cc1f25', '#90c445','#868684', '#DAA520'],
			crosshair: {color: '#dadada',trigger: 'selection'},
		};	
		return options;
	}
	getOptionsGraphChildren(graph_title, x, y, x_label, y_label, _min_hAxis, _max_hAxis, _hAxis_value, _min_vAxis, _max_vAxis, _vAxis_value){
		var options = {
			width:this.withChildrenGraphic,
			title: graph_title,
			legend: { position: 'bottom' },
			animation: {
				duration: 1000,
				easing: 'out'
			},
			tooltip: {isHtml: true},
			titleTextStyle: {
				color: 'red',
				fontName: 'Verdana',
				fontSize: 14, 
				bold: true,   
				italic: false
			},
			series: {5:{pointShape: 'circle', pointSize: 10}},
			hAxis: {
				title: x_label,
				viewWindow: { min: _min_hAxis, max: _max_hAxis},
				ticks: this._calcRange( _hAxis_value, x, 14 )
			},
			vAxis: {
				title: y_label,
				viewWindow: {min: _min_vAxis ,max: _max_vAxis},
				ticks: this._calcRange( _vAxis_value, y, 50 )
			},
			chartArea: {width: '90%',height: '80%'},
			colors: ['#868684', '#90c445','#cc1f25', '#90c445','#868684', '#DAA520'],
			crosshair: {
				color: '#dadada',
				trigger: 'selection'
			}
		};	
		return options;
	}

	doZoom(){
		this.zoom	=	!this.zoom;
		this._graficarChildren(this.json[this.valoracion.metodo_valoracion]);
	}
	_calcRange(ini, periodicity, fractions){
		var range = new Array();
		range.push (Math.floor(ini));
		for (var i = 1; i <= fractions; i++){
			ini = parseInt(ini)+parseInt(periodicity); 
			range.push(ini);
		}
		return range;
	}

	calculateEdad( fecha_nac, fecha_consulta ){
		var _edad	=	0;
		var birthday = fecha_nac.split('/');
		var year	=	Number(birthday[2]);
		var month	=	Number(birthday[1]);
		var day		=	Number(birthday[0]);
		var fecha	=	new Date(year, month-1, day).getTime() / 1000;
		var timeDiff = Math.abs( Number(fecha_consulta)-Number(fecha) );
		_edad	=	((timeDiff / (3600 * 24)) / 365);
		var edadPaciente:number		=	Number( _edad );
		var edadPaciente_dias:number=	Math.round(edadPaciente*365.25);
		var edadPaciente_meses:number=	Math.round(edadPaciente*12);

		return {'edad': edadPaciente, 'dias': edadPaciente_dias, 'meses':edadPaciente_meses};		
	}

	graficoxSelected(header, event){
		try {
			this.cleanGraficoChildren();
			this.tagBody.classList.add('grafico-by-selected-' + header.id + '');
			document.getElementById(header.id).className = 'active';
			document.getElementById('container_' + header.id).className = 'active';
			this.showBoxIndicadorImcEdad	=	false;
			this.showBoxIndicadorPesoEdad	=	false;
			this.showBoxIndicadorPesoEstatura	=	false;
			this.grafico_children_indicator_current	=	header.id;
		}
		catch(err) {
				console.log( 'E:graficoxSelected(' + err.message + ')' );
		}
	}
	graficoChildrenxSelected(header, event){
		try {
			this.cleanGraficoChildrenHistorial();
			this.tagBody.classList.add('grafico-children-by-selected-' + header.id + '');
			document.getElementById(header.id).className = 'active';
			document.getElementById('container_' + header.id).className = 'active';
		}
		catch(err) {
				console.log( 'E:graficoChildrenxSelected(' + err.message + ')' );
		}
	}
	cleanGraficoChildren(){
		var indicadores	=	['estatura-edad', 'imc-edad', 'peso-edad', 'estatura-peso'];
		var indicador	=	'';
		try {
			for(var key in indicadores) {
				indicador	=	indicadores[key];
				this.tagBody.classList.remove('grafico-by-selected-' + indicador);
				if(document.getElementById('container_' + indicador) !== null)
					document.getElementById('container_' + indicador).className = '';
				
				if(document.getElementById(indicador) !== null)
					document.getElementById(indicador).className = '';
			}
		}
		catch(err) {
				console.log( 'E:cleanGraficoChildren(' + err.message + ')' );
		}
	}
	cleanGraficoChildrenHistorial(){
		var indicadores	=	['estatura-edad', 'imc-edad', 'peso-edad', 'estatura-peso'];
		var indicador	=	'';
		try {
			for(var key in indicadores) {
				indicador	=	indicadores[key];
				this.tagBody.classList.remove('grafico-children-by-selected-' + indicador);
				if(document.getElementById('container_children_' + indicador) !== null)
					document.getElementById('container_children_' + indicador).className = '';
				
				if(document.getElementById('children_' + indicador) !== null)
					document.getElementById('children_' + indicador).className = '';
			}
		}
		catch(err) {
				console.log( 'E:cleanGraficoChildrenHistorial(' + err.message + ')' );
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
		this.formControlDataService.addValoracionAntropometrica(data)
		.subscribe(
			 response  => {
						this.goTo(this.page);
						this.btnNavigation_pressed	=	false;
						},
			error =>  console.log(<any>error)
		);
	}

	changeMethod(){
		this.esAdulto	=	this.valoracion.metodo_valoracion=='adulto';
		this.esMenor	=	!this.esAdulto;
		this.displayoptionsForAdulto	=	this.esAdulto;
		var valorarAdulto	=	this.valoracion.metodo_valoracion=='adulto';
		this.displayoptionsForAdulto	=	valorarAdulto;
		this.displayGraphicChildren		=	!valorarAdulto;
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
				setTimeout(() => {
						  this.graficarEnModal();
					    }, 1000);
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
				break;
			case 'musculo':
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
		this.formControlDataService.saveDatosGrasa(data)
		.subscribe(
			 response  => {
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
		this.formControlDataService.saveDatosMusculo(data)
		.subscribe(
			 response  => {
						this.detalleMusculo.id	=	response['id'];
						},
			error =>  console.log(<any>error)
		);
	}
	calcularMusculoSegmentado(){
		var valor	=	Number(this.detalleMusculo.tronco) + Number(this.detalleMusculo.pierna_derecha) + Number(this.detalleMusculo.pierna_izquierda) + Number(this.detalleMusculo.brazo_derecho) + Number(this.detalleMusculo.brazo_izquierdo);
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
			if(estructura_osea>10.4){
				valor	=	'PEQUEÑA';
				pesoIdeal	-=	valor_porcentaje_10;
			}else{
				if(estructura_osea>9.6)
					valor	=	'MEDIANA';
				else{
					valor	=	'GRANDE';
					pesoIdeal	+=	valor_porcentaje_10;
				}
			}
		}else{
			if(estructura_osea>11){
				valor	=	'PEQUEÑA';
				pesoIdeal	-=	valor_porcentaje_10;
			}else{
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
	_analisis(){
		this._calcularImc();
/*	peso, estatura	*/
		this._calcularPesoIdeal();
		this._calcularEstaturaIdeal();
/*	peso, pesoIdeal	*/
		this._calcularPesoIdealAjustado();
		this._calcularPorcentajePeso();
		this._calcularGradoSobrepeso();
/*	peso, pesoIdealAjustado	*/
		this._calcularDiferenciaPeso();
		this._calcularAdecuacion();
/*	circunferencia_cintura, circunferencia_cadera	*/
		this._calcularRelacionCinturaCadera();
/*	peso, imc	*/
		this._calcularPesoMetaMaximo();
		this._calcularPesoMetaMinimo();
	}
	_calcularImc(){
		if( !this.allowCalculate || !this.valoracion.peso || !this.valoracion.estatura ){
			this.analisis_imc	=	0;
			return '';
		}
/*
 *	=	PESO/(ESTATURA*ESTATURA)
 */
			this.analisis.imc	=	Number(this.valoracion.peso) / ( Number(this.valoracion.estatura) * Number(this.valoracion.estatura) );
			this.analisis_imc	=	this.analisis.imc;
	}
	_calcularPesoIdeal(){
		if( !this.allowCalculate || !this.valoracion.estatura ){
			this.analisis.pesoIdeal	=	0;
			return 0;
		}

		var esMasculino	=	this.paciente.genero=='M';
		if(this.displayGraphicChildren){
			try{
				var _info	=	this.infoIdeal[this.valoracion.metodo_valoracion]['peso-edad'];
				switch(this.valoracion.percentil_analisis){
					case '10':
						this.analisis.pesoIdeal	=	_info.P10;
						break;
					case '25':
						this.analisis.pesoIdeal	=	_info.P25;
						break;
					case '50':
						this.analisis.pesoIdeal	=	_info.P50;
						break;
					case '75':
						this.analisis.pesoIdeal	=	_info.P75;
						break;
					case '90':
						this.analisis.pesoIdeal	=	_info.P90;
						break;
				}
			}
			catch(err) {
				console.log( 'E:_calcularPesoIdeal(' + err.message + ')' );
				this.analisis.pesoIdeal	=	0;
			}
		}else{
/*
 *	=SI(SEXO="M";(ESTATURA*100-152)*2,72/2,5+47,7;(ESTATURA*100-152)*2,27/2,5+45,5)
 */
			var factor_1	=	45.5;
			var factor_2	=	2.27;
			if( esMasculino ){
				factor_1	=	47.7;
				factor_2	=	2.72;
			}
			var pesoIdeal			=	(Number(this.valoracion.estatura)*100-152)*factor_2/2.5+factor_1;
			this.analisis.pesoIdeal	=	this.restarSumarAlPesoIdeal( pesoIdeal, esMasculino );
		}
		return this.analisis.pesoIdeal;
	}
	_calcularEstaturaIdeal(){
		if(!this.allowCalculate)
			return 0;
		if(!this.valoracion.peso){
			this.analisis.estaturaIdeal	=	0;
			return 0;
		}
		var esMasculino	=	this.paciente.genero=='M';
		if(this.displayGraphicChildren){
			try{
				var _info	=	this.infoIdeal[this.valoracion.metodo_valoracion]['estatura-edad'];
				switch(this.valoracion.percentil_analisis){
					case '10':
						this.analisis.estaturaIdeal	=	_info.P10;
						break;
					case '25':
						this.analisis.estaturaIdeal	=	_info.P25;
						break;
					case '50':
						this.analisis.estaturaIdeal	=	_info.P50;
						break;
					case '75':
						this.analisis.estaturaIdeal	=	_info.P75;
						break;
					case '90':
						this.analisis.estaturaIdeal	=	_info.P90;
						break;
				}
			}
			catch(err) {
				console.log( 'E:_calcularEstaturaIdeal(' + err.message + ')' );
				this.analisis.estaturaIdeal	=	0;
			}
		}
		return this.analisis.estaturaIdeal;
	}
	_calcularPesoIdealAjustado(){
		if( !this.allowCalculate || !this.valoracion.peso || !this.valoracion.estatura ){
			this.analisis.pesoIdealAjustado	=	0;
			return 0;
		}
/*
 *	=(PESO-PESO_IDEAL)/(4)+(PESO_IDEAL)
 */
		this.analisis.pesoIdealAjustado	=	Number(this.valoracion.getPesoIdealAjustado(this.valoracion.peso, this.analisis.pesoIdeal));
		return this.analisis.pesoIdealAjustado;
	}
	_calcularDiferenciaPeso(){
		if( !this.allowCalculate || !this.valoracion.peso || !this.valoracion.estatura ){
			this.analisis.diferenciaPeso	=	0;
			return 0;
		}
/*
=PESO-PESO_IDEAL_AJUSTADO
*/
		this.analisis.diferenciaPeso	=	Number(this.valoracion.peso) - Number(this.analisis.pesoIdealAjustado);
		return this.analisis.diferenciaPeso;
	}
	_calcularAdecuacion(){
		if( !this.allowCalculate || !this.valoracion.peso || !this.valoracion.estatura ){
			this.model.adecuacion	=	0;
			return 0;
		}
/*
 *	=PESO/PESO_IDEAL_AJUSTADO
*/
		this.model.adecuacion	=	(Number(this.valoracion.peso)/this.analisis.pesoIdealAjustado) * 100;
		return this.model.adecuacion;
	}
	_calcularRelacionCinturaCadera(){
		if(!this.allowCalculate || !Number(this.valoracion.circunferencia_cintura) || !Number(this.valoracion.circunferencia_cadera)){
			this.model.relacionCinturaCadera	=	0;
			return 0;
		}
/*
 *	=CINTURA/CADERA
 */
		this.model.relacionCinturaCadera	=	Number(this.valoracion.circunferencia_cintura)/Number(this.valoracion.circunferencia_cadera);
		var perc	=	this.model.relacionCinturaCadera*100;
		return perc;
	}
	_calcularGradoSobrepeso(){
		if( !this.allowCalculate || !this.valoracion.peso || !this.valoracion.estatura ){
			this.analisis_gradoSobrepeso	=	'';
			return 0;
		}
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
			}
		}
		this.analisis_gradoSobrepeso	=	_print;
		return _print;
	}
	_calcularPorcentajePeso(){
		if( !this.allowCalculate || !this.valoracion.peso || !this.valoracion.estatura ){
			this.analisis.porcentajePeso	=	0;
			return 0;
		}
/*
104%	=PESO/PESO_IDEAL
Nl		=SI(PORCENTAJE_PESO<75%;"DN SEVERA";SI(PORCENTAJE_PESO<85%;"DN MOD";SI(PORCENTAJE_PESO<90%;"DN LEVE";SI(
*/
		this.analisis.porcentajePeso	=	(Number(this.valoracion.peso)/this.analisis.pesoIdeal) * 100;
 		return this.analisis.porcentajePeso;
	}
	_calcularPesoMetaMaximo(){
		if( !this.allowCalculate || !this.valoracion.peso || !this.valoracion.estatura ){
			this.analisis.pesoMetaMaximo	=	0;
			return 0;
		}
/*
80,1025		=(PESO*25)/IMC
*/
		this.analisis.pesoMetaMaximo	=	(Number(this.valoracion.peso)*25)/this.analisis.imc;
		if(isNaN(this.analisis.pesoMetaMaximo))
			this.analisis.pesoMetaMaximo	=	0;
		return this.analisis.pesoMetaMaximo;
	}
	_calcularPesoMetaMinimo(){
		if( !this.allowCalculate || !this.valoracion.peso || !this.valoracion.estatura ){
			this.analisis.pesoMetaMinimo	=	0;
			return 0;
		}
/*
 *	=(PESO*18,9)/IMC
 */
		this.analisis.pesoMetaMinimo	=	(Number(this.valoracion.peso)*18.9)/this.analisis.imc;
		if(isNaN(this.analisis.pesoMetaMinimo))
			this.analisis.pesoMetaMinimo	=	0;
		return this.analisis.pesoMetaMinimo;
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

		var edad	=	this.paciente.edad;
		var esMasculino	=	this.paciente.genero=='M';
/*
	D= Densidad del cuerpo; 
	L= Suma de pliegues cutáneos
*/
		var D	=	0;
		var L	=	Number(this.grasa.pliegue_tricipital) + Number(this.grasa.pliegue_bicipital) + Number(this.grasa.pliegue_subescapular) + Number(this.grasa.pliegue_supraliaco);		
			L	=	Math.log(L);
			
			if(isNaN(L))
				L	=	0;	
	
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
/*	Porcentage de grasa (%) = (495 / D) – 450	*/
		this.valorGrasaPliegues	=	Math.round((495/D)-450);
		return this.valorGrasaPliegues;
	}

	saveForm(){
		this.formControlDataService.setFormControlData(this.model);
		this.model.getFormValoracionAntropometrica().set(this.valoracion);
		if(this.infoEdited())
			this.createValoracionAntropometrica(this.valoracion);
		else
			this.goTo(this.page);		
	}

	get	imc(){
		if(!this.allowCalculate)
			return '';

		if(!this.valoracion.peso)
			return '';
		
		if(this.displayGraphicChildren)
			return '';
/*
=PESO/(ESTATURA*ESTATURA)

=SI(B10<18,5;"BAJO PESO";SI(B10<24,9;"NORMAL";SI(B10<30;"SOBREPESO 1";SI(B10<40;"SOBREPESO 2";"SOBREPESO 3"))))

*/
		this.analisis.imc	=	Number(this.valoracion.peso) / ( Number(this.valoracion.estatura) * Number(this.valoracion.estatura) );
		
		var _print	=	'';
		if(this.analisis.imc<18.51)
			_print	=	'BAJO PESO';
		else{
			if(this.analisis.imc<24.91)
				_print	=	'NORMAL';
			else{
				if(this.analisis.imc<30)
					_print	=	'SOBREPESO 1';
				else{
					if(this.analisis.imc<40)
						_print	=	'SOBREPESO 2';
					else
						_print	=	'SOBREPESO 3';
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
		var factor_1	=	45.5;
		var factor_2	=	2.27;
		if( esMasculino ){
			factor_1	=	47.7;
			factor_2	=	2.72;
		}
		var pesoIdeal			=	(Number(this.valoracion.estatura)*100-152)*factor_2/2.5+factor_1;
		this.analisis.pesoIdeal	=	this.restarSumarAlPesoIdeal( pesoIdeal, esMasculino );
		
		return this.analisis.pesoIdeal;
	}
	get pesoIdealAjustado(){
		if(!this.allowCalculate)
			return 0;
		if(!this.valoracion.peso)
			return 0;		

		this.analisis.pesoIdealAjustado	=	(Number(this.valoracion.peso)-this.analisis.pesoIdeal)/(4)+(this.analisis.pesoIdeal);
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
		return perc;
	}
	get gradoSobrepeso(){
		if(!this.allowCalculate)
			return 0;
		if(!this.valoracion.peso)
			return '';
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
			}
		}		
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
	}
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
}
