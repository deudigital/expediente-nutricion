import { Component, OnInit } from '@angular/core';

import { Analisis } from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styles: []
})
export class ContactoComponent implements OnInit {
	model:any;
	constructor(private formControlDataService: FormControlDataService) {
		this.model	=	formControlDataService.getFormControlData().getFormPaciente();
	}

	ngOnInit() {
	}

}
