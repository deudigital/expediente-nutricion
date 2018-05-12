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
		/*console.log(this.paciente);*/
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
		this.btnNavigation_pressed	=	false;
		this.goToPrevious	=	false;
		this.goToNext		=	false;
		this.pacienteNuevo	=	false;
		/*if(this.mng.operacion!='nuevo-paciente')
			this.mng.setEnableLink(false);
		else
			this.pacienteNuevo	=	true;*/
		if(this.mng.operacion=='nuevo-paciente')
			this.pacienteNuevo	=	true;
	}
	ngOnDestroy() {
		if(!this.btnNavigation_pressed)
			this.saveForm();
	}
	/*filterItems(query) {
		return this.ubicaciones.filter(function(x) {
			return x => x.codigo_provincia === 1;
		});
	}*/
	setUbicacion(){//console.log('this.paciente.ubicacion_id-> ' + this.paciente.ubicacion_id);
		var	ubicacion_id	=	6345;
		if(this.paciente.ubicacion_id>0)
			ubicacion_id	=	this.paciente.ubicacion_id;

		var ubicacion	=	this.ubicaciones.filter(x => x.id === ubicacion_id);
		ubicacion	=	ubicacion[0];
		//console.log('ubicacion');console.log(ubicacion);
		this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === ubicacion.codigo_provincia);		
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_provincia === ubicacion.codigo_provincia && x.codigo_canton === ubicacion.codigo_canton);
		this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_provincia === ubicacion.codigo_provincia && x.codigo_canton === ubicacion.codigo_canton && x.codigo_distrito === ubicacion.codigo_distrito);
		this.canton		=	ubicacion.codigo_canton;
		this.distrito	=	ubicacion.codigo_distrito;
		this.provincia	=	ubicacion.codigo_provincia;
		
		
		this.paciente.ubicacion_id	=	ubicacion_id;
		return ;
	}
	selectCantones(event:Event):void {console.log('selectCantones de provincia->' + this.provincia);
		this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === this.provincia);
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		
		this.canton		=	this.filter_cantones[0].codigo_canton;
		this.distrito	=	this.filter_distritos[0].codigo_distrito;

		this.paciente.ubicacion_id	=	this.filter_barrios[0].id;
	}
	selectDistritos(event:Event):void {console.log('selectDistritos de canton->' + this.canton);
		this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);		
		this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === this.provincia);
		this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
		
		this.paciente.ubicacion_id	=	this.filter_barrios[0].id;
	}
	selectBarrios(event:Event):void {console.log('selectBarrios de Distrito->' + this.distrito);
		this.filter_barrios	=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
	}
	setInfoInit(){console.log(this.paciente);
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
		console.log('telefono: ' + this.oPaciente.telefono + '!==' + this.paciente.telefono);
		console.log('celular: ' + this.oPaciente.celular + '!==' + this.paciente.celular);
		console.log('email: ' + this.oPaciente.email + '!==' + this.paciente.email);
		console.log('provincia: ' + this.oPaciente.provincia + '!==' + this.paciente.provincia);
		console.log('canton: ' + this.oPaciente.canton + '!==' + this.paciente.canton);
		console.log('distrito: ' + this.oPaciente.distrito + '!==' + this.paciente.distrito);
		console.log('provincia: ' + this.oPaciente.provincia + '!==' + this.paciente.provincia);
		console.log('detalles_direccion: ' + this.oPaciente.detalles_direccion + '!==' + this.paciente.detalles_direccion);
		console.log('responsable_telefono: ' + this.oPaciente.responsable_telefono + '!==' + this.paciente.responsable_telefono);
		console.log('responsable_email: ' + this.oPaciente.responsable_email + '!==' + this.paciente.responsable_email);
		console.log('ubicacion_id: ' + this.oPaciente.ubicacion_id + '!==' + this.paciente.ubicacion_id);
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
		if(!this.paciente.id){
			console.log('sin datos de paciente id');
			return ;
		}
		this.formControlDataService.saveDatosContacto(data)
		.subscribe(
			 response  => {
						console.log('<--Crud Contacto');
						console.log(response);
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
