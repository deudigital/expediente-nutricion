import { Component, OnInit } from '@angular/core';
import { Router }              from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FormControlDataService }     from '../control/data/formControlData.service';
import { Consulta } from '../control/data/formControlData.model';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: []
})
export class TopnavComponent implements OnInit {
	consulta:Consulta;
	title_control:string='TOP NAV COMPONENT';
	model:any;
	items:any;
	showTitle:boolean;
	agregadoAPI:number;
	
	constructor( private router: Router, private formControlDataService: FormControlDataService, private commonService: CommonService ) {
		this.model	=	formControlDataService.getFormControlData();
		this.items	=	this.model.getManejadorDatos();
		this.displayTitle();
	}		
	ngOnInit() {
		this.agregadoAPI = parseInt(localStorage.getItem("agregadoAPI"));
		this.title_control	=	this.model.getFormPaciente().nombre;
		if(!this.title_control){
			setInterval(() => {
				this.title_control	=	this.model.getFormPaciente().nombre;
			  }, 1000); 
		}
	}
	displayTitle(){
		console.log(this.router.url);
		switch(this.router.url){
			case '/reportes':
			case '/servicios-productos':
			case '/sinfacturar':
			case '/config-factura':
				this.showTitle	=	false;
				break;
			default:
				this.showTitle	=	true;
		}
	}
	action_nuevo(){
		this.formControlDataService.getFormControlData().clear();
		this.router.navigate(['/nuevo']);
	}

	mouseOut(){
	    document.getElementById("invoice-menu-div").className = "dropdown";
	  }	

	  mouseOver(){
	    document.getElementById("invoice-menu-div").className = "dropdown open";
	  }

	openFactura(){
		this.commonService.notifyOther({option: 'openModalDatos'});
	}	  
}
