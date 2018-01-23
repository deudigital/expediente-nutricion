import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Analisis,PatronMenu, PatronMenuEjemplo, Paciente, DetalleValoracionDieteticaTexto } from '../../../control/data/formControlData.model';
import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-valoracion-dietetica',
  templateUrl: './valoracion-dietetica.component.html',
  styles: []
})
export class ValoracionDieteticaComponent implements OnInit {
	menus:{ [id: string]: any; } = {'0':''}; 
	menusEjemplo:{ [id: string]: any; } = {'0':''}; 
	asignacionPorciones: {};
	asignacionEjemplos: {};
	model:any;
	mng:any;
	texto_dieta_comidas_rapidas:string='';
	paciente:any;
	showmodal:boolean=false;
	showmodalgraficos:boolean=false;
	navitation:boolean=false;
	inputModal:any;  

	showTabGrafico:boolean=false;
	showTabDatos:boolean=true;
	tab_class_datos:string='';
	tab_class_graficos:string='';

	displayModalPorciones:boolean=false;
	label_modal_porciones:string='';

	dieta_desayuno_text:string='testing, desayuno';
	dieta_media_manana_text:string='testing, media mañana';

	currentTiempoComida:number;
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
	
	total_leche_descremada:number=0;
	total_leche_2:number=0;
	total_leche_entera:number=0;
	total_vegetales:number=0;
	total_frutas:number=0;
	total_harinas:number=0;
	total_carne_magra:number=0;
	total_carne_intermedia:number=0;
	total_carne_grasa:number=0;
	total_azucares:number=0;
	total_grasas:number=0;
	total_vaso_agua:number=0;
	
	porcentaje_carbohidratos:number;
	porcentaje_proteinas:number;
	porcentaje_grasas:number;
	kcal_value:number;

	arrayMenuDesayuno:{ [id: string]: any; } = {'0':''}; 
	arrayMenuMediaManana:{ [id: string]: any; } = {'0':''}; 
	arrayMenuAlmuerzo:{ [id: string]: any; } = {'0':''}; 
	arrayMenuMediaTarde:{ [id: string]: any; } = {'0':''}; 
	arrayMenuCena:{ [id: string]: any; } = {'0':''}; 
	arrayMenuCoicionNocturna:{ [id: string]: any; } = {'0':''};
	arrayMenuCurrent:{ [id: string]: any; } = {'0':''};

	arrayMenuAgua:{ [id: string]: any; } = {};
	arrayMenuGaseosa:{ [id: string]: any; } = {};
	arrayJugosEmpacados:{ [id: string]: any; } = {};
	arrayMenuComidasRapidas:{ [id: string]: any; } = {};
	arrayMenuAlimentosEmpacados:{ [id: string]: any; } = {};
	arrayMenuEmbutidos:{ [id: string]: any; } = {};

	alimentos:Object[]=[];
	tiempos:Object[]=[];
	data:{ [id: string]: any; } = {'0':''}; 
	oData:{ [id: string]: any; } = {'0':''}; 
	pme:PatronMenuEjemplo=new PatronMenuEjemplo();
	dvdt:DetalleValoracionDieteticaTexto=new DetalleValoracionDieteticaTexto();
	tagBody:any;
	oMenu:{ [id: string]: any; } = {'0':''};
	notas:any;
	
	textoDesayuno:string='';
	textoMediaManana:string='';
	textoAlmuerzo:string='';
	textoMediaTarde:string='';
	textoCena:string='';
	textoCoicionNocturna:string='';
	textoCurrent:string='';

