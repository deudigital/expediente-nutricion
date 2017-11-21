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
