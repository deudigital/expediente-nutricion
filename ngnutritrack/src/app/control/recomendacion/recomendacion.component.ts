import { Component, OnInit } from '@angular/core';

import { Rdd } from '../data/formControlData.model';
import { FormControlDataService }     from '../data/formControlData.service';


@Component({
  selector: 'app-recomendacion',
  templateUrl: './recomendacion.component.html',
  styles: []
})
export class RecomendacionComponent implements OnInit {
  recomendacion=new Rdd();
  
	showModalRdds:boolean=false;
	showModalTabDatos:boolean=true;
	showModalTabGrafico:boolean=false;


	tab_class_datos:string='active';
	tab_class_graficos:string='';
	
  constructor(private formControlDataService: FormControlDataService) {
	  this.recomendacion	=	formControlDataService.getFormControlData().getFormRdd();
   }

  ngOnInit() {
  }
  
  toggleModalRdds() {
		this.showModalRdds	=	!this.showModalRdds;
		let body = document.getElementsByTagName('body')[0];
		if(this.showModalRdds)
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
