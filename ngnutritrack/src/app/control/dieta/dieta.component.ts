import { Component, OnInit, Input  } from '@angular/core';
import { Router } from '@angular/router';

import { Prescripcion, PrescripcionItem, Paciente, Rdd, OtroAlimento } from '../data/formControlData.model';
import { FormControlDataService }     from '../data/formControlData.service';

@Component({
  selector: 'app-dieta',
  templateUrl: './dieta.component.html',
  styles: []
})
export class DietaComponent implements OnInit {
	/*@Input()*/
	items:PrescripcionItem[]=[]; 
	oItems:PrescripcionItem[]=[];
	otrosItems:PrescripcionItem[]=[]; 
	//oOtrosItems:PrescripcionItem[]=[];
	extraInfoAlimentos:any[]=[];
	aOtrosAlimentos:any[]=[];

	prescripcion=new Prescripcion();
	oPrescripcion=new Prescripcion();
	paciente:Paciente;
	rdd:Rdd;
	otroAlimento:any;
	
	historial:any[];
	
	total_carbohidratos:number=0;
	total_proteinas:number=0;
	total_grasas:number=0;
	total_kcal:number=0;
	
	total_ideal_carbohidratos:number=0;
	total_ideal_proteinas:number=0;
	total_ideal_grasas:number=0;
	
	total_faltante_carbohidratos:number=0;
	total_faltante_proteinas:number=0;
	total_faltante_grasas:number=0;
	total_faltante_kcal:number=0;
	
	total_adecuacion_carbohidratos:number=0;
	total_adecuacion_proteinas:number=0;
	total_adecuacion_grasas:number=0;
	total_adecuacion_kcal:number=0;
	
	
	total_otros_carbohidratos:number=0;
	total_otros_proteinas:number=0;
	total_otros_grasas:number=0;
	total_otros_calorias:number=0;

	hideModalDatos:boolean=true;
	showModalDatos:boolean=false;
	showModalTabDatos:boolean=true;
	showModalTabGrafico:boolean=false;
	showModalFactura:boolean=false;
	
	navitation:boolean=false;
	
	model:any;
	kcalCarb:any;
	kcalProt:any;
	kcalGrasas:any;
	changeLog:any;
	
	tab_class_datos:string='active';
	tab_class_graficos:string='';
	tagBody:any;
	showAdicionarOtro:boolean=false;
	nuevo:boolean=false;
	addOtrosItems:boolean=false;
	helpers:any;
	
	errors:any = {
		nombre: false,
		porciones: false
	};

