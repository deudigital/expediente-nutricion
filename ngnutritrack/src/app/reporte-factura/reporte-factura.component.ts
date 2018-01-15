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
  private today: any = new Date();
	//private formControlData: FormControlData = new FormControlData();
	private formControlData: any;
	filter = {};
	factura = [];
  nombre: string = "";
  tipo: string = "Todos";
  tipos: any = [];
  resultArray: any = [];
  deleted_document: any = {};
  show_deleteConfirmation: boolean = false;

  form_errors: any = {
    loading: false,
    successful_operation: false,
    ajax_failure: false
  };

  public fromDate: any = { date: {year: this.today.getFullYear(), month: this.today.getMonth()+1, day:this.today.getDate() } };
  public untilDate: any = { date: {year: this.today.getFullYear(), month: this.today.getMonth()+1, day:this.today.getDate() } };
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
    this.tipos = [
            {
              id:1,
              nombre:"Factura Electronica"
            },
            {
              id:3,
              nombre:"Nota de Credito"
            }
    ]
  }

  obtenerFacturas(){
		this.formControlDataService.getReporteFactura()
		.subscribe(
			 response  => {                        

          this.factura = response;    
          console.log(this.factura)  
          for(let doc in this.factura){
            for(let item in this.tipos){
              if(this.factura[doc].tipo_documento_id === this.tipos[item].id){
                this.factura[doc].nombre_tipo = this.tipos[item].nombre;
                this.factura[doc].monto = Math.round(this.factura[doc].monto * 100) / 100;                
              }              
            }
            if(this.factura[doc].tipo_documento_id===3){
                this.factura[doc].monto= '-'+this.factura[doc].monto;
              }
          }          
			},
			error =>  {
					console.log(error)
				}
		);
	}

  confirmDeleteFactura(documento){
    this.deleted_document = documento;
    this.show_deleteConfirmation = !this.show_deleteConfirmation;
    let body = document.getElementsByTagName('body')[0];
    if(this.show_deleteConfirmation){
      body.classList.add('open-modal');
	  window.scrollTo(0, 0);
	}
    else
      body.classList.remove('open-modal');    
  }

  anularFactura(){
    this.show_deleteConfirmation = false;
    this.form_errors.loading = true;
    this.formControlDataService.deleteFactura(this.deleted_document)
    .subscribe(
      response => {     
           console.log(response);
        if(response.status === 200){          
          this.form_errors.loading = false;
          this.form_errors.successful_operation = true;
          setTimeout(() => {
            this.form_errors.successful_operation = false;  
            this.deleted_document.nombre_tipo = "Nota de crédito";
            this.deleted_document.tipo_documento_id = 3;
          }, 3000); 
        }
      },
      error => {
        console.log(error);        
        this.form_errors.loading = false;
        this.form_errors.ajax_failure = true;
        setTimeout(() => {
            this.form_errors.ajax_failure = false;            
          }, 3000); 
      }
    );
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

  showPDF(item){
    let pdf = item.pdf.split('/');    

    if(item.tipo_documento_id != 3){
      window.open("http://expediente.nutricion.co.cr/nutri/public/invoices/"+pdf[pdf.length-1], "_blank");
    }else{
      window.open("http://expediente.nutricion.co.cr/nutri/public/invoices/deleted/"+pdf[pdf.length-1], "_blank");
    }
  }

	filterQuery(){
		this.resultArray = [];
		console.log(this.fromDate.date);
		var fromDate	=	new Date(this.fromDate.date.year, this.fromDate.date.month-1, this.fromDate.date.day);
		fromDate	=	new Date(fromDate.getTime());
		var uDate	=	new Date(this.untilDate.date.year, this.untilDate.date.month, this.untilDate.date.day);    
		uDate.setSeconds(86400);
		uDate	=	new Date(uDate.getTime());
		var _fromDate	=	fromDate.getTime();
		var _uDate		=	uDate.getTime();
		for(let consulta in this.factura){			
			let queryDate	=	new Date(this.factura[consulta].fecha);
			let _queryDate	=	queryDate.getTime();
			var sw	=	String(this.factura[consulta].nombre).toLowerCase().includes(this.nombre.toLowerCase());
			if(_queryDate > _fromDate && _queryDate < _uDate && sw){			
				var factura	=	Object.create(this.factura[consulta]);
				let dia		=	this.fillWithZero(queryDate.getDate());
				let mes		=	this.fillWithZero(queryDate.getMonth()+1);
				let hora	=	this.fillWithZero(queryDate.getHours());
				let minuto	=	this.fillWithZero(queryDate.getMinutes());
				let _fecha	=	dia + '/' + mes + '/' + queryDate.getFullYear() + ' ' + hora + ':' + minuto + ':' + queryDate.getSeconds();
				factura.fecha	=	_fecha;
				this.factura[consulta].fecha_processed	=	_fecha;

				this.factura[consulta].showDelete		=	true;
				if(this.factura[consulta].tipo_documento_id==3 || !this.factura[consulta].estado){
					this.factura[consulta].showDelete		=	false;
				}				
				
				if(this.tipo === this.factura[consulta].nombre_tipo)
					this.resultArray.push(this.factura[consulta]);
				else if(this.tipo === "Todos")
					this.resultArray.push(this.factura[consulta]);

			}
		}
  }
  fillWithZero(valor){
	  /*console.log(valor);
	  console.log(String(valor).length);*/
	  valor	=	((String(valor).length==1)? '0':'' ) + valor;	  
	  return valor;
  }
  filterQuery__original(){

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

  			for(let xi=0;xi< this.resultArray.length;xi++){
  				let js = this.resultArray[xi];
				let temp = [js.numeracion_consecutiva,js.nombre,js.nombre_tipo,js.fecha,'Colones',js.monto];
        		rows.push(temp);
		    }
  			doc.autoTable(col, rows);
  			doc.save('Reporte de Factura.pdf');
  			break;
		  case 2: console.log('excel');
        let excelArray = [];
        for(let xi = 0;xi<this.resultArray.length-1;xi++){
          let objecto = {
            '# Documento' : this.resultArray[xi].numeracion_consecutiva,
            'Receptor' : this.resultArray[xi].nombre,
            'Tipo' : this.resultArray[xi].nombre_tipo,
            'Fecha' : this.resultArray[xi].fecha,
            'Moneda' : 'Colones',
            'Monto' : this.resultArray[xi].monto
          }
          excelArray.push(objecto);
        }
			  new Angular2Csv(excelArray, 'My Report',{ headers: Object.keys(excelArray[0]) });
  			break;
  	}
  }
}
