import { Component, OnInit } from '@angular/core';
import { Producto } from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';
import { FormControlData} from '../control/data/formControlData.model';


@Component({
  selector: 'app-servicios-productos',
  templateUrl: './servicios-productos.component.html',
  styles: []
})
export class ServiciosProductosComponent implements OnInit {

	private formControlData: FormControlData = new FormControlData();
	nuevo:boolean = false;
	showZero_price:boolean = false;
	show_deleteConfirmation:boolean = false;
	edit_mode:boolean = false;


	form_errors:any = {
		null_description: false,
		null_unity: false,
		NaN_error: false,
		save_product: false,
		edit_product: false,
		delete_product: false
	};
	productos: any = [];

	responses: any = [];

	precio: number = 0.00;
	descripcion: string;
	unidad_medida: string = null;
	productIndex: number = 0;

	paquete: any = {};

	unidades: any = [];

  	constructor(private formControlDataService: FormControlDataService) {}

  	ngOnInit() {
  		this.obtenerUnidades();
  		this.obtenerProductos();
  	}

  	showNewProductForm(){  		
		this.nuevo	=	!this.nuevo;
	}

	agregarProducto(){		

		this.form_errors.save_product = false;

		if(this.descripcion === ""){			
			this.form_errors.null_description = true;
			return;
		}

		if(this.unidad_medida === null){			
			this.form_errors.null_unity = true;
			return;
		}

		if(Number.isNaN(this.precio)){		 	
		 	this.form_errors.NaN_error = true;
			return;
		}

		if(this.precio === 0){	
			if(!this.showZero_price){		
				this.confirmZeroPrice();
				return;
			}
		}		

		var nutricionista_id	=	this.formControlData.nutricionista_id;		

		this.paquete = {
			precio: this.precio,
			descripcion: this.descripcion,
			unidad_medida: this.unidad_medida["id"],
			nombre_unidad: this.unidad_medida["nombre"],
			index: this.productIndex,
			nutricionista_id: nutricionista_id
		};

		this.productIndex ++;

		this.saveProduct(this.paquete);
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

	obtenerProductos(){
		this.formControlDataService.getProducts()
		.subscribe(
			 response  => {
			 			/*let res = response.text();
			 			let resArray = [] 

			 			resArray = res.split('<br />');		

			 			this.productos = JSON.parse(resArray[2]);*/

			 			this.productos = response;

			 			for(let producto in this.productos){
			              for(let item in this.unidades){			            			               
			              	if(this.productos[producto].unidad_medida === this.unidades[item].id){
			                	this.productos[producto].nombre_unidad = this.unidades[item].nombre;
			              	}
			              }    
			          	}						          	
						},
			error =>  {
					console.log(error)
				}
		);
	}

	saveProduct(producto){		

		this.formControlDataService.addProducto(producto)
		.subscribe(
			 response  => {
			 			/*let res = response.text();
			 			let resArray = [] 
			 			let finalResult:any;

			 			resArray = res.split('<br />');			 			
			 			finalResult = JSON.parse(resArray[2]);	*/		 			
			 			//producto.id = finalResult.data;

			 			this.responses.push(response);
			 			producto.id = this.responses[0].data;

			 			this.responses.splice(0, 1);	
						this.productos.push(producto);
					},
			error =>  {
						console.log(<any>error);
						this.form_errors.save_product = true;
					}
		);

		let body = document.getElementsByTagName('body')[0];

		if(this.showZero_price)
			body.classList.remove('open-modal');		
			
	}

	editProduct(producto){		
		this.form_errors.edit_product = false;
		producto.edit_mode = !producto.edit_mode;

		if(!producto.edit_mode){			
			producto.unidad_medida = this.unidad_medida["id"];
			producto.nombre_unidad = this.unidad_medida["nombre"];			

			this.formControlDataService.updateProducto(producto)
			.subscribe(
				response => {
					console.log(response);
				},
				error => {
					console.log(<any>error);
					this.form_errors.edit_product = true;
				}
			);	
		}
	}

	removeProduct(){			

		this.form_errors.delete_product = false;

		let removedProduct = {
			index: 0,
			id: null
		}

		for(let i=0; i<this.productos.length; i++){			
			if(this.productos[i].index === this.paquete.index){			
				removedProduct.index = i;
				removedProduct.id = this.productos[i].id;
			}		   	
		}

		this.formControlDataService.deleteProducto(removedProduct.id)
		.subscribe(
			response => {
				this.productos.splice(removedProduct.index, 1);	
			},
			error => {
				console.log(<any>error);
				this.form_errors.delete_product = true;
			}
		);	

		this.paquete.edit_mode = false;
		this.confirmDeleteItem(this.paquete);
	}

	cleanError(input){
		switch(input){
			case "descripcion": this.form_errors.null_description = false;
				break;
			case "unidad"	 : this.form_errors.null_unity = false;
				break;
			case "precio"	 : this.form_errors.NaN_error = false;
				break;					
		}
	}

	confirmZeroPrice(){
		this.showZero_price = !this.showZero_price;
		let body = document.getElementsByTagName('body')[0];
		if(this.showZero_price)
			body.classList.add('open-modal');
		else
			body.classList.remove('open-modal');
	}

	confirmDeleteItem(producto){
		this.paquete = producto;
		this.show_deleteConfirmation = !this.show_deleteConfirmation;
		let body = document.getElementsByTagName('body')[0];
		if(this.show_deleteConfirmation)
			body.classList.add('open-modal');
		else
			body.classList.remove('open-modal');
		
	}
}
