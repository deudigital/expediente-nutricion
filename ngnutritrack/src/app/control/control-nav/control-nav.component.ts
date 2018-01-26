import { Component, OnInit } from '@angular/core';
import { FormControlDataService }     from '../../control/data/formControlData.service';


@Component({
  selector: 'app-control-nav',
  templateUrl: './control-nav.component.html',
  styles: []
})
export class ControlNavComponent implements OnInit {
	showMenuPaciente:boolean=true;
	showDatosPaciente:boolean=false;
	class_toggle:string='';
	mng:any;
	
	constructor(private formControlDataService: FormControlDataService) {}
	ngOnInit(){
		this.mng	=	this.formControlDataService.getFormControlData().getManejadorDatos();
		this.showMenuPaciente	=	this.mng.getMenuPacienteLastStatus();
	}
	ngOnDestroy(){
		this.mng.setMenuPacienteStatus(this.showMenuPaciente);
	}
	toggleDatosPaciente(){
		this.showMenuPaciente  = !this.showMenuPaciente;
		this.showDatosPaciente  = !this.showDatosPaciente;
		this.class_toggle = (this.showDatosPaciente? ' opened':'');
	}

}
