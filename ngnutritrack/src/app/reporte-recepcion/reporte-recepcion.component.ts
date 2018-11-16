import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';

import { Router } from '@angular/router';
import { Reporte } from '../control/data/formControlData.model';
import { FormControlData }     from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

declare let jsPDF;

@Component({
  selector: 'app-reporte-recepcion',
  templateUrl: './reporte-recepcion.component.html',
})
export class ReporteRecepcionComponent implements OnInit {
  private today: any = new Date();
	//private formControlData: FormControlData = new FormControlData();
	fcd:any;
	private formControlData: any;
	filter = {};
	doc_recepcionados = [];
  nombre: string = "";
  estado: string = "Todos";
  estados: any = [];
  resultArray: any = [];
  deleted_document: any = {};
  show_deleteConfirmation: boolean = false;

  form_errors: any = {
    loading: false,
    successful_operation: false,
    ajax_failure: false
  };

  public fromDate: any = { date: {year: this.today.getFullYear(), month: this.today.getMonth()+1, day:this.today.getDate() } };
  public untilDate: any = { date: {year: this.today.getFullYear(), month: this.today.getMonth()+1, day:this.today.getDate()+1 } };
  public fromOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    disableSince: {year: this.untilDate.date.year,
             month: this.untilDate.date.month,
             day: this.untilDate.date.day +1
            },
    editableDateField: false,
    showClearDateBtn: false,
    openSelectorOnInputClick: true
  };
  public untilOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    disableUntil: {year: this.fromDate.date.year,
             month: this.fromDate.date.month,
             day: this.fromDate.date.day -1
            },
    editableDateField: false,
    showClearDateBtn: false,
    openSelectorOnInputClick: true
  };
  constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
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
    this.estados = [
            {id:5, nombre:"Aceptado"},
            {id:6, nombre:"Aceptado Parcial"},
            {id:7, nombre:"Rechazado"}
			];			
  }
  obtenerFacturas(){
		this.formControlDataService.select('reporte-recepcion', {'nutricionista_id':this.fcd.nutricionista_id})
		.subscribe(
			 response  => {
					this.doc_recepcionados	=	response;
					for(let doc in this.doc_recepcionados){
						let _frow		=	this.estados.filter(x => x.id === Number(this.doc_recepcionados[doc].tipo_documento_id));
						if(_frow[0])
							this.doc_recepcionados[doc].estado_text	=	_frow[0].nombre;

						this.doc_recepcionados[doc].monto = Math.round(this.doc_recepcionados[doc].monto * 100) / 100;
					}
			},
			error =>  {
					console.log(error)
				}
		);
	}

  showPDF(item){
    let pdf = item.pdf.split('/');

    if(item.tipo_documento_id != 3){
      window.open(item.pdf, "_blank");
    }else{
      window.open(item.pdf, "_blank");
    }
  }
  fillWithZero(valor){
	  valor	=	((String(valor).length==1)? '0':'' ) + valor;
	  return valor;
  }
  filterQuery(){
    this.resultArray = [];
    let fromDate	=	new Date(this.fromDate.date.year + '-' + this.fromDate.date.month + '-' + this.fromDate.date.day);
    let uDate		=	new Date(this.untilDate.date.year + '-' + this.untilDate.date.month + '-' + this.untilDate.date.day);

	if(this.fromDate.date.day != fromDate.getDate())
		fromDate = new Date(fromDate.setDate(fromDate.getDate() + 1));

	if(this.untilDate.date.day != uDate.getDate())
		uDate = new Date(uDate.setDate(uDate.getDate() + 1));	
	
    if(this.nombre== ''){
		for(let consulta in this.doc_recepcionados){
			let queryDate	=	new Date(this.doc_recepcionados[consulta].fecha_emision);

			if(queryDate >= fromDate && queryDate <= uDate){
				if(this.estado == this.doc_recepcionados[consulta].tipo_documento_id){
					let _row	=	this.doc_recepcionados[consulta];
					let _frow	=	this.estados.filter(x => x.id === _row.tipo_documento_id);
					console.log('_frow');console.log(_frow);
					if(_frow)
					_row.estado_text=	_frow[0].nombre;

					this.resultArray.push(_row);
				}else{
					if(this.estado === "Todos")
						this.resultArray.push(this.doc_recepcionados[consulta]);
				}
			}
		}
    }else{
      for(let consulta in this.doc_recepcionados){
        let queryDate =  new Date(this.doc_recepcionados[consulta].fecha_emision);
        queryDate =  new Date(queryDate.setDate(queryDate.getDate() + 1));

        if(queryDate >= fromDate && queryDate <=
          uDate && this.doc_recepcionados[consulta].nombre.toLowerCase().includes(this.nombre.toLowerCase())){
          if(this.estado === this.doc_recepcionados[consulta].estado){
            this.resultArray.push(this.doc_recepcionados[consulta]);
          } else if(this.estado === "Todos"){
            this.resultArray.push(this.doc_recepcionados[consulta]);
          }
        }
      }
    }
  }

  setLeftBorder(index){
    let value = "";
    let maxPosition = this.resultArray.length-1;

    if(index === maxPosition){
      return value = '0 0 0 15px';
    }else{
      return value = '0px';
    }
  }


  setRightBorder(index){
    let value = "";
    let maxPosition = this.resultArray.length-1;

    if(index === maxPosition){
      return value = '0 0 15px 0';
    }else{
      return value = '0px';
    }
  }
  exportData(Data){console.log( this.resultArray );
  	switch(Data){
		case 1: console.log('pdf build');
			let doc = new jsPDF({orientation:'l', format: 'a2'});
			let col = ["# Documento", "Emisor", "Cedula","Estado","Fecha","Moneda","Monto"];
			let rows = [];

			for(let xi=0;xi< this.resultArray.length;xi++){
				let js = this.resultArray[xi];
				let temp = [js.clave,js.nombre,js.emisor_cedula,js.estado_text,js.fecha_emision,js.moneda,js.monto];
			}
			doc.autoTable(col, rows);
			doc.save('Reporte de Recepcion de documento.pdf');
			break;
		case 2: console.log('excel build');
			let excelArray = [];
			for(let xi = 0;xi<this.resultArray.length;xi++){
				let objecto = {
				  '# Documento' : this.resultArray[xi].clave,
				  'Emisor' : this.resultArray[xi].nombre,
				  'Cedula' : this.resultArray[xi].emisor_cedula,
				  'Estado' : this.resultArray[xi].estado_text,
				  'Fecha' : this.resultArray[xi].fecha_emision,
				  'Moneda' : this.resultArray[xi].moneda,
				  'Monto' : this.resultArray[xi].monto
				}
				excelArray.push(objecto);			  
			}
		new Angular2Csv(excelArray, 'My Report',{ headers: Object.keys(excelArray[0]) });
		break;
  	}
  }
}
