import { Component, OnInit } from '@angular/core';

import { Analisis,PatronMenu, Paciente } from '../../data/formControlData.model';
import { FormControlDataService }     from '../../data/formControlData.service';

@Component({
  selector: 'app-patronmenu',
  templateUrl: './patronmenu.component.html',
  styles: []
})
export class PatronmenuComponent implements OnInit {
  menus: any[];
  asignacionPorciones: {};
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


  constructor(private formControlDataService: FormControlDataService) {
    this.model	=	formControlDataService.getFormControlData();
    this.menus	=	formControlDataService.getFormControlData().patronmenu;	
	console.log(this.menus);
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
	this.alimentos['10']	=	'Azucares';
	this.alimentos['11']	=	'Grasas';
	this.alimentos['12']	=	'Vasos de Agua';

	this.tiempos['']	=	'';
	this.tiempos['1']	=	'Desayuno';
	this.tiempos['2']	=	'Media Mañana';
	this.tiempos['3']	=	'Almuerzo';
	this.tiempos['4']	=	'Media Tarde';
	this.tiempos['5']	=	'Cena';
	this.tiempos['6']	=	'Coici&oacute;n Nocturna';
  }
	ngOnDestroy() {
		//this.formControlDataService.getFormControlData().getFormPaciente().set(this.paciente);
		if(this.infoEdited())
			this.saveInfo(this.asignacionPorciones);

	}
	setInfoInit(){
/*		this.oPaciente.cedula				=	this.paciente.cedula;
		this.oPaciente.nombre				=	this.paciente.nombre;
		this.oPaciente.genero				=	this.paciente.genero;
		this.oPaciente.fecha_nac			=	this.paciente.fecha_nac;
		this.oPaciente.responsable_cedula	=	this.paciente.responsable_cedula;
		this.oPaciente.responsable_nombre	=	this.paciente.responsable_nombre;
		this.oPaciente.responsable_parentezco	=	this.paciente.responsable_parentezco;*/
	}
	
	infoEdited(){
		return 	true;
/*		return 	(
			this.oPaciente.cedula					!==	this.paciente.cedula || 
			this.oPaciente.nombre					!==	this.paciente.nombre || 
			this.oPaciente.genero					!==	this.paciente.genero || 
			this.oPaciente.fecha_nac				!==	this.paciente.fecha_nac || 
			this.oPaciente.responsable_cedula		!==	this.paciente.responsable_cedula || 
			this.oPaciente.responsable_nombre		!==	this.paciente.responsable_nombre || 
			this.oPaciente.responsable_parentezco	!==	this.paciente.responsable_parentezco
		);
*/
	}
	save(){
		this.asignacionPorciones = {
				'0': '',
				'1': this.arrayMenuDesayuno,
				'2': this.arrayMenuMediaManana,
				'3': this.arrayMenuAlmuerzo,
				'4': this.arrayMenuMediaTarde,
				'5': this.arrayMenuCena,
				'6': this.arrayMenuCoicionNocturna,
			};
		this.saveInfo(this.asignacionPorciones);
	}
	saveInfo(data){
		console.log('saveInfo:sending...');
		console.log(data);
		this.formControlDataService.saveDatosPatronMenu(data)
		.subscribe(
			 response  => {
						console.log('saveInfo:receiving...');
						console.log(response);
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

}
