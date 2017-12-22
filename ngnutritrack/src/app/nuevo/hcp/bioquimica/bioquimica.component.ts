import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-bioquimica',
  templateUrl: './bioquimica.component.html',
  styles: []
})
export class BioquimicaComponent implements OnInit {

	nuevo:boolean=false;
	model:any;
	bioquimicas:any;
	body:any;
	constructor(private router: Router, private formControlDataService: FormControlDataService) {
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

	showFormEdit(){
		this.nuevo	=	!this.nuevo;
	}
	
	saveForm(){
		
	}
	Previous(){
		this.saveForm();
		this.router.navigate(['/medicamentos']);
	}
	Next(){
		this.saveForm();
		this.router.navigate(['/hcf']);
	}
}
