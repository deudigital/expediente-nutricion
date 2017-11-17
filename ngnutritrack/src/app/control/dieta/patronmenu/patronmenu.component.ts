import { Component, OnInit } from '@angular/core';

import { Analisis } from '../../data/formControlData.model';
import { FormControlDataService }     from '../../data/formControlData.service';

@Component({
  selector: 'app-patronmenu',
  templateUrl: './patronmenu.component.html',
  styles: []
})
export class PatronmenuComponent implements OnInit {
  menus: any[];
  model:any;
  showmodal:boolean=false;
  showmodalgraficos:boolean=false;

  showTabGrafico:boolean=false;
  showTabDatos:boolean=true;
  tab_class_datos:string='';
  tab_class_graficos:string='';
  
  
  displayModalPorciones:boolean=false;
  label_modal_porciones:string='';
  
  
  constructor(private formControlDataService: FormControlDataService) {
    this.model	=	formControlDataService.getFormControlData();
    this.menus	=	formControlDataService.getFormControlData().patronmenu;
    console.log(this.menus);
   }
   showModalPorciones(titulo){
	   this.label_modal_porciones	=	titulo;
	   this.displayModalPorciones=!this.displayModalPorciones;	   
		let body = document.getElementsByTagName('body')[0];
		if(this.displayModalPorciones)
			body.classList.add('open-modal');
		else
			body.classList.remove('open-modal');
   }
   fxshowmodal(){
     this.showmodal=!this.showmodal;
     console.log(this.showmodal);
   }
   fxshowmodalgraficos(){
     this.showmodalgraficos=!this.showmodalgraficos;
     console.log(this.showmodalgraficos);
   }
   tabSelected(tab:string){
     console.log(tab);
      if(tab=='graficos'){
        this.showTabDatos = false;
        this.showTabGrafico=true;
        this.tab_class_graficos = 'active';
        this.tab_class_datos = '';
      }else{
        this.showTabDatos = true;
        this.showTabGrafico=false;
        this.tab_class_datos = 'active';
        this.tab_class_graficos = '';
      }
   }
  ngOnInit() {

  }

}
