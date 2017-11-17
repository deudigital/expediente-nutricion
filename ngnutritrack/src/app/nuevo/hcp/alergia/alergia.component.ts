import { Component, OnInit } from '@angular/core';
import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-alergia',
  templateUrl: './alergia.component.html',
  styles: []
})
export class AlergiaComponent implements OnInit {

	model:any;
	paciente:any;
	constructor(private formControlDataService: FormControlDataService) {
		/*this.model		=	formControlDataService.getFormControlData();*/
		this.paciente	=	formControlDataService.getFormControlData().getFormPaciente();
	}

  ngOnInit() {
  }

}
