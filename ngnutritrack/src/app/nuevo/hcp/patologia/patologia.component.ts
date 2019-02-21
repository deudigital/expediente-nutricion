import { Component, OnInit } from '@angular/core';
import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-patologia',
  templateUrl: './patologia.component.html',
  styleUrls: []
})
export class PatologiaComponent implements OnInit {
	paciente:any;
	model:any;
	constructor(private formControlDataService: FormControlDataService) {
		this.paciente	=	formControlDataService.getFormControlData().getFormPaciente();
	}
  ngOnInit() {
								
  }

}
