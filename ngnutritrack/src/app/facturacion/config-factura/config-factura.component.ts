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

    // this.ubicaciones	=	this.mng.getUbicaciones();
    // this._provincias	=	this.mng.getProvincias();
    // this._cantones	=	this.mng.getCantones();
    // this._distritos	=	this.mng.getDistritos();
  }



  ngOnInit() {
    this.loadDataForm();

    this.optenerTipoIdentificacion();
    //this.optenerProvincia();    
  //--------------------------------------//


  }

  // Comentar para subir
  loadDataForm(){
    this.loading = true;
    this.formControlDataService.getDataForm()
    .subscribe(
       response  => {
            /*let resArray = [];
            resArray = response.text().split('<br />');
            this.mng.fillDataForm(JSON.parse(resArray[2]));*/
            this.mng.fillDataForm(response);
            this.ubicaciones  = this.mng.getUbicaciones();
            this._provincias  = this.mng.getProvincias();
            this._cantones  = this.mng.getCantones();
            this._distritos = this.mng.getDistritos();

            if(this.ubicaciones)
                this.setUbicacion(6345);

            this.getDataNutricionista();  
            this.loading = false;        
            },
      error => { 
        this.loading = false;
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


   this.data.ubicacion_id	=	ubicacion_id;
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
 }
 selectDistritos(event:Event):void {console.log('selectDistritos de canton->' + this.canton);
   this.filter_distritos	=	this._distritos.filter(x => x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
   this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
 }
 selectBarrios(event:Event):void {console.log('selectBarrios de Distrito->' + this.distrito);
   this.filter_barrios	=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
   console.log(this.data.ubicacion_id);
   //console.log(this.filter_barrios);
 }

  optenerTipoIdentificacion(){
    this.formControlDataService.getTipo_ID()
    .subscribe(
      response  =>  {
        /*let res = response.text();
        let resArray = []

        resArray = res.split('<br />');
        this.tipos = JSON.parse(resArray[2]);
        console.log(this.tipos)*/
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
        let llave = this.data.atv_llave_criptografica.split('/');
        this.crytoName=llave[llave.length-1];
        this.setUbicacion(this.data.ubicacion_id);
        console.log(this.data);
      },
      error =>  {
        console.log(error);
      }      
    )
    if(this.data.imagen=='' && this.data.imagen==null ){
      this.data.imagen='assets/images/logo-placeholder.jpg';
    }
    this.setUbicacion(this.data.ubicacion_id);
  }

  saveConfigData(){
    console.log('entra');
    console.log(this.ubicaciones);
    console.log(this.data);
    if( !this.form_errors.empty_id && !this.form_errors.empty_postal &&
        !this.form_errors.empty_comercialName && !this.form_errors.empty_comercialName &&
        !this.form_errors.empty_direccion && !this.form_errors.empty_idAtv &&
        !this.form_errors.empty_passAtv && !this.form_errors.empty_pinAtv &&
        !this.form_errors.invalid_id && !this.form_errors.invalid_phone && 
        !this.form_errors.invalid_email && !this.form_errors.invalid_file){
      this.loading = true;
      this.formControlDataService.updateConfiguracionFactura(this.data)
      .subscribe(
        response => {
          console.log(response);        
            if(this.fileToUpload){
              this.formControlDataService.uploadImagen(this.fileToUpload)
              .subscribe(
                res => {
                  console.log(res);
                },
                err => {
                  console.log(<any>err);               
                }
              );              
            }
            if(this.crytoToUpload){
              this.formControlDataService.uploadCrypto(this.crytoToUpload)
              .subscribe(
                res=>{
                  console.log(res);
                },
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
          }, 3000);
        }
      );
    }
  }

  addFile(): void {
    let fi = this.fileInput.nativeElement;
    console.log(fi);
    let format = fi.files[0].type.split('/');
    console.log(format);
    if (fi.files && fi.files[0]) {
      if(fi.files[0].size<2097153 && format[0]==='image'){
        this.fileToUpload = fi.files[0];
        console.log(this.fileToUpload);
        this.form_errors.invalid_file=false;
        var reader = new FileReader();
        reader.onload = (e) => {
          let v = e.target
          console.log(reader.result);
          this.data.imagen= reader.result;
          /*this.data.imagen= r.target.result
            $('#uploadForm + img').remove();
            $('#uploadForm').after('<img src="'+e.target.result+'" width="450" height="300"/>');*/
        }
        reader.readAsDataURL(fi.files[0]);

      }else{
        this.form_errors.invalid_file=true;
      }
        

        // this.uploadService
        //     .upload(fileToUpload)
        //     .subscribe(res => {
        //         console.log(res);
        //     });
    }
  }

  validarCedula(){
    this.form_errors.empty_id = false;
    let cedula = this.data.cedula+"";
    let ced_long = cedula.split('');

    switch(this.data.identification_nombre){
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

    if(tel_long.length != 9){
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
    console.log(fi.files[0]);
    let format = fi.files[0].type.split('/');
    console.log(format);
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
