import { Component, OnInit } from '@angular/core';
import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-bioquimica',
  templateUrl: './bioquimica.component.html',
  styles: []
})
export class BioquimicaComponent implements OnInit {

	model:any;
	bioquimicas:any;
	constructor(private formControlDataService: FormControlDataService) {
		this.model		=	formControlDataService.getFormControlData();		
		this.bioquimicas	=	formControlDataService.getFormControlData().getFormPacienteBioquimicas();
		/*console.log(this.model);*/
	}

  ngOnInit() {
  }

}
