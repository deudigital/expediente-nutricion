import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FormControlData }     from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';
import { CommonService } from '../../Services/common.service';



@Component({
  selector: 'app-config-factura',
  templateUrl: './config-factura.component.html',
  styleUrls: ['./config-factura.component.css']
})


export class ConfigFacturaComponent implements OnInit {
@ViewChild("fileInput") fileInput;


  mng:any;
  fcData: any;

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

  fileToUpload:any;

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

    this.ubicaciones	=	this.mng.getUbicaciones();
    this._provincias	=	this.mng.getProvincias();
    this._cantones	=	this.mng.getCantones();
    this._distritos	=	this.mng.getDistritos();

    this.optenerTipoIdentificacion();
    //this.optenerProvincia();
    this.getDataNutricionista()

    if(this.ubicaciones)
        this.setUbicacion(6345);
  //--------------------------------------//


  }

  // Comentar para subir
  loadDataForm(){
    this.formControlDataService.getDataForm()
    .subscribe(
       response  => {
            /*let resArray = [];
            resArray = response.text().split('<br />');
            this.mng.fillDataForm(JSON.parse(resArray[2]));*/
            this.mng.fillDataForm(response);
            },
      error =>  console.log(<any>error)
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


   //this.persona.ubicacion_id	=	ubicacion_id;
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

   this.filter_cantones	=	this._cantones.filter(x => x.codigo_provincia === this.provincia);
   this.filter_barrios		=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
 }
 selectBarrios(event:Event):void {console.log('selectBarrios de Distrito->' + this.distrito);
   this.filter_barrios	=	this.ubicaciones.filter(x => x.codigo_distrito === this.distrito && x.codigo_canton === this.canton && x.codigo_provincia === this.provincia);
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
      /*  let res = response.text();
        let resArray = []

        resArray = res.split('<br />');
        let arreglo = JSON.parse(resArray[2]);
        this.data = arreglo[0];
        console.log(this.data)*/
        this.data = response;
      },
      error =>  {
        console.log(error);
      }
    )

    this.setUbicacion(this.data.ubicacion_id);
  }

  saveConfigData(){
    console.log('entra');
    console.log(this.ubicaciones);
    console.log(this.data);
    this.formControlDataService.updateConfiguracionFactura(this.data)
    .subscribe(
      response => {
        console.log(response);
        this.formControlDataService.uploadImagen(this.fileToUpload)
        .subscribe(
          response => {
            console.log(response);
          },
          error => {
            console.log(<any>error);
          }
        );
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  addFile(): void {
    let fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {
        this.fileToUpload = fi.files[0];
        console.log(this.fileToUpload);

        // this.uploadService
        //     .upload(fileToUpload)
        //     .subscribe(res => {
        //         console.log(res);
        //     });
    }
}

}
