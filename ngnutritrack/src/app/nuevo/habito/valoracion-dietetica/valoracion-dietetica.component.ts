import { Component, OnInit } from '@angular/core';

import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-valoracion-dietetica',
  templateUrl: './valoracion-dietetica.component.html',
  styles: []
})
export class ValoracionDieteticaComponent implements OnInit {
	prescripcion:any;
	
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
  arrayMenuAgua:{ [id: string]: any; } = {'0':''};
  arrayMenuGaseosa:{ [id: string]: any; } = {'0':''};
  arrayJugosEmpacados:{ [id: string]: any; } = {'0':''};
  arrayMenuComidasRapidas:{ [id: string]: any; } = {'0':''};
  arrayMenuAlimentosEmpacados:{ [id: string]: any; } = {'0':''};
  arrayMenuEmbutidos:{ [id: string]: any; } = {'0':''};
  
  arrayMenuCurrent:{ [id: string]: any; } = {'0':''};
  
  porcentaje_carbohidratos:number;
  porcentaje_proteinas:number;
  porcentaje_grasas:number;
  porcentaje_kcal:number;
  
	alimentos:Object[]=[];
	tiempos:Object[]=[];
	//data:Object[]=[];
	data:{ [id: string]: any; } = {'0':''}; 
	oData:{ [id: string]: any; } = {'0':''}; 
	//pme:PatronMenuEjemplo=new PatronMenuEjemplo();
	
	tagBody:any;
	oMenu:{ [id: string]: any; } = {'0':''};
	
  constructor(private formControlDataService: FormControlDataService) {
    this.model	=	formControlDataService.getFormControlData();
  }

	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		this.tagBody.classList.add('menu-parent-habito');
		this.initAlimentos();
	}
	ngOnDestroy(){
		this.tagBody.classList.remove('menu-parent-habito');	
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
		
/*		this.menus	=	this.formControlDataService.getFormControlData().patronmenu;
		console.log('cargando Patron Menu');
		console.log(this.menus);
		this.setInfoInit();
*/		
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
		this.mostrarModal();
		this.concatenar(aMenu);
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
  get summary_dieta_agua(){
		var summary	=	'';
		for(var i in this.arrayMenuAgua){
			if(this.arrayMenuAgua[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuAgua[i] + ' ' + this.alimentos[i];
			}
		}
		return summary;
  }
  get summary_dieta_gaseosa(){
		var summary	=	'';
		for(var i in this.arrayMenuGaseosa){
			if(this.arrayMenuGaseosa[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuGaseosa[i] + ' ' + this.alimentos[i];
			}
		}
		return summary;
  }
  get summary_dieta_jugos_empacados(){
		var summary	=	'';
		for(var i in this.arrayJugosEmpacados){
			if(this.arrayJugosEmpacados[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayJugosEmpacados[i] + ' ' + this.alimentos[i];
			}
		}
		return summary;
  }
  get summary_dieta_comidas_rapidas(){
		var summary	=	'';
		for(var i in this.arrayMenuComidasRapidas){
			if(this.arrayMenuComidasRapidas[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuComidasRapidas[i] + ' ' + this.alimentos[i];
			}
		}
		return summary;
  }
  get summary_dieta_alimentos_empacados(){
		var summary	=	'';
		for(var i in this.arrayMenuAlimentosEmpacados){
			if(this.arrayMenuAlimentosEmpacados[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuAlimentosEmpacados[i] + ' ' + this.alimentos[i];
			}
		}
		return summary;
  }
  get summary_dieta_embutidos(){
		var summary	=	'';
		for(var i in this.arrayMenuEmbutidos){
			if(this.arrayMenuEmbutidos[i]){
				if(summary)
					summary	+=	', ';
				summary	+=	this.arrayMenuEmbutidos[i] + ' ' + this.alimentos[i];
			}
		}
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

	  console.log('alimento_id: ' + alimento_id + ' -> '  + total);
	  return total;	  
  }
/*

  porcentaje_carbohidratos:number;
  porcentaje_proteinas:number;
  porcentaje_grsas:number;
  porcentaje_kcal
*/
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
	var total_proteinas		=	this.calcularProteinas();
	var total_grasas		=	this.calcularGrasas();
	var total				=	total_carbohidratos	+	total_proteinas	+ total_grasas;
	this.porcentaje_carbohidratos	=	(total_carbohidratos*100)/total;
	return this.porcentaje_carbohidratos;
  }
  get porcentaje_de_proteinas(){
	  var total_carbohidratos	=	this.calcularCarbohidratos();
	var total_proteinas		=	this.calcularProteinas();
	var total_grasas		=	this.calcularGrasas();
	var total				=	total_carbohidratos	+	total_proteinas	+ total_grasas;
	
	this.porcentaje_proteinas		=	(total_proteinas*100)/total;
	return this.porcentaje_proteinas;
	
  }
  get porcentaje_de_grasas(){
  var total_carbohidratos	=	this.calcularCarbohidratos();
	var total_proteinas		=	this.calcularProteinas();
	var total_grasas		=	this.calcularGrasas();
	var total				=	total_carbohidratos	+	total_proteinas	+ total_grasas;
	this.porcentaje_grasas			=	(total_grasas*100)/total;
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


   
}
