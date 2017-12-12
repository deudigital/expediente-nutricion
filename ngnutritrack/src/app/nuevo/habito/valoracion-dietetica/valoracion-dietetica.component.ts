import { Component, OnInit } from '@angular/core';

import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-valoracion-dietetica',
  templateUrl: './valoracion-dietetica.component.html',
  styles: []
})
export class ValoracionDieteticaComponent implements OnInit {
	menus:{ [id: string]: any; } = {'0':''}; 
	asignacionPorciones: {};
	model:any;
	paciente:any;
	showmodal:boolean=false;
	showmodalgraficos:boolean=false;
	inputModal:any;

	displayModalPorciones:boolean=false;
	label_modal_porciones:string='';

	showTabGrafico:boolean=false;
	showTabDatos:boolean=true;
	tab_class_datos:string='';
	tab_class_graficos:string='';
	
	porciones_leche_descremada:number=0;
	porciones_leche_2:number=0;
	porciones_leche_entera:number=0;
	porciones_vegetales:number=0;
	porciones_frutas:number=0;
	porciones_harinas:number=0;
	porciones_carne_magra:number=0;
	porciones_carne_intermedia:number=0;
	porciones_carne_grasa:number=0;
	porciones_azucares:number=0;
	porciones_grasas:number=0;
	porciones_vaso_agua:number=0;

	porcentaje_carbohidratos:number;
	porcentaje_proteinas:number;
	porcentaje_grasas:number;
	porcentaje_kcal:number;
	currentTiempoComida:number;

	arrayMenuCurrent:{ [id: string]: any; } = {};
	/*arrayMenuDesayuno:{ [id: string]: any; } = {'0':''}; */
	arrayMenuDesayuno:{ [id: string]: any; } = {}; 
	arrayMenuMediaManana:{ [id: string]: any; } = {}; 
	arrayMenuAlmuerzo:{ [id: string]: any; } = {}; 
	arrayMenuMediaTarde:{ [id: string]: any; } = {}; 
	arrayMenuCena:{ [id: string]: any; } = {}; 
	arrayMenuCoicionNocturna:{ [id: string]: any; } = {};
	arrayMenuAgua:{ [id: string]: any; } = {};
	arrayMenuGaseosa:{ [id: string]: any; } = {};
	arrayJugosEmpacados:{ [id: string]: any; } = {};
	arrayMenuComidasRapidas:{ [id: string]: any; } = {};
	arrayMenuAlimentosEmpacados:{ [id: string]: any; } = {};
	arrayMenuEmbutidos:{ [id: string]: any; } = {};

	alimentos:Object[]=[];
	tiempos:Object[]=[];
	//data:Object[]=[];
	data:{ [id: string]: any; } = {'0':''}; 
	oData:{ [id: string]: any; } = {'0':''};
	
	tagBody:any;
	oMenu:{ [id: string]: any; } = {'0':''};
	
