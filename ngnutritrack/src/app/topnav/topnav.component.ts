import { Component, OnInit } from '@angular/core';
import { FormControlDataService }     from '../control/data/formControlData.service';
import { Consulta } from '../control/data/formControlData.model';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent implements OnInit {
	consulta:Consulta;
	title_control:string='TOP NAV COMPONENT';
	model:any;
	constructor( private formControlDataService: FormControlDataService ) {
		this.model	=	formControlDataService.getFormControlData();	
	}
		
	ngOnInit() {
		this.title_control	=	this.model.getFormPaciente().nombre;
	}
}
