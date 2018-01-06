import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';

import { Reporte } from '../control/data/formControlData.model';
import { FormControlData }     from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

declare let jsPDF;

@Component({
  selector: 'app-reporte-factura',
  templateUrl: './reporte-factura.component.html',
})
export class ReporteFacturaComponent implements OnInit {
	private formControlData: FormControlData = new FormControlData();
	filter = {};
	factura = [];
  nombre: string = "";
  tipo: string = "Todos";
  tipos: any = [];
  resultArray: any = [];

  public fromDate: any = { date: {year: 2017, month: 10, day:9 } };
  public untilDate: any = { date: {year: 2017, month: 10, day:15 } };
  public fromOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    disableSince: {year: this.untilDate.date.year,
             month: this.untilDate.date.month,
             day: this.untilDate.date.day +1
            },
    editableDateField: false,
    showClearDateBtn: false
  };
  public untilOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    disableUntil: {year: this.fromDate.date.year,
             month: this.fromDate.date.month,
             day: this.fromDate.date.day -1
            },
    editableDateField: false,
    showClearDateBtn: false
  };

  constructor(private formControlDataService: FormControlDataService) {
  }

  ngOnInit() {
    this.obtenerTiposDeDocumento();
  	this.obtenerFacturas();
  }

  refreshDateFromLimits(event){
   this.untilOptions = {
      dateFormat: 'dd/mm/yyyy',
      disableUntil: {year: event.date.year,
               month: event.date.month,
               day: event.date.day
              }
   };
  }

  refreshUntilDateLimits(event){
   this.fromOptions = {
      dateFormat: 'dd/mm/yyyy',
      disableSince: {year: event.date.year,
               month: event.date.month,
               day: event.date.day
              }
   };
  }

  obtenerTiposDeDocumento(){
    this.formControlDataService.getTipos()
      .subscribe(
        response  =>  {
         /* let res = response.text();
          let resArray = []

          resArray = res.split('<br />');
          this.tipos = JSON.parse(resArray[2]);*/
          this.tipos = response;
        },
        error =>  {
          console.log(error);
        }
      )
  }

  obtenerFacturas(){
		this.formControlDataService.getReporteFactura()
		.subscribe(
			 response  => {

			 		/*let res = response.text();
			 		let resArray = []

			 		resArray = res.split('<br />');
          this.factura = JSON.parse(resArray[2]);
          console.log(this.factura);*/
          

          this.factura = response;

          for(let doc in this.factura){
            for(let item in this.tipos){
              if(this.factura[doc].tipo_documento_id === this.tipos[item].id){
                this.factura[doc].nombre_tipo = this.tipos[item].nombre;
              }
            }
          }

          this.resultArray = this.factura;
			},
			error =>  {
					console.log(error)
				}
		);
	}

  showPDF(item){
    let pdf = item.pdf.split('/');    
    window.open("http://expediente.nutricion.co.cr/nutri/public/invoices/"+pdf[pdf.length-1], "_blank");
  }

  deleteData(item){
  	console.log(item);
  	/*realizar aqui el codigo para la nota de creditoy si da 200 coloca este codigo*/
  	for(let i=0; i<this.factura.length;i++){
  		if(item.id===this.factura[i].id){
  			console.log(this.factura[i]);
  			this.factura.splice(i,1);
  		}
  	}
  }

  filterQuery(){

    this.resultArray = [];

    //filter dates
    let fromDate = new Date(this.fromDate.date.year + '-' + this.fromDate.date.month + '-' + this.fromDate.date.day);
    let uDate = new Date(this.untilDate.date.year + '-' + this.untilDate.date.month + '-' + this.untilDate.date.day);

    if(this.fromDate.date.day != fromDate.getDate()){
      fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1));
    }

    if(this.untilDate.date.day != uDate.getDate()){
      uDate = new Date(uDate.setDate(uDate.getDate() + 1));
    }

    if(this.nombre === ""){
      for(let consulta in this.factura){
        let queryDate =  new Date(this.factura[consulta].fecha);
        queryDate =  new Date(queryDate.setDate(queryDate.getDate() + 1));

        if(queryDate >= fromDate && queryDate <= uDate){
          if(this.tipo === this.factura[consulta].nombre_tipo){
            this.resultArray.push(this.factura[consulta]);
          } else if(this.tipo === "Todos"){
            this.resultArray.push(this.factura[consulta]);
          }
        }
      }
    }else{
      for(let consulta in this.factura){
        let queryDate =  new Date(this.factura[consulta].fecha);
        queryDate =  new Date(queryDate.setDate(queryDate.getDate() + 1));

        if(queryDate >= fromDate && queryDate <=
          uDate && this.factura[consulta].nombre.toLowerCase().includes(this.nombre.toLowerCase())){
          if(this.tipo === this.factura[consulta].nombre_tipo){
            this.resultArray.push(this.factura[consulta]);
          } else if(this.tipo === "Todos"){
            this.resultArray.push(this.factura[consulta]);
          }
        }
      }
    }
  }

  exportData(Data){
  	switch(Data){
  		case 1: console.log('pdf');
  			let doc = new jsPDF({orientation:'l', format: 'a2'});
  			let col = ["# Documento", "Receptor","Tipo","Fecha","Moneda","Monto"];
  			let rows = [];

  			for(let xi=0;xi< this.factura.length;xi++){
  				let js = this.factura[xi];
				let temp = [js.documento,js.receptor,js.tipo,js.fecha,js.moneda,js.monto];
        		rows.push(temp);
		    }
  			doc.autoTable(col, rows);
  			doc.save('Reporte de Factura.pdf');
  			break;
		  case 2: console.log('excel');
			  new Angular2Csv(this.factura, 'My Report');
  			break;
  	}
  }
}