	notas:any;
	constructor(private formControlDataService: FormControlDataService) {
		this.model	=	formControlDataService.getFormControlData();
		this.paciente	=	this.model.getFormPaciente();
		this.notas	=	this.paciente.notas_valoracion_dietetica;
	}
	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		this.tagBody.classList.add('menu-parent-habito');
		this.initAlimentos();
	}
	ngOnDestroy(){
		this.tagBody.classList.remove('menu-parent-habito');
		this.save();
	}
	
	initAlimentos(){
		this.alimentos['0']	=	'';
		this.alimentos['1']	=	'Leche Descremada';
		this.alimentos['2']	=	'Leche 2%';
		this.alimentos['3']	=	'Leche Entera';
		this.alimentos['4']	=	'Vegetales';
		this.alimentos['5']	=	'Frutas';
		this.alimentos['6']	=	'Harinas';
		this.alimentos['7']	=	'Carne Magra';
		this.alimentos['8']	=	'Carne Intermedia';
		this.alimentos['9']	=	'Carne Grasa';
		this.alimentos['10']=	'Azucares';
		this.alimentos['11']=	'Grasas';
		this.alimentos['12']=	'Vasos de Agua';

		this.tiempos['']	=	'';
		this.tiempos['1']	=	'Desayuno';
		this.tiempos['2']	=	'Media Mañana';
		this.tiempos['3']	=	'Almuerzo';
		this.tiempos['4']	=	'Media Tarde';
		this.tiempos['5']	=	'Cena';
		this.tiempos['6']	=	'Coición Nocturna';
		this.tiempos['7']	=	'Agua';
		this.tiempos['8']	=	'Gaseosas';
		this.tiempos['9']	=	'Jugos Empacados';
		this.tiempos['10']	=	'Comidas R&aacute;pidas';
		this.tiempos['11']	=	'Alimentos Empacados';
		this.tiempos['12']	=	'Embutidos';
		
		this.menus	=	this.formControlDataService.getFormControlData().valoracionDietetica;
		console.log(this.menus);
		this.setInfoInit();
	}
	setupMenu(){
		this.menus['0']	=	'';
		this.menus['1']	=	this.copy(this.arrayMenuDesayuno);
		this.menus['2']	=	this.copy(this.arrayMenuMediaManana);
		this.menus['3']	=	this.copy(this.arrayMenuAlmuerzo);
		this.menus['4']	=	this.copy(this.arrayMenuMediaTarde);
		this.menus['5']	=	this.copy(this.arrayMenuCena);
		this.menus['6']	=	this.copy(this.arrayMenuCoicionNocturna);
		this.menus['7']	=	this.copy(this.arrayMenuAgua);
		this.menus['8']	=	this.copy(this.arrayMenuGaseosa);
		this.menus['9']	=	this.copy(this.arrayJugosEmpacados);
		this.menus['10']	=	this.copy(this.arrayMenuComidasRapidas);
		this.menus['11']	=	this.copy(this.arrayMenuAlimentosEmpacados);
		this.menus['12']	=	this.copy(this.arrayMenuEmbutidos);
	}
	
	setInfoInit(){	
		var aMenu	=	{};
		this.oMenu	=	{};
		if(this.menus.length==0)
			this.setupMenu();

		for(var i in this.menus){
			var item	=	this.menus[i];
			var tiempo_de_comida	=	item.categoria_valoracion_dietetica_id;
			switch(tiempo_de_comida){
				case 1:
					aMenu	=	this.arrayMenuDesayuno;
					break;
				case 2:
					aMenu	=	this.arrayMenuMediaManana;
					break;
				case 3:
					aMenu	=	this.arrayMenuAlmuerzo;
					break;
				case 4:
					aMenu	=	this.arrayMenuMediaTarde;
					break;
				case 5:
					aMenu	=	this.arrayMenuCena;
					break;
				case 6:
					aMenu	=	this.arrayMenuCoicionNocturna;
					break;
				case 7:
					aMenu	=	this.arrayMenuAgua;
					break;
				case 8:
					aMenu	=	this.arrayMenuGaseosa;
					break;
				case 9:
					aMenu	=	this.arrayJugosEmpacados;
					break;
				case 10:
					aMenu	=	this.arrayMenuComidasRapidas;
					break;
				case 11:
					aMenu	=	this.arrayMenuAlimentosEmpacados;
					break;
				case 12:
					aMenu	=	this.arrayMenuEmbutidos;
					break;
			}

			aMenu['_' + item.grupo_alimento_nutricionista_id]			=	item.porciones;
			this.concatenar(aMenu);
		}
		this.oMenu['0']	=	'';
		this.oMenu['1']	=	this.copy(this.arrayMenuDesayuno);
		this.oMenu['2']	=	this.copy(this.arrayMenuMediaManana);
		this.oMenu['3']	=	this.copy(this.arrayMenuAlmuerzo);
		this.oMenu['4']	=	this.copy(this.arrayMenuMediaTarde);
		this.oMenu['5']	=	this.copy(this.arrayMenuCena);
		this.oMenu['6']	=	this.copy(this.arrayMenuCoicionNocturna);
		this.oMenu['7']	=	this.copy(this.arrayMenuAgua);
		this.oMenu['8']	=	this.copy(this.arrayMenuGaseosa);
		this.oMenu['9']	=	this.copy(this.arrayJugosEmpacados);
		this.oMenu['10']	=	this.copy(this.arrayMenuComidasRapidas);
		this.oMenu['11']	=	this.copy(this.arrayMenuAlimentosEmpacados);
		this.oMenu['12']	=	this.copy(this.arrayMenuEmbutidos);
	}
	copy(data){
		var myArray={};
		for(var i in data){
			myArray[i]	=	data[i];
		}
		return myArray;
	}
	infoEdited(){		
		var $notasEdited		=	this.infoEditedNotas();
		var $porcionesEdited	=	this.infoEditedPorciones();		
		//var result	=	this.infoEditedNotas() || this.infoEditedPorciones();
		var result	=	$notasEdited ||  $porcionesEdited;
		return result;
	}
	infoEditedNotas(){
		var notas_changed	=	false;
		/*this.data['notas']	=	[];
		this.data['items']	=	[];*/
		if(this.notas	!==	this.paciente.notas_valoracion_dietetica){
			notas_changed	=	true;
			this.data['notas']	=	[];
			this.data['notas'][0]	=	this.paciente.notas_valoracion_dietetica;
		}
		return notas_changed;
	}
	infoEditedPorciones(){
		if(this.chechChangesItems()){		
			this.asignacionPorciones = [
				{'categoria_valoracion_dietetica_id':'1', 'porciones': this.arrayMenuDesayuno},
				{'categoria_valoracion_dietetica_id':'2', 'porciones': this.arrayMenuMediaManana},
				{'categoria_valoracion_dietetica_id':'3', 'porciones': this.arrayMenuAlmuerzo},
				{'categoria_valoracion_dietetica_id':'4', 'porciones': this.arrayMenuMediaTarde},
				{'categoria_valoracion_dietetica_id':'5', 'porciones': this.arrayMenuCena},
				{'categoria_valoracion_dietetica_id':'6', 'porciones': this.arrayMenuCoicionNocturna},
				{'categoria_valoracion_dietetica_id':'7', 'porciones': this.arrayMenuAgua},
				{'categoria_valoracion_dietetica_id':'8', 'porciones': this.arrayMenuGaseosa},
				{'categoria_valoracion_dietetica_id':'9', 'porciones': this.arrayJugosEmpacados},
				{'categoria_valoracion_dietetica_id':'10', 'porciones': this.arrayMenuComidasRapidas},
				{'categoria_valoracion_dietetica_id':'11', 'porciones': this.arrayMenuAlimentosEmpacados},
				{'categoria_valoracion_dietetica_id':'12', 'porciones': this.arrayMenuEmbutidos},
			];
			this.data['items']		=	this.asignacionPorciones;
			return 	true;
		}
		return false;		
	}
	chechChangesItems(){
		var obj2	=	{};
		for(var i in this.oMenu){
			if(Number(i)>0){
				var oItem	=	this.oMenu[i];
				switch(i.toString()){
					case '1':
						obj2	=	this.arrayMenuDesayuno;
						break;
					case '2':
						obj2	=	this.arrayMenuMediaManana;
						break;
					case '3':
						obj2	=	this.arrayMenuAlmuerzo;
						break;
					case '4':
						obj2	=	this.arrayMenuMediaTarde;
						break;
					case '5':
						obj2	=	this.arrayMenuCena;
						break;
					case '6':
						obj2	=	this.arrayMenuCoicionNocturna;
						break;
					case '7':
						obj2	=	this.arrayMenuAgua;
						break;
					case '8':
						obj2	=	this.arrayMenuGaseosa;
						break;
					case '9':
						obj2	=	this.arrayJugosEmpacados;
						break;
					case '10':
						obj2	=	this.arrayMenuComidasRapidas;
						break;
					case '11':
						obj2	=	this.arrayMenuAlimentosEmpacados;
						break;
					case '12':
						obj2	=	this.arrayMenuEmbutidos;
						break;
				}
				if(JSON.stringify(oItem) !== JSON.stringify(obj2)){
					return true;
				}
			}
		}
		return false;
	}
	save(){
		this.data	=	{'0':''};
		this.data['paciente_id']	=	this.paciente.id;
		if(this.infoEdited()){
			console.log('CAMBIOS');
			this.updateItems();
			this.data['0']				=	'';
			this.saveInfo(this.data);
			
		}
	}
	saveInfo(data){
		this.tagBody.classList.add('sending');
		this.formControlDataService.store('habitos_valoracion_dietetica', data)
		.subscribe(
			 response  => {
						console.log('saveInfo:receiving...');
						console.log(response);
						this.tagBody.classList.remove('sending');
						},
			error =>  console.log(<any>error)
		);
	}
	updateItems(){
		this.menus		=	{};
		this.menus[0]	=	'';
		var id_consulta	=	this.model.getFormConsulta().id;
		this.menus		=	this.prepare(id_consulta)
		this.model.setValoracionDietetica(this.asignacionPorciones);
		this.formControlDataService.setFormControlData(this.model);		
	}
	prepare(id_consulta){
		var myArray=[];
		var menus	=	[];
/*
		menus[0]	=	this.arrayMenuDesayuno;
		menus[1]	=	this.arrayMenuMediaManana;
		menus[2]	=	this.arrayMenuAlmuerzo;
		menus[3]	=	this.arrayMenuMediaTarde;
		menus[4]	=	this.arrayMenuCena;
		menus[5]	=	this.arrayMenuCoicionNocturna;
		menus[6]	=	this.arrayMenuAgua;
		menus[7]	=	this.arrayMenuGaseosa;
		menus[8]	=	this.arrayJugosEmpacados;
		menus[9]	=	this.arrayMenuComidasRapidas;
		menus[10]	=	this.arrayMenuAlimentosEmpacados;
		menus[11]	=	this.arrayMenuEmbutidos;
*/
		menus['0']	=	this.arrayMenuDesayuno;
		menus['1']	=	this.arrayMenuMediaManana;
		menus['2']	=	this.arrayMenuAlmuerzo;
		menus['3']	=	this.arrayMenuMediaTarde;
		menus['4']	=	this.arrayMenuCena;
		menus['5']	=	this.arrayMenuCoicionNocturna;
		menus['6']	=	this.arrayMenuAgua;
		menus['7']	=	this.arrayMenuGaseosa;
		menus['8']	=	this.arrayJugosEmpacados;
		menus['9']	=	this.arrayMenuComidasRapidas;
		menus['10']	=	this.arrayMenuAlimentosEmpacados;
		menus['11']	=	this.arrayMenuEmbutidos;

		//myArray[0]	=	'';
		var j=0;
		for(var a in menus){
			var data	=	menus[a];
			var tiempoComida	=	Number(a) + 1;
			for(var i in data){
				var grupoAlimentoNutricionista	=	Number(i);
				if(Number(i)>0){
					myArray[j]	=	{'grupo_alimento_nutricionista_id': grupoAlimentoNutricionista, 'porciones': data[grupoAlimentoNutricionista], 'categoria_valoracion_dietetica_id': tiempoComida}
					j++;
				}
			}
		}
		return myArray;
	}
	
	showModalPorciones(tiempoComida, nameTiempoComida){
	   this.inputModal	=	'';
	   this.currentTiempoComida	=	tiempoComida;
	   var aMenu	=	{};
	   switch(tiempoComida){
			case 1:
				aMenu	=	this.arrayMenuDesayuno;
				break;
			case 2:
				aMenu	=	this.arrayMenuMediaManana;
				break;
			case 3:
				aMenu	=	this.arrayMenuAlmuerzo;
				break;
			case 4:
				aMenu	=	this.arrayMenuMediaTarde;
				break;
			case 5:
				aMenu	=	this.arrayMenuCena;
				break;
			case 6:
				aMenu	=	this.arrayMenuCoicionNocturna;
				break;
			case 7:
				aMenu	=	this.arrayMenuAgua;
				break;
			case 8:
				aMenu	=	this.arrayMenuGaseosa;
				break;
			case 9:
				aMenu	=	this.arrayJugosEmpacados;
				break;
			case 10:
				aMenu	=	this.arrayMenuComidasRapidas;
				break;
			case 11:
				aMenu	=	this.arrayMenuAlimentosEmpacados;
				break;
			case 12:
				aMenu	=	this.arrayMenuEmbutidos;
				break;
	   }
	   this.porciones_leche_descremada	=	aMenu['_1'];
	   this.porciones_leche_2			=	aMenu['_2'];
	   this.porciones_leche_entera		=	aMenu['_3'];
	   this.porciones_vegetales			=	aMenu['_4'];
	   this.porciones_frutas			=	aMenu['_5'];
	   this.porciones_harinas			=	aMenu['_6'];
	   this.porciones_carne_magra		=	aMenu['_7'];
	   this.porciones_carne_intermedia	=	aMenu['_8'];
	   this.porciones_carne_grasa		=	aMenu['_9'];
	   this.porciones_azucares			=	aMenu['_10'];
	   this.porciones_grasas			=	aMenu['_11'];
	   this.porciones_vaso_agua			=	aMenu['_12'];
		var tiempo_de_comida			=	this.tiempos[tiempoComida];;
		this.label_modal_porciones		=	tiempo_de_comida.toString()

		this.displayModalPorciones=true;
		this.mostrarModal();
		this.concatenar(aMenu);
	}
	porciones(alimento_name, alimento_id){
		var aTiempoComida	=	[];
		aTiempoComida.push(this.getCurrentTiempoComida());
		//aTiempoComida	=	this.getCurrentTiempoComida();
		var cantidad	=	this.getCantidad(alimento_id);

		//this.setPorciones(aTiempoComida, alimento_id, cantidad);
		var aMenu	=	{};
		switch(this.currentTiempoComida){
			case 1:
				aMenu	=	this.arrayMenuDesayuno;
				break;
			case 2:
				aMenu	=	this.arrayMenuMediaManana;
				break;
			case 3:
				aMenu	=	this.arrayMenuAlmuerzo;
				break;
			case 4:
				aMenu	=	this.arrayMenuMediaTarde;
				break;
			case 5:
				aMenu	=	this.arrayMenuCena;
				break;
			case 6:
				aMenu	=	this.arrayMenuCoicionNocturna;
				break;
			case 7:
				aMenu	=	this.arrayMenuAgua;
				break;
			case 8:
				aMenu	=	this.arrayMenuGaseosa;
				break;
			case 9:
				aMenu	=	this.arrayJugosEmpacados;
				break;
			case 10:
				aMenu	=	this.arrayMenuComidasRapidas;
				break;
			case 11:
				aMenu	=	this.arrayMenuAlimentosEmpacados;
				break;
			case 12:
				aMenu	=	this.arrayMenuEmbutidos;
				break;
		}

		aMenu['_' + alimento_id]	=	cantidad;
		this.arrayMenuCurrent	=	aMenu;
		this.concatenar(aMenu);
	}
	setPorciones(aTiempoComida, alimento_id, cantidad){
		if(aTiempoComida.length==1){
			aTiempoComida.push({'alimento_id':alimento_id, 'cantidad':cantidad});
			return aTiempoComida;
		}
		
		var found			=	aTiempoComida.filter(function(arr){
								return arr.alimento_id == alimento_id
							  })[0];
		  if(found){
				found.cantidad	=	cantidad;
		  }else
			  aTiempoComida.push({'alimento_id':alimento_id, 'cantidad':cantidad});

		return aTiempoComida;
	}
	getCantidad(alimento_id){
		var cantidad	=	0;
		switch(alimento_id){
			case 1:
				cantidad	=	this.porciones_leche_descremada;
				break;
			case 2:
				cantidad	=	this.porciones_leche_2;
				break;
			case 3:
				cantidad	=	this.porciones_leche_entera;
				break;
			case 4:
				cantidad	=	this.porciones_vegetales;
				break;
			case 5:
				cantidad	=	this.porciones_frutas;
				break;
			case 6:
				cantidad	=	this.porciones_harinas;
				break;
			case 7:
				cantidad	=	this.porciones_carne_magra;
				break;
			case 8:
				cantidad	=	this.porciones_carne_intermedia;
				break;
			case 9:
				cantidad	=	this.porciones_carne_grasa;
				break;
			case 10:
				cantidad	=	this.porciones_azucares;
				break;
			case 11:
				cantidad	=	this.porciones_grasas;
				break;
			case 12:
				cantidad	=	this.porciones_vaso_agua;
				break;			
		}
		return cantidad;
	}
	getCurrentTiempoComida(){
		var aMenu	=	{};
		switch(this.currentTiempoComida){
			case 1:
				aMenu	=	this.arrayMenuDesayuno;
				break;
			case 2:
				aMenu	=	this.arrayMenuMediaManana;
				break;
			case 3:
				aMenu	=	this.arrayMenuAlmuerzo;
				break;
			case 4:
				aMenu	=	this.arrayMenuMediaTarde;
				break;
			case 5:
				aMenu	=	this.arrayMenuCena;
				break;
			case 6:
				aMenu	=	this.arrayMenuCoicionNocturna;
				break;
			case 7:
				aMenu	=	this.arrayMenuAgua;
				break;
			case 8:
				aMenu	=	this.arrayMenuGaseosa;
				break;
			case 9:
				aMenu	=	this.arrayJugosEmpacados;
				break;
			case 10:
				aMenu	=	this.arrayMenuComidasRapidas;
				break;
			case 11:
				aMenu	=	this.arrayMenuAlimentosEmpacados;
				break;
			case 12:
				aMenu	=	this.arrayMenuEmbutidos;
				break;
		}
		return aMenu;
	}



  concatenarItemsOfArray(aMenu){
	  var summary	=	'';
	  var key;
		for(var i in aMenu){
			if(aMenu[i]){
				if(summary)
					summary	+=	', ';
				key	=	i.match(/\d+/);
				//summary	+=	aMenu[i] + ' ' + this.alimentos[i];
				summary	+=	aMenu[i] + ' ' + this.alimentos[key];
			}
		}
		/*this.inputModal	=	summary;*/
		return summary;
  }
	concatenar(aMenu){
		var summary	=	this.concatenarItemsOfArray(aMenu);
		this.inputModal	=	summary;
		return summary;
	}
	get summary_desayuno(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuDesayuno);
		/*
		for(var i in this.arrayMenuDesayuno){
			if(this.arrayMenuDesayuno[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuDesayuno[i] + ' ' + this.alimentos[i];;
			}
		}*/
		return summary;
  }
	get summary_media_manana(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuMediaManana);
		/*
		for(var i in this.arrayMenuMediaManana){
			if(this.arrayMenuMediaManana[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuMediaManana[i] + ' ' + this.alimentos[i];
			}
		}*/
		return summary;
  }
	get summary_almuerzo(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuAlmuerzo);
		/*
		for(var i in this.arrayMenuAlmuerzo){
			if(this.arrayMenuAlmuerzo[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuAlmuerzo[i] + ' ' + this.alimentos[i];
			}
		}
		*/
		return summary;
  }
	get summary_media_tarde(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuMediaTarde);
		/*
		for(var i in this.arrayMenuMediaTarde){
			if(this.arrayMenuMediaTarde[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuMediaTarde[i] + ' ' + this.alimentos[i];
			}
		}
		*/
		return summary;
  }
	get summary_cena(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuCena);
		/*
		for(var i in this.arrayMenuCena){
			if(this.arrayMenuCena[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuCena[i] + ' ' + this.alimentos[i];
			}
		}
		*/
		return summary;
  }
	get summary_coicion_nocturna(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuCoicionNocturna);
		/*
		for(var i in this.arrayMenuCoicionNocturna){
			if(this.arrayMenuCoicionNocturna[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuCoicionNocturna[i] + ' ' + this.alimentos[i];
			}
		}
		*/
		return summary;
  }
	get summary_dieta_agua(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuAgua);
		/*
		for(var i in this.arrayMenuAgua){
			if(this.arrayMenuAgua[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuAgua[i] + ' ' + this.alimentos[i];
			}
		}*/
		return summary;
	}
	get summary_dieta_gaseosa(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuGaseosa);
		/*
		for(var i in this.arrayMenuGaseosa){
			if(this.arrayMenuGaseosa[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuGaseosa[i] + ' ' + this.alimentos[i];
			}
		}*/
		return summary;
	}
	get summary_dieta_jugos_empacados(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayJugosEmpacados);
		/*
		for(var i in this.arrayJugosEmpacados){
			if(this.arrayJugosEmpacados[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayJugosEmpacados[i] + ' ' + this.alimentos[i];
			}
		}*/
		return summary;
	}
	get summary_dieta_comidas_rapidas(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuComidasRapidas);
		/*
		for(var i in this.arrayMenuComidasRapidas){
			if(this.arrayMenuComidasRapidas[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuComidasRapidas[i] + ' ' + this.alimentos[i];
			}
		}*/
		return summary;
	}
	get summary_dieta_alimentos_empacados(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuAlimentosEmpacados);
		/*
		for(var i in this.arrayMenuAlimentosEmpacados){
			if(this.arrayMenuAlimentosEmpacados[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuAlimentosEmpacados[i] + ' ' + this.alimentos[i];
			}
		}*/
		return summary;
	}
	get summary_dieta_embutidos(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuEmbutidos);
		/*
		for(var i in this.arrayMenuEmbutidos){
			if(this.arrayMenuEmbutidos[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuEmbutidos[i] + ' ' + this.alimentos[i];
			}
		}
		*/
		return summary;
	}

	getTotalAlimentos(alimento_id):number{
	  var total	=	0;
		if(this.arrayMenuDesayuno[alimento_id])
			total	+=	Number(this.arrayMenuDesayuno[alimento_id]);
		
		if(this.arrayMenuMediaManana[alimento_id])
			total	+=	Number(this.arrayMenuMediaManana[alimento_id]);
		
		if(this.arrayMenuAlmuerzo[alimento_id])
			total	+=	Number(this.arrayMenuAlmuerzo[alimento_id]);
		
		if(this.arrayMenuMediaTarde[alimento_id])
			total	+=	Number(this.arrayMenuMediaTarde[alimento_id]);
		
		if(this.arrayMenuCena[alimento_id])
			total	+=	Number(this.arrayMenuCena[alimento_id]);
		
		if(this.arrayMenuCoicionNocturna[alimento_id])
			total	+=	Number(this.arrayMenuCoicionNocturna[alimento_id]);
		
		if(this.arrayMenuAgua[alimento_id])
			total	+=	Number(this.arrayMenuAgua[alimento_id]);
		
		if(this.arrayMenuGaseosa[alimento_id])
			total	+=	Number(this.arrayMenuGaseosa[alimento_id]);
		if(this.arrayJugosEmpacados[alimento_id])
			total	+=	Number(this.arrayJugosEmpacados[alimento_id]);
		
		if(this.arrayMenuComidasRapidas[alimento_id])
			total	+=	Number(this.arrayMenuComidasRapidas[alimento_id]);
		
		if(this.arrayMenuAlimentosEmpacados[alimento_id])
			total	+=	Number(this.arrayMenuAlimentosEmpacados[alimento_id]);
		
		if(this.arrayMenuEmbutidos[alimento_id])
			total	+=	Number(this.arrayMenuEmbutidos[alimento_id]);

	  return total;	  
	}

	calcularPorcentajes(){
		var total_carbohidratos	=	this.calcularCarbohidratos();
		var total_proteinas		=	this.calcularProteinas();
		var total_grasas		=	this.calcularGrasas();
		var total				=	total_carbohidratos	+	total_proteinas	+ total_grasas;
		this.porcentaje_carbohidratos	=	(total_carbohidratos*100)/total;
		this.porcentaje_proteinas		=	(total_proteinas*100)/total;
		this.porcentaje_grasas			=	(total_grasas*100)/total;
	}
	calcularCarbohidratos(){
		var sumatoria	=	0;
		sumatoria	+=	this.getTotalAlimentos(1) * 12;//leche desc
		sumatoria	+=	this.getTotalAlimentos(2) * 12;//leche 2%
		sumatoria	+=	this.getTotalAlimentos(3) * 12;//leche int
		sumatoria	+=	this.getTotalAlimentos(4) * 5;//vegetales
		sumatoria	+=	this.getTotalAlimentos(5) * 15;//frutas
		sumatoria	+=	this.getTotalAlimentos(6) * 15;//harinas
		sumatoria	+=	0;//carne m
		sumatoria	+=	0;//carne int
		sumatoria	+=	0;//carne g
		sumatoria	+=	this.getTotalAlimentos(10) * 10;//azucar
		sumatoria	+=	0;//grasas
		sumatoria	+=	0;//agua vasos
		//this.porcentaje_carbohidratos	=	sumatoria/100;
	//	this.calcularPorcentajes();
		return sumatoria;
	}
	calcularProteinas(){
		var sumatoria	=	0;
		sumatoria	+=	this.getTotalAlimentos(1) * 8;//leche desc
		sumatoria	+=	this.getTotalAlimentos(2) * 8;//leche 2%
		sumatoria	+=	this.getTotalAlimentos(3) * 8;//leche int
		sumatoria	+=	this.getTotalAlimentos(4) * 2;//vegetales
		sumatoria	+=	0;//frutas
		sumatoria	+=	this.getTotalAlimentos(6) * 3;//harinas
		sumatoria	+=	this.getTotalAlimentos(7) * 7;//carne m
		sumatoria	+=	this.getTotalAlimentos(8) * 7;//carne Int
		sumatoria	+=	this.getTotalAlimentos(9) * 7;//carne g
		sumatoria	+=	0;//azucar
		sumatoria	+=	0;//grasas
		sumatoria	+=	0;//agua vasos
		//this.porcentaje_proteinas	=	sumatoria/100;
	//	this.calcularPorcentajes();
		return sumatoria;
	}
	calcularGrasas(){
		var sumatoria	=	0;
		sumatoria	+=	this.getTotalAlimentos(1) * 1;//leche desc
		sumatoria	+=	this.getTotalAlimentos(2) * 5;//leche 2%
		sumatoria	+=	this.getTotalAlimentos(3) * 8;//leche int
		sumatoria	+=	0;//vegetales
		sumatoria	+=	0;//frutas
		sumatoria	+=	this.getTotalAlimentos(6) * 1;//harinas
		sumatoria	+=	this.getTotalAlimentos(7) * 3;//carne m
		sumatoria	+=	this.getTotalAlimentos(8) * 5;//carne Int
		sumatoria	+=	this.getTotalAlimentos(9) * 8;//carne g
		sumatoria	+=	0;//azucar
		sumatoria	+=	this.getTotalAlimentos(11) * 5;//grasas
		sumatoria	+=	0;//agua vasos
		//this.porcentaje_grasas	=	sumatoria/100;
	//	this.calcularPorcentajes();
		return sumatoria;
	}
	calcularKcal(){
		var sumatoria	=	0;
		sumatoria	+=	this.getTotalAlimentos(1) * 90;//leche desc
		sumatoria	+=	this.getTotalAlimentos(2) * 120;//leche 2%
		sumatoria	+=	this.getTotalAlimentos(3) * 150;//leche int
		sumatoria	+=	this.getTotalAlimentos(4) * 28;//vegetales
		sumatoria	+=	this.getTotalAlimentos(5) * 60;//frutas
		sumatoria	+=	this.getTotalAlimentos(6) * 80;//harinas
		sumatoria	+=	this.getTotalAlimentos(7) * 55;//carne m
		sumatoria	+=	this.getTotalAlimentos(8) * 75;//carne Int
		sumatoria	+=	this.getTotalAlimentos(9) * 100;//carne g
		sumatoria	+=	this.getTotalAlimentos(10) * 40;//azucar
		sumatoria	+=	this.getTotalAlimentos(11) * 45;//grasas
		sumatoria	+=	0;//agua vasos
		this.porcentaje_kcal	=	sumatoria/100;
		
		return sumatoria;
	}
	get gramos_carbohidratos(){
		return this.calcularCarbohidratos();
	}
	get gramos_proteinas(){
		return this.calcularProteinas();
	}
	get gramos_grasas(){
		return this.calcularGrasas();
	}
	get porcentaje_de_carbohidratos(){
	  var total_carbohidratos	=	this.calcularCarbohidratos();
		var total_proteinas			=	this.calcularProteinas();
		var total_grasas			=	this.calcularGrasas();
		var total					=	total_carbohidratos	+	total_proteinas	+ total_grasas;
		this.porcentaje_carbohidratos	=	(total_carbohidratos*100)/total;
		if(isNaN(this.porcentaje_carbohidratos))
			this.porcentaje_carbohidratos	=	0;
		return this.porcentaje_carbohidratos;
	}
	get porcentaje_de_proteinas(){
	  var total_carbohidratos	=	this.calcularCarbohidratos();
		var total_proteinas		=	this.calcularProteinas();
		var total_grasas		=	this.calcularGrasas();
		var total				=	total_carbohidratos	+	total_proteinas	+ total_grasas;

		this.porcentaje_proteinas		=	(total_proteinas*100)/total;
		if(isNaN(this.porcentaje_proteinas))
			this.porcentaje_proteinas	=	0;
		return this.porcentaje_proteinas;

	}
	get porcentaje_de_grasas(){
		var total_carbohidratos	=	this.calcularCarbohidratos();
		var total_proteinas		=	this.calcularProteinas();
		var total_grasas		=	this.calcularGrasas();
		var total				=	total_carbohidratos	+	total_proteinas	+ total_grasas;
		this.porcentaje_grasas			=	(total_grasas*100)/total;
		if(isNaN(this.porcentaje_grasas))
			this.porcentaje_grasas	=	0;
		return this.porcentaje_grasas;

	}
	closeModalPorciones(){
		this.displayModalPorciones=false;
		this.cerrarModal();
		this.inputModal	=	'';		
	}

	mostrarModal(){
		this.tagBody.classList.add('open-modal');
	}	
	cerrarModal(){
		this.tagBody.classList.remove('open-modal');
	}

	get current(){
		return JSON.stringify(this.arrayMenuCurrent);
	}
   
}
