import { Component, OnInit, Input  } from '@angular/core';

import { Prescripcion, PrescripcionItem, Paciente, Rdd } from '../data/formControlData.model';
import { FormControlDataService }     from '../data/formControlData.service';

@Component({
  selector: 'app-dieta',
  templateUrl: './dieta.component.html',
  styles: []
})
export class DietaComponent implements OnInit {
	@Input()
	items:PrescripcionItem[]=[]; 
	oItems:PrescripcionItem[]=[]; 

	prescripcion=new Prescripcion();
	oPrescripcion=new Prescripcion();
	paciente:Paciente;
	rdd:Rdd;
	
	total_carbohidratos:number;
	total_proteinas:number;
	total_grasas:number;
	total_kcal:number;

	showModalDatos:boolean=false;
	showModalTabDatos:boolean=true;
	showModalTabGrafico:boolean=false;
	model:any;
	kcalCarb:any;
	kcalProt:any;
	kcalGrasas:any;
	changeLog:any;
	
	tab_class_datos:string='active';
	tab_class_graficos:string='';
  
  constructor(private formControlDataService: FormControlDataService) {
	this.model			=	formControlDataService.getFormControlData();
	this.prescripcion	=	this.model.getFormPrescripcion();
	this.items			=	this.prescripcion.items;
	this.createOriginal();	
	this.paciente		=	this.model.getFormPaciente();
	this.rdd			=	this.model.getFormRdd();
	console.log(this.rdd);
  }
  ngOnInit() {
  }
	ngOnDestroy() {
		
		this.prescripcion.items	=	this.items;
		this.model.getFormPrescripcion().set(this.prescripcion);
		this.formControlDataService.setFormControlData(this.model);		
		if(this.existChanges()){
			console.log('HAY CAMBIOS, ENVIAR A LA API');
			this.createPrescripcion(this.prescripcion);
		}
	}
	createOriginal(){
		this.oPrescripcion.carbohidratos	=	this.prescripcion.carbohidratos;
		this.oPrescripcion.grasas			=	this.prescripcion.grasas;
		this.oPrescripcion.proteinas		=	this.prescripcion.proteinas;
		for(var i =0;i<this.items.length;i++){
			var obj	=	this.items[i];
			var presc	=	new PrescripcionItem(obj.id, obj.nombre, obj.slug, obj.ngmodel, obj.cantidad, obj.carbohidratos, obj.proteinas, obj.grasas, obj.kcal);
			this.oItems[i]	=	presc;
		}
	}
	existChanges(){
		return this.chechChangesItems() || 
				(this.oPrescripcion.carbohidratos	!==	this.prescripcion.carbohidratos || 
				this.oPrescripcion.proteinas	!==	this.prescripcion.proteinas || 
				this.oPrescripcion.grasas		!==	this.prescripcion.grasas);

	}
	chechChangesItems(){
		for(var i =0;i<this.items.length;i++){
			var obj1	=	this.items[i];
			var obj2	=	this.oItems[i];
			if(obj1.cantidad !== obj2.cantidad){
				/*console.log('objs diferentes');*/
				return true;
			}
		}
		return false;
	}	
	createPrescripcion(prescripcion) {
		console.log(prescripcion);

		this.formControlDataService.addPrescripcion(prescripcion)
		.subscribe(
			 response  => {
						console.log('Prescripcion receiving...');
						console.log(response);
						},
			error =>  console.log(<any>error)
		);
	}
	openModalDatos() {
		this.showModalDatos	=	!this.showModalDatos;
		let body = document.getElementsByTagName('body')[0];
		if(this.showModalDatos)
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

	get kcal_carbohidratos(){
		var percentage	=	this.prescripcion.carbohidratos*0.01;
		this.kcalCarb	=	Math.round(this.rdd.icr*percentage);
		return this.kcalCarb;
	}
	get gramos_carbohidratos(){
		return this.kcalCarb/4;
	}
	get kcal_proteinas(){
		var percentage	=	this.prescripcion.proteinas*0.01;
		this.kcalProt	=	Math.round(this.rdd.icr*percentage);
		return this.kcalProt;
	}
	get gramos_proteinas(){
		return this.kcalProt/4;
	}
	get kcal_grasas(){
		var percentage	=	this.prescripcion.grasas*0.01;
		this.kcalGrasas	=	Math.round(this.rdd.icr*percentage);
		return this.kcalGrasas;
	}
	get gramos_grasas(){
		return this.kcalGrasas/9;
	}
   calculate(item){
	   //console.log(item);
	   var cho_factor=0;
	   var prot_factor=0;
	   var grasa_factor=0;
	   var kcal_factor=0;
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
	   item.carbohidratos	=	item.cantidad*cho_factor;
	   item.proteinas		=	item.cantidad*prot_factor;
	   item.grasas			=	item.cantidad*grasa_factor;
	   item.kcal			=	item.cantidad*kcal_factor;
	   this.total();
   }
   
   total(){
	   var total	=	0;
		this.total_carbohidratos=0;
		this.total_proteinas=0;
		this.total_grasas=0;
		this.total_kcal=0;
	   for(var i =0;i<this.items.length;i++){
			this.total_carbohidratos +=this.items[i].carbohidratos;
			this.total_proteinas +=this.items[i].proteinas;
			this.total_grasas +=this.items[i].grasas;
			this.total_kcal +=this.items[i].kcal;;   
	   }
   }

}
