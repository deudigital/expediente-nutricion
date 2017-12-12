import { Component, OnInit } from '@angular/core';
import { Router }              from '@angular/router';
import { FormControlDataService }     from '../control/data/formControlData.service';
import { Consulta } from '../control/data/formControlData.model';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: []
})
export class TopnavComponent implements OnInit {
	consulta:Consulta;
	title_control:string='TOP NAV COMPONENT';
	model:any;
	items:any;
	constructor( private router: Router, private formControlDataService: FormControlDataService ) {
		this.model	=	formControlDataService.getFormControlData();
		this.items	=	this.model.getManejadorDatos();
	}		
	ngOnInit() {
		this.title_control	=	this.model.getFormPaciente().nombre;
		if(!this.title_control){
			setInterval(() => {
				this.title_control	=	this.model.getFormPaciente().nombre;
			  }, 1000); 
		}
	}
	action_nuevo(){
		console.log('topnav component');
		this.formControlDataService.getFormControlData().clear();
		this.router.navigate(['/nuevo']);
	}
}
