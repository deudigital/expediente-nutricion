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
  
	constructor(private router: Router, private formControlDataService: FormControlDataService, private fileService: FileService) {
		this.model		=	formControlDataService.getFormControlData();
		this.helpers	=	this.model.getHelpers();
		/*this.paciente	=	this.model.getFormPaciente();
		console.log(this.paciente);*/
		
		var mng	=	this.model.getManejadorDatos();
		mng.setMenuPacienteStatus(false);
		this.nuevaConsulta	=	false;
		if(mng.operacion=='nueva-consulta')
			this.nuevaConsulta	=	true;			
		
		this.disableButtonHistorial	=	true;
		this.loading_data_form	=	true;
		this.getDatosDeConsulta(this.model.consulta.id);
    }
	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		/*this.aPendientes		=	[];
		this.aPendientess		=	[];*/
		this.countPendientes	=	0;
	}
	ngOnDestroy() {
		if(!this.btnNavigation_pressed)
			this.saveForm();
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
		
		if(this.nuevaConsulta && !this.valoracion.id){
			/*this.valoracion.estatura				=	Number(this.valoracion.lastEstatura);
			this.valoracion.circunferencia_muneca	=	Number(this.valoracion.lastCircunferencia_muneca);*/
			this.valoracion.estatura				=	String(this.valoracion.lastEstatura);
			this.valoracion.circunferencia_muneca	=	String(this.valoracion.lastCircunferencia_muneca);
		}		
	}
	infoEdited(){
		/*console.log('infoEdited');
		console.log('this.valoracion.id: ' + this.valoracion.id);
		console.log('this.aPendientes.length: ' + this.aPendientes.length);
		console.log('this.aPendientess.length: ' + this.aPendientess.length);*/
		//if(!this.valoracion.id && this.aPendientess.length>0){
		if(!this.valoracion.id && this.countPendientes>0){
			return true;
		}
		/*console.log(this.oValoracion.estatura + '!==' + Number(this.valoracion.estatura));
		console.log(this.oValoracion.circunferencia_muneca + '!==' + Number(this.valoracion.circunferencia_muneca));
		console.log(this.oValoracion.peso	 + '!==' + Number(this.valoracion.peso));
		console.log(this.oValoracion.grasa	 + '!==' + Number(this.valoracion.grasa));
		console.log(this.oValoracion.musculo + '!==' + Number(this.valoracion.musculo));
		console.log(this.oValoracion.agua	 + '!==' + Number(this.valoracion.agua));
		console.log(this.oValoracion.grasa_viceral + '!==' + Number(this.valoracion.grasa_viceral));
		console.log(this.oValoracion.hueso	 + '!==' + Number(this.valoracion.hueso));
		console.log(this.oValoracion.edad_metabolica	 + '!==' + Number(this.valoracion.edad_metabolica));
		console.log(this.oValoracion.circunferencia_cintura + '!==' + Number(this.valoracion.circunferencia_cintura));
		console.log(this.oValoracion.circunferencia_cadera + '!==' + Number(this.valoracion.circunferencia_cadera));*/
		/*return 	(
			this.oValoracion.estatura				!==	Number(this.valoracion.estatura) || 
			this.oValoracion.circunferencia_muneca	!==	Number(this.valoracion.circunferencia_muneca) || 
			this.oValoracion.peso					!==	Number(this.valoracion.peso) || 
			this.oValoracion.grasa					!==	Number(isNaN(this.valoracion.grasa) ? 0:this.valoracion.grasa) || 
			this.oValoracion.musculo				!==	Number(this.valoracion.musculo) || 
			this.oValoracion.agua					!==	Number(this.valoracion.agua) || 
			this.oValoracion.grasa_viceral			!==	Number(this.valoracion.grasa_viceral) || 
			this.oValoracion.hueso					!==	Number(this.valoracion.hueso) || 
			this.oValoracion.edad_metabolica		!==	Number(this.valoracion.edad_metabolica) || 
			this.oValoracion.circunferencia_cintura	!==	Number(this.valoracion.circunferencia_cintura) || 
			this.oValoracion.circunferencia_cadera	!==	Number(this.valoracion.circunferencia_cadera)
		);*/
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
			Number(this.oValoracion.circunferencia_cadera)	!==	Number(this.valoracion.circunferencia_cadera)
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
				
				//console.log(this.paciente);
				//console.log(this.grasa);
				this.setInfoInit();
				this.loading_data_form	=	false;
				this.getHistorial();
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
						/*console.log('<-- cRud Historial VA');console.log(response);*/
						this.historial	=	response;
						console.log(this.historial.length);
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
/*	createValoracionAntropometrica(valoracionAntropometrica) {
		this.tagBody.classList.add('sending');
		this.formControlDataService.addValoracionAntropometrica(valoracionAntropometrica)
		.subscribe(
			 response  => {
						console.log('<!--Crud va');
						console.log(response);
						this.tagBody.classList.remove('sending');
						this.goTo(this.page);
						},
			error =>  console.log(<any>error)
		);
	}*/
	createValoracionAntropometrica(valoracionAntropometrica){
		var data	=	valoracionAntropometrica;
		
		console.log('this.countPendientes: ' + this.countPendientes);
		//if(!this.valoracion.id && this.aPendientes.length>0){
		if(!this.valoracion.id && this.countPendientes>0){
			this.aPendientess['va']		=	valoracionAntropometrica;
			//this.aPendientess.push(valoracionAntropometrica);
			data	=	this.aPendientess;
		}
		console.log('-->Crud va');
		console.log(data);
		this.formControlDataService.addValoracionAntropometrica(data)
		.subscribe(
			 response  => {
						console.log('<!--Crud va');
						console.log(response);
						this.tagBody.classList.remove('sending');
						this.goTo(this.page);
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
					console.log('this.valoracion.grasa-> ' + this.valoracion.grasa);
					console.log('this.valorGrasaPliegues-> ' + this.valorGrasaPliegues);
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
			console.log('saveInfoGrasa');
			//console.log(this.aPendientess);
			return ;
		}

		console.log('-->Crud Grasa');	console.log(data);
		this.formControlDataService.saveDatosGrasa(data)
		.subscribe(
			 response  => {
						console.log('<!--Crud Grasa');
						console.log(response);
						this.grasa.id	=	response['id'];
						},
			error =>  console.log(<any>error)
		);
	}
	saveInfoMusculo(data){
		if(!this.valoracion.id){
			this.aPendientess['detalle_musculo']	=	data;
			this.countPendientes++;
			console.log('saveInfoMusculo');
			//console.log(this.aPendientess);
			return ;
		}
		console.log('-->Crud Musculo...');	console.log(data);
		this.formControlDataService.saveDatosMusculo(data)
		.subscribe(
			 response  => {
						console.log('<!--Crud Musculo');
						console.log(response);
						this.detalleMusculo.id	=	response['id'];
						this.tagBody.classList.remove('sending');
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
	restarSumarAlPesoIdeal(pesoIdeal, esMasculino){//console.log('restarSumarAlPesoIdeal: ' + pesoIdeal);
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
		}//console.log('valor: ' + valor + ', pesoIdeal: ' + pesoIdeal);
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
		/*console.log('(495' + '/' + D + ')-450');*/
		
		
		
		//this.grasa.valorGrasaPliegues	=	(495/D)-450;
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
		this.btnNavigation_pressed	=	true;		
		if(this.nuevaConsulta){
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
