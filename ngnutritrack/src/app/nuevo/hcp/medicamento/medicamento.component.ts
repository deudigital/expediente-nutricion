import { Component, OnInit } from '@angular/core';
import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-medicamento',
  templateUrl: './medicamento.component.html',
  styles: []
})
export class MedicamentoComponent implements OnInit {

	model:any;
	paciente:any;
	constructor(private formControlDataService: FormControlDataService) {
		/*this.model		=	formControlDataService.getFormControlData();*/
		this.paciente	=	formControlDataService.getFormControlData().getFormPaciente();
	}

  ngOnInit() {
  }

}
