import { Component, OnInit } from '@angular/core';

import { Analisis } from '../../control/data/formControlData.model';
import { FormControlDataService }     from '../../control/data/formControlData.service';

@Component({
  selector: 'app-hcp',
  templateUrl: './hcp.component.html',
  styles: []
})
export class HcpComponent implements OnInit {
	model:any;
	paciente:any;
	constructor(private formControlDataService: FormControlDataService) {
		this.model		=	formControlDataService.getFormControlData();
		this.paciente	=	formControlDataService.getFormControlData().getFormPaciente();
	}

	ngOnInit() {
	}
}
