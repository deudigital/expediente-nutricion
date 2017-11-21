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
	body:any;
	constructor(private formControlDataService: FormControlDataService) {
		this.model		=	formControlDataService.getFormControlData();		
		this.bioquimicas	=	formControlDataService.getFormControlData().getFormPacienteBioquimicas();
	}

	ngOnInit() {
		this.body = document.getElementsByTagName('body')[0];
		this.body.classList.add('menu-parent-hcp');	
	}
	ngOnDestroy(){
		this.body.classList.remove('menu-parent-hcp');	
	}

}
