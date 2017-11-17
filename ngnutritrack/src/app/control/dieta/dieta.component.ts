import { Component, OnInit } from '@angular/core';

import { Prescripcion } from '../data/formControlData.model';
import { FormControlDataService }     from '../data/formControlData.service';

@Component({
  selector: 'app-dieta',
  templateUrl: './dieta.component.html',
  styles: []
})
export class DietaComponent implements OnInit {
  prescripcion=new Prescripcion();
  
	showModalDatos:boolean=false;
	showModalTabDatos:boolean=true;
	showModalTabGrafico:boolean=false;
	
	
	tab_class_datos:string='active';
	tab_class_graficos:string='';
  
  constructor(private formControlDataService: FormControlDataService) {
    this.prescripcion	=	formControlDataService.getFormControlData().getFormPrescripcion();
    console.log(this.prescripcion);
  }

  ngOnInit() {
  }
	
	openModalDatos() {
		this.showModalDatos	=	!this.showModalDatos;
		let body = document.getElementsByTagName('body')[0];
		if(this.showModalDatos)
			body.classList.add('open-modal');
		else
			body.classList.remove('open-modal');
	}
	
   tabSelected(tab:string){
     console.log(tab);
      if(tab=='graficos'){
        this.showModalTabDatos = false;
        this.showModalTabGrafico=true;
        this.tab_class_graficos = 'active';
        this.tab_class_datos = '';
      }else{
        this.showModalTabDatos = true;
        this.showModalTabGrafico=false;
        this.tab_class_datos = 'active';
        this.tab_class_graficos = '';
      }
   }

}
