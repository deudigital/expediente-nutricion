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
	helpers:any;

	fcData:any;
	paciente:any;
	oPaciente:any;
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

	btnNavigation_pressed:boolean;

	goToNext:boolean;
	goToPrevious:boolean;	
	page:string;
	
	pacienteNuevo:boolean;
	
	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcData		=	formControlDataService.getFormControlData();
		this.helpers	=	this.fcData.getHelpers();
		this.paciente	=	this.fcData.getFormPaciente();
		this.mng		=	this.fcData.getManejadorDatos();
		this.mng.setMenuPacienteStatus(true);
		this.ubicaciones	=	this.mng.getUbicaciones();
		this._provincias	=	this.mng.getProvincias();
		this._cantones	=	this.mng.getCantones();
		this._distritos	=	this.mng.getDistritos();
		this.setInfoInit();
		if(this.ubicaciones)
			this.setUbicacion();
	}
	ngOnInit() {
		this.btnNavigation_pressed	=	false;
		this.goToPrevious	=	false;
		this.goToNext		=	false;
		this.pacienteNuevo	=	false;
		if(this.mng.operacion=='nuevo-paciente')
			this.pacienteNuevo	=	true;
	}
	ngOnDestroy() {
		if(!this.btnNavigation_pressed)
			this.saveForm();
		this.helpers.scrollToForm();
	}
	setUbicacion(){
		var	ubicacion_id	=	6345;
		if(this.paciente.ubicacion_id>0)
			ubicacion_id	=	this.paciente.ubicacion_id;

		var ubicacion	=	this.ubicaciones.filter(x => x.id === ubicacion_id);
		ubicacion	=	ubicacion[0];
		this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === ubicacion.codigo_provincia);		
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_provincia === ubicacion.codigo_provincia && x.codigo_canton === ubicacion.codigo_canton);
		this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_provincia === ubicacion.codigo_provincia && x.codigo_canton === ubicacion.codigo_canton && x.codigo_distrito === ubicacion.codigo_distrito);
		this.canton		=	ubicacion.codigo_canton;
		this.distrito	=	ubicacion.codigo_distrito;
		this.provincia	=	ubicacion.codigo_provincia;
		this.paciente.ubicacion_id	=	ubicacion_id;
		return ;
	}
	selectCantones(event:Event):void {
		this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === this.provincia);
		this.canton		=	this.filter_cantones[0].codigo_canton;
		this.distrito	=	this.filter_distritos[0].codigo_distrito;
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		this.paciente.ubicacion_id	=	this.filter_barrios[0].id;
	}
	selectDistritos(event:Event):void {
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		this.distrito	=	this.filter_distritos[0].codigo_distrito;				
		this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		this.paciente.ubicacion_id	=	this.filter_barrios[0].id;
	}
	selectBarrios(event:Event):void {
		this.filter_barrios	=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		this.paciente.ubicacion_id	=	this.filter_barrios[0].id;	
	}
	setInfoInit(){
		this.oPaciente	=	new Paciente();
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
		if(!this.paciente.id){
			return ;
		}
		this.formControlDataService.saveDatosContacto(data)
		.subscribe(
			 response  => {
						this.mng.setEnableLink(true);
						this.goTo(this.page);
						this.btnNavigation_pressed	=	false;
					},
			error =>  {
				console.log(<any>error)
				this.btnNavigation_pressed	=	false;
			}
		);
	}
	saveForm(){
		this.formControlDataService.getFormControlData().getFormPaciente().set(this.paciente);
		if(this.infoEdited())
			this.saveInfo(this.paciente);
	}
	Previous(){
		this.btnNavigation_pressed	=	true;
		if(this.pacienteNuevo){
			this.page	=	'/personales';
			this.saveForm();
		}else
			this.router.navigate(['/personales']);
	}
	Next(){
		this.btnNavigation_pressed	=	true;
		if(this.pacienteNuevo){
			this.page	=	'/hcp';
			this.saveForm();
		}else{
			this.btnNavigation_pressed	=	false;
			this.router.navigate(['/hcp']);
		}
		
	}
	goTo(page){
		if(this.btnNavigation_pressed)
			this.router.navigate([page]);
	}
}
