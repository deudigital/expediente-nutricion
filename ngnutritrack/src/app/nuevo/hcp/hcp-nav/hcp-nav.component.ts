import { Component, OnInit } from '@angular/core';

import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-hcp-nav',
  templateUrl: './hcp-nav.component.html',
  styles: []
})
export class HcpNavComponent implements OnInit {
 esFemenino:boolean=false;
 paciente:any;
 fcData:any;
 constructor(private formControlDataService: FormControlDataService) {
		this.fcData		=	formControlDataService.getFormControlData();
		this.paciente	=	this.fcData.getFormPaciente();
		this.esFemenino	=	this.paciente.genero=='F';
		/*console.log(this.paciente);*/	  
  }
  ngOnInit() {
  }
}
