import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';
import { Subscription } from 'rxjs/Subscription';

import { FormControlData }     from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';
import { CommonService } from '../../services/common.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

declare let jsPDF;

@Component({
  selector: 'app-consultas-sin-facturar',
  templateUrl: './consultas-sin-facturar.component.html',
})
export class ConsultasSinFacturarComponent implements OnInit {  

  private today: any = new Date();
  private subscription: Subscription;
  selectedOption: string;
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

  consultas: any = [];
  resultArray: any = [];
  nombre: string = "";
  loading: boolean = false;

  fcData:any;
  mng:any;

  constructor(private formControlDataService: FormControlDataService, private commonService: CommonService) {
    this.fcData  =  this.formControlDataService.getFormControlData();
    this.mng     =  this.fcData.getManejadorDatos(); 
  }

  ngOnInit() {
    this.subscription = this.commonService.notifyObservable$.subscribe((res)=>{
      if(res.hasOwnProperty('option') && res.option === 'removeConsulta') {

        for(let con in this.consultas){
          if(res.consulta === this.consultas[con].id){
            this.consultas.splice(con, 1);
          }
        }
      }
    });
    this.loadDataForm();
  }

  refreshDateFromLimits(event){  	  	
	 this.untilOptions = {
	  	dateFormat: 'dd/mm/yyyy',
	  	disableUntil: {
               year: event.date.year,
	  				   month: event.date.month,
	  				   day: event.date.day
	  				  }
	 };
  }

  refreshUntilDateLimits(event){
	 this.fromOptions = {
	  	dateFormat: 'dd/mm/yyyy',
	  	disableSince: {
               year: event.date.year,
	  				   month: event.date.month,
	  				   day: event.date.day
	  				  }
	 };
  }

  obtenerConsultas_sinFacturar(){
  	this.formControlDataService.getConsultasSinFacturar()
		.subscribe(
			response => {          
            for(let con in response){
              this.consultas.push(response[con]);
            }              
			},
			error => {
				console.log(<any>error);
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

  openFacturacion(consulta){    
    this.commonService.notifyOther({option: 'openModalDatos', persona_id:consulta.persona_id, consulta_id: consulta.id});
  }

  exportData(Data){
    switch(Data){
      case 1:
        let doc = new jsPDF({orientation:'l', format: 'a2'});
        let col = ["ID", "Paciente","Fecha","Estado"];        
        let rows = [];        

        for(let i=0; i< this.resultArray.length; i++){
          let q = this.resultArray[i];
          let temp = [q.id,
                      q.nombre,
                      q.fecha,
                      "Sin Facturar"];
          rows.push(temp);                      
        }
        doc.autoTable(col, rows);
        doc.save('Consultas_Sin_Facturar.pdf');
        break;
      case 2:        
        let excelArray = [];        
        let options = {
          showLabels: true
        };        

        for(let con in this.resultArray){
          excelArray.push({
            id: this.resultArray[con].id,
            fecha: this.resultArray[con].fecha,
            nombre: this.resultArray[con].nombre
          });
        }

        let head = ['ID', 'Fecha', 'Paciente']        

        new Angular2Csv(excelArray, 'Consultas_Sin_Facturar', {headers: (head)});
        break;
    }
  }

  loadDataForm(){
    this.loading = true;
    this.formControlDataService.getDataForm()
    .subscribe(
       response  => {         
            this.mng.fillDataForm(response);
            this.obtenerConsultas_sinFacturar(); 
            this.loading = false;
            },
      error => {
        this.loading = false;
        console.log(<any>error);
      } 
    );
  }

  fillDataForm(data){
    this.mng.fillDataForm(data);
  }
  filterQuery(){
  	this.resultArray = [];
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

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
