import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { CommonService } from '../Services/common.service';
import { FormControlData }     from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {

  private subscription: Subscription;
  showModalDatos:boolean = false;
  persona: any = {};
  constructor( private commonService: CommonService, private formControlDataService: FormControlDataService ) { }

  ngOnInit() {
  	this.subscription= this.commonService.notifyObservable$.subscribe((res)=>{
  		if(res.hasOwnProperty('option') && res.option === 'openModalDatos') {
  			this.openModalDatos();  			
  			this.getPaciente(res.persona_id);
  		}
  	});
  }

  	closeModal(){
		let body = document.getElementsByTagName('body')[0];
		body.classList.remove('open-modal');
		this.showModalDatos		=	false;
	}

	getPaciente(id){
		this.formControlDataService.getPaciente(id)
		.subscribe(
			response => {				
				/*let resArray = [];
				resArray = response.text().split('<br />');							
			 	this.persona = JSON.parse(resArray[2]);	*/			
			 	this.persona = response;
			},
			error => {
				console.log(<any>error);
			}
		);	
	}

 	openModalDatos() {
		let modal = document.getElementsByClassName('esc-modal');		
		this.showModalDatos	=	!this.showModalDatos;
		let body = document.getElementsByTagName('body')[0];
		if (this.showModalDatos){
			window.scrollTo(0, 0);
			body.classList.add('open-modal');			
			modal.item(0).setAttribute("style","margin-top: -15%");
		} else{			
			modal.item(0).setAttribute("style","margin-top: -500%");
			body.classList.remove('open-modal');
		}
	}

	ngOnDestroy(){
		this.subscription.unsubscribe();
	}

}
