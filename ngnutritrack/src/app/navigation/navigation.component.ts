import { Component, OnInit } from '@angular/core';

import { ManejadorDatos } from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styles: []
})
export class NavigationComponent implements OnInit {
	showMenuPaciente:boolean=true;
	showMenuConsulta:boolean=false;
	enableLink:boolean=false;
	class_toggle:string='';
	mng:ManejadorDatos;
	
	isConsulta:boolean=false;
	expandMenu:boolean=false;
	
	control_va:boolean;
	control_rdd:boolean;
	control_dieta:boolean;
	
	constructor(private formControlDataService: FormControlDataService) {}

	ngOnInit() {
		this.mng	=	this.formControlDataService.getFormControlData().getManejadorDatos();
		//console.log('navigation');console.log(this.mng);
		if(this.mng.operacion!='nuevo-paciente'){
			this.isConsulta			=	true;
			this.showMenuPaciente	=	this.mng.getMenuPacienteLastStatus();
			this.class_toggle = (this.showMenuPaciente? ' opened':'');
		}
		this.enableLink	=	this.mng.getEnableLink();
		this.setMenuControl(this.mng.getCurrentStepConsulta());
	}
	ngOnDestroy(){
		this.mng.setMenuPacienteStatus(this.showMenuPaciente);
	}
	setMenuControl(currentStep){console.log('currentStep-> ' + currentStep);
		this.control_va		=	false;
		this.control_rdd	=	false;
		this.control_dieta	=	false;
		switch(currentStep){
			case 'va':
				this.control_va		=	true;
				break;
			case 'rdd':
				this.control_rdd	=	true;
				break;
			case 'dieta':
				this.control_dieta	=	true;
				break;
		}
	}
	toggleDatosPaciente(){
		this.showMenuPaciente  = !this.showMenuPaciente;
		this.class_toggle = (this.showMenuPaciente? ' opened':'');

	  }
	toggle(){
		this.expandMenu  = !this.expandMenu;		
	}
}
