import { Component, OnInit } from '@angular/core';

import { FormControlData }     from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';

declare let jsPDF;

@Component({
  selector: 'app-reporte-factura',
  templateUrl: './reporte-factura.component.html',
})
export class ReporteFacturaComponent implements OnInit {
	filter = {};	
	factura = [
	{
		'id'		: '1',
		'documento' : '001000101011111188',
		'receptor'  : 'Esteban Ramirez',
		'tipo'		: 'Factura',
		'fecha'		: '10/10/2017 3:45pm',
		'moneda'	: 'Colones',
		'monto'		: '22,000'
	},
	{
		'id'		: '2',
		'documento' : '001000101011111188',
		'receptor'  : 'Esteban Ramirez',
		'tipo'		: 'Factura',
		'fecha'		: '10/10/2017 3:45pm',
		'moneda'	: 'Colones',
		'monto'		: '22,000'
	},
	{
		'id'		: '3',
		'documento' : '001000101011111188',
		'receptor'  : 'Esteban Ramirez',
		'tipo'		: 'Factura',
		'fecha'		: '10/10/2017 3:45pm',
		'moneda'	: 'Colones',
		'monto'		: '22,000'
	},
	{
		'id'		: '4',
		'documento' : '001000101011111188',
		'receptor'  : 'Esteban Ramirez',
		'tipo'		: 'Factura',
		'fecha'		: '10/10/2017 3:45pm',
		'moneda'	: 'Colones',
		'monto'		: '22,000'
	},
	{
		'id'		: '5',
		'documento' : '001000101011111188',
		'receptor'  : 'Esteban Ramirez',
		'tipo'		: 'Factura',
		'fecha'		: '10/10/2017 3:45pm',
		'moneda'	: 'Colones',
		'monto'		: '22,000'
	},
	{
		'id'		: '6',
		'documento' : '001000101011111188',
		'receptor'  : 'Esteban Ramirez',
		'tipo'		: 'Factura',
		'fecha'		: '10/10/2017 3:45pm',
		'moneda'	: 'Colones',
		'monto'		: '22,000'
	},
	{
		'id'		: '7',
		'documento' : '001000101011111188',
		'receptor'  : 'Esteban Ramirez',
		'tipo'		: 'Factura',
		'fecha'		: '10/10/2017 3:45pm',
		'moneda'	: 'Colones',
		'monto'		: '22,000'
	}]

  constructor() {
  }

  ngOnInit() {
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

  filterData(){  	
  	console.log(this.filter);
  	/* colocar aqui el servicio para los filtros desde la base de datos */
  }

  exportData(Data){
  	switch(Data){
  		case 1: console.log('pdf');
  			var doc = new jsPDF({orientation:'l'});
  			let col = ["# Documento", "Receptor","Tipo","Fecha","Moneda","Monto"];  			
  			let rows = [];

  			for(var xi=0;xi< this.factura.length;xi++){
  				var js = this.factura[xi];
  				for(var key in js){
  					var temp = [key,js[key]];
		        	rows.push(temp);
  				}		        
		    }
  			doc.autoTable(col, rows);
  			doc.save('test.pdf');
  			break;
		case 2: console.log('excel');
  			break;
  	}
  }

}
