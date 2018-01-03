import { Component, OnInit, Input }   from '@angular/core';

import { FormControlDataService }            from './control/data/formControlData.service';

@Component ({
    selector:     'nutri-track-app'
    ,templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
    title = 'Nutri Track';
    @Input() formControlData;
	info:any;
		
    constructor(private formControlDataService: FormControlDataService) {
    }

    ngOnInit() {
        this.formControlData = this.formControlDataService.getFormControlData();
    }
	get currentFormControlData() {
		return JSON.stringify(this.formControlData);
	}
	get developmentInfo (){
/*
Nutricionista ID: 4
Consulta ID: 
{"id":141,"fecha":"2017-12-27","notas":"","paciente_id":22,"paciente_nombre":"Juan Manuel Solano"} Logout
*/		this.info	=	this.formControlDataService.getFormControlData().getFormConsulta();
		var summary	=	'Nutricionista: ' + this.formControlDataService.getFormControlData().nutricionista_id;
		if(this.info.id)
			summary	+=	', Consulta: ' + this.info.id;
		if(this.info.paciente_id)
			summary	+=	', Paciente: ' + this.info.paciente_id;
		return summary;
	}
}