import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Analisis, Paciente, Provincia, Canton, Distrito } from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styles: []
})
export class ContactoComponent implements OnInit {
	model:any;

	fcData:any;
	paciente=new Paciente();
	oPaciente=new Paciente();
	esMenor:boolean=false;	
	projects:{ [id: string]: any; } = {}; 
	st_option:{ [id: string]: any; } = {}; 
	co_option:{ [id: string]: any; } = {}; 
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
	goToNext:boolean;
	goToPrevious:boolean;
	
	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcData		=	formControlDataService.getFormControlData();
		this.paciente	=	this.fcData.getFormPaciente();
		console.log(this.paciente);
		this.mng		=	this.fcData.getManejadorDatos();
		this.mng.setMenuPacienteStatus(true);
		this.ubicaciones	=	this.mng.getUbicaciones();
		this._provincias	=	this.mng.getProvincias();
		this._cantones	=	this.mng.getCantones();
		this._distritos	=	this.mng.getDistritos();
		//console.log('this._cantones');
		//console.log(this._cantones);		
		this.setInfoInit();
		if(this.ubicaciones)
			this.setUbicacion();
	}
	ngOnInit() {
		this.goToPrevious	=	false;
		this.goToNext		=	false;
	}
	ngOnDestroy() {
		this.saveForm();
	}
	
	filterItems(query) {
		//x => x.codigo_provincia === 1, x => x.codigo_distrito === 1 ,  && x.codigo_canton === 1
		
		return this.ubicaciones.filter(function(x) {
			return x => x.codigo_provincia === 1;
		});
	}

/*	 
id 	
codigo_provincia 	codigo_canton 	codigo_distrito 	codigo_barrio
nombre_provincia 	nombre_canton 	nombre_distrito 	nombre_barrio
*/	
	setUbicacion(){console.log('this.paciente.ubicacion_id-> ' + this.paciente.ubicacion_id);
		var	ubicacion_id	=	6345;
		if(this.paciente.ubicacion_id>0)
			ubicacion_id	=	this.paciente.ubicacion_id;
			
		
		var ubicacion	=	this.ubicaciones.filter(x => x.id === ubicacion_id);
		ubicacion	=	ubicacion[0];
		console.log('ubicacion');
		console.log(ubicacion);
		
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
		
		
		this.paciente.ubicacion_id	=	ubicacion_id;
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
/*	setCantones(codigo_provincia){
		this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === codigo_provincia);
	}
	setDistritos(codigo_provincia, codigo_canton){
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === codigo_canton && x.codigo_provincia === codigo_provincia);
	}
*/
	selectCantones(event:Event):void {console.log('selectCantones de provincia->' + this.provincia);
		//this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === this.provincia.codigo_provincia);
		this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === this.provincia);
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
	}
	selectDistritos(event:Event):void {console.log('selectDistritos de canton->' + this.canton);
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		
		this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === this.provincia);
		this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
	}
	selectBarrios(event:Event):void {console.log('selectBarrios de Distrito->' + this.distrito);
		this.filter_barrios	=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		//console.log(this.filter_barrios);
	}
	setInfoInit(){
		this.oPaciente.telefono				=	this.paciente.telefono;
		this.oPaciente.celular				=	this.paciente.celular;
		this.oPaciente.email				=	this.paciente.email;
		this.oPaciente.provincia			=	this.paciente.provincia;
		this.oPaciente.canton				=	this.paciente.canton;
		this.oPaciente.distrito				=	this.paciente.distrito;
		this.oPaciente.detalles_direccion	=	this.paciente.detalles_direccion;
		this.oPaciente.responsable_telefono	=	this.paciente.responsable_telefono;
		this.oPaciente.responsable_email	=	this.paciente.responsable_email;
		this.oPaciente.ubicacion_id			=	this.paciente.ubicacion_id;
	}
	
	infoEdited(){
		return 	(
			this.oPaciente.telefono				!==	this.paciente.telefono || 
			this.oPaciente.celular				!==	this.paciente.celular || 
			this.oPaciente.email				!==	this.paciente.email || 
			this.oPaciente.provincia			!==	this.paciente.provincia || 
			this.oPaciente.canton				!==	this.paciente.canton || 
			this.oPaciente.distrito				!==	this.paciente.distrito || 
			this.oPaciente.detalles_direccion	!==	this.paciente.detalles_direccion || 
			this.oPaciente.responsable_telefono	!==	this.paciente.responsable_telefono || 
			this.oPaciente.responsable_email	!==	this.paciente.responsable_email	|| 
			this.oPaciente.ubicacion_id			!==	this.paciente.ubicacion_id
		);

	}
	saveInfo(data){
		console.log('save Contacto...');
		console.log(data);
		this.formControlDataService.saveDatosContacto(data)
		.subscribe(
			 response  => {
						console.log('Response Contacto');
						console.log(response);						
					},
			error =>  console.log(<any>error)
		);
	}
	saveForm(){
		this.formControlDataService.getFormControlData().getFormPaciente().set(this.paciente);
		if(this.infoEdited())
			this.saveInfo(this.paciente);
	}
	Previous(){
		this.saveForm();
		this.router.navigate(['/personales']);
	}
	Next(){
		this.saveForm();
		this.router.navigate(['/hcp']);
	}
}
