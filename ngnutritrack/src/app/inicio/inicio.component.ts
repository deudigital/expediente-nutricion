import { Component, OnInit } from '@angular/core';
import { Router }              from '@angular/router';

/*import { FormControlData, Consulta } from '../control/data/formControlData.model';*/
import { Consulta } from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';
import {Observable} from 'rxjs/Observable';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
	consultas: Observable<Consulta[]>;
	/*consulta: Observable<Consulta>;*/
	selectedConsulta: Consulta;

	constructor(private router: Router, private formControlDataService: FormControlDataService) {
		this.consultas = formControlDataService.getConsultasPendientes();
	}
	ngOnInit() {}
	onSelect(consulta: Consulta) {
		this.selectedConsulta = consulta;
		this.formControlDataService.setSelectedConsuta(consulta);
		var mng	=	this.formControlDataService.getFormControlData().getManejadorDatos();
		mng.setOperacion('continuar-consulta');
		mng.setMenuPacienteStatus(false);
		this.router.navigate(['/valoracion']);
	}
}
