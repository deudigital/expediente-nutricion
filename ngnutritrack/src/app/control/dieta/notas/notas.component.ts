import { Component, OnInit } from '@angular/core';

import { Analisis } from '../../data/formControlData.model';
import { FormControlDataService }     from '../../data/formControlData.service';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styles: []
})
export class NotasComponent implements OnInit {
model:any;
  constructor(private formControlDataService: FormControlDataService) {
	  this.model	=	formControlDataService.getFormControlData().getFormConsulta();
   }

  ngOnInit() {
  }

}