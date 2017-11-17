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
	/*consulta: Consulta;*/
	selectedPaciente: Paciente;

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.pacientes = formControlDataService.getPacientesDeNutricionista();
	}
	ngOnInit() {}
	onSelect(paciente: Paciente) {/*console.log(paciente);*/
		this.selectedPaciente = paciente;
		this.formControlDataService.setPaciente(paciente);
		var mng	=	this.formControlDataService.getFormControlData().getManejadorDatos();
		mng.setOperacion('nueva-consulta');
		mng.setMenuPacienteStatus(false);
		this.createConsulta(paciente);
		
	}
	createConsulta(paciente) {
		/*console.log('enviando Crear Consulta');
		console.log(paciente);*/
		this.formControlDataService.addConsulta(paciente)
		.subscribe(
			 response  => {
						/*console.log('cargando datos recibidos...');
						console.log( response['data'] );*/
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
	/*onSelectControl(paciente: Paciente) {
		this.selectedPaciente = paciente;		
		this.createConsulta(paciente);
		this.router.navigate(['/valoracion']);
	}*/
}
