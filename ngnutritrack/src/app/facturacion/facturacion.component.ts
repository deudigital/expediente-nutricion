import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { CommonService } from '../services/common.service';
import { FormControlData }     from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html'
})
export class FacturacionComponent implements OnInit {

  loading:boolean = false;

  private subscription: Subscription;
  showModalDatos:boolean = false;

  model: any;
  fcData: any;
  unidad_medida: string = null;
  factura: any = {};
  producto: any = {};
  persona: any = {};
  nutricionista: any = {};
  tipos_ID: any = [];
  unidades: any = [];
  medios_pagos: any = [];
  productos: any = [];
  productosDB: any = [];

  filter:{ [id: string]: any; } = {};
  provincia:any;
  canton:any;
  distrito:any;
  barrio:any;
  provincias:{ [id: string]: any; };
  cantones:{ [id: string]: any; };
 
  _provincias:{ [id: string]: any; };
  _cantones:{ [id: string]: any; };
  _distritos:{ [id: string]: any; };

  filter_cantones:{ [id: string]: any; };
  filter_distritos:{ [id: string]: any; };
  filter_barrios:{ [id: string]: any; };
  ubicaciones:any;
  mng:any;
  impuesto:boolean = false;

 form_errors:any = {
 	empty_name: false,
	invalid_id: false,
	negativeSubtotal_product: false,
	invalid_phone: false,
	invalid_email: false,
	empty_products: false,
	successful_operation: false,
	ajax_failure: false
 };

// Autocomplete variables
    public query = '';
    public filteredList = [];
    results: any = [];
    public elementRef;
    productIndex = 0;
    consulta_id: number = 0;
    margin:boolean = false;

  constructor( private router: Router, private commonService: CommonService, private formControlDataService: FormControlDataService ) { 

	this.fcData  =  this.formControlDataService.getFormControlData();
  	this.mng     =	this.fcData.getManejadorDatos(); 

	this.factura = {
		subtotal: 0.00,
		descuento: 0.00,
		ive: 0.00,
		total: 0.00,
		medio: 1,
		medio_nombre: 'Tarjeta'
	};  

	this.producto = {
		descripcion: "",
		unidad_nombre: "",
		unidad_medida: 1,
		precio: 0.00,
		cantidad: 1,
		descuento: 0.00,
		impuesto: 0.00,
		subtotal: 0.00
	}

	this.persona = {
			cedula : "",
			celular: "",
			detalles_direccion:"",
			nombre:"",
			telefono:"",
			email:""
	}

  	// Descomentar para subir

  /*	this.ubicaciones	=	this.mng.getUbicaciones();
	this._provincias	=	this.mng.getProvincias();
	this._cantones	=	this.mng.getCantones();
	this._distritos	=	this.mng.getDistritos();				

	if(this.ubicaciones)
			this.setUbicacion();*/
  }
  		
	  ngOnInit() {
	  	this.subscription= this.commonService.notifyObservable$.subscribe((res)=>{
	  		if(res.hasOwnProperty('option') && res.option === 'openModalDatos') {

	  			this.productos = [];
	  			this.margin = res.margin;
	  			this.consulta_id = res.consulta_id;
	  			this.obtenerProductos();
	  		// Comentar para subir
	  			this.ubicaciones	=	this.mng.getUbicaciones();
				this._provincias	=	this.mng.getProvincias();
				this._cantones	=	this.mng.getCantones();
				this._distritos	=	this.mng.getDistritos();				

				if(this.ubicaciones)
						this.setUbicacion(6345);
			//--------------------------------------//		

				this.obtenerUnidades();				
				this.getTipo_ID();
				this.getMediosPagos();
	  			this.getPaciente(res.persona_id);  

	  			this.openModalDatos();  		
	  			this.getNutricionista();		  			
	  		}
	  	});
	  	this.unidad_medida = 'Servicios Profesionales';
		this.persona.identification_nombre="Cedula Fisica";
	  }

	 // Autocomplete 
	 suggest(){
	 	if(this.query !== ""){
			if(this.productosDB.length>0){	

 				this.filteredList = this.productosDB.filter(function(el){
 					this.adjustAutoCompletePosition(this.productos.length); 	 					
		 			return el.descripcion.toString().toLowerCase().includes(this.query.toLowerCase());
		 		}.bind(this));		
			}else{
				this.filteredList = [];
			} 	
	 	}else{
	 		this.filteredList = [];
	 	}
	 }

