import { Component, OnInit } from '@angular/core';

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
	
	constructor(private formControlDataService: FormControlDataService) {
		this.fcData		=	formControlDataService.getFormControlData();
		this.paciente	=	this.fcData.getFormPaciente();
		console.log(this.paciente);
		this.mng		=	this.fcData.getManejadorDatos();
		this.ubicaciones	=	this.mng.getUbicaciones();
		this._provincias	=	this.mng.getProvincias();
		this._cantones	=	this.mng.getCantones();
		this._distritos	=	this.mng.getDistritos();
		
		//console.log('this._cantones');
		//console.log(this._cantones);

		this.setUbicacion();
		
		this.setInfoInit();
	}
	ngOnInit() {
	}
	ngOnDestroy() {
		this.formControlDataService.getFormControlData().getFormPaciente().set(this.paciente);
		if(this.infoEdited()){
			/*if(this.barrio)
				this.paciente.ubicacion_id	=	this.barrio.id;*/
			this.saveInfo(this.paciente);
		}

	}
/*	 
id 	
codigo_provincia 	codigo_canton 	codigo_distrito 	codigo_barrio
nombre_provincia 	nombre_canton 	nombre_distrito 	nombre_barrio
*/	
	setUbicacion(){console.log('this.paciente.ubicacion_id-> ' + this.paciente.ubicacion_id);
		if(!this.paciente.ubicacion_id)
			return ;
		var ubicacion	=	this.ubicaciones.filter(x => x.id === this.paciente.ubicacion_id);
		
		console.log(ubicacion);//console.log(this.ubicaciones);
		this.setCantones(ubicacion.codigo_provincia);
		this.setDistritos(ubicacion.codigo_provincia, ubicacion.codigo_canton);
		var prov	=	new Provincia(ubicacion.codigo_provincia, ubicacion.nombre_provincia);
		/*prov.codigo_provincia		=	ubicacion.codigo_provincia;
		prov.nombre_provincia		=	ubicacion.nombre_provincia;*/
		this.provincia	=	prov;
		var cant	=	new Canton(ubicacion.codigo_canton, ubicacion.nombre_canton, ubicacion.codigo_provincia);
		this.canton		=	cant;
		
		var dist	=	new Distrito(ubicacion.codigo_distrito, ubicacion.nombre_distrito, ubicacion.codigo_canton, ubicacion.codigo_provincia);
		this.distrito	=	dist;		
		/*this.barrio		=	ubicacion;*/
	}
	setCantones(codigo_provincia){
		this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === codigo_provincia);
	}
	setDistritos(codigo_provincia, codigo_canton){
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === codigo_canton && x.codigo_provincia === codigo_provincia);
	}
	selectCantones(event:Event):void {console.log(this.provincia);
		this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === this.provincia.codigo_provincia);
		//console.log(this.filter_cantones);
	}
	selectDistritos(event:Event):void {console.log(this.canton);
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === this.canton.codigo_canton && x.codigo_provincia === this.canton.codigo_provincia);
		//console.log(this.filter_distritos);
	}
	selectBarrios(event:Event):void {console.log(this.distrito);
		this.filter_barrios	=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito.codigo_distrito && x.codigo_canton === this.distrito.codigo_canton && x.codigo_provincia === this.distrito.codigo_provincia);
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
		console.log('saveInfo:sending...');
		console.log(data);
		this.formControlDataService.saveDatosContacto(data)
		.subscribe(
			 response  => {
						console.log('saveInfo:receiving...');
						console.log(response);
						},
			error =>  console.log(<any>error)
		);
	}
}
