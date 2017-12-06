import { Component, OnInit } from '@angular/core';

import { FormControlData, ManejadorDatos, Paciente }     from '../../../control/data/formControlData.model';
import { FormControlDataService }     from '../../../control/data/formControlData.service';

@Component({
  selector: 'app-medicamento',
  templateUrl: './medicamento.component.html',
  styles: []
})
export class MedicamentoComponent implements OnInit {
	fcd:FormControlData;
	mng:ManejadorDatos;
	paciente:Paciente;
	medicamentos:any;
	body:any;

	constructor(private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
		this.mng		=	this.fcd.getManejadorDatos();
		this.paciente	=	this.fcd.getFormPaciente();
		this.medicamentos	=	this.paciente.notas_medicamentos;
	}
	ngOnInit() {
		this.body = document.getElementsByTagName('body')[0];
		this.body.classList.add('menu-parent-hcp');
	}
	ngOnDestroy(){
		this.body.classList.remove('menu-parent-hcp');
		if(this.isValid())
			this.save(this.paciente);
	}
	isValid(){
		return this.medicamentos!=this.paciente.notas_medicamentos;
	}
	save(data){
		this.formControlDataService.store('medicamentos', data)
		.subscribe(
			 response  => {
						console.log('Service:medicamentos->receiving...');
						console.log(response);
						
						},
			error =>  console.log(<any>error)
		);
	}

}