	 select(item){	 	
	 	this.query = item.descripcion;	 	
	 	this.filteredList = [];
	 	
	 	for(let u in this.unidades){
	 		if(this.unidades[u].id === item.unidad_medida_id){
	 			item.unidad_nombre = this.unidades[u].nombre;
	 		}
	 	}

	 	this.unidad_medida = item.unidad_nombre;
	 	this.producto = {
	 		descripcion: this.query,
			unidad_medida: item.unidad_medida,
			precio: item.precio,
			cantidad: 1,
			descuento: 0.00,
			impuesto: 0.00,
			subtotal: item.precio,
			id: item.id
	 	}
	 }

	 setUbicacion(ubicacion_id){	 	

	 	if(!this.persona.ubicacion_id)
	 		ubicacion_id = 6435;

		if(this.persona.ubicacion_id>0)
			ubicacion_id	=	this.persona.ubicacion_id;

		
		var ubicacion	=	this.ubicaciones.filter(x => x.id === ubicacion_id);
		ubicacion = ubicacion[0];
		
		 //setTimeout(() => {
                //this.provincia	=	2;
           // }, 1000);
		
		
		
		//this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_provincia === 1 && x.codigo_canton === 1 && x.codigo_distrito === 1);
				
		this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === ubicacion.codigo_provincia);		
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_provincia === ubicacion.codigo_provincia && x.codigo_canton === ubicacion.codigo_canton);
		this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_provincia === ubicacion.codigo_provincia && x.codigo_canton === ubicacion.codigo_canton && x.codigo_distrito === ubicacion.codigo_distrito);
		this.canton		=	ubicacion.codigo_canton;
		this.distrito	=	ubicacion.codigo_distrito;
		this.provincia	=	ubicacion.codigo_provincia;
		
		
		this.persona.ubicacion_id	=	ubicacion_id;
		return ;