	textoAgua:string='';
	textoGaseosa:string='';
	textoJugosEmpacados:string='';
	textoComidasRapidas:string='';
	textoAlimentosEmpacados:string='';
	textoEmbutidos:string='';

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.model		=	formControlDataService.getFormControlData();
		this.mng		=	this.model.getManejadorDatos();
		this.mng.setMenuPacienteStatus(true);
		this.paciente	=	this.model.getFormPaciente();
		this.notas		=	this.paciente.notas_valoracion_dietetica;
	}
	ngOnInit() {
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
		this.alimentos['10']=	'Azúcares';
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

		this.tagBody = document.getElementsByTagName('body')[0];
		this.tagBody.classList.add('menu-parent-habito');

		//this.menus	=	this.formControlDataService.getFormControlData().patronmenu;
		this.menus			=	this.formControlDataService.getFormControlData().valoracionDietetica;
		this.menusEjemplo	=	this.formControlDataService.getFormControlData().valoracionDieteticaEjemplo;
		/*console.log('cargando valoracionDietetica');
		console.log(this.menus);
		console.log(this.menusEjemplo);*/
		this.setInfoInit();
		this.calcularPorcentajes();
		this.setTotales();
		this.navitation	=	false;
	}
	ngOnDestroy() {
		if(!this.navitation)
			this.saveForm();
		this.tagBody.classList.remove('menu-parent-habito');
	}
	setInfoInit(){
		this.pme.dieta_desayuno_ejemplo			=	this.model.dieta_desayuno_ejemplo;
		this.pme.dieta_media_manana_ejemplo		=	this.model.dieta_media_manana_ejemplo;
		this.pme.dieta_almuerzo_ejemplo			=	this.model.dieta_almuerzo_ejemplo;
		this.pme.dieta_media_tarde_ejemplo		=	this.model.dieta_media_tarde_ejemplo;
		this.pme.dieta_cena_ejemplo				=	this.model.dieta_cena_ejemplo;
		this.pme.dieta_coicion_nocturna_ejemplo	=	this.model.dieta_coicion_nocturna_ejemplo;
		
		var aMenu	=	{};
		this.oMenu	=	{};
/*
categoria_valoracion_dietetica_id: 1
grupo_alimento_nutricionista_id: 1
paciente_id: 6
porciones: 7

this.			=	this.menusEjemplo.textoDesayuno;
		this.		=	this.menusEjemplo.textoMediaManana;
		this.			=	this.menusEjemplo.textoAlmuerzo;
		this.		=	this.menusEjemplo.textoMediaTarde;
		this.				=	this.menusEjemplo.textoCena;
		this.	=	this.menusEjemplo.textoCoicionNocturna;

		this.				=	this.menusEjemplo.textoAgua;
		this.			=	this.menusEjemplo.textoGaseosa;
		this.	=	this.menusEjemplo.textoJugosEmpacados;
		this.	=	this.menusEjemplo.textoComidasRapidas;
		this.=	this.menusEjemplo.textoAlimentosEmpacados;
		this.textoEmbutidos			=	this.menusEjemplo.textoEmbutidos;
		
*/
		for(var i in this.menusEjemplo){
			var item	=	this.menusEjemplo[i];
			var tiempo_de_comida	=	item.categoria_valoracion_dietetica_id;
			switch(tiempo_de_comida){
				case 1:
					this.textoDesayuno	=	item.ejemplo;
					break;
				case 2:
					this.textoMediaManana	=	item.ejemplo;
					break;
				case 3:
					this.textoAlmuerzo	=	item.ejemplo;
					break;
				case 4:
					this.textoMediaTarde	=	item.ejemplo;
					break;
				case 5:
					this.textoCena	=	item.ejemplo;
					break;
				case 6:
					this.textoCoicionNocturna	=	item.ejemplo;
					break;
				case 7:
					this.textoAgua	=	item.ejemplo;
					break;
				case 8:
					this.textoGaseosa	=	item.ejemplo;
					break;
				case 9:
					this.textoJugosEmpacados	=	item.ejemplo;
					break;
				case 10:
					this.textoComidasRapidas	=	item.ejemplo;
					break;
				case 11:
					this.textoAlimentosEmpacados	=	item.ejemplo;
					break;
				case 12:
					this.textoEmbutidos	=	item.ejemplo;
					break;
			}
		}
		
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

			aMenu[item.grupo_alimento_nutricionista_id]			=	item.porciones;			
			this.concatenar(aMenu);
		}
		this.oMenu[0]	=	'';
		this.oMenu[1]	=	this.copy(this.arrayMenuDesayuno);
		this.oMenu[2]	=	this.copy(this.arrayMenuMediaManana);
		this.oMenu[3]	=	this.copy(this.arrayMenuAlmuerzo);
		this.oMenu[4]	=	this.copy(this.arrayMenuMediaTarde);
		this.oMenu[5]	=	this.copy(this.arrayMenuCena);
		this.oMenu[6]	=	this.copy(this.arrayMenuCoicionNocturna);

		this.oMenu[7]	=	this.copy(this.arrayMenuAgua);
		this.oMenu[8]	=	this.copy(this.arrayMenuGaseosa);
		this.oMenu[9]	=	this.copy(this.arrayJugosEmpacados);
		this.oMenu[10]	=	this.copy(this.arrayMenuComidasRapidas);
		this.oMenu[11]	=	this.copy(this.arrayMenuAlimentosEmpacados);
		this.oMenu[12]	=	this.copy(this.arrayMenuEmbutidos);
	}
	copy(data){
		var myArray={};
		for(var i in data){
			myArray[i]	=	data[i];
		}
		return myArray;
	}
	prepare(paciente_id){
		var myArray=[];
		
		var menus	=	[];
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
		
		var j=0;
		for(var a in menus){
			var data	=	menus[a];
			var tiempoComida	=	Number(a) + 1;
			for(var i in data){
				var grupoAlimentoNutricionista	=	Number(i);
				if(Number(i)>0){
					myArray[j]	=	{'paciente_id': paciente_id, 'grupo_alimento_nutricionista_id': grupoAlimentoNutricionista, 'porciones': data[grupoAlimentoNutricionista], 'categoria_valoracion_dietetica_id': tiempoComida}
					j++;
				}
			}
		}
		return myArray;
	}
	prepareEjemplo(paciente_id){
		var myArray=[];
		
		var menus	=	[];
		menus[0]	=	this.textoDesayuno;
		menus[1]	=	this.textoMediaManana;
		menus[2]	=	this.textoAlmuerzo;
		menus[3]	=	this.textoMediaTarde;
		menus[4]	=	this.textoCena;
		menus[5]	=	this.textoCoicionNocturna;
	
		menus[6]	=	this.textoAgua;
		menus[7]	=	this.textoGaseosa;
		menus[8]	=	this.textoJugosEmpacados;
		menus[9]	=	this.textoComidasRapidas;
		menus[10]	=	this.textoAlimentosEmpacados;
		menus[11]	=	this.textoEmbutidos;
		
		var j=0;
		for(var a in menus){
			var data	=	menus[a];
			var tiempoComida	=	Number(a) + 1;
			//if(Number(a)>0){
				myArray[j]	=	{'paciente_id': paciente_id, 'ejemplo': data, 'categoria_valoracion_dietetica_id': tiempoComida}
				j++;
			//}
		}
		return myArray;
	}
	/*infoEdited(){		
		
		var result	=	this.infoEditedEjemplos() || this.infoEditedPorciones();
		return result;
	}*/
	infoEdited(){		
		var notasEdited		=	this.infoEditedNotas();
		var ejemplosEdited		=	this.infoEditedEjemplos();
		var porcionesEdited	=	this.infoEditedPorciones();
		var result	=	notasEdited ||  ejemplosEdited ||  porcionesEdited;
		return result;
	}
	infoEditedNotas(){
		var notas_changed	=	false;
		if(this.notas	!==	this.paciente.notas_valoracion_dietetica){
			notas_changed	=	true;
			this.data['notas']	=	[];
			this.data['notas'][0]	=	this.paciente.notas_valoracion_dietetica;
		}
		return notas_changed;
	}
	infoEditedEjemplos__old(){
		var i=0;
		var tiempo_de_comidas	=	[];
		tiempo_de_comidas[i]	=	{'tiempo_id':'0', 'ejemplo':''};
		i++;
		if(this.pme.dieta_desayuno_ejemplo !==	this.model.dieta_desayuno_ejemplo){
			tiempo_de_comidas[i]	=	{'tiempo_id':'1', 'ejemplo':this.model.dieta_desayuno_ejemplo} ;
			i++;
		}
		if(this.pme.dieta_media_manana_ejemplo !==	this.model.dieta_media_manana_ejemplo){
			tiempo_de_comidas[i]	=	{'tiempo_id':'2', 'ejemplo':this.model.dieta_media_manana_ejemplo};
			i++;
		}
		if(this.pme.dieta_almuerzo_ejemplo !==	this.model.dieta_almuerzo_ejemplo){
			tiempo_de_comidas[i]	=	{'tiempo_id':'3', 'ejemplo':this.model.dieta_almuerzo_ejemplo};
			i++;
		}
		if(this.pme.dieta_media_tarde_ejemplo !==	this.model.dieta_media_tarde_ejemplo){
			tiempo_de_comidas[i]	=	{'tiempo_id':'4', 'ejemplo':this.model.dieta_media_tarde_ejemplo};
			i++;
		}
		if(this.pme.dieta_cena_ejemplo !==	this.model.dieta_cena_ejemplo){
			tiempo_de_comidas[i]	=	{'tiempo_id':'5', 'ejemplo':this.model.dieta_cena_ejemplo};
			i++;
		}
		if(this.pme.dieta_coicion_nocturna_ejemplo	!==	this.model.dieta_coicion_nocturna_ejemplo){
			tiempo_de_comidas[i]	=	{'tiempo_id':'6', 'ejemplo':this.model.dieta_coicion_nocturna_ejemplo};
			i++;
		}
		if(tiempo_de_comidas.length>1){
			this.data['tiempos']	=	tiempo_de_comidas;
			return true;
		}
		
		return false;
	}
	infoEditedEjemplos(){
		var i=0;
		var tiempo_de_comidas	=	[];
		tiempo_de_comidas[i]	=	{'tiempo_id':'0', 'ejemplo':''};
		i++;
		if(this.dvdt.textoDesayuno !==	this.textoDesayuno){
			tiempo_de_comidas[i]	=	{'tiempo_id':'1', 'ejemplo':this.textoDesayuno} ;
			i++;
		}
		if(this.dvdt.textoMediaManana !==	this.textoMediaManana){
			tiempo_de_comidas[i]	=	{'tiempo_id':'2', 'ejemplo':this.textoMediaManana};
			i++;
		}
		if(this.dvdt.textoAlmuerzo !==	this.textoAlmuerzo){
			tiempo_de_comidas[i]	=	{'tiempo_id':'3', 'ejemplo':this.textoAlmuerzo};
			i++;
		}
		if(this.dvdt.textoMediaTarde !==	this.textoMediaTarde){
			tiempo_de_comidas[i]	=	{'tiempo_id':'4', 'ejemplo':this.textoMediaTarde};
			i++;
		}
		if(this.dvdt.textoCena !==	this.textoCena){
			tiempo_de_comidas[i]	=	{'tiempo_id':'5', 'ejemplo':this.textoCena};
			i++;
		}
		if(this.dvdt.textoCoicionNocturna	!==	this.textoCoicionNocturna){
			tiempo_de_comidas[i]	=	{'tiempo_id':'6', 'ejemplo':this.textoCoicionNocturna};
			i++;
		}
		
		if(this.dvdt.textoAgua !==	this.textoAgua){
			tiempo_de_comidas[i]	=	{'tiempo_id':'7', 'ejemplo':this.textoAgua} ;
			i++;
		}
		if(this.dvdt.textoGaseosa !==	this.textoGaseosa){
			tiempo_de_comidas[i]	=	{'tiempo_id':'8', 'ejemplo':this.textoGaseosa};
			i++;
		}
		if(this.dvdt.textoJugosEmpacados !==	this.textoJugosEmpacados){
			tiempo_de_comidas[i]	=	{'tiempo_id':'9', 'ejemplo':this.textoJugosEmpacados};
			i++;
		}
		if(this.dvdt.textoComidasRapidas !==	this.textoComidasRapidas){
			tiempo_de_comidas[i]	=	{'tiempo_id':'10', 'ejemplo':this.textoComidasRapidas};
			i++;
		}
		if(this.dvdt.textoAlimentosEmpacados !==	this.textoAlimentosEmpacados){
			tiempo_de_comidas[i]	=	{'tiempo_id':'11', 'ejemplo':this.textoAlimentosEmpacados};
			i++;
		}
		if(this.dvdt.textoEmbutidos	!==	this.textoEmbutidos){
			tiempo_de_comidas[i]	=	{'tiempo_id':'12', 'ejemplo':this.textoEmbutidos};
			i++;
		}
		
		if(tiempo_de_comidas.length>1){
			this.data['tiempos']	=	tiempo_de_comidas;
			return true;
		}
		
		return false;
	}
	infoEditedPorciones(){
		if(this.chechChangesItems()){
			this.asignacionPorciones = [
				{'tiempo_id':'1', 'porciones': this.arrayMenuDesayuno},
				{'tiempo_id':'2', 'porciones': this.arrayMenuMediaManana},
				{'tiempo_id':'3', 'porciones': this.arrayMenuAlmuerzo},
				{'tiempo_id':'4', 'porciones': this.arrayMenuMediaTarde},
				{'tiempo_id':'5', 'porciones': this.arrayMenuCena},
				{'tiempo_id':'6', 'porciones': this.arrayMenuCoicionNocturna},				
				{'tiempo_id':'7', 'porciones': this.arrayMenuAgua},
				{'tiempo_id':'8', 'porciones': this.arrayMenuGaseosa},
				{'tiempo_id':'9', 'porciones': this.arrayJugosEmpacados},
				{'tiempo_id':'10','porciones': this.arrayMenuComidasRapidas},
				{'tiempo_id':'11','porciones': this.arrayMenuAlimentosEmpacados},
				{'tiempo_id':'12','porciones': this.arrayMenuEmbutidos},
				
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
					/*console.log('diferentes');console.log(oItem);console.log(obj2);*/
					return true;
				}
			}
		}
		return false;
	}
	saveForm(){		
		if(this.infoEdited()){
			this.updateItems();
			this.data['0']				=	'';
			this.data['paciente_id']	=	 this.paciente.id;
			this.saveInfo(this.data);
			
		}
	}
	updateItems(){
		this.menus			=	{};
		this.menus[0]		=	'';
		this.menus			=	this.prepare(this.paciente.id)
		this.menusEjemplo	=	this.prepareEjemplo(this.paciente.id)
		this.model.setValoracionDietetica(this.menus);
		this.model.setValoracionDieteticaEjemplo(this.menusEjemplo);
		this.formControlDataService.setFormControlData(this.model);		
	}
	saveInfo_patronmenu(data){		
		this.tagBody.classList.add('sending');
		console.log('save Valoracion Dietetica...');
		console.log(data);
		this.formControlDataService.saveDatosPatronMenu(data)
		.subscribe(
			 response  => {
						console.log('Response Valoracion Dietetica');
						console.log(response);
						this.tagBody.classList.remove('sending');
						},
			error =>  console.log(<any>error)
		);
	}
	saveInfo(data){
		this.tagBody.classList.add('sending');
		this.formControlDataService.store('habitos_valoracion_dietetica', data)
		.subscribe(
			 response  => {
						console.log('store->response...');
						console.log(response);
						this.tagBody.classList.remove('sending');
						},
			error =>  console.log(<any>error)
		);
	}
  porciones(alimento_name, alimento_id){  
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
		aMenu[alimento_id]	=	cantidad;
		this.arrayMenuCurrent	=	aMenu;
		this.concatenar(aMenu);
  }  

 concatenarItemsOfArray(aMenu){
	  var summary	=	'';
	  var key;
		for(var i in aMenu){
			if(aMenu[i]){
				if(summary)
					summary	+=	', ';
				
				summary	+=	aMenu[i] + ' ' + this.alimentos[i];
				//key	=	i.match(/\d+/);
				//summary	+=	aMenu[i] + ' ' + this.alimentos[key];
			}
		}
		return summary;
  }
  concatenar(aMenu){
	  var summary	=	'';
		for(var i in aMenu){
			if(aMenu[i]){
				if(summary)
					summary	+=	', ';
				
				summary	+=	aMenu[i] + ' ' + this.alimentos[i];
			}
		}
		//this.inputModal	=	summary;
		return summary;
  }
	get summary_desayuno(){
		var summary	=	'';
		for(var i in this.arrayMenuDesayuno){
			if(this.arrayMenuDesayuno[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuDesayuno[i] + ' ' + this.alimentos[i];;
			}
		}
		return summary;
  }
	get summary_media_manana(){
		var summary	=	'';
		for(var i in this.arrayMenuMediaManana){
			if(this.arrayMenuMediaManana[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuMediaManana[i] + ' ' + this.alimentos[i];
			}
		}
		return summary;
  }
	get summary_almuerzo(){
		var summary	=	'';
		for(var i in this.arrayMenuAlmuerzo){
			if(this.arrayMenuAlmuerzo[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuAlmuerzo[i] + ' ' + this.alimentos[i];
			}
		}
		return summary;
  }
	get summary_media_tarde(){
		var summary	=	'';
		for(var i in this.arrayMenuMediaTarde){
			if(this.arrayMenuMediaTarde[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuMediaTarde[i] + ' ' + this.alimentos[i];
			}
		}
		return summary;
  }
	get summary_cena(){
		var summary	=	'';
		for(var i in this.arrayMenuCena){
			if(this.arrayMenuCena[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuCena[i] + ' ' + this.alimentos[i];
			}
		}
		return summary;
  }
	get summary_coicion_nocturna(){
		var summary	=	'';
		for(var i in this.arrayMenuCoicionNocturna){
			if(this.arrayMenuCoicionNocturna[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuCoicionNocturna[i] + ' ' + this.alimentos[i];
			}
		}
		return summary;
  }
	get summary_dieta_agua(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuAgua);
		return summary;
	}
	get summary_dieta_gaseosa(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuGaseosa);
		return summary;
	}
	get summary_dieta_jugos_empacados(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayJugosEmpacados);
		return summary;
	}
	get summary_dieta_comidas_rapidas(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuComidasRapidas);
		return summary;
	}
	get summary_dieta_alimentos_empacados(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuAlimentosEmpacados);
		return summary;
	}
	get summary_dieta_embutidos(){
		var summary	=	'';
		summary	=	this.concatenarItemsOfArray(this.arrayMenuEmbutidos);
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
		//console.log(total_carbohidratos	+ ' + ' +	total_proteinas	+ ' + ' + total_grasas + ' = ' + total);
		this.porcentaje_carbohidratos	=	(total_carbohidratos*100)/total;
		this.porcentaje_proteinas		=	(total_proteinas*100)/total;
		this.porcentaje_grasas			=	(total_grasas*100)/total;
		
		this.kcal_value		=	this.calcularKcal();
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
		//this.porcentaje_kcal	=	sumatoria/100;
		
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
	
	setTotales(){	
		this.total_leche_descremada	=	this.getTotalAlimentos(1);
		this.total_leche_2			=	this.getTotalAlimentos(2);
		this.total_leche_entera		=	this.getTotalAlimentos(3);
		this.total_vegetales		=	this.getTotalAlimentos(4);
		this.total_frutas			=	this.getTotalAlimentos(5);
		this.total_harinas			=	this.getTotalAlimentos(6);
		this.total_carne_magra		=	this.getTotalAlimentos(7);
		this.total_carne_intermedia	=	this.getTotalAlimentos(8);
		this.total_carne_grasa		=	this.getTotalAlimentos(9);
		this.total_azucares			=	this.getTotalAlimentos(10);
		this.total_grasas			=	this.getTotalAlimentos(11);
		this.total_vaso_agua		=	this.getTotalAlimentos(12);
	}
	
  showModalPorciones(tiempoComida, nameTiempoComida){
	   this.inputModal	=	'';
	   this.currentTiempoComida	=	tiempoComida;
	   var aMenu	=	{};
	   switch(tiempoComida){
			case 1:
				aMenu			=	this.arrayMenuDesayuno;
				this.inputModal	=	this.textoDesayuno;
				break;
			case 2:
				aMenu	=	this.arrayMenuMediaManana;
				this.inputModal	=	this.textoMediaManana;
				break;
			case 3:
				aMenu	=	this.arrayMenuAlmuerzo;
				this.inputModal	=	this.textoAlmuerzo;
				break;
			case 4:
				aMenu	=	this.arrayMenuMediaTarde;
				this.inputModal	=	this.textoMediaTarde;
				break;
			case 5:
				aMenu	=	this.arrayMenuCena;
				this.inputModal	=	this.textoCena;
				break;
			case 6:
				aMenu	=	this.arrayMenuCoicionNocturna;
				this.inputModal	=	this.textoCoicionNocturna;
				break;
			case 7:
				aMenu	=	this.arrayMenuAgua;
				this.inputModal	=	this.textoAgua;
				break;
			case 8:
				aMenu	=	this.arrayMenuGaseosa;
				this.inputModal	=	this.textoGaseosa;
				break;
			case 9:
				aMenu	=	this.arrayJugosEmpacados;
				this.inputModal	=	this.textoJugosEmpacados;
				break;
			case 10:
				aMenu	=	this.arrayMenuComidasRapidas;
				this.inputModal	=	this.textoComidasRapidas;
				break;
			case 11:
				aMenu	=	this.arrayMenuAlimentosEmpacados;
				this.inputModal	=	this.textoAlimentosEmpacados;
				break;
			case 12:
				aMenu	=	this.arrayMenuEmbutidos;
				this.inputModal	=	this.textoEmbutidos;
				break;
	   }
	   this.porciones_leche_descremada	=	aMenu[1];
	   this.porciones_leche_2			=	aMenu[2];
	   this.porciones_leche_entera		=	aMenu[3];
	   this.porciones_vegetales			=	aMenu[4];
	   this.porciones_frutas			=	aMenu[5];
	   this.porciones_harinas			=	aMenu[6];
	   this.porciones_carne_magra		=	aMenu[7];
	   this.porciones_carne_intermedia	=	aMenu[8];
	   this.porciones_carne_grasa		=	aMenu[9];
	   this.porciones_azucares			=	aMenu[10];
	   this.porciones_grasas			=	aMenu[11];
	   this.porciones_vaso_agua			=	aMenu[12];
		var tiempo_de_comida	=	this.tiempos[tiempoComida];;
		this.label_modal_porciones	=	tiempo_de_comida.toString()

		this.displayModalPorciones=true;
	   let body = document.getElementsByTagName('body')[0];
		body.classList.add('open-modal');		
		window.scrollTo(0, 0);
		this.concatenar(aMenu);
   }
	closeModalPorciones(){
		let body = document.getElementsByTagName('body')[0];
		this.displayModalPorciones=false;

		switch(this.currentTiempoComida){
			case 1:
				this.textoDesayuno	=	this.inputModal;
				break;
			case 2:
				this.textoMediaManana	=	this.inputModal;
				break;
			case 3:
				this.textoAlmuerzo	=	this.inputModal;
				break;
			case 4:
				this.textoMediaTarde	=	this.inputModal;
				break;
			case 5:
				this.textoCena	=	this.inputModal;
				break;
			case 6:
				this.textoCoicionNocturna	=	this.inputModal;
				break;
			case 7:
				this.textoAgua	=	this.inputModal;
				break;
			case 8:
				this.textoGaseosa	=	this.inputModal;
				break;
			case 9:
				this.textoJugosEmpacados	=	this.inputModal;
				break;
			case 10:
				this.textoComidasRapidas	=	this.inputModal;
				break;
			case 11:
				this.textoAlimentosEmpacados	=	this.inputModal;
				break;
			case 12:
				this.textoEmbutidos	=	this.inputModal;
				break;
	   }
		
		body.classList.remove('open-modal');
		this.inputModal	=	'';
		
		this.calcularPorcentajes();
		this.setTotales();
		
	}
   fxshowmodal(){
     this.showmodal=!this.showmodal;
   }
   fxshowmodalgraficos(){
     this.showmodalgraficos=!this.showmodalgraficos;
   }
   tabSelected(tab:string){
      if(tab=='graficos'){
        this.showTabDatos = false;
        this.showTabGrafico=true;
        this.tab_class_graficos = 'active';
        this.tab_class_datos = '';
      }else{
        this.showTabDatos = true;
        this.showTabGrafico=false;
        this.tab_class_datos = 'active';
        this.tab_class_graficos = '';
      }
   }

  get currentArray() {
		return JSON.stringify(this.arrayMenuDesayuno);
	}

	
	Previous(){
		this.navitation	=	true;
		this.saveForm();
		this.router.navigate(['/actividad']);
	}
	Next(){
		this.navitation	=	true;
		this.saveForm();
		this.router.navigate(['/gustos']);
	}
}
