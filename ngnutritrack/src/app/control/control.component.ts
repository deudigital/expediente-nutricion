import { Component, OnInit, Input } from '@angular/core';
import { FormControlData, Consulta, Paciente } from './data/formControlData.model';
import { FormControlDataService }     from './data/formControlData.service';
import {Observable} from 'rxjs/Observable';
import { Router }              from '@angular/router';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {	
	pacientes: Observable<Paciente[]>;
	nueva_consulta: Observable<Consulta[]>;
	selectedConsulta: Consulta;
	selectedPaciente: Paciente;

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.pacientes = formControlDataService.getPacientesDeNutricionista();
	}
	ngOnInit() {}
	onSelect(paciente: Paciente) {
		this.selectedPaciente = paciente;
		this.formControlDataService.setPaciente(paciente);
		var mng	=	this.formControlDataService.getFormControlData().getManejadorDatos();
		mng.setOperacion('nueva-consulta');
		mng.setMenuPacienteStatus(false);
		this.createConsulta(paciente);
	}
	createConsulta(paciente) {
		this.formControlDataService.addConsulta(paciente)
		.subscribe(
			 response  => {
					console.log(response);
						this.formControlDataService.setSelectedConsuta(response['data']);
						this.router.navigate(['/valoracion']);
						},
			error =>  console.log(<any>error)
		);
	}
	createConsulta__last_working(paciente) {
		this.formControlDataService.addConsulta(paciente)
		.subscribe(
			 response  => console.log(response),
			error =>  console.log(<any>error)
		);
	}
}