/*		
		

		var prov	=	new Provincia(ubicacion.codigo_provincia, ubicacion.nombre_provincia);
		/ *prov.codigo_provincia		=	ubicacion.codigo_provincia;
		prov.nombre_provincia		=	ubicacion.nombre_provincia;* /
		this.provincia	=	prov;
		
		this.setCantones(ubicacion.codigo_provincia);
		var cant	=	new Canton(ubicacion.codigo_canton, ubicacion.nombre_canton, ubicacion.codigo_provincia);
		this.canton		=	cant;
		
		this.setDistritos(ubicacion.codigo_provincia, ubicacion.codigo_canton);
		var dist	=	new Distrito(ubicacion.codigo_distrito, ubicacion.nombre_distrito, ubicacion.codigo_canton, ubicacion.codigo_provincia);
		this.distrito	=	dist;*/

	}

	selectCantones(event:Event):void {console.log('selectCantones de provincia->' + this.provincia);
		//this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === this.provincia.codigo_provincia);
		this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === this.provincia);
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		this.canton=1;
		this.distrito = 1;
		this.persona.ubicacion_id = this.filter_barrios[0].id;
	}
	selectDistritos(event:Event):void {console.log('selectDistritos de canton->' + this.canton);
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);	
		this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		this.distrito = 1;
		this.persona.ubicacion_id = this.filter_barrios[0].id;
	}
	selectBarrios(event:Event):void {console.log('selectBarrios de Distrito->' + this.distrito);
		this.filter_barrios	=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		this.persona.ubicacion_id = this.filter_barrios[0].id;
		//console.log(this.filter_barrios);
	}

  	closeModal(){
		let body = document.getElementsByTagName('body')[0];
		body.classList.remove('open-modal');
		this.showModalDatos		=	false;
	}

	obtenerProductos(){
		this.formControlDataService.getProducts()
		.subscribe(
			 response  => {

			 			this.productosDB = response;			 			

			 			for(let producto in this.productosDB){
			              for(let item in this.unidades){			            			               
			              	if(this.productosDB[producto].unidad_medida_id === this.unidades[item].id){
			                	this.productosDB[producto].nombre_unidad = this.unidades[item].nombre;
			              	}
			              }    
			          	}				          	
					},
			error =>  {
					console.log(error)
				}
		);
	}

	obtenerUnidades(){
		this.formControlDataService.getMeasures()
		.subscribe(
			response => {
						/*let res = response.text();
			 			let resArray = [] 

			 			resArray = res.split('<br />');			 			
			 			this.unidades = JSON.parse(resArray[2]);*/
			 			this.unidades = response;
			},
			error => {
				console.log(error);
			}
		)
	}

  setLeftBorder(index){
    let value = "";
    let maxPosition = this.productos.length-1;

    if(index === maxPosition){      
      return value = '0 0 0 15px';
    }else{
      return value = '0px';
    }
  }

  setRightBorder(index){
    let value = "";
    let maxPosition = this.productos.length-1;

    if(index === maxPosition){      
      return value = '0 0 15px 0';
    }else{
      return value = '0px';
    }
  }

  getUbicacion_Nutricionista(){
  	this.formControlDataService.getNutricionistaUbicacion(this.nutricionista.ubicacion_id)
  	.subscribe(
  		response => {
  			this.nutricionista.canton = response[0].nombre_canton;
  			this.nutricionista.distrito = response[0].nombre_distrito;
  			this.nutricionista.provincia = response[0].nombre_provincia;
  			this.nutricionista.barrio = response[0].nombre_barrio;
  		},
  		error => {
  			console.log(<any>error);
  		}
  	);
  }

  getNutricionista(){
		this.formControlDataService.getNutricionista()
		.subscribe(
			response => {				
				/*let resArray = [];
				resArray = response.text().split('<br />');							
			 	this.nutricionista = JSON.parse(resArray[2])[0];	*/		 	
			 	this.nutricionista = response[0];			 	
			 	this.getUbicacion_Nutricionista();	

			 	if(this.nutricionista.imagen === null){
			 		this.nutricionista.imagen = "assets/images/logo.png";
			 	}
			},
			error => {
				console.log(<any>error);
			}
		);
	}

	getPaciente(id){
		this.formControlDataService.getPaciente(id)
		.subscribe(
			response => {				
				/*let resArray = [];
				resArray = response.text().split('<br />');							
			 	this.persona = JSON.parse(resArray[2]);		*/	 				 	
			 	this.persona = response;
			 	if (this.persona.tipo_idenfificacion_id==null) {
			 		this.persona.tipo_idenfificacion_id=1;
			 	}
			 	for(let tipo in this.tipos_ID){			 		
			 		if(this.tipos_ID[tipo].id === this.persona.tipo_idenfificacion_id){
			 			this.persona.identification_nombre = this.tipos_ID[tipo].nombre;
			 		}
			 	}					

			 // Validar carga de datos
	  			this.validarNombre();
			/*	this.validarCorreo();
				this.validarTelefono();
				this.validarCedula();*/

				if(!this.persona.cedula){
					this.form_errors.empty_id = true;
				}

			 	this.setUbicacion(this.persona.ubicacion_id);	 			 	
			},
			error => {
				console.log(<any>error);
			}
		);	
	}

	getTipo_ID(){
		this.formControlDataService.getTipo_ID()
		.subscribe(
			response => {
				/*let resArray = [];
				resArray = response.text().split('<br />');							
			 	this.tipos_ID = JSON.parse(resArray[2]);*/	
				this.tipos_ID = response;
			},
			error => {
				console.log(<any>error);
			}
		);
	}

	getMediosPagos(){
		this.formControlDataService.getMedio_Pagos()
		.subscribe(
			response => {
				/*let resArray = [];
				resArray = response.text().split('<br />');	
				this.medios_pagos = JSON.parse(resArray[2]);*/				
				this.medios_pagos = response;
			},
			error => {
				console.log(<any>error);
			}
		);
	}

	aplicarImpuestoProducto(){
		this.impuesto =! this.impuesto;	
		this.calcularSubtotalProducto();	
	}

	calcularSubtotalProducto(){
		let precio_cantidad = this.producto.precio * this.producto.cantidad;

		if(this.impuesto){						
			this.producto.subtotal = precio_cantidad - this.producto.descuento;	
			this.producto.impuesto = this.producto.subtotal * 0.13;					
		}else{
			this.producto.subtotal = precio_cantidad - this.producto.descuento;		
			this.producto.impuesto = 0.00;		
		}					

		if(this.producto.descuento > this.producto.subtotal){			
			this.form_errors.negativeSubtotal_product = true;
		}else{			
			this.form_errors.negativeSubtotal_product = false;
		}
	}

	addProducto() {

		this.form_errors.empty_products = false;

		this.producto.descripcion = this.query;
		if(this.producto.descripcion && this.producto.cantidad > 0 && !this.form_errors.negativeSubtotal_product){

			if(!this.producto.descuento){
				this.producto.descuento = 0.0;
			}

			if(!this.producto.subtotal){
				this.calcularSubtotalProducto();
			}

			this.producto.unidad_nombre = this.unidad_medida;

			for(let u in this.unidades){
				if(this.unidades[u].nombre === this.unidad_medida){
					this.producto.unidad_medida = this.unidades[u].id;
				}
			}

			this.producto.subtotal = Math.round(this.producto.subtotal * 100) / 100;
			this.producto.subtotal = Math.round(this.producto.subtotal * 100) / 100;
			this.producto.impuesto = Math.round(this.producto.impuesto * 100) / 100;
			
			this.producto.index = this.productIndex;
			this.productIndex++;

			this.productos.push(this.producto);			
			this.unidad_medida = "Servicios Profesionales";
			this.calcularFactura(true);		
			this.query = "";
			this.impuesto = false;
			this.producto = {};
			
			this.producto = {
				descripcion: "",
				unidad_nombre: "",
				unidad_medida: 1,
				precio: 0.00,
				cantidad: 1,
				descuento: 0.00,
				impuesto: 0.00,
				subtotal: 0.00
			}						
		}		
	}

	removeProduct(producto){			
		for(let prod in this.productos){			
			if(producto.index === this.productos[prod].index){				
				this.productos.splice(prod, 1);
			}
		}		

		this.productIndex = this.productos.length;
		this.calcularFactura(false);
	}

	adjustAutoCompletePosition(number_products){
		let modal = document.getElementsByClassName('autocomplete-div');	
		let percentage = this.productos.length * 1.5;		

		let top = 65 + percentage;

		if(this.productos.length > 0){
			if(document.getElementsByClassName('autocomplete-div').item(0) != null){
				document.getElementsByClassName('autocomplete-div').item(0).setAttribute("style","top: "+top+"%");
			}	
		}	
	}

	calcularFactura(action){
		if(action){
			for(let prod=this.productos.length-1; prod<this.productos.length; prod++){
				let subtotal = this.productos[prod].precio * this.productos[prod].cantidad;;
				this.factura.subtotal += subtotal;
				this.factura.descuento += this.productos[prod].descuento;
				this.factura.ive += this.productos[prod].impuesto;
				let total = this.productos[prod].subtotal + this.productos[prod].impuesto;
				this.factura.total += total;

				this.factura.subtotal = Math.round(this.factura.subtotal * 100) / 100;
				this.factura.descuento = Math.round(this.factura.descuento * 100) / 100;
				this.factura.ive = Math.round(this.factura.ive * 100) / 100;
				this.factura.total = Math.round(this.factura.total * 100) / 100;
			}
		}else{
			this.factura.subtotal = 0.00;
			this.factura.descuento = 0.00;
			this.factura.ive = 0.00;
			this.factura.total = 0.00;

			for(let prod=0; prod<this.productos.length; prod++){
				let subtotal = this.productos[prod].precio * this.productos[prod].cantidad;;
				this.factura.subtotal += subtotal;
				this.factura.descuento += this.productos[prod].descuento;
				this.factura.ive += this.productos[prod].impuesto;
				let total = this.productos[prod].subtotal + this.productos[prod].impuesto;
				this.factura.total += total;

				this.factura.subtotal = Math.round(this.factura.subtotal * 100) / 100;
				this.factura.descuento = Math.round(this.factura.descuento * 100) / 100;
				this.factura.ive = Math.round(this.factura.ive * 100) / 100;
				this.factura.total = Math.round(this.factura.total * 100) / 100;
			}
		}	
	}

	facturar(){

		/*if(!this.persona.cedula){
			this.form_errors.empty_id = true;
		}*/

	/*	if((this.persona.cedula && this.persona.nombre) && (this.persona.telefono && this.persona.email) 
			&& (!this.form_errors.invalid_id && !this.form_errors.invalid_phone) && !this.form_errors.invalid_email){	*/

		if(this.persona.nombre){		

			if(this.productos.length > 0){
				let telefono = this.persona.telefono+"";			

				if(telefono.indexOf('-') > -1){
					this.persona.telefono = telefono.replace('-','');
				}

				for(let tipo in this.tipos_ID){
					if(this.persona.identification_nombre === this.tipos_ID[tipo].nombre){
						this.persona.tipo_idenfificacion_id = this.tipos_ID[tipo].id;
					}
				}

				for(let md in this.medios_pagos){
					if(this.medios_pagos[md].nombre === this.factura.medio_nombre){
						this.factura.medio = this.medios_pagos[md].id;						
					}
				}

				let data = {
					client: this.persona,
					productos: this.productos,
					factura: this.factura,
					consulta: this.consulta_id
				}

				this.loading = true;

				this.formControlDataService.generarFactura(data)
				.subscribe(
					response => {					   
					   let number = 0;	
					   this.loading = false;
					   this.form_errors.ajax_failure = false;	
					   this.form_errors.successful_operation = true;

					   this.form_errors.empty_id = false;

					   	this.factura = {
							subtotal: 0.00,
							descuento: 0.00,
							ive: 0.00,
							total: 0.00,
							medio: 1,
							medio_nombre: 'Efectivo'
						};  

						this.productos = [];
						this.producto.descripcion = "";

					   setTimeout(() => {
					      this.form_errors.successful_operation = false;
					      this.openModalDatos();
					      if(this.router.url==='/notas'){
					      	this.router.navigate(['/inicio']);
					      }
					      this.commonService.notifyOther({option: 'removeConsulta', consulta: this.consulta_id});
					    }, 3000);					   					   					 
					},
					error => {
						console.log(<any>error);
						this.loading = false;
						this.form_errors.successful_operation = false;
						this.form_errors.ajax_failure = true;	
						setTimeout(() => {
					      this.form_errors.ajax_failure = false;
					      this.openModalDatos();
					    }, 3000);											
					}
				);							
			}else{
				this.form_errors.empty_products = true;
			}
		}
	}	

 	openModalDatos() {
 		if (!this.loading) {
 			this.form_errors.successful_operation = false;
	 		this.form_errors.successful_operation = false;	
			let modal = document.getElementsByClassName('esc-modal');		
			this.showModalDatos	=	!this.showModalDatos;
			let body = document.getElementsByTagName('body')[0];
			if (this.showModalDatos){
				window.scrollTo(0, 0);
				body.classList.add('open-modal');	
				modal.item(0).setAttribute("style","display: inline");
				if(this.margin){
					modal.item(0).setAttribute("style","margin-top: 0%");	
				}else{
					modal.item(0).setAttribute("style","margin-top: -10%");	
				}
			} else{		
				if(this.router.url==='/notas'){
					this.router.navigate(['/inicio']);
				}	
				modal.item(0).setAttribute("style","display: none");
				body.classList.remove('open-modal');
			}
 		} 		
	}

	regexEmail(email) {
	  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	  return re.test(email);
	}

	validarNombre(){
		console.log(this.persona);
		if(this.persona.nombre){
			this.form_errors.empty_name = false;
		}else{
			this.form_errors.empty_name = true;
		}
	}

	validarCorreo() {
	  let email = this.persona.email;
	  if (this.regexEmail(email)) {
	  	this.form_errors.invalid_email = false;
	  } else {
	    this.form_errors.invalid_email = true;
	  }	  
	}

	validarTelefono(){
		let telefono = this.persona.telefono+"";
		let tel_long = telefono.split('');

		if(tel_long.length != 9){
			this.form_errors.invalid_phone = true;
		}else{
			this.form_errors.invalid_phone = false;
		}
	}

	validarCedula(){
		this.form_errors.empty_id = false;
		let cedula = this.persona.cedula+"";
		let ced_long = cedula.split('');

		switch(this.persona.identification_nombre){
			case "Cedula Fisica":
			  if(ced_long.length === 9){
			  	this.form_errors.invalid_id = false;
			  } else {
			  	this.form_errors.invalid_id = true;
			  }
			  break;
			case "Cedula Juridica":
			  if(ced_long.length === 10){
			  	this.form_errors.invalid_id = false;
			  } else {
			  	this.form_errors.invalid_id = true;
			  }
			  break;
			case "DIMEX":
			  if(ced_long.length === 11 || ced_long.length === 12){
			  	this.form_errors.invalid_id = false;
			  } else {
			  	this.form_errors.invalid_id = true;
			  }
			  break;
			case "NITE":
			  if(ced_long.length === 10){
			  	this.form_errors.invalid_id = false;
			  } else {
			  	this.form_errors.invalid_id = true;
			  }
			  break;
			 case "EXTRANJERO":
			  if(ced_long.length <= 20){
			  	this.form_errors.invalid_id = false;
			  } else {
			  	this.form_errors.invalid_id = true;
			  }
			  break;
		}
	}

	_keyPress(event: any) {
	    const pattern = /^[0-9._\b]/;
	    let inputChar = String.fromCharCode(event.charCode);

	    if (!pattern.test(inputChar)) {
	      // invalid character, prevent input
	      event.preventDefault();
	    }
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}

}
