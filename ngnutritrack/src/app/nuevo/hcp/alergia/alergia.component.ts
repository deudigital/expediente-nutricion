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
	body:any;
	constructor(private formControlDataService: FormControlDataService) {
		/*this.model		=	formControlDataService.getFormControlData();*/
		this.paciente	=	formControlDataService.getFormControlData().getFormPaciente();
	}

	ngOnInit() {
		this.body = document.getElementsByTagName('body')[0];
		this.body.classList.add('menu-parent-hcp');	
	}
	ngOnDestroy(){
		this.body.classList.remove('menu-parent-hcp');	
	}

}
