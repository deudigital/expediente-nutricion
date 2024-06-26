import { Component, OnInit, Input  } from '@angular/core';
import { Router } from '@angular/router';

import { Prescripcion, PrescripcionItem, Paciente, Rdd, OtroAlimento } from '../data/formControlData.model';
import { FormControlDataService }     from '../data/formControlData.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dieta',
  templateUrl: './dieta.component.html',
  styles: []
})
export class DietaComponent implements OnInit {
	items:PrescripcionItem[]=[]; 
	oItems:PrescripcionItem[]=[];
	otrosItems:PrescripcionItem[]=[]; 
	extraInfoAlimentos:any[]=[];
	aOtrosAlimentos:any[]=[];

	prescripcion=new Prescripcion();
	oPrescripcion=new Prescripcion();
	paciente:Paciente;
	rdd:Rdd;
	va:any;
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
	hideModalCopiar:boolean=true;
	
	showModalDatos:boolean=false;
	showModalTabDatos:boolean=true;
	showModalTabGrafico:boolean=false;
	showModalFactura:boolean=false;
	
	navitation:boolean=false;
	
	model:any;
	helpers:any;
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
	copiando:boolean=false;

	errors:any = {
		nombre: false,
		porciones: false
	};

	disableButtonHistorial:boolean;
	current_peso:number;
	paraCopiar:any;
  constructor(private auth: AuthService, private router: Router, private formControlDataService: FormControlDataService) {
	this.model			=	formControlDataService.getFormControlData();
	this.helpers		=	this.model.getHelpers();	
	/*this.prescripcion	=	this.model.getFormPrescripcion();	*/
	this.prescripcion	=	this.model.getFormPrescripcion();	
	this.items			=	this.prescripcion.itemsByDefault;	
	this.otrosItems		=	this.prescripcion.otros;	
	this.paciente		=	this.model.getFormPaciente();
	this.rdd			=	this.model.getFormRdd();
	this.va				=	this.model.getFormValoracionAntropometrica();	
	this.rdd.setPaciente(this.paciente);
	this.rdd.setVA(this.va);
	this.rdd.doAnalisis();
	this.otroAlimento	=	new OtroAlimento('', this.prescripcion.id);
	this.createOriginal();	
	this.calculateItems();
	this.total();
  }
  ngOnInit() {
	  this.tagBody = document.getElementsByTagName('body')[0];
	  this.auth.verifyUser(localStorage.getItem('nutricionista_id'))
			.then((response) => {
				var response	=	response.json();
				if(!response.valid){
					localStorage.clear();
					this.formControlDataService.getFormControlData().message_login	=	response.message;
					this.router.navigateByUrl('/login');
					return false;
				}
				this.disableButtonHistorial	=	true;
				  this.getHistorial();
				  this.navitation	=	false;
				  this.otroAlimento	=	new OtroAlimento('', this.prescripcion.id);
				  this.addOtrosItems=false;
				  this.copiando	=	false;
				  this.current_peso	=	0;
					switch(this.rdd.peso_calculo){
						case 'actual':
							this.current_peso	=	this.va.peso;
							break;
						case 'ideal':
							this.current_peso	=	this.va.pesoIdeal;
							break;
						case 'ideal-ajustado':
							this.current_peso	=	this.va.pesoIdealAjustado;
							break;
					}
			})		
			.catch((err) => {
				console.log(JSON.parse(err._body));
			});	  
  }
	ngOnDestroy() {console.log( 'ngOnDestroy' );
		if(!this.navitation)
			this.saveForm();

		this.helpers.scrollToForm(true);
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

		this.formControlDataService.addPrescripcion(prescripcion)
		.subscribe(
			 response  => {
						if(this.addOtrosItems)
							this.saveOtrosAlimentos(response);
					},
			error =>  console.log(<any>error)
		);
	}
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
						this.fillHistorial(response);
						},
			error =>  console.log(<any>error)
		);
	}
	in_array(_array, ele){
		return _array.indexOf(ele)>-1;
	}
	fillHistorial(historial){
		var data	=	[];console.log('historial');console.log(historial);
		for(var i in historial){
			historial[i].display	=	false;
			data[i]		=	historial[i];
		}
		this.historial	=	data;/*console.log(this.historial);*/
		this.disableButtonHistorial	=	this.historial.length==0;
	}
	displayDetails(item){
		item.display	=	!item.display;
	}
	showModalCopiar(prescripcion){
		this.paraCopiar	=	prescripcion;
		this.hideModalCopiar	=	false;
	}	
	copiarYes(){
		this.copiando	=	true;		
		let data	=	{
			prescripcion_id: this.paraCopiar.id,
			consulta_id: this.model.consulta.id
		};
		this.formControlDataService.store('copiar_prescripcion', data)
		.subscribe(
			 response  => {
						this.formControlDataService.getConsultaSelected(this.model.consulta.id).subscribe(
							data => {
								this.model.fill(data);
								this.prescripcion	=	this.model.getFormPrescripcion();	
								this.va				=	this.model.getFormValoracionAntropometrica();
								this.otroAlimento	=	new OtroAlimento('', this.prescripcion.id);
								this.items			=	this.prescripcion.itemsByDefault;	
								this.otrosItems		=	this.prescripcion.otros;
								this.rdd.setPaciente(this.paciente);
								this.rdd.setVA(this.va);
								this.rdd.doAnalisis();
								
								this.createOriginal();	
								this.calculateItems()
								this.total();
	
								this.copiando	=	false;
								this.hideModalCopiar	=	true;
								this.hideModal('datos');
							},
							error => console.log(<any>error)
						);
				},
			error =>  {
				console.log(<any>error)
				this.copiando	=	false;
			}
		);
	}
	copiarCancelar(){
		this.hideModalCopiar	=	true;
	}
	showModal(modal){
		this.hideModalDatos		=	true;
		this.hideModalCopiar	=	true;
		switch(modal){
			case 'datos':
				this.hideModalDatos	=	false;
				break;
			case 'copiar':
				this.hideModalCopiar	=	false;
				break;
		}
		this.tagBody.classList.add('open-modal');
		window.scrollTo(0, 0);
	}
	hideModal(modal){
		switch(modal){
			case 'datos':
				this.hideModalDatos	=	true;
				break;
			case 'copiar':
				this.hideModalCopiar	=	true;
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
			this.save(this.otroAlimento);
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
						this.otrosItems.splice(index,1);
						},
			error =>  console.log(<any>error)
		);
	}
	save(data){
		if(!this.prescripcion.id){
			this.setOtroAlimento(data);
			return ;
		}
		this.formControlDataService.store('otros_alimentos', data)
		.subscribe(
			 response  => {
						this.setOtroAlimentoR(response);
				},
			error =>  console.log(<any>error)
		);
	}
	saveOtrosAlimentos(response){
		this.formControlDataService.store('otros_alimentos_multiples', {items:this.otrosItems, prescripcion_id:response.data.id})
		.subscribe(
			 response  => {},
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
   
   getCalculoGKgCarbohidratos(){
	   if(!this.prescripcion.carbohidratos)
			return 0;
		let gramos	=	this.kcalCarb/4;
		return gramos/this.current_peso;
   }
   getCalculoGKgProteinas(){
	   if(!this.prescripcion.proteinas)
			return 0;
		let gramos	=	this.kcalProt/4;
		return gramos/this.current_peso;
   }  
   getCalculoGKgGrasas(){
	   if(!this.prescripcion.grasas)
			return 0;
		let gramos	=	this.kcalGrasas/9;
		return gramos/this.current_peso;
   }
   
	
	get g_kg_carbohidratos(){
		return this.getCalculoGKgCarbohidratos();
	}
	get g_kg_proteinas(){
		return this.getCalculoGKgProteinas();
	}
	get g_kg_grasas(){
		return this.getCalculoGKgGrasas();
	}
	
	get kcal_carbohidratos(){
		return this.getCalculoKcalCarbohidratos();
	}
	get kcal_proteinas(){
		return this.getCalculoKcalProteinas();
	}
	get kcal_grasas(){
		return this.getCalculoKcalGrasas();
	}
		
	get gramos_carbohidratos(){
		return this.getCalculoKcalCarbohidratos()/4;
	}
	get gramos_proteinas(){
		return this.getCalculoKcalProteinas()/4;
	}
	get gramos_grasas(){
		return this.getCalculoKcalGrasas()/9;
	}
	
	get sumatoria_distribucion(){
		var total	=	0;

		if(this.prescripcion.carbohidratos)
			total	+=	this.prescripcion.carbohidratos;

		if(this.prescripcion.proteinas)
			total	+=	this.prescripcion.proteinas;

		if(this.prescripcion.grasas)
			total	+=	this.prescripcion.grasas;

		return total;
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
			case 1:/*Leche Descremada*/
				cho_factor	=	12;
				prot_factor	=	8;
				grasa_factor=	1;
				kcal_factor	=	90;
				break;
			case 2:/*Leche 2%*/
				cho_factor	=	12;
				prot_factor	=	8;
				grasa_factor=	5;
				kcal_factor	=	120;				
				break;
			case 3:/*Leche Entera*/
				cho_factor	=	12;
				prot_factor	=	8;
				grasa_factor=	8;
				kcal_factor	=	150;				
				break;
			case 4:/*Vegetales*/
				cho_factor	=	5;
				prot_factor	=	2;
				grasa_factor=	0;
				kcal_factor	=	28;				
				break;
			case 5:/*Frutas*/
				cho_factor	=	15;
				prot_factor	=	0;
				grasa_factor=	0;
				kcal_factor	=	60;				
				break;
			case 6:/*Harinas*/
				cho_factor	=	15;
				prot_factor	=	3;
				grasa_factor=	1;
				kcal_factor	=	80;				
				break;
			case 7:/*Carne Media*/
				cho_factor	=	0;
				prot_factor	=	7;
				grasa_factor=	3;
				kcal_factor	=	55;				
				break;
			case 8:/*Carne Intermedia*/
				cho_factor	=	0;
				prot_factor	=	7;
				grasa_factor=	5;
				kcal_factor	=	75;				
				break;
			case 9:/*Carne Grasa*/
				cho_factor	=	0;
				prot_factor	=	7;
				grasa_factor=	8;
				kcal_factor	=	100;				
				break;
			case 10:/*Azúcares*/
				cho_factor	=	10;
				prot_factor	=	0;
				grasa_factor=	0;
				kcal_factor	=	40;				
				break;
			case 11:/*Grasas*/
				cho_factor	=	0;
				prot_factor	=	0;
				grasa_factor=	5;
				kcal_factor	=	45;				
				break;
			case 12:/*Vasos Agua*/
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

	saveForm(){console.log('saveForm');
		this.prescripcion.items	=	this.items;
		this.model.getFormPrescripcion().set(this.prescripcion);
		this.formControlDataService.setFormControlData(this.model);		
		if(this.existChanges()){
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
	dietaxSelected(dieta, $event){
		this.navitation	=	true;
		this.saveForm();
		/*console.log('dietaxSelected');
		console.log(dieta);*/
/*		var	c	=	document.getElementById("dietas_navigation").children;
		var i;
		for (i = 0; i < c.length; i++) {
			c[i].classList.remove("active"); 
		}*/
		/*var ele	=	$event.target.parentElement.parentElement;*/
/*		var ele	=	$event.target.parentElement;
		ele.className	=	'active';*/
		/*console.log( ele );*/
		/*this.model.setCurrentDieta(dieta.dieta_id);*/
		this.model.setPrescripcionPatronMenu( dieta.dieta_id );		
		this.prescripcion	=	this.model.getFormPrescripcion();	
		this.items			=	this.prescripcion.itemsByDefault;	
		this.otrosItems		=	this.prescripcion.otros;	
/*		this.rdd.doAnalisis();	*/
		this.otroAlimento	=	new OtroAlimento('', this.prescripcion.id);
		this.createOriginal();	
		this.calculateItems();
		this.total();
	}
}
