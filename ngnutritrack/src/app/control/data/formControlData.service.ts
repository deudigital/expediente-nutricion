import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormControlData,
		 Analisis, Consulta,
		 ValoracionAntropometrica,
		 Paciente,
		 Persona,
		 Nutricionista,
		 Reporte,
		 Tipo,
		 Tipo_ID,
		 Medio,
		 Medida,
		 Ejercicio,
		 Rdd,
		 Prescripcion,
		 Producto,
		 Consulta_s_f } from './formControlData.model';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class FormControlDataService {
	private formControlData: FormControlData = new FormControlData();
	private apiURL	=	environment.apiUrl;
	private headers: Headers;
	private token: any;
	data:any={};

	constructor(private http: Http) {}
	setHeader(token){
		this.token	=	token;
		this.headers	=	new Headers({
								  'Content-Type': 'application/json',
								  Authorization: `Bearer ${token}`
								});
	}
	setSession(nutricionista_id, token){
		localStorage.setItem('token', token);
		localStorage.setItem('nutritrack', 'desktop');
		localStorage.setItem('nutricionista_id', nutricionista_id);
		this.setHeader(token);
		this.formControlData.setNutricionistaId(nutricionista_id);		
	}
	getDataForm(): Observable<any[]> {
		let url	=	this.apiURL + 'form/data';
		return this.http.get( url, {headers: this.headers} ).map((response: Response) => response.json());
	}
/*	INICIO	*/
	getConsultasPendientes(): Observable<Consulta[]> {
		var nutricionista_id	=	localStorage.getItem('nutricionista_id');
		var url	=	this.apiURL + 'consultas/nutricionista/' + nutricionista_id + '/pendientes/';
		return this.http.get( url, {headers: this.headers} )
		.map((response: Response) => response.json());
	}
	getNutricionista(): Observable<any[]> {
		var nutricionista_id = localStorage.getItem('nutricionista_id');
		return this.http.get( this.apiURL +'nutricionistas/' + nutricionista_id, {headers: this.headers} ).map((response: Response) => response.json());
	}
	/*	VALORACION ANTROPOMETRICA	*/	
	getConsultaSelected(consulta_id): Observable<Consulta> {
		return this.http.get( this.apiURL + 'consultas/' + consulta_id + '/all', {headers: this.headers})
				.map((response: Response) => response.json());
	}	
	addValoracionAntropometrica(valoracionAntropometrica: ValoracionAntropometrica): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'consultas/valoracion', valoracionAntropometrica, {headers: this.headers}).map((response: Response) => response.json());
	}
	
