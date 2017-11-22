import { Component, OnInit } from '@angular/core';

import { ManejadorDatos } from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';
//import {Observable} from 'rxjs/Observable';
import { Router }              from '@angular/router';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {
mng:ManejadorDatos;
  constructor(private router: Router, private formControlDataService: FormControlDataService) {
	this.formControlDataService.resetFormControlData();
	var mng	=	this.formControlDataService.getFormControlData().getManejadorDatos();
	mng.setOperacion('nuevo-paciente');
	mng.setMenuPacienteStatus(false);
  }

  ngOnInit() {
	  this.router.navigate(['/personales']);
  }

}
