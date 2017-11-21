import { Component, OnInit } from '@angular/core';

import { Analisis,PatronMenu } from '../../data/formControlData.model';
import { FormControlDataService }     from '../../data/formControlData.service';

@Component({
  selector: 'app-patronmenu',
  templateUrl: './patronmenu.component.html',
  styles: []
})
export class PatronmenuComponent implements OnInit {
  menus: any[];
  model:any;
  showmodal:boolean=false;
  showmodalgraficos:boolean=false;

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

  arrayMenuDesayuno:{ [id: string]: any; } = {}; 
  arrayMenuMediaManana:{ [id: string]: any; } = {}; 
  arrayMenuAlmuerzo:{ [id: string]: any; } = {}; 
  arrayMenuMediaTarde:{ [id: string]: any; } = {}; 
  arrayMenuCena:{ [id: string]: any; } = {}; 
  arrayMenuCoicionNocturna:{ [id: string]: any; } = {};
  arrayMenuCurrent:{ [id: string]: any; } = {};

  constructor(private formControlDataService: FormControlDataService) {
    this.model	=	formControlDataService.getFormControlData();
    this.menus	=	formControlDataService.getFormControlData().patronmenu;	
  }
  porciones(alimento_name, alimento_id){
	  /*console.log(event); */
	  console.log(alimento_id);
	  
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
		switch(alimento_id){
			case 1:
				aMenu[alimento_name]	=	this.porciones_leche_descremada;
				break;
			case 2:
				aMenu[alimento_name]	=	this.porciones_leche_2;
				break;
			case 3:
				aMenu[alimento_name]	=	this.porciones_leche_entera;
				break;
			case 4:
				aMenu[alimento_name]	=	this.porciones_vegetales;
				break;
			case 5:
				aMenu[alimento_name]	=	this.porciones_frutas;
				break;
			case 6:
				aMenu[alimento_name]	=	this.porciones_harinas;
				break;
			case 7:
				aMenu[alimento_name]	=	this.porciones_carne_magra;
				break;
			case 8:
				aMenu[alimento_name]	=	this.porciones_carne_intermedia;
				break;
			case 9:
				aMenu[alimento_name]	=	this.porciones_carne_grasa;
				break;
			case 10:
				aMenu[alimento_name]	=	this.porciones_azucares;
				break;
			case 11:
				aMenu[alimento_name]	=	this.porciones_grasas;
				break;
			case 12:
				aMenu[alimento_name]	=	this.porciones_vaso_agua;
				break;
			
		}
		this.arrayMenuCurrent	=	aMenu;
		//this.concatenar(aMenu);
  }
	get summary(){
		var summary	=	'';
		for(var i in this.arrayMenuCurrent){
			if(this.arrayMenuCurrent[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuCurrent[i] + ' ' + i;
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
				summary	+=	this.arrayMenuDesayuno[i] + ' ' + i;
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
				summary	+=	this.arrayMenuMediaManana[i] + ' ' + i;
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
				summary	+=	this.arrayMenuAlmuerzo[i] + ' ' + i;
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
				summary	+=	this.arrayMenuMediaTarde[i] + ' ' + i;
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
				summary	+=	this.arrayMenuCena[i] + ' ' + i;
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
				summary	+=	this.arrayMenuCoicionNocturna[i] + ' ' + i;
			}
		}
		return summary;
  }
   showModalPorciones(tiempoComida, nameTiempoComida){
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
	   console.log('cargar menu');
	   console.log(aMenu);
	   /*this.porciones_leche_descremada	=	aMenu[1];
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
	   this.porciones_vaso_agua			=	aMenu[12];*/
	   this.porciones_leche_descremada	=	aMenu['leche_descremada'];
	   this.porciones_leche_2			=	aMenu['leche_2'];
	   this.porciones_leche_entera		=	aMenu['leche_entera'];
	   this.porciones_vegetales			=	aMenu['vegetales'];
	   this.porciones_frutas			=	aMenu['frutas'];
	   this.porciones_harinas			=	aMenu['harinas'];
	   this.porciones_carne_magra		=	aMenu['carne_magra'];
	   this.porciones_carne_intermedia	=	aMenu['carne_intermedia'];
	   this.porciones_carne_grasa		=	aMenu['carne_grasa'];
	   this.porciones_azucares			=	aMenu['azucares'];
	   this.porciones_grasas			=	aMenu['grasas'];
	   this.porciones_vaso_agua			=	aMenu['vaso_agua'];
	   
	   //this.label_modal_porciones	=	titulo;	   
	   this.displayModalPorciones=true;
	   let body = document.getElementsByTagName('body')[0];
		body.classList.add('open-modal');
   }
   closeModalPorciones(){
		let body = document.getElementsByTagName('body')[0];
		this.displayModalPorciones=false;
		body.classList.remove('open-modal');
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
  ngOnInit() {

  }
  get currentArray() {
		return JSON.stringify(this.arrayMenuDesayuno);
	}

}
