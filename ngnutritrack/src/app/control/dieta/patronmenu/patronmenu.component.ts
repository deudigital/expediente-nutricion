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
  /*asignacionPorciones:any;*/
  asignacionPorciones:{ [id: string]: any; } = {};
  model:any;
  helpers:any;
  showmodal:boolean=false;
  showmodalgraficos:boolean=false;
  inputModal:any;
  
  prescripcion=new Prescripcion();
  items:PrescripcionItem[]=[]; 
  patron_menu_ejemplos:any[]=[]; 
  
  showTabGrafico:boolean=false;
  showTabDatos:boolean=true;
  tab_class_datos:string='';
  tab_class_graficos:string='';
  
  displayModalPorciones:boolean=false;
  displayOldTiemposComida:boolean=false;
  label_modal_porciones:string='';
  
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

	alimentos:Object[]=[];
	tiempos:Object[]=[];
	data:{ [id: string]: any; } = {'0':''}; 
	oData:{ [id: string]: any; } = {'0':''}; 
	pme:PatronMenuEjemplo=new PatronMenuEjemplo();
	
	abkp:any;
	
	tagBody:any;
	oMenu:{ [id: string]: any; } = {'0':''};
	
	prescritos:Object[]=[];
	
	navigation:boolean=false;
	nuevo:boolean=false;
	
	tiempo_comida_nombre:string;
	tiempo_comida_nombre_message:string;
	custom_tiempo_comidas:any;
	current_dieta_id:number=0;
	
  constructor(private router: Router, private formControlDataService: FormControlDataService) {/*console.log('patronmenu:constructor');*/
	this.model	=	formControlDataService.getFormControlData();
	this.helpers	=	this.model.getHelpers();
  }
  ngOnInit() {/*console.log('patronmenu:ngOnInit');*/
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

	this.tagBody = document.getElementsByTagName('body')[0];
	this.tagBody.classList.add('menu-parent-dieta');
	this.navigation	=	false;
	this.current_dieta_id	=	this.formControlDataService.getFormControlData().current_dieta_id;
	this.menus	=	this.helpers.clone(this.formControlDataService.getFormControlData().patronmenu);
	this.setInfoInit();
	this.setAsignaciones();
	this.setTotales();
	this.tiempo_comida_nombre	=	'';
	/*this._loadValuesInForm();*/
  }
	ngOnDestroy() {
		if(!this.navigation){
			this.saveForm();
		}
		this.tagBody.classList.remove('menu-parent-dieta');
		this.helpers.scrollToForm(true);
	}
	_loadValuesInForm(){
		this.menus	=	this.model.patronmenu;
		this.setInfoInit();
		this.setAsignaciones();
		this.setTotales();
		this.tiempo_comida_nombre	=	'';
	}
	setInfoInit(){/*console.log('setInfoInit', this.menus );*/
		this.custom_tiempo_comidas	=	[];
		this.custom_tiempo_comidas	=	this.helpers.clone(this.model.getTiempoComidasDeNutricionista());
		var ejemplos	=	[];
		ejemplos	=	this.formControlDataService.getFormControlData().patron_menu_ejemplos;
		for(var j in this.custom_tiempo_comidas){
			if(ejemplos){
				var __aEjemplo	=	ejemplos.filter(x => x.tiempo_comida_id === this.custom_tiempo_comidas[j].id);
				if( __aEjemplo[0] ){
					this.custom_tiempo_comidas[j].ejemplo	=	__aEjemplo[0].​​ejemplo;
				}else
					this.custom_tiempo_comidas[j].ejemplo	=	'';
			}else
					this.custom_tiempo_comidas[j].ejemplo	=	'';
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
				}else
					this.custom_tiempo_comidas[j].summary	=	'';
			}else
					this.custom_tiempo_comidas[j].summary	=	'';
		}
    		this.abkp	=	this.helpers.clone(this.custom_tiempo_comidas);
		var aMenu	=	{};
		this.oMenu	=	{};
		for(var j in this.custom_tiempo_comidas){
			this.oMenu[this.custom_tiempo_comidas[j].id]	=	this.copy( this.custom_tiempo_comidas[j].menu );
		}
	}
	setAsignaciones(){
		this.prescripcion	=	this.model.getFormPrescripcion();
		this.items			=	this.helpers.clone(this.prescripcion.items);
		this.prescritos		=	[];
		for(var i=0;i<13;i++)
			this.prescritos[i]	=	0;

		var obj;
		for(var i =0;i<this.items.length;i++){
			obj	=	this.items[i];
			this.prescritos[obj.id]	=	obj.porciones;
		}
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
	copy(data){
		var myArray={};
		for(var i in data){
			myArray[i]	=	data[i];
		}
		return myArray;
	}
/*	prepare(id_consulta){
		var myArray=[];
		var menus	=	[];
		for(var k in this.custom_tiempo_comidas){
			menus.push(this.custom_tiempo_comidas[k]);
		}
		var j=0;
		var grupoAlimentoNutricionista	=	0;
		for(var a in menus){
			var data	=	menus[a].menu;
			var tiempoComida	=	menus[a].id;
			for(var i in data){
				if(Number(i)>0){
					grupoAlimentoNutricionista	=	Number(i);
					let _data	=	{'consulta_id': id_consulta, 'dieta_id': id_consulta, 'ejemplo': '', 'grupo_alimento_nutricionista_id': grupoAlimentoNutricionista, 'porciones': data[grupoAlimentoNutricionista], 'tiempo_comida_id': tiempoComida};
					myArray.push(_data);
				}
			}
		}
		return myArray;
	}*/
	/*prepareEjemplos(id_consulta){
		var i=0;
		var tiempo_de_comidas_ejemplos	=	[];
		for(var j in this.custom_tiempo_comidas){
			tiempo_de_comidas_ejemplos.push( {'consulta_id': id_consulta, 'ejemplo': this.custom_tiempo_comidas[j].ejemplo, 'id': 0, 'tiempo_comida_id': this.custom_tiempo_comidas[j].id} );
		}				
		return tiempo_de_comidas_ejemplos;
	}*/
	prepare(dieta_id){
		var myArray=[];
		var menus	=	[];
		for(var k in this.custom_tiempo_comidas){
			menus.push(this.custom_tiempo_comidas[k]);
		}
		var j=0;
		var grupoAlimentoNutricionista	=	0;
		for(var a in menus){
			var data	=	menus[a].menu;
			var tiempoComida	=	menus[a].id;
			for(var i in data){
				if(Number(i)>0){
					grupoAlimentoNutricionista	=	Number(i);
					let _data	=	{'dieta_id': dieta_id, 'ejemplo': '', 'grupo_alimento_nutricionista_id': grupoAlimentoNutricionista, 'porciones': data[grupoAlimentoNutricionista], 'tiempo_comida_id': tiempoComida};
					myArray.push(_data);
				}
			}
		}/*console.log('prepare', myArray);*/
		return myArray;
	}
	prepareEjemplos(dieta_id){
		var i=0;
		var tiempo_de_comidas_ejemplos	=	[];
		for(var j in this.custom_tiempo_comidas){
			tiempo_de_comidas_ejemplos.push( {'dieta_id': dieta_id, 'ejemplo': this.custom_tiempo_comidas[j].ejemplo, 'id': 0, 'tiempo_comida_id': this.custom_tiempo_comidas[j].id} );
		}				
		return tiempo_de_comidas_ejemplos;
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
		for(var j in this.custom_tiempo_comidas){
			if(this.abkp[j].ejemplo!==this.custom_tiempo_comidas[j].ejemplo){
				tiempo_de_comidas.push( {'tiempo_id':this.custom_tiempo_comidas[j].id, 'ejemplo': this.custom_tiempo_comidas[j].ejemplo } );
			}
		}
		if(tiempo_de_comidas.length>0){
			this.data['tiempos']	=	tiempo_de_comidas;
			return true;
		}
		return false;
	}
	infoEditedPorciones(){
		if(this.chechChangesItems()){
			var k	=	0;
			for(var j in this.custom_tiempo_comidas){
				let item	=	this.custom_tiempo_comidas[j];
				this.asignacionPorciones[k]	=	{'tiempo_id':item.id, 'porciones': item.menu };
				k++;
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
				var _aMenu	=	this.custom_tiempo_comidas.filter(x => x.id === Number(i));
				obj2	=	_aMenu[0].menu;
						
				if(JSON.stringify(oItem) !== JSON.stringify(obj2)){
					return true;
				}
			}
		}
		return false;
	}
	saveForm(){
		if(this.infoEdited()){/*console.log('PatronMenu:infoEdited->saveForm');*/
			this.updateItems();
			this.data['0']				=	'';
			this.data['consulta_id']	=	 this.model.getFormConsulta().id;
			this.data['dieta_id']		=	 this.model.current_dieta_id;
			this.saveInfo(this.data);
			
		}
	}
	updateItems(){
		this.menus		=	{};
		this.menus[0]	=	'';
		/*var id_consulta	=	this.model.getFormConsulta().id;
		this.menus		=	this.prepare(id_consulta);
		this.patron_menu_ejemplos		=	this.prepareEjemplos(id_consulta);*/
		this.menus						=	this.prepare( this.model.current_dieta_id );
		this.patron_menu_ejemplos		=	this.prepareEjemplos( this.model.current_dieta_id );
		
		/*this.model.patron_menu	=	this.menus;*/
		this.model.patronmenu	=	this.menus;
		this.model.patron_menu_ejemplos	=	this.patron_menu_ejemplos;
		
		/*this.model.setPatronMenu(this.model.current_dieta_id, this.menus);*/
		/*this.model.setPatronMenuEjemplos( this.model.current_dieta_id, this.patron_menu_ejemplos);*/
		
		
		this.formControlDataService.setFormControlData(this.model);
		
	}
	saveInfo(data){
		this.tagBody.classList.add('sending');
		this.formControlDataService.saveDatosPatronMenu(data)
		.subscribe(
			 response  => {
						this.model._displayMessage( response );
						this.setPatronMenuCurrentDieta(response);
						this.tagBody.classList.remove('sending');
			},
			error =>  {
				this.model._displayMessage();
				console.log(<any>error)
			}
		);
	}
	setPatronMenuCurrentDieta(response){
		var filter_dieta	=	this.model.dietas.filter(x => x.dieta_id === response.dieta_id);
		var _dieta		=	filter_dieta[0];
	
		if(response.items.patron_menu){
			_dieta.patron_menu	=	response.items.patron_menu;
			/*if(_dieta.patronmenu){
				for(var j in this.custom_tiempo_comidas){
						var __aMenu	=	_dieta.patronmenu.filter(x => x.tiempo_comida_id === this.custom_tiempo_comidas[j].id);
					if(__aMenu[0]){
						let a_Menu	=	__aMenu;
						for(var f in a_Menu){
							let _item	=	a_Menu[f];
							this.custom_tiempo_comidas[j].menu[_item.grupo_alimento_nutricionista_id]		=	_item.porciones;
						}
						this.custom_tiempo_comidas[j].summary	=	this.concatenar(this.custom_tiempo_comidas[j].menu);
					}
				}
			}*/
		}
		if(response.items.patron_menu_ejemplos){
			_dieta.patron_menu_ejemplos			=	response.items.patron_menu_ejemplos;		
		}
		
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
		_aMenu	=	this.custom_tiempo_comidas.filter(x => x.id === this.currentTiempoComida);
		if(_aMenu[0]){
			if(_aMenu[0].menu)
				aMenu		=	_aMenu[0].menu;
			else
				_aMenu[0].menu	=	{};
		}
		aMenu[alimento_id]	=	cantidad;
/*		this.arrayMenuCurrent	=	aMenu;*/
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
   showModalPorcionesNew(tiempoComida){
		this.inputModal	=	'';
		this.currentTiempoComida	=	tiempoComida;
		var aMenu	=	{};
		var oTiempoComida	=	this.custom_tiempo_comidas.filter(x => x.id === tiempoComida);
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
		this.label_modal_porciones	=	oTiempoComida[0].nombre;		
		this.displayModalPorciones	=	true;
		let body	=	document.getElementsByTagName('body')[0];
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
		for(var j in this.custom_tiempo_comidas){
			if(this.custom_tiempo_comidas[j].menu[alimento_id])
				total	+=	Number(this.custom_tiempo_comidas[j].menu[alimento_id]);
		}
	  return total;	  
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
			this.abkp.push(this.helpers.clone(response.data));
			this.oMenu[response.data.id]	=	this.copy( response.data.menu );
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
		if(this.model.current_dieta_id==this.model.dietas[this.model.dietas.length-1].dieta_id){
			this.router.navigate([ '/notas']);
			return ;
		}
		this.navigation	=	true;
				
		var _goto	=	'/dieta';
		var _index	=	-1;
		for(var i =0;i<this.model.dietas.length-1;i++){
			if(this.model.current_dieta_id==this.model.dietas[i].dieta_id){
				_index	=	i+1;
				i	=	this.model.dietas.length;
			}
		}
		if(_index>-1){
			this.dietaxSelected(this.model.dietas[_index]);
			this.router.navigate([ _goto ]);
			this.helpers.scrollToForm(true);
		}
		return ;
	}
	dietaxSelected(newDietaSelected, $event=false){
		this.navigation	=	true;
		/*if($event)*/
			this.saveForm();
		/*this.model.setPrescripcionPatronMenu( dieta.dieta_id );*/		
		this.model.setDieta( newDietaSelected.dieta_id );
		
		this.menus	=	this.helpers.clone(this.formControlDataService.getFormControlData().patronmenu);
		this.setInfoInit();
		this.setAsignaciones();
		this.setTotales();
		this.tiempo_comida_nombre	=	'';

	}
	_cleanCustomTiempoComidas(){
		for(var j in this.custom_tiempo_comidas){			
			this.custom_tiempo_comidas[j].ejemplo	=	'';
			this.custom_tiempo_comidas[j].menu	=	{};		
			this.custom_tiempo_comidas[j].summary	=	'';
		}
	}

}
