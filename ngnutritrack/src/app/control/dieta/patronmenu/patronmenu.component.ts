import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Prescripcion, PrescripcionItem, Analisis,PatronMenu, PatronMenuEjemplo, Paciente } from '../../data/formControlData.model';
import { FormControlDataService }     from '../../data/formControlData.service';

@Component({
  selector: 'app-patronmenu',
  templateUrl: './patronmenu.component.html',
  styles: []
})
export class PatronmenuComponent implements OnInit {
  menus:{ [id: string]: any; } = {'0':''}; 
  /*asignacionPorciones: {};*/
  asignacionPorciones:any;
  asignacionEjemplos: {};
  model:any;
  helpers:any;
  showmodal:boolean=false;
  showmodalgraficos:boolean=false;
  inputModal:any;
  
  prescripcion=new Prescripcion();
  items:PrescripcionItem[]=[]; 
  
  showTabGrafico:boolean=false;
  showTabDatos:boolean=true;
  tab_class_datos:string='';
  tab_class_graficos:string='';
  
  displayModalPorciones:boolean=false;
  displayOldTiemposComida:boolean=false;
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

  arrayMenuDesayuno:{ [id: string]: any; } = {'0':''}; 
  arrayMenuMediaManana:{ [id: string]: any; } = {'0':''}; 
  arrayMenuAlmuerzo:{ [id: string]: any; } = {'0':''}; 
  arrayMenuMediaTarde:{ [id: string]: any; } = {'0':''}; 
  arrayMenuCena:{ [id: string]: any; } = {'0':''}; 
  arrayMenuCoicionNocturna:{ [id: string]: any; } = {'0':''};
  arrayMenuCurrent:{ [id: string]: any; } = {'0':''};
  arrayMenuCustom:{ [id: string]: any; } = {'0':''};
  
	alimentos:Object[]=[];
	tiempos:Object[]=[];
	data:{ [id: string]: any; } = {'0':''}; 
	oData:{ [id: string]: any; } = {'0':''}; 
	pme:PatronMenuEjemplo=new PatronMenuEjemplo();
	
	abkp:any;
	
	tagBody:any;
	oMenu:{ [id: string]: any; } = {'0':''};
	
	prescritos:Object[]=[];
	
	navitation:boolean=false;
	nuevo:boolean=false;
	
	tiempo_comida_nombre:string;
	tiempo_comida_nombre_message:string;
	custom_tiempo_comidas:any;
	