/*	CONTROL	*/	
	getPacientesDeNutricionista(): Observable<Paciente[]> {
		var nutricionista_id	=	localStorage.getItem('nutricionista_id');
		return this.http.get( this.apiURL + 'pacientes/nutricionista/' + nutricionista_id, {headers: this.headers}  ).map((response: Response) => response.json());
	}
	/*	FACTURACION	*/
	getProducts(): Observable<Producto[]> {
		var nutricionista_id   =   localStorage.getItem('nutricionista_id');
		return this.http.get( this.apiURL + 'productos/nutricionista/' + nutricionista_id, {headers: this.headers})
		.map((response: Response) => response.json());
	}
	getMeasures(): Observable<Medida[]> {
		return this.http.get( this.apiURL + 'productos/medidas', {headers: this.headers}).map((response: Response) => response.json());
	}
	getTipo_ID(): Observable<Tipo_ID[]>{
		return this.http.get( this.apiURL+'facturacion/tipos_identification', {headers: this.headers}).map((response:Response)=>response.json());
	}
	getMedio_Pagos(): Observable<Medio>{
		return this.http.get( this.apiURL+'facturacion/medios_pagos', {headers: this.headers}).map((response: Response)=>response.json());
	}
	getNutricionistaUbicacion(ubicacion_id): Observable<any[]> {
		return this.http.get( this.apiURL +'nutricionistas/ubicacion/' + ubicacion_id, {headers: this.headers}).map((response: Response) => response.json());
	}
	/*	REPORTES	*/	
	getReporteFactura(): Observable<Reporte[]>{
		var nutricionista_id= localStorage.getItem('nutricionista_id');
		return this.http.get( this.apiURL+'reportes/nutricionista/'+nutricionista_id, {headers: this.headers})
		.map((response:Response)=>response.json());
	}
	/*	CONSULTAS SIN FACTURAR	*/	
	getConsultasSinFacturar(): Observable<Consulta_s_f[]>{
		var nutricionista_id   =   localStorage.getItem('nutricionista_id');
		return this.http.get( this.apiURL + 'reportes/consultas_sin_facturar/nutricionista/'+nutricionista_id, {headers: this.headers}).map((response: Response) => response.json());
	}
	/*	SERVICIOS PRODUCTOS	*/
	
	/*	CONFIGURACION	*/
	
	getTipos(): Observable<Tipo[]>{
		return this.http.get( this.apiURL+'reportes/tipos_documento', {headers: this.headers}).map((response: Response)=>response.json());
	 }
	getProvincia(){
		return this.http.get( this.apiURL+'ubicacion', {headers: this.headers}).map((response:Response)=>response);
	}
	getCanton(id){
		return this.http.get( this.apiURL+'ubicacion/canton/'+id, {headers: this.headers}).map((response:Response)=>response);
	}

	getConsultas(): Observable<Consulta[]> {
		return this.http.get( this.apiURL + 'consultas/process', {headers: this.headers}).map((response: Response) => response.json());
	}
	getEjercicios(): Observable<Ejercicio[]> {
		return this.http.get( this.apiURL + 'ejercicios', {headers: this.headers}).map((response: Response) => response.json());
	}
	getPacientes(): Observable<Consulta[]> {
		var nutricionista_id	=	localStorage.getItem('nutricionista_id');
		return this.http.get( this.apiURL + 'nutricionista/pacientes/' + nutricionista_id, {headers: this.headers})
		.map((response: Response) => response.json());
	}
	getPaciente(id): Observable<Persona> {
		var nutricionista_id = localStorage.getItem('nutricionista_id');
		return this.http.get(this.apiURL + 'nutricionista/'+nutricionista_id+'/cliente/'+id, {headers: this.headers}).map((response: Response) => response.json());
	}
	buscarProductosDisponibles(query: string){
		let data = {
			nutricionista_id:  this.formControlData.nutricionista_id,
			query: query
		}
		return this.http.post( this.apiURL + 'productos/buscar', data, {headers: this.headers}).map((response:Response) => response.json());
	}
	generarFactura(data: any){
		data.nutricionista_id = this.formControlData.nutricionista_id;
		return this.http.post( this.apiURL + 'facturacion/generar_factura', data, {headers: this.headers}).map((response:Response) => response);
	}
	addConsulta(paciente: Paciente): Observable<Consulta[]> {
		var data={paciente_id:paciente.id};
		return this.http.post( this.apiURL + 'consultas/', data, {headers: this.headers}).map((response: Response) => response.json());
	}
	addRdds(rdd: Rdd): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'consultas/rdd', rdd, {headers: this.headers}).map((response: Response) => response.json());
	}
	addDietas(dietas: any): Observable<any[]> {
		return this.http.post( this.apiURL + 'consultas/dietas', dietas, {headers: this.headers}).map((response: Response) => response.json());
	}
	addPrescripcion(prescripcion: Prescripcion): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'consultas/prescripcion', prescripcion, {headers: this.headers}).map((response: Response) => response.json());
	}
	addProducto(producto: Producto): Observable<Producto[]> {
		return this.http.post( this.apiURL + 'productos/nuevoproducto', producto, {headers: this.headers}).map((response: Response) => response.json());
	}
	saveDatosPersonales(paciente: Paciente): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'pacientes/datos', paciente, {headers: this.headers}).map((response: Response) => response.json());
	}
	saveDatosContacto(paciente: Paciente): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'pacientes/contacto', paciente, {headers: this.headers}).map((response: Response) => response.json());
	}
	saveNotasConsulta(consulta: Consulta): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'consultas/notas', consulta, {headers: this.headers}).map((response: Response) => response.json());
	}
	saveDatosPatronMenu(patronMenus: any): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'dietas', patronMenus, {headers: this.headers}).map((response: Response) => response.json());
	}
	saveDatosMusculo(data: any): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'consultas/musculo', data, {headers: this.headers}).map((response: Response) => response.json());
	}
	saveDatosGrasa(data: any): Observable<Consulta[]> {
		return this.http.post( this.apiURL + 'consultas/grasa', data, {headers: this.headers}).map((response: Response) => response.json());
	}
	upload(module:string, body:any): Observable<any[]> {
		var serviceUrl	=	this.apiURL;
		switch(module){
			case 'bioquimicas':
				serviceUrl	+=	'pacientes/hcpbioquimicas';
				break;
			case 'recepcion':
				serviceUrl	+=	'recepcion/importar';
				break;
		}
		const headers = new Headers();		 
		headers.append('Authorization', "Bearer" + " " + this.token);
		const options = new RequestOptions({headers: headers});
		
		return this.http.post( serviceUrl, body, options)
		.map((response: Response) => response.json());
	}
	store(module:string, data:any): Observable<any[]> {
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
			case 'hcp_otros':
				serviceUrl	+=	'pacientes/hcpotros';
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
			case 'copiar_prescripcion':
				serviceUrl	+=	'prescripcion/copy';
				break;
			case 'agenda-servicio':
				serviceUrl	+=	'agenda/servicios';
				break;
			case 'agenda':
				serviceUrl	+=	'agenda';
				break;
			case 'confirmar_cita':
				serviceUrl	+=	'agenda/' + data.id + '/confirmar';
				break;
			case 'cancelar_cita':
				serviceUrl	+=	'agenda/' + data.id + '/cancelar';
				break;
			case 'tiempo_comida':
				serviceUrl	+=	'tiempocomidas';
				break;
			case 'dietas':
				serviceUrl	+=	'dietas/nuevo';
				break;
		}
		return this.http.post( serviceUrl, data, {headers: this.headers}).map((response: Response) => response.json());
	}
	delete(module:string, data:any): Observable<any[]> {
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
			case 'agenda-servicio':
				serviceUrl	+=	'agenda/servicios/' + data.id + '/delete';
				break;
		}
		return this.http.post( serviceUrl, data, {headers: this.headers}).map((response: Response) => response.json());
	}
	select(module:string, data:any): Observable<any[]> {
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
			case 'graphic':
				serviceUrl	+=	'graphics/' + data.method + '/' + data.indicator + '/' + data.paciente_id;
				break;
			case 'data-graphic':
				serviceUrl	+=	'graphics/all/' + data.paciente_id;
				break;
			case 'consulta-paciente':
				serviceUrl	+=	'consultas/paciente/' + data.paciente_id;
				break;
			case 'reporte-recepcion':
				serviceUrl	+=	'reportes/recepcion/' + data.nutricionista_id;
				break;
			case 'agenda-servicio':
				serviceUrl	+=	'agenda/servicios/' + data.nutricionista_id;
				break;
			case 'agenda-personas':
				serviceUrl	+=	'agenda/nutricionista/' + data.nutricionista_id + '/personas';
				break;
			case 'agenda':
				serviceUrl	+=	'agenda/' + data.nutricionista_id + '/' + data.fecha;
				break;
		}
		return this.http.get( serviceUrl, {headers: this.headers}).map((response: Response) => response.json());
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
	getAnalisis():Analisis{
		var analisis:Analisis={
			imc: this.formControlData.imc,
			pesoIdeal : this.formControlData.pesoIdeal,
			estaturaIdeal : this.formControlData.estaturaIdeal,
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
	updateProducto(producto: Producto): Observable<Producto[]> {
		return this.http.post( this.apiURL + 'productos/editarproducto', producto, {headers: this.headers}).map((response: Response) => response.json());
	}
	deleteProducto(producto: Producto){
		return this.http.post( this.apiURL + 'productos/'+producto+'/delete', {}, {headers: this.headers}).map((response: Response) => response);
	}

	deleteFactura(documento: any){
		return this.http.post( this.apiURL + 'facturacion/delete', documento, {headers: this.headers}).map((response: Response) => response);
	}
	updateConfiguracionFactura(nutri){
		return this.http.post( this.apiURL + 'nutricionistas/configFactura',nutri, {headers: this.headers}).map((response: Response) => response.json());
	}
	uploadImagen(image:any){
		var nutricionista_id   =   localStorage.getItem('nutricionista_id');
		let form: FormData  = new FormData();
		form.append('avatar', image);
		return this.http.post( this.apiURL + 'nutricionistas/uploadAvatar/'+nutricionista_id,form, {headers: this.headers}).map((response: Response) => response.json());
	}
	uploadCrypto(key:any){
		var nutricionista_id   =   localStorage.getItem('nutricionista_id');
		let form: FormData  = new FormData();
		form.append('cryptoKey', key);
		return this.http.post( this.apiURL + 'nutricionistas/uploadCrypto/'+nutricionista_id,form, {headers: this.headers}).map((response: Response) => response.json());
	}
	guardarPaciente(paciente){
		return this.http.post( this.apiURL + 'facturacion/guardarPaciente',paciente, {headers: this.headers}).map((response: Response) => response.json());
	}
}
