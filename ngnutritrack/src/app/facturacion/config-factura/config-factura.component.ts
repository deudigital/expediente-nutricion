import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FormControlData }     from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';
import { CommonService } from '../../services/common.service';



@Component({
  selector: 'app-config-factura',
  templateUrl: './config-factura.component.html',
  styleUrls: ['./config-factura.component.css']
})


export class ConfigFacturaComponent implements OnInit {
@ViewChild("fileInput") fileInput;
@ViewChild("fileCrypto") fileCrypto;
  mng:any;
  fcData: any;  
  helpers:any;
  showOverlay: boolean = false;
  loading: boolean = false;

  tipos: any =[];
  data: any={};
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

  crytoName : string ='';

  fileToUpload:any;
  crytoToUpload:any;

   form_errors:any = {
    empty_id: false,
    empty_postal: false,
    empty_comercialName: false,
    empty_direccion: false,
    empty_idAtv: false,
    empty_passAtv: false,
    empty_pinAtv:false,
    invalid_id: false,    
    invalid_phone: false,
    invalid_email: false,   
    invalid_file: false, 
    invalid_cryto:false,
    successful_operation: false,
    successful_loadImage:false,
    ajax_failure: false
   };

  constructor(private formControlDataService: FormControlDataService, private commonService: CommonService) {
    this.fcData  =  this.formControlDataService.getFormControlData();
    this.mng  =  this.fcData.getManejadorDatos();
	this.helpers	=	this.fcData.getHelpers();
  }
  ngOnInit() {
    this.data.imagen='assets/images/logo-placeholder.jpg';
	this.loadDataForm();
    this.optenerTipoIdentificacion();
  }
  loadDataForm(){
    this.showOverlay = true;
    this.loading = true;
    this.formControlDataService.getDataForm()
    .subscribe(
       response  => {
            this.mng.fillDataForm(response);
            this.ubicaciones  = this.mng.getUbicaciones();
            this._provincias  = this.mng.getProvincias();
            this._cantones  = this.mng.getCantones();
            this._distritos = this.mng.getDistritos();

            if(this.ubicaciones)
                this.setUbicacion(6345);

            this.getDataNutricionista();  
            this.loading = false;        
            this.showOverlay = false;        
            },
      error => { 
        this.loading = false;
        this.showOverlay = false;
        console.log(<any>error)
      }
    );
  }