  constructor(private router: Router, private formControlDataService: FormControlDataService) {
	this.model	=	formControlDataService.getFormControlData();
	this.helpers	=	this.model.getHelpers();
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
	this.alimentos['12']=	'Vasos con Agua';

	this.tiempos['']	=	'';
	this.tiempos['1']	=	'Desayuno';
	this.tiempos['2']	=	'Media Mañana';
	this.tiempos['3']	=	'Almuerzo';
	this.tiempos['4']	=	'Media Tarde';
	this.tiempos['5']	=	'Cena';
	this.tiempos['6']	=	'Coición Nocturna';
	
	this.tagBody = document.getElementsByTagName('body')[0];
	this.tagBody.classList.add('menu-parent-dieta');
	this.navitation	=	false;
	
	this.menus	=	this.formControlDataService.getFormControlData().patronmenu;
	console.log('this.menus');
	console.log(this.menus);
	
	
	let _withOldInfo	=	this.menus.filter(x => x.tiempo_comida_id < 7);
	console.log('_withOldInfo');
	console.log(_withOldInfo);
	if(_withOldInfo[0])
		this.displayOldTiemposComida	=	true;

	this.setInfoInit();
	
	
	this.prescripcion	=	this.model.getFormPrescripcion();
	this.items			=	this.prescripcion.items;

	for(var i=0;i<13;i++)
		this.prescritos[i]	=	0;
	
	var obj;
	for(var i =0;i<this.items.length;i++){
		obj	=	this.items[i];
		this.prescritos[obj.id]	=	obj.porciones;
	}
	
	this.setTotales();
	this.tiempo_comida_nombre	=	'';
  }
	ngOnDestroy() {
		if(!this.navitation)
			this.saveForm();
		this.tagBody.classList.remove('menu-parent-dieta');
		this.helpers.scrollToForm(true);
	}
	setInfoInit(){		
		this.custom_tiempo_comidas	=	this.model.getTiempoComidasDeNutricionista();
		var ejemplos	=	this.formControlDataService.getFormControlData().patron_menu_ejemplos;

		for(var j in this.custom_tiempo_comidas){
			if(ejemplos){
				var __aEjemplo	=	ejemplos.filter(x => x.tiempo_comida_id === this.custom_tiempo_comidas[j].id);
				if( __aEjemplo[0] ){
					this.custom_tiempo_comidas[j].ejemplo	=	__aEjemplo[0].​​ejemplo;
				}
			}				
			this.custom_tiempo_comidas[j].menu	=	{};
			if(this.menus){
				var __aMenu	=	this.menus.filter(x => x.tiempo_comida_id === this.custom_tiempo_comidas[j].id);
				if(__aMenu[0]){
					let a_Menu	=	__aMenu;
					for(var f in a_Menu){
						let _item	=	a_Menu[f];
						this.custom_tiempo_comidas[j].menu[_item.grupo_alimento_nutricionista_id]		=	_item.porciones;
					}
					this.custom_tiempo_comidas[j].summary	=	this.concatenar(this.custom_tiempo_comidas[j].menu);
				}
			}
		}

		this.pme.dieta_desayuno_ejemplo			=	this.model.dieta_desayuno_ejemplo;
		this.pme.dieta_media_manana_ejemplo		=	this.model.dieta_media_manana_ejemplo;
		this.pme.dieta_almuerzo_ejemplo			=	this.model.dieta_almuerzo_ejemplo;
		this.pme.dieta_media_tarde_ejemplo		=	this.model.dieta_media_tarde_ejemplo;
		this.pme.dieta_cena_ejemplo				=	this.model.dieta_cena_ejemplo;
		this.pme.dieta_coicion_nocturna_ejemplo	=	this.model.dieta_coicion_nocturna_ejemplo;
		
		
		this.abkp	=	this.helpers.clone(this.custom_tiempo_comidas);
		
		var aMenu	=	{};
		this.oMenu	=	{};
		if(this.menus){
			for(var i in this.menus){
				var item	=	this.menus[i];
				var tiempo_de_comida	=	item.tiempo_comida_id;
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
		}
		for(var j in this.custom_tiempo_comidas){
			this.oMenu[this.custom_tiempo_comidas[j].id]	=	this.copy( this.custom_tiempo_comidas[j].menu );		
		}		
	}
	copy(data){
		var myArray={};
		for(var i in data){
			myArray[i]	=	data[i];
		}
		return myArray;
	}
	prepare__old(id_consulta){
		var myArray=[];
		var menus	=	[];
		menus[0]	=	this.arrayMenuDesayuno;
		menus[1]	=	this.arrayMenuMediaManana;
		menus[2]	=	this.arrayMenuAlmuerzo;
		menus[3]	=	this.arrayMenuMediaTarde;
		menus[4]	=	this.arrayMenuCena;
		menus[5]	=	this.arrayMenuCoicionNocturna;
		var j=0;
		for(var a in menus){
			var data	=	menus[a];
			var tiempoComida	=	Number(a) + 1;
			for(var i in data){
				var grupoAlimentoNutricionista	=	Number(i);
				if(Number(i)>0){
					myArray[j]	=	{'consulta_id': id_consulta, 'ejemplo': '', 'grupo_alimento_nutricionista_id': grupoAlimentoNutricionista, 'porciones': data[grupoAlimentoNutricionista], 'tiempo_comida_id': tiempoComida}
					j++;
				}
			}
		}
		return myArray;
	}
	prepare(id_consulta){
		var myArray=[];
		var menus	=	[];
		menus[0]	=	this.arrayMenuDesayuno;
		menus[1]	=	this.arrayMenuMediaManana;
		menus[2]	=	this.arrayMenuAlmuerzo;
		menus[3]	=	this.arrayMenuMediaTarde;
		menus[4]	=	this.arrayMenuCena;
		menus[5]	=	this.arrayMenuCoicionNocturna;

		for(var k in this.custom_tiempo_comidas){
			menus.push(this.custom_tiempo_comidas[k]);
		}
		/*console.log('menus');console.log(menus);*/
		var j=0;
		for(var a in menus){
			var data	=	menus[a].menu;
			var tiempoComida	=	menus[a].id;
			for(var i in data){
				var grupoAlimentoNutricionista	=	Number(i);
				if(Number(i)>0){
					let _data	=	{'consulta_id': id_consulta, 'ejemplo': '', 'grupo_alimento_nutricionista_id': grupoAlimentoNutricionista, 'porciones': data[grupoAlimentoNutricionista], 'tiempo_comida_id': tiempoComida};
					myArray.push(_data);
				}
			}
		}
		console.log('prepare:');console.log(myArray);
		return myArray;
	}
	infoEdited(){
		var result1	=	this.infoEditedEjemplos();
		var result2	=	this.infoEditedPorciones();
		var result	=	result1 || result2;
		return result;
	}
	infoEditedEjemplos(){
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

		for(var j in this.custom_tiempo_comidas){
			if(this.abkp[j].ejemplo!==this.custom_tiempo_comidas[j].ejemplo)
				tiempo_de_comidas[++i]	=	{'tiempo_id':this.custom_tiempo_comidas[j].id, 'ejemplo': this.custom_tiempo_comidas[j].ejemplo };
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
			];
			
			var k	=	this.asignacionPorciones.length - 1;
			
			for(var j in this.custom_tiempo_comidas){
				this.asignacionPorciones[++k]	=	{'tiempo_id':this.custom_tiempo_comidas[j].id, 'porciones': this.custom_tiempo_comidas[j].menu };
			}
			
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
					default:
						var _aMenu	=	this.custom_tiempo_comidas.filter(x => x.id === Number(i));
						obj2	=	_aMenu[0].menu;
				}
				if(JSON.stringify(oItem) !== JSON.stringify(obj2)){
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
			this.data['consulta_id']	=	 this.model.getFormConsulta().id;
			this.saveInfo(this.data);
			
		}
	}
	updateItems(){
		this.menus		=	{};
		this.menus[0]	=	'';
		var id_consulta	=	this.model.getFormConsulta().id;
		this.menus		=	this.prepare(id_consulta)
		this.model.setPatronMenu(this.menus);
		this.formControlDataService.setFormControlData(this.model);		
	}
	saveInfo(data){console.log('saveInfo');console.log(data);
		this.tagBody.classList.add('sending');
		this.formControlDataService.saveDatosPatronMenu(data)
		.subscribe(
			 response  => {
						this.tagBody.classList.remove('sending');
						},
			error =>  console.log(<any>error)
		);
	}
  porciones(alimento_name, alimento_id){	  
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
		
		var _aMenu	=	{};
		var aMenu		=	{};
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
			default:
				_aMenu	=	this.custom_tiempo_comidas.filter(x => x.id === this.currentTiempoComida);
				if(_aMenu[0]){
					if(_aMenu[0].menu)
						aMenu		=	_aMenu[0].menu;
					else
						_aMenu[0].menu	=	{};
				}					
		}
		aMenu[alimento_id]	=	cantidad;
		this.arrayMenuCurrent	=	aMenu;
		if(_aMenu[0])
			_aMenu[0].summary	=	this.concatenar(aMenu);
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
		this.inputModal	=	summary;
		return summary;
  }
	summary_tiempoComida(aMenu){
		var summary	=	'';
		for(var i in aMenu){
			if(aMenu[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuDesayuno[i] + ' ' + this.alimentos[i];;
			}
		}
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
		this.concatenar(aMenu);
		window.scrollTo(0, 0);
   }
   showModalPorcionesNew(tiempoComida){
		this.inputModal	=	'';
		this.currentTiempoComida	=	tiempoComida;
		var aMenu	=	{};
		
		var oTiempoComida	=	this.custom_tiempo_comidas.filter(x => x.id === tiempoComida);
		console.log(oTiempoComida);
		aMenu	=	oTiempoComida[0].menu;

		this.porciones_leche_descremada	=	aMenu[1];
		this.porciones_leche_2			=	aMenu[2];
		this.porciones_leche_entera		=	aMenu[3];
		this.porciones_vegetales		=	aMenu[4];
		this.porciones_frutas			=	aMenu[5];
		this.porciones_harinas			=	aMenu[6];
		this.porciones_carne_magra		=	aMenu[7];
		this.porciones_carne_intermedia	=	aMenu[8];
		this.porciones_carne_grasa		=	aMenu[9];
		this.porciones_azucares			=	aMenu[10];
		this.porciones_grasas			=	aMenu[11];
		this.porciones_vaso_agua		=	aMenu[12];
		
		/*var tiempo_de_comida	=	this.tiempos[tiempoComida];
		this.label_modal_porciones	=	tiempo_de_comida.toString()*/

		this.label_modal_porciones	=	oTiempoComida[0].nombre;
		
		this.displayModalPorciones=true;
		let body = document.getElementsByTagName('body')[0];
		body.classList.add('open-modal');
		this.concatenar(aMenu);
		window.scrollTo(0, 0);
		}
   closeModalPorciones(){
		let body = document.getElementsByTagName('body')[0];
		this.displayModalPorciones=false;
		body.classList.remove('open-modal');
		this.inputModal	=	'';
		this.setTotales();
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
		
		for(var j in this.custom_tiempo_comidas){
			if(this.custom_tiempo_comidas[j].menu[alimento_id])
				total	+=	Number(this.custom_tiempo_comidas[j].menu[alimento_id]);
		}
	  return total;	  
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

	showFormEdit(){
		this.nuevo	=	!this.nuevo;
	}
	save(data){
		this.tiempo_comida_nombre_message	=	'';
		this.formControlDataService.store('tiempo_comida', data)
		.subscribe(
			 response  => {
						this.setTiempoComida(response);
						},
			error =>  console.log(<any>error)
		);
	}
	setTiempoComida(response){
		if(response.code==208){
			this.tiempo_comida_nombre_message	=	response.message;
			return ;
		}
		if(response.code==201){
			this.tiempo_comida_nombre	=	'';
			this.custom_tiempo_comidas.push(response.data);
			this.abkp.push(response.data);
			this.nuevo	=	false;
		}
	}
	isValid(){
		return true;/*this.tiempo_comida_nombre!='';*/
	}
	adicionarNuevo(){
		if(this.isValid()){
			this.data['0']				=	'';
			this.data['nutricionista_id']	=	 this.model.nutricionista_id;
			this.data['tiempo_comida_nombre']	=	 this.tiempo_comida_nombre;
			this.save(this.data);
		}else
			alert('campo vacio')
		return true;
	}
	
	
	Previous(){
		this.saveForm();
		this.router.navigate(['/dieta']);
	}
	Next(){
		this.navitation	=	true;
		this.saveForm();
		this.router.navigate(['/notas']);
	}
}
