import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import { Subscription } from 'rxjs/Subscription';

import { FormControlData }     from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';
import { CommonService } from '../../Services/common.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

declare let jsPDF;

@Component({
  selector: 'app-consultas-sin-facturar',
  templateUrl: './consultas-sin-facturar.component.html',
})
export class ConsultasSinFacturarComponent implements OnInit {  

  selectedOption: string;
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

  consultas: any = [];
  resultArray: any = [];
  nombre: string = "";

  constructor(private formControlDataService: FormControlDataService, private commonService: CommonService) {}

  ngOnInit() {
  	this.obtenerConsultas_sinFacturar();
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

  obtenerConsultas_sinFacturar(){
  	this.formControlDataService.getConsultasSinFacturar()
		.subscribe(
			response => {
						/*let res = response.text();
			 			let resArray = [] 

			 			resArray = res.split('<br />');			 			
			 			this.consultas = Object.values(JSON.parse(resArray[2]));*/

            this.consultas = response;               
			 			this.resultArray = this.consultas;
			},
			error => {
				console.log(<any>error);
			}
		);	
  }

  openFacturacion(persona_id){
    this.commonService.notifyOther({option: 'openModalDatos', persona_id:persona_id});
  }

  exportData(Data){
    switch(Data){
      case 1:
        let doc = new jsPDF({orientation:'l', format: 'a2'});
        let col = ["ID", "Paciente","Fecha","Estado"];        
        let rows = [];        

        for(let i=0; i< this.consultas.length; i++){
          let q = this.consultas[i];
          let temp = [q.id,
                      q.nombre,
                      q.fecha,
                      "Sin Consultar"];
          rows.push(temp);                      
        }
        doc.autoTable(col, rows);
        doc.save('Consultas_Sin_Facturar.pdf');
        break;
    case 2:
        new Angular2Csv(this.consultas, 'Consultas_Sin_Facturar');
        break;
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
  		for(let consulta in this.consultas){
  			let queryDate =  new Date(this.consultas[consulta].fecha);
  			queryDate =  new Date(queryDate.setDate(queryDate.getDate() + 1));					

			if(queryDate >= fromDate && queryDate <= uDate){					
				this.resultArray.push(this.consultas[consulta]);
			}
  		}
  	}else{
  		for(let consulta in this.consultas){
  			let queryDate =  new Date(this.consultas[consulta].fecha);
  			queryDate =  new Date(queryDate.setDate(queryDate.getDate() + 1));					
			   
  			if(queryDate >= fromDate && queryDate <= 
  			  uDate && this.consultas[consulta].nombre.toLowerCase().includes(this.nombre.toLowerCase())){			   	
  				this.resultArray.push(this.consultas[consulta]);
  			}
  		}
  	}
  }
}
