import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Analisis,PatronMenu, PatronMenuEjemplo, Paciente } from '../../data/formControlData.model';
import { FormControlDataService }     from '../../data/formControlData.service';

@Component({
  selector: 'app-patronmenu',
  templateUrl: './patronmenu.component.html',
  styles: []
})
export class PatronmenuComponent implements OnInit {
  menus:{ [id: string]: any; } = {'0':''}; 
  asignacionPorciones: {};
  asignacionEjemplos: {};
  model:any;
  showmodal:boolean=false;
  showmodalgraficos:boolean=false;
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

  arrayMenuDesayuno:{ [id: string]: any; } = {'0':''}; 
  arrayMenuMediaManana:{ [id: string]: any; } = {'0':''}; 
  arrayMenuAlmuerzo:{ [id: string]: any; } = {'0':''}; 
  arrayMenuMediaTarde:{ [id: string]: any; } = {'0':''}; 
  arrayMenuCena:{ [id: string]: any; } = {'0':''}; 
  arrayMenuCoicionNocturna:{ [id: string]: any; } = {'0':''};
  arrayMenuCurrent:{ [id: string]: any; } = {'0':''};
  
	alimentos:Object[]=[];
	tiempos:Object[]=[];
	//data:Object[]=[];
	data:{ [id: string]: any; } = {'0':''}; 
	oData:{ [id: string]: any; } = {'0':''}; 
	pme:PatronMenuEjemplo=new PatronMenuEjemplo();
	
	tagBody:any;
	oMenu:{ [id: string]: any; } = {'0':''};
  constructor(private router: Router, private formControlDataService: FormControlDataService) {
    this.model	=	formControlDataService.getFormControlData();
	/*
	this.menus	=	formControlDataService.getFormControlData().patronmenu;	
	
	console.log('cargando Patron Menu');
	console.log(this.menus);
	this.setInfoInit();
	*/
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
	
	this.tagBody = document.getElementsByTagName('body')[0];
	this.tagBody.classList.add('menu-parent-dieta');
	
	this.menus	=	this.formControlDataService.getFormControlData().patronmenu;
	console.log('cargando Patron Menu');
	console.log(this.menus);
	this.setInfoInit();
	
  }
	ngOnDestroy() {
		this.saveForm();
/*
		if(this.infoEdited()){
			this.data['0']	=	'';
			this.saveInfo(this.data);
		}
		
*/

		this.tagBody.classList.remove('menu-parent-dieta');
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
	copy(data){
		var myArray={};
		for(var i in data){
			/*console.log(i)console.log(data[i])*/
			myArray[i]	=	data[i];
		}
		return myArray;
	}
	//prepare(data, tiempo_comida_id, id_consulta){
	prepare(id_consulta){
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
	infoEdited(){		
		
		var result	=	this.infoEditedEjemplos() || this.infoEditedPorciones();
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
			console.log('CAMBIOS');
			this.updateItems();
			this.data['0']				=	'';
			this.data['consulta_id']	=	 this.model.getFormConsulta().id;
			this.saveInfo(this.data);
			
		}
	}
	updateItems(){
		/*console.log('current this.menus');
		console.log(this.menus);*/
		this.menus		=	{};
		this.menus[0]	=	'';
		var id_consulta	=	this.model.getFormConsulta().id;
/*		this.menus[1]	=	this.prepare(this.arrayMenuDesayuno,1, id_consulta);
		this.menus[2]	=	this.prepare(this.arrayMenuMediaManana,2, id_consulta);
		this.menus[3]	=	this.prepare(this.arrayMenuAlmuerzo,3, id_consulta);
		this.menus[4]	=	this.prepare(this.arrayMenuMediaTarde,4, id_consulta);
		this.menus[5]	=	this.prepare(this.arrayMenuCena,5, id_consulta);
		this.menus[6]	=	this.prepare(this.arrayMenuCoicionNocturna,6, id_consulta);
*/
		this.menus		=	this.prepare(id_consulta)
		/*console.log('updated this.menus');
		console.log(this.menus);*/
		this.model.setPatronMenu(this.menus);
		this.formControlDataService.setFormControlData(this.model);		
		console.log('global this.model');
		console.log(this.formControlDataService.getFormControlData().patronmenu);
	}
	saveInfo(data){		
		this.tagBody.classList.add('sending');
		console.log('saveInfo:sending...');
		console.log(data);
		this.formControlDataService.saveDatosPatronMenu(data)
		.subscribe(
			 response  => {
						console.log('saveInfo:receiving...');
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
   }
   closeModalPorciones(){
		let body = document.getElementsByTagName('body')[0];
		this.displayModalPorciones=false;
		body.classList.remove('open-modal');
		this.inputModal	=	'';
		
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
		this.saveForm();
		this.router.navigate(['/dieta']);
	}
	Next(){
		this.saveForm();
		this.router.navigate(['/notas']);
	}
}
