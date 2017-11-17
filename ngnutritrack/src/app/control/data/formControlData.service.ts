import { Injectable } from '@angular/core';
import { FormControlData, Analisis, Consulta, ValoracionAntropometrica, Paciente, Ejercicio } from './formControlData.model';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class FormControlDataService {
	private formControlData: FormControlData = new FormControlData();
	private apiURL	=	'http://127.0.0.1:8000/api/v0/';
	//private apiURL	=	'http://expediente.nutricion.co.cr/nutri/public/api/v0/';
	data:any={};
	constructor(private http: Http) {
		//console.log('Iniciando FCDS');
	}  
	getPacientesDeNutricionista(): Observable<Paciente[]> {
		var nutricionista_id	=	this.formControlData.nutricionista_id;
		return this.http.get( this.apiURL + 'pacientes/nutricionista/' + nutricionista_id ).map((response: Response) => response.json());
	}
	getConsultaSelected(consulta_id): Observable<Consulta> {
		//var consulta_id	=	this.formControlData.consulta_id;
		console.log('FCDS::ConsSel(): ' + this.apiURL + 'consultas/' + consulta_id + '/all' );
		return this.http.get( this.apiURL + 'consultas/' + consulta_id + '/all')
				.map((response: Response) => response.json());
	}
	getConsultas(): Observable<Consulta[]> {
		//console.log('FCDS::Cons()');
		return this.http.get( this.apiURL + 'consultas/process').map((response: Response) => response.json());
	}
	getEjercicios(): Observable<Ejercicio[]> {
		//console.log('FCDS::Cons()');
		return this.http.get( this.apiURL + 'ejercicios').map((response: Response) => response.json());
	}
	getConsultasPendientes(): Observable<Consulta[]> {
		var nutricionista_id	=	this.formControlData.nutricionista_id;
		//console.log('FCDS::getConsPend( ' + nutricionista_id + ' )' );
		return this.http.get( this.apiURL + 'consultas/nutricionista/' + nutricionista_id + '/pendientes/').map((response: Response) => response.json());
	}	
	getPacientes(): Observable<Consulta[]> {
		var nutricionista_id	=	this.formControlData.nutricionista_id;
		//console.log('FCDS::getPac( ' + nutricionista_id + ' )' );
		return this.http.get( this.apiURL + 'nutricionista/pacientes/' + nutricionista_id).map((response: Response) => response.json());
	}
	setSelectedConsuta(consulta){
		this.formControlData.setFormConsulta(consulta);
	}
	setPaciente(paciente: Paciente){
		this.formControlData.setFormPaciente(paciente);
	}
	/*
	setConsulta(consulta: Consulta){
		this.formControlData.consulta_id	=	consulta.id;
		this.formControlData.consulta_fecha	=	consulta.fecha;
		this.formControlData.consulta_notas	=	consulta.notas;
		this.formControlData.consulta_estado	=	consulta.estado;
		this.formControlData.consulta_paciente_id	=	consulta.paciente_id;
		this.formControlData.consulta_paciente_nombre	=	consulta.paciente_nombre;
	}
    getConsulta(): Consulta {
        var consulta: Consulta = {
            id: this.formControlData.consulta_id,
            fecha: this.formControlData.consulta_fecha,
            notas: this.formControlData.consulta_notas,
            estado: this.formControlData.consulta_estado,
            paciente_id: this.formControlData.consulta_paciente_id,
            paciente_nombre: this.formControlData.consulta_paciente_nombre
        };
        return consulta;
	}
	
	
	*/
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
	getAnalisis():Analisis{
		var analisis:Analisis={
			imc: this.formControlData.imc,
			pesoIdeal : this.formControlData.pesoIdeal,
			pesoIdealAjustado: this.formControlData.pesoIdealAjustado,
			diferenciaPeso: this.formControlData.diferenciaPeso,
			adecuacion: this.formControlData.adecuacion,
			relacionCinturaCadera: this.formControlData.relacionCinturaCadera,
			porcentajePeso: this.formControlData.porcentajePeso,
			gradoSobrepeso: this.formControlData.gradoSobrepeso,
			pesoMetaMaximo: this.formControlData.pesoMetaMaximo,
			pesoMetaMinimo: this.formControlData.pesoMetaMinimo
		}
		return analisis;
	}
    setAnalisis(data: Analisis) {
        // Update the Personal data only when the Personal Form had been validated successfully
        this.formControlData.imc	=	this.formControlData.imc;
		this.formControlData.pesoIdeal = data.pesoIdeal;
		this.formControlData.pesoIdealAjustado= data.pesoIdealAjustado;
		this.formControlData.diferenciaPeso= data.diferenciaPeso;
		this.formControlData.adecuacion= data.adecuacion;
		this.formControlData.relacionCinturaCadera= data.relacionCinturaCadera;
		this.formControlData.porcentajePeso= data.porcentajePeso;
		this.formControlData.gradoSobrepeso= data.gradoSobrepeso;
		this.formControlData.pesoMetaMaximo= data.pesoMetaMaximo;
		this.formControlData.pesoMetaMinimo= data.pesoMetaMinimo;
    }

	addConsulta(paciente: Paciente): Observable<Consulta[]> {
		var data={paciente_id:paciente.id};
		return this.http.post( this.apiURL + 'consultas/', data).map((response: Response) => response.json());
	}
	addConsulta__0(paciente: Paciente): Observable<Consulta[]> {
		//let headers = new Headers({ 'Content-Type': 'application/json' });
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		console.log('addCons: ' + this.apiURL + 'consultas/paciente_id:' + paciente.id);
		var data={paciente_id:paciente.id}
		return this.http.post(this.apiURL + 'consultas', data, options)
			.map((response: Response) => response.json())
			.catch((error: any) => Observable.throw(error.json().error));
		
	}
	addConsulta_1(paciente: Paciente){
		//let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' });
		let headers = new Headers({ 'Content-Type': 'application/json' });
//		headers.append('Access-Control-Allow-Origin','*');

		let options = new RequestOptions({ headers: headers });
		var data={paciente_id:paciente.id};
		return this.http.post(this.apiURL + 'consultas', data, options)
			.subscribe((res:Response)=>{console.log()});
			
			/*
			.map((response: Response) => response.json())
			.catch((error: any) => Observable.throw(error.json().error));
			*/
	}
	
	addValoracionAntropometrica(valoracionAntropometrica: Object): Observable<ValoracionAntropometrica[]> {
		return this.http.post(this.apiURL + 'consultas/valoracion', valoracionAntropometrica)
			.map((response: Response) => response.json())
			.catch((error: any) => Observable.throw(error.json().error || {message: 'Server Error: valoracionAntropometrica'}));
	}
	
}