  constructor(private router: Router, private formControlDataService: FormControlDataService) {
	this.model			=	formControlDataService.getFormControlData();
	console.log('this.model');
	console.log(this.model);
	this.helpers		=	this.model.getHelpers();
	
	this.prescripcion	=	this.model.getFormPrescripcion();	
	console.log(this.prescripcion);
	//this.items			=	this.prescripcion.items;	
	this.items			=	this.prescripcion.itemsByDefault;	
	this.otrosItems		=	this.prescripcion.otros;	
	this.paciente		=	this.model.getFormPaciente();
	this.rdd			=	this.model.getFormRdd();
	this.createOriginal();	
	this.calculateItems()
  }
  ngOnInit() {
	  this.tagBody = document.getElementsByTagName('body')[0];
	  this.getHistorial();
	  this.navitation	=	false;
	  this.otroAlimento	=	new OtroAlimento('', this.prescripcion.id);
	  this.addOtrosItems=false;
  }
	ngOnDestroy() {
		if(!this.navitation)
			this.saveForm();
	}
	createOriginal(){
		this.oPrescripcion.carbohidratos	=	this.prescripcion.carbohidratos;
		this.oPrescripcion.grasas			=	this.prescripcion.grasas;
		this.oPrescripcion.proteinas		=	this.prescripcion.proteinas;
		
		if(this.items.length==0)
			return ;
		
		var found:any;
		for(var i =0;i<this.items.length;i++){
			var obj	=	this.items[i];
			found	=	this.prescripcion.items.filter(function(arr){return arr.grupo_alimento_nutricionista_id == obj.id})[0];
			if(found)
				this.items[i].porciones	=	found.porciones;
		}
		for(var i =0;i<this.items.length;i++){
			var obj	=	this.items[i];
			var presc	=	new PrescripcionItem(obj.id, obj.nombre, obj.slug, obj.porciones, obj.carbohidratos, obj.proteinas, obj.grasas, obj.kcal);
			this.oItems[i]	=	presc;
		}
		
		
	}
	existChanges(){
		var itemsOtrosInArray	=	!this.prescripcion.id && this.otrosItems.length>0;
		
		return this.chechChangesItems() || itemsOtrosInArray ||
				(this.oPrescripcion.carbohidratos	!==	this.prescripcion.carbohidratos || 
				this.oPrescripcion.proteinas	!==	this.prescripcion.proteinas || 
				this.oPrescripcion.grasas		!==	this.prescripcion.grasas);

	}
	existChanges_old(){
		return this.chechChangesItems() || 
				(this.oPrescripcion.carbohidratos	!==	this.prescripcion.carbohidratos || 
				this.oPrescripcion.proteinas	!==	this.prescripcion.proteinas || 
				this.oPrescripcion.grasas		!==	this.prescripcion.grasas);

	}
	chechChangesItems(){
		for(var i =0;i<this.items.length;i++){
			var obj1	=	this.items[i];
			var obj2	=	this.oItems[i];
			if(obj1.porciones !== obj2.porciones){
				return true;
			}
		}
		return false;
	}	
	createPrescripcion(prescripcion) {
		if(!this.prescripcion.id)
			this.addOtrosItems	=	true;
		console.log('save Prescripcion...');
		console.log(prescripcion);
		this.formControlDataService.addPrescripcion(prescripcion)
		.subscribe(
			 response  => {
						console.log('<!--Crud Prescripcion');
						console.log(response);
						if(this.addOtrosItems)
							this.saveOtrosAlimentos(response);
					},
			error =>  console.log(<any>error)
		);
	}
/*	openModalDatos() {
		this.showModalDatos	=	!this.showModalDatos;
		let body = document.getElementsByTagName('body')[0];
		if(this.showModalDatos)
			body.classList.add('open-modal');
		else
			body.classList.remove('open-modal');
	}*/
	openModalFactura(){
		this.showModalFactura = !this.showModalFactura;
		let body = document.getElementsByTagName('body')[0];
		if(this.showModalFactura)
			body.classList.add('open-modal');
		else
			body.classList.remove('open-modal');
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
	displayFormAddOther(){
		this.showAdicionarOtro=true;
	}
	
	getHistorial(){
		var paciente_id	=	this.paciente.persona_id;
		this.formControlDataService.select('prescripcion', paciente_id)
		.subscribe(
			 response  => {
						console.log('<--S prescripcion');
						console.log(response);
						this.fillHistorial(response);
						},
			error =>  console.log(<any>error)
		);
	}
	in_array(_array, ele){
		return _array.indexOf(ele)>-1;
	}
	fillHistorial(historial){
		var data	=	[];
		for(var i in historial){console.log(historial[i]);
			historial[i].display	=	false;;
			data[i]		=	historial[i];
		}
		/*console.log('listo para el historial');
		console.log(data);*/
		this.historial	=	data;
		
	}
	displayDetails(item){
		item.display	=	!item.display;
	}
	
	
	showModal(modal){
		this.hideModalDatos		=	true;
		switch(modal){
			case 'datos':
				this.hideModalDatos	=	false;
				break;
		}
		this.tagBody.classList.add('open-modal');		
	}
	hideModal(modal){
		switch(modal){
			case 'datos':
				this.hideModalDatos	=	true;
				break;
		}
		this.tagBody.classList.remove('open-modal');		
	}
	
	showFormEdit(){
		this.nuevo			=	!this.nuevo;
		this.errors.nombre		=	!this.nuevo;
		this.errors.porciones	=	!this.nuevo;
	}
	isValid(){
		if(!this.otroAlimento.nombre || !this.otroAlimento.porciones){
			if(!this.otroAlimento.nombre)
				this.errors.nombre	=	true;
				
			if(!this.otroAlimento.porciones)
				this.errors.porciones	=	true;
				
			return false;
		}
		return true;
	}
	adicionarNuevo(){
		if(this.isValid()){
			//this.otroAlimento.prescripcion_id	=	this.prescripcion.id;
			this.save(this.otroAlimento);
		}
	}
	setOtroAlimento__old(response){
		if(response.code==201){
			var item	=	response.data;
			this.otrosItems.push(item);
			this.otroAlimento.nombre	=	'';
			this.otroAlimento.porciones	=	'';
			this.otroAlimento.carbohidratos	=	'';
			this.otroAlimento.proteinas	=	'';
			this.otroAlimento.calorias	=	'';
			this.otroAlimento.grasas	=	'';
			this.nuevo	=	false;
		}
	}
	setOtroAlimentoR(response){
		if(response.code==201){
			var item	=	response.data;
			this.setOtroAlimento(item);
		}
	}
	setOtroAlimento(item){
		this.otrosItems.push(item);
		this.total();
		this.otroAlimento	=	new OtroAlimento('', this.prescripcion.id);
		this.nuevo	=	false;
	}
	remove(otroAlimento){
		var index	=	this.otrosItems.indexOf(otroAlimento);
		if(!this.prescripcion.id){
			this.otrosItems.splice(index,1);
			return ;
		}
		this.formControlDataService.delete('otros_alimentos', otroAlimento).subscribe(
			 response  => {
						/*console.log('Eliminado');
						console.log(response);*/
						this.otrosItems.splice(index,1);
						},
			error =>  console.log(<any>error)
		);
	}
	save(data){console.log('Crud OtroAlimento-->');console.log(data);
	
		if(!this.prescripcion.id){
			//console.log('saving in array');
			this.setOtroAlimento(data);
			return ;
		}
		this.formControlDataService.store('otros_alimentos', data)
		.subscribe(
			 response  => {
						console.log('store->response...');
						console.log(response);
						this.setOtroAlimentoR(response);
				},
			error =>  console.log(<any>error)
		);
	}
	saveOtrosAlimentos(response){
		console.log(response);
		this.formControlDataService.store('otros_alimentos_multiples', {items:this.otrosItems, prescripcion_id:response.data.id})
		.subscribe(
			 response  => {
						console.log('store->response...');
						console.log(response);
						},
			error =>  console.log(<any>error)
		);
	}
	
   getCalculoKcalCarbohidratos(){
	   if(!this.prescripcion.carbohidratos)
			return 0;
		var percentage	=	this.prescripcion.carbohidratos*0.01;
		this.kcalCarb	=	Math.round(this.rdd.icr*percentage);
		return this.kcalCarb;
   }   
   getCalculoKcalProteinas(){
	   if(!this.prescripcion.proteinas)
			return 0;
		var percentage	=	this.prescripcion.proteinas*0.01;
		this.kcalProt	=	Math.round(this.rdd.icr*percentage);
		return this.kcalProt;
   } 
   getCalculoKcalGrasas(){
	   if(!this.prescripcion.grasas)
			return 0;
		var percentage	=	this.prescripcion.grasas*0.01;
		this.kcalGrasas	=	Math.round(this.rdd.icr*percentage);
		return this.kcalGrasas;
   }
	get kcal_carbohidratos(){
		return this.getCalculoKcalCarbohidratos();
	}

	get gramos_carbohidratos(){
		return this.getCalculoKcalCarbohidratos()/4;
	}
	get kcal_proteinas(){
		return this.getCalculoKcalProteinas();
	}
	get gramos_proteinas(){
		return this.getCalculoKcalProteinas()/4;
	}
	get kcal_grasas(){
		return this.getCalculoKcalGrasas();
	}
	get gramos_grasas(){
		return this.getCalculoKcalGrasas()/9;
	}
	calculateItems(){
		if(this.items.length==0)
			return ;
		for(var i =0;i<this.items.length;i++){
			this.calculate(this.items[i]);
	   }
	}
   calculate(item){
	   var cho_factor	=	0;
	   var prot_factor	=	0;
	   var grasa_factor	=	0;
	   var kcal_factor	=	0;
		switch(item.id){
			case 1://Leche Descremada
				cho_factor	=	12;
				prot_factor	=	8;
				grasa_factor=	1;
				kcal_factor	=	90;
				break;
			case 2://Leche 2%
				cho_factor	=	12;
				prot_factor	=	8;
				grasa_factor=	5;
				kcal_factor	=	120;				
				break;
			case 3://Leche Entera
				cho_factor	=	12;
				prot_factor	=	8;
				grasa_factor=	8;
				kcal_factor	=	150;				
				break;
			case 4://Vegetales
				cho_factor	=	5;
				prot_factor	=	2;
				grasa_factor=	0;
				kcal_factor	=	28;				
				break;
			case 5://Frutas
				cho_factor	=	15;
				prot_factor	=	0;
				grasa_factor=	0;
				kcal_factor	=	60;				
				break;
			case 6://Harinas
				cho_factor	=	15;
				prot_factor	=	3;
				grasa_factor=	1;
				kcal_factor	=	80;				
				break;
			case 7://Carne Media
				cho_factor	=	0;
				prot_factor	=	7;
				grasa_factor=	3;
				kcal_factor	=	55;				
				break;
			case 8://Carne Intermedia
				cho_factor	=	0;
				prot_factor	=	7;
				grasa_factor=	5;
				kcal_factor	=	75;				
				break;
			case 9://Carne Grasa
				cho_factor	=	0;
				prot_factor	=	7;
				grasa_factor=	8;
				kcal_factor	=	100;				
				break;
			case 10://Azúcares
				cho_factor	=	10;
				prot_factor	=	0;
				grasa_factor=	0;
				kcal_factor	=	40;				
				break;
			case 11://Grasas
				cho_factor	=	0;
				prot_factor	=	0;
				grasa_factor=	5;
				kcal_factor	=	45;				
				break;
			case 12://Vasos Agua
				cho_factor	=	0;
				prot_factor	=	0;
				grasa_factor=	0;
				kcal_factor	=	0;				
				break;
		   }
	   item.carbohidratos	=	item.porciones*cho_factor;
	   item.proteinas		=	item.porciones*prot_factor;
	   item.grasas			=	item.porciones*grasa_factor;
	   item.kcal			=	item.porciones*kcal_factor;
	   this.total();
   }
   
   calculateOtrosItems(){
		this.total_otros_carbohidratos	=	0;
		this.total_otros_proteinas		=	0;
		this.total_otros_grasas			=	0;
		this.total_otros_calorias			=	0;
		var value;
		for(var i =0;i<this.otrosItems.length;i++){
			value	=	this.otrosItems[i];
			this.total_otros_carbohidratos	+=	Number(isNaN(value.carbohidratos)? 0: value.carbohidratos);
			this.total_otros_proteinas		+=	Number(isNaN(value.proteinas)? 0: value.proteinas);
			this.total_otros_grasas			+=	Number(isNaN(value.grasas)? 0: value.grasas);
			this.total_otros_calorias		+=	Number(isNaN(value.calorias)? 0: value.calorias);
		}
   }
   calculate_total_ideal(){	   
   }
   
   total(){
		var total	=	0;
		this.total_carbohidratos=	0;
		this.total_proteinas	=	0;
		this.total_grasas		=	0;
		this.total_kcal			=	0;
		
		this.calculateOtrosItems();
		
		this.total_ideal_carbohidratos	=	this.getCalculoKcalCarbohidratos()/4;
		this.total_ideal_proteinas		=	this.getCalculoKcalProteinas()/4;
		this.total_ideal_grasas			=	this.getCalculoKcalGrasas()/9;
		
	   for(var i =0;i<this.items.length;i++){
			this.total_carbohidratos+=	this.items[i].carbohidratos;
			this.total_proteinas 	+=	this.items[i].proteinas;
			this.total_grasas 		+=	this.items[i].grasas;
			this.total_kcal 		+=	this.items[i].kcal;
	   }
	   
		this.total_carbohidratos+=	this.total_otros_carbohidratos;
		this.total_proteinas 	+=	this.total_otros_proteinas;
		this.total_grasas 		+=	this.total_otros_grasas;
		this.total_kcal 		+=	this.total_otros_calorias;
	   

	   this.total_faltante_carbohidratos=	this.total_ideal_carbohidratos - this.total_carbohidratos;
	   this.total_faltante_proteinas	=	this.total_ideal_proteinas - this.total_proteinas;
	   this.total_faltante_grasas		=	this.total_ideal_grasas - this.total_grasas;
	   
		if(this.total_carbohidratos)
			this.total_adecuacion_carbohidratos	=	this.total_carbohidratos/this.total_ideal_carbohidratos*100;
		else
			this.total_adecuacion_carbohidratos	=	0;
		
		if(this.total_proteinas)
			this.total_adecuacion_proteinas		=	this.total_proteinas/this.total_ideal_proteinas*100;
		else
			this.total_adecuacion_proteinas		=	0;
		
		if(this.total_grasas)
			this.total_adecuacion_grasas			=	this.total_grasas/this.total_ideal_grasas*100;
		else
			this.total_adecuacion_grasas			=	0;

	   this.total_faltante_kcal		=	this.rdd.icr - this.total_kcal;
	   
	   if(this.total_kcal)
			this.total_adecuacion_kcal	=	this.total_kcal/this.rdd.icr*100;
		else
			this.total_adecuacion_kcal	=	0;
   }
	saveForm(){
		this.prescripcion.items	=	this.items;
		this.model.getFormPrescripcion().set(this.prescripcion);
		this.formControlDataService.setFormControlData(this.model);		
		if(this.existChanges()){
			//console.log('HAY CAMBIOS, ENVIAR A LA API');
			this.createPrescripcion(this.prescripcion);
		}
	}
	Previous(){
		this.navitation	=	true;
		this.saveForm();
		this.router.navigate(['/recomendacion']);
	}
	Next(){
		this.navitation	=	true;
		this.saveForm();
		this.router.navigate(['/patron-menu']);
	}
}