  setUbicacion(ubicacion_id){

   if(!this.data.ubicacion_id)
     ubicacion_id = 6435;

   if(this.data.ubicacion_id>0)
     ubicacion_id	=	this.data.ubicacion_id;


   var ubicacion	=	this.ubicaciones.filter(x => x.id === ubicacion_id);
   ubicacion	=	ubicacion[0];
   this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === ubicacion.codigo_provincia);
   this.filter_distritos	=	this._distritos.filter(x => x.codigo_provincia === ubicacion.codigo_provincia && x.codigo_canton === ubicacion.codigo_canton);
   this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_provincia === ubicacion.codigo_provincia && x.codigo_canton === ubicacion.codigo_canton && x.codigo_distrito === ubicacion.codigo_distrito);
   this.canton		=	ubicacion.codigo_canton;
   this.distrito	=	ubicacion.codigo_distrito;
   this.provincia	=	ubicacion.codigo_provincia;


   this.data.ubicacion_id	=	ubicacion_id;
   return ;
 }

 selectCantones(event:Event):void {
   this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === this.provincia);
   this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
   this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
 }
 selectDistritos(event:Event):void {
   this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
   this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
 }
 selectBarrios(event:Event):void {
   this.filter_barrios	=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
 }

  optenerTipoIdentificacion(){
    this.formControlDataService.getTipo_ID()
    .subscribe(
      response  =>  {
        this.tipos = response;
      },
      error =>  {
        console.log(error);
      }
    )
  }

  getDataNutricionista(){
    this.formControlDataService.getNutricionista()
    .subscribe(
      response  =>  {
        this.data = response[0];
        for(let tipo in this.tipos){         
          if(this.tipos[tipo].id === this.data.tipo_idenfificacion_id){
            this.data.identification_nombre = this.tipos[tipo].nombre;
          }
        }
        if(this.data.atv_llave_criptografica){
          let llave = this.data.atv_llave_criptografica.split('/');
          this.crytoName=llave[llave.length-1];
        }
        if(this.data.imagen=='' || this.data.imagen==null ){
          this.data.imagen='assets/images/logo.png';
        }        
        this.setUbicacion(this.data.ubicacion_id);
      },
      error =>  {
        console.log(error);
      }      
    )
    
    this.setUbicacion(this.data.ubicacion_id);
  }

  saveConfigData(){
    if( !this.form_errors.empty_id && !this.form_errors.empty_postal &&
        !this.form_errors.empty_comercialName && !this.form_errors.empty_comercialName &&
        !this.form_errors.empty_direccion && !this.form_errors.empty_idAtv &&
        !this.form_errors.empty_passAtv && !this.form_errors.empty_pinAtv &&
        !this.form_errors.invalid_id && !this.form_errors.invalid_phone && 
        !this.form_errors.invalid_email && !this.form_errors.invalid_file){
      this.showOverlay	=	true;
      this.loading = true;
      switch(this.data.identification_nombre){
      case "Cedula Fisica":
        this.data.tipo_idenfificacion_id=1;
        break;
      case "Cedula Juridica":
        this.data.tipo_idenfificacion_id=2;
        break;
      case "DIMEX":
        this.data.tipo_idenfificacion_id=3;
        break;
      case "NITE":
        this.data.tipo_idenfificacion_id=4;
        break;
       case "EXTRANJERO":
        this.data.tipo_idenfificacion_id=5;
        break;
    }
      this.formControlDataService.updateConfiguracionFactura(this.data)
      .subscribe(
        response => {
            if(this.fileToUpload){
              this.formControlDataService.uploadImagen(this.fileToUpload)
              .subscribe(
                res => {},
                err => {
                  console.log(<any>err);               
                }
              );              
            }
            if(this.crytoToUpload){
              this.formControlDataService.uploadCrypto(this.crytoToUpload)
              .subscribe(
                res=>{},
                err=> {
                  console.log(<any>err);
                });
            }
          setTimeout(() => {
            this.loading = false;
            this.form_errors.ajax_failure = false; 
            this.form_errors.successful_loadImage = false;
            this.form_errors.successful_operation = true;
              setTimeout(() => {
				this.showOverlay	=	false;
              this.form_errors.successful_operation = false;
            }, 3000);
          }, 5000);                  
        },
        error => {
          console.log(<any>error);
		  
          this.loading = false;
          this.form_errors.successful_operation = false;
          this.form_errors.successful_loadImage = false;
          this.form_errors.ajax_failure = true;
          setTimeout(() => {
            this.form_errors.ajax_failure = false;
			  this.showOverlay	=	false;
          }, 3000);
        }
      );
    }
  }

  addFile(): void {
    let fi = this.fileInput.nativeElement;
    let format = fi.files[0].type.split('/');
    if (fi.files && fi.files[0]) {
      if(fi.files[0].size<2097153 && format[0]==='image'){
        this.fileToUpload = fi.files[0];
        this.form_errors.invalid_file=false;
        var reader = new FileReader();
        reader.onload = (e) => {
          let v = e.target
          this.data.imagen= reader.result;
        }
        reader.readAsDataURL(fi.files[0]);

      }else{
        this.form_errors.invalid_file=true;
      }
    }
  }

  validarCedula(){
    this.form_errors.empty_id = false;
    let cedula = this.data.cedula+"";
    let ced_long = cedula.split('');

    switch(this.data.identification_nombre){
      case "Cedula Fisica":
        if(ced_long.length === 9){
          this.data.
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
        event.preventDefault();
      }
  }

  validarNombreComercial(){
    if(this.data.nombre_comercial){
      this.form_errors.empty_comercialName = false;
    }else{
      this.form_errors.empty_comercialName = true;
    }
  }

  validarApartado(){
    if(this.data.apartado_postal){
      this.form_errors.empty_postal = false;
    }else{
      this.form_errors.empty_postal = true;
    }
  }

  validarTelefono(){
    let telefono = this.data.telefono+"";
    let tel_long = telefono.split('');

    if(tel_long.length != 8){
      this.form_errors.invalid_phone = true;
    }else{
      this.form_errors.invalid_phone = false;
    }
  }

  validarCorreo() {
    let email = this.data.email;
    if (this.regexEmail(email)) {
      this.form_errors.invalid_email = false;
    } else {
      this.form_errors.invalid_email = true;
    }   
  }

  regexEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validarDireccion(){
    if(this.data.detalles_direccion){
      this.form_errors.empty_direccion = false;
    }else{
      this.form_errors.empty_direccion = true;
    }
  }

  validarIdATV(){
    if(this.data.atv_ingreso_id){
      this.form_errors.empty_idAtv = false;
    }else{
      this.form_errors.empty_idAtv = true;
    }
  }

  validarPassATV(){
    if(this.data.atv_ingreso_contrasena){
      this.form_errors.empty_passAtv = false;      
    }else{
      this.form_errors.empty_passAtv = true;
    }
  }

  validarPinATV(){
    if(this.data.atv_clave_llave_criptografica){
      this.form_errors.empty_pinAtv = false;
    }else{
      this.form_errors.empty_pinAtv = true;
    }
  }

  input(id){
    document.getElementById(id).click();
  }

  addCryptograficKey(): void {
    let fi = this.fileCrypto.nativeElement;
    let format = fi.files[0].type.split('/');
    if(fi.files && fi.files[0]){
      if(format[0]==='application' && format[1]==='x-pkcs12'){
        this.crytoToUpload = fi.files[0];  
        this.crytoName = fi.files[0].name;
        this.form_errors.invalid_cryto=false;

      }else{
        this.form_errors.invalid_cryto=true;
      }
    }    
  }

}
