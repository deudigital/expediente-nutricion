import { Injectable } from '@angular/core';
import { FormControlData, Analisis, Consulta, ValoracionAntropometrica, Paciente, Ejercicio,Rdd, Prescripcion } from './formControlData.model';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class FormControlDataService {
	private formControlData: FormControlData = new FormControlData();
	private apiURL	=	'https://expediente.nutricion.co.cr/nutri/public/api/v0/';
	//private apiURL	=	'https://expediente.nutricion.co.cr/nutri/public/api/v1/';
	private headers: Headers;
	data:any={};

	constructor(private http: Http) {}
	setHeader(token){
		this.headers	=	new Headers({
								  'Content-Type': 'application/json',
								  Authorization: `Bearer ${token}`
								});
	}	
	setSession(nutricionista_id, token){
		localStorage.setItem('token', token);
		localStorage.setItem('nutricionista_id', nutricionista_id);
		this.setHeader(token);
		this.formControlData.setNutricionistaId(nutricionista_id);		
	}
	
	getDataForm(): Observable<any[]> {
		return this.http.get( this.apiURL + 'form/data', {headers: this.headers} ).map((response: Response) => response.json());
	}
	getPacientesDeNutricionista(): Observable<Paciente[]> {
		var nutricionista_id	=	this.formControlData.nutricionista_id;
		return this.http.get( this.apiURL + 'pacientes/nutricionista/' + nutricionista_id ).map((response: Response) => response.json());
	}
	getConsultaSelected(consulta_id): Observable<Consulta> {
		return this.http.get( this.apiURL + 'consultas/' + consulta_id + '/all')
				.map((response: Response) => response.json());
	}
	getConsultas(): Observable<Consulta[]> {
		return this.http.get( this.apiURL + 'consultas/process').map((response: Response) => response.json());
	}
	getEjercicios(): Observable<Ejercicio[]> {
		return this.http.get( this.apiURL + 'ejercicios').map((response: Response) => response.json());
	}
	getConsultasPendientes(): Observable<Consulta[]> {
		var nutricionista_id	=	this.formControlData.nutricionista_id;
		return this.http.get( this.apiURL + 'consultas/nutricionista/' + nutricionista_id + '/pendientes/')
		.map((response: Response) => response.json());
	}	
	getPacientes(): Observable<Consulta[]> {
		var nutricionista_id	=	this.formControlData.nutricionista_id;
		return this.http.get( this.apiURL + 'nutricionista/pacientes/' + nutricionista_id)
		.map((response: Response) => response.json());
	}
	addConsulta(paciente: Paciente): Observable<Consulta[]> {
		var data={paciente_id:paciente.id};
		return this.http.post( this.apiURL + 'consultas/', data).map((response: Response) => response.json());
	}
	addValoracionAntropometrica(valoracionAntropometrica: ValoracionAntropometrica): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'consultas/valoracion', valoracionAntropometrica).map((response: Response) => response.json());
	}
	addRdds(rdd: Rdd): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'consultas/rdd', rdd).map((response: Response) => response.json());
	}
	addPrescripcion(prescripcion: Prescripcion): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'consultas/prescripcion', prescripcion).map((response: Response) => response.json());
	}
	saveDatosPersonales(paciente: Paciente): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'pacientes/datos', paciente).map((response: Response) => response.json());
	}
	saveDatosContacto(paciente: Paciente): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'pacientes/contacto', paciente).map((response: Response) => response.json());
	}
	saveNotasConsulta(consulta: Consulta): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'consultas/notas', consulta).map((response: Response) => response.json());
	}
	saveDatosPatronMenu(patronMenus: any): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'dietas', patronMenus).map((response: Response) => response.json());
	}
	saveDatosMusculo(data: any): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'consultas/musculo', data).map((response: Response) => response.json());
	}
	
	store(module:string, data:any): Observable<any[]> {
		console.log('Crud:' + module + '-->');
		console.log(data);
		var serviceUrl	=	this.apiURL;
		switch(module){
			case 'consulta':
				serviceUrl	+=	'consultas';
				break;
			case 'otros_alimentos':
				serviceUrl	+=	'consultas/otros';
				break;
			case 'otros_alimentos_multiples':
				serviceUrl	+=	'consultas/otrosmultiple';
				break;
			case 'objetivos':
				serviceUrl	+=	'pacientes/objetivos';
				break;
			case 'medicamentos':
				serviceUrl	+=	'pacientes/medicamentos';
				break;
			case 'gustos':
				serviceUrl	+=	'pacientes/gustos';
				break;
			case 'habitos_ejercicios':
				serviceUrl	+=	'pacientes/ejercicios';
				break;
			case 'habitos_otros':
				serviceUrl	+=	'pacientes/otros';
				break;
			case 'habitos_valoracion_dietetica':
				serviceUrl	+=	'valoraciondietetica';
				break;
			case 'hcf_patologis':
				serviceUrl	+=	'pacientes/hcfpatologias';
				break;
			case 'hcp_patologis':
				serviceUrl	+=	'pacientes/hcppatologias';
				break;
			case 'alergias':
				serviceUrl	+=	'pacientes/alergias';
				break;
		}
		
		return this.http.post( serviceUrl, data)
				.map((response: Response) => response.json());
	}
	delete(module:string, data:any): Observable<any[]> {
		console.log('cruD:' + module + '-->');
		console.log(data);
		var serviceUrl	=	this.apiURL;
		switch(module){
			case 'consultas':
				serviceUrl	+=	'consultas/' + data.id + '/delete';
				break;
			case 'objetivos':
				serviceUrl	+=	'objetivos/' + data.id + '/delete';
				break;
			case 'ejercicios':
				serviceUrl	+=	'ejercicios/' + data.id + '/delete';
				break;
			case 'otros_alimentos':
				serviceUrl	+=	'otrosalimentos/' + data.id + '/delete';
				break;
		}
		return this.http.post( serviceUrl, data)
				.map((response: Response) => response.json());
	}
	select(module:string, data:any): Observable<any[]> {
		console.log('cRud ' + module + '-->');
		console.log(data);
		var serviceUrl	=	this.apiURL;
		switch(module){
			case 'valoracionAntropometrica':
				serviceUrl	+=	'valoracionantropometrica/paciente/' + data;
				break;
			case 'rdds':
				serviceUrl	+=	'rdds/paciente/' + data;
				break;
			case 'prescripcion':
				serviceUrl	+=	'prescripcion/paciente/' + data;
				break;
		}
		return this.http.get( serviceUrl )
				.map((response: Response) => response.json());
	}
	setSelectedConsuta(consulta){
		this.formControlData.setFormConsulta(consulta);
	}
	setPaciente(paciente: Paciente){
		this.formControlData.setFormPaciente(paciente);
	}
	
    getFormControlData(): FormControlData {
        return this.formControlData;
    }
    setFormControlData(formControlData: FormControlData) {
        this.formControlData	=	formControlData;
    }
    resetFormControlData(): FormControlData {
        this.formControlData.clear();
        return this.formControlData;
    }	
}
