import { Component, OnInit } from '@angular/core';

import { ManejadorDatos } from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';
import { Router }              from '@angular/router';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: []
})
export class NuevoComponent implements OnInit {
	mng:ManejadorDatos;
	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		var mng	=	this.formControlDataService.getFormControlData().getManejadorDatos();
		mng.setOperacion('nuevo-paciente');
		mng.setMenuPacienteStatus(false);
		mng.setEnableLink(false);
		this.formControlDataService.resetFormControlData();
	}
	ngOnInit() {
		this.router.navigate(['/personales']);
	}

}
