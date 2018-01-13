import { Component, OnInit, Input }   from '@angular/core';

import { FormControlDataService }            from './control/data/formControlData.service';

@Component ({
    selector:     'nutri-track-app'
    ,templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
    title = 'Nutri Track';
    @Input() formControlData;
	fcd:any;
	consulta:any;
	prescripcion:any;
	rdd:any;
	
	information:any;
		
    constructor(private formControlDataService: FormControlDataService) {
    }

    ngOnInit() {
        this.formControlData = this.formControlDataService.getFormControlData();
    }
	get currentFormControlData() {
		return JSON.stringify(this.formControlData);
	}
/*	get developmentInfo (){
	
		this.fcd			=	this.formControlDataService.getFormControlData();
		this.consulta		=	this.fcd.getFormConsulta();
		this.prescripcion	=	this.fcd.getFormPrescripcion();
		this.rdd			=	this.fcd.getFormRdd();
		//console.log(this.rdd);
		//var summary	=	'Nutricionista: ' + this.fcd.nutricionista_id;
		var summary	=	'';
		if(this.consulta.id){
			//this.information['consulta']	=	this.consulta.id
			summary	+=	'Consulta: ' + this.consulta.id;
		}
		if(this.prescripcion.id){
			//this.information['Prescripcion']	=	 this.prescripcion.id;
			summary	+=	'  |  Prescripcion: ' + this.prescripcion.id;
		}
		if(this.rdd.id){
			//this.information['Prescripcion']	=	 this.prescripcion.id;
			summary	+=	'  |  Rdd: ' + this.rdd.id;
		}
		if(this.consulta.paciente_id){
			//this.information['Paciente']	=	this.consulta.paciente_id;
			summary	+=	'  |  Paciente: ' + this.consulta.paciente_id;
		}
		if(summary)
			summary	+=	'  |  ';
		return summary + 'Nutricionista: ' + this.fcd.nutricionista_id + '  |  ';
	}
*/
}