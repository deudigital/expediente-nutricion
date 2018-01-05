import { Component, OnInit, Input } from '@angular/core';
import { FormControlData, Consulta, Paciente } from './data/formControlData.model';
import { FormControlDataService }     from './data/formControlData.service';
import {Observable} from 'rxjs/Observable';
import { Router }              from '@angular/router';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: []
})
export class ControlComponent implements OnInit {	
	pacientes: Observable<Paciente[]>;
	nueva_consulta: Observable<Consulta[]>;
	selectedConsulta: Consulta;
	selectedPaciente: Paciente;
	tagBody:any;
	mng:any;
	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.mng	=	this.formControlDataService.getFormControlData().getManejadorDatos();
		this.pacientes = formControlDataService.getPacientesDeNutricionista();
	}
	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		this.tagBody.className = '';
		this.tagBody.classList.add('with-bg');
		this.tagBody.classList.add('page-control');
	}
	ngOnDestroy(){
		this.tagBody.classList.remove('with-bg');
		this.tagBody.classList.remove('page-control');
	}
	onSelect(paciente: Paciente) {
		this.selectedPaciente = paciente;
		
		this.formControlDataService.resetFormControlData();		
		this.formControlDataService.setPaciente(paciente);
		
		this.mng.setOperacion('nueva-consulta');
		this.mng.setMenuPacienteStatus(false);
		this.mng.setEnableLink(true);
		this.mng.setCurrentStepConsulta('va');
		this.save(paciente);
	}	
	save(data){
		this.formControlDataService.store('consulta', data)
		.subscribe(
			 response  => {
						console.log('Service:consulta->receiving...');
						console.log(response);
						this.formControlDataService.setSelectedConsuta(response['data']);
						if(response['va'])
							this.formControlDataService.getFormControlData().setLastValuesFormValoracionAntropometrica(response['va']);
						
						this.router.navigate(['/valoracion']);
						},
			error =>  console.log(<any>error)
		);
	}
}
