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
	valoracion:any;
	prescripcion:any;
	rdd:any;
	paciente:any;
	
	information:any;
		
    constructor(private formControlDataService: FormControlDataService) {
    }

    ngOnInit() {
        this.formControlData = this.formControlDataService.getFormControlData();
    }
	get currentFormControlData() {
		return JSON.stringify(this.formControlData);
	}
	get developmentInfo(){
		var summary	=	'';
		try{
			this.fcd			=	this.formControlDataService.getFormControlData();
			this.consulta		=	this.fcd.getFormConsulta();
			this.valoracion		=	this.fcd.getFormValoracionAntropometrica();
			this.prescripcion	=	this.fcd.getFormPrescripcion();
			this.rdd			=	this.fcd.getFormRdd();
			this.paciente			=	this.fcd.getFormPaciente();

			
			if(this.consulta.id){
				summary	+=	'Consulta: ' + this.consulta.id;
			}
			if(this.prescripcion.id){
				summary	+=	'  |  Prescripcion: ' + this.prescripcion.id;
			}
			if(this.valoracion.id){
				summary	+=	'  |  VA: ' + this.valoracion.id;
			}
			if(this.rdd.id){
				summary	+=	'  |  Rdd: ' + this.rdd.id;
			}
			if(this.consulta.paciente_id){
				summary	+=	'  |  Paciente: ' + this.consulta.paciente_id;
				summary	+=	' (' + this.paciente.genero + ', ' + this.paciente.edad.toFixed(2) + ' años )';
			}
			if(summary)
				summary	+=	'  |  ';

			summary += 'Nutricionista: ' + this.fcd.nutricionista_id + '  |  ';
		}catch(err) {
			console.log( 'E:_setInfoIdeal(' + err.message + ')' );
		}
		return summary;
	}

}