import { Injectable } from '@angular/core';
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
	private apiURL	=	'https://expediente.nutricion.co.cr/nutri/public/api/v0/';
	//private apiURL	=	'http://127.0.0.1:8000/api/v0/';
	data:any={};
	constructor(private http: Http) {}

	getDataForm(): Observable<any[]> {
		return this.http.get( this.apiURL + 'form/data' ).map((response: Response) => response.json());
	}

	/*getDataForm() {
		return this.http.get( this.apiURL + 'form/data' ).map((response: Response) => response);
	}*/

	getPacientesDeNutricionista(): Observable<Paciente[]> {
		var nutricionista_id	=	this.formControlData.nutricionista_id;
		return this.http.get( this.apiURL + 'pacientes/nutricionista/' + nutricionista_id ).map((response: Response) => response.json());
	}

	//original method
	getNutricionista(): Observable<any[]> {
		var nutricionista_id = this.formControlData.nutricionista_id;
		return this.http.get( this.apiURL +'nutricionistas/' + nutricionista_id ).map((response: Response) => response.json());
	}

	/*getNutricionista() {
		var nutricionista_id = this.formControlData.nutricionista_id;
		return this.http.get( this.apiURL +'nutricionistas/' + nutricionista_id ).map((response: Response) => response );
	}*/

	//original method
	 getReporteFactura(): Observable<Reporte[]>{
	 	var nutricionista_id= this.formControlData.nutricionista_id;
	 	return this.http.get( this.apiURL+'reportes/nutricionista/'+nutricionista_id)
	 	.map((response:Response)=>response.json());
	 }
	/*getReporteFactura(){
		var nutricionista_id = this.formControlData.nutricionista_id;
		return this.http.get( this.apiURL+'reportes/nutricionista/'+nutricionista_id )
		.map((response:Response)=>response);
	}*/

	//original method
	getTipos(): Observable<Tipo[]>{
		return this.http.get( this.apiURL+'reportes/tipos_documento').map((response: Response)=>response.json());
	 }

	/*getTipos(){
		return this.http.get( this.apiURL+'reportes/tipos_documento').map((response: Response)=>response);
	}*/


	getTipo_ID(): Observable<Tipo_ID[]>{
		return this.http.get( this.apiURL+'facturacion/tipos_identification').map((response:Response)=>response.json());
	}

	/*getTipo_ID(){
		return this.http.get( this.apiURL+'facturacion/tipos_identification').map((response:Response)=>response);
	}*/

	getProvincia(){
		return this.http.get( this.apiURL+'ubicacion').map((response:Response)=>response);
	}

	getCanton(id){
		return this.http.get( this.apiURL+'ubicacion/canton/'+id).map((response:Response)=>response);
	}

	/*getMedio_Pagos(){
		return this.http.get( this.apiURL+'facturacion/medios_pagos').map((response: Response)=>response);
	}*/

	getMedio_Pagos(): Observable<Medio>{
		return this.http.get( this.apiURL+'facturacion/medios_pagos').map((response: Response)=>response.json());
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

	//Original method
	getPaciente(id): Observable<Persona> {
		var nutricionista_id = this.formControlData.nutricionista_id;
		return this.http.get(this.apiURL + 'nutricionista/'+nutricionista_id+'/cliente/'+id).map((response: Response) => response.json());
	}

	/*getPaciente(id){
		var nutricionista_id = this.formControlData.nutricionista_id;
		return this.http.get(this.apiURL + 'nutricionista/'+nutricionista_id+'/cliente/'+id).map((response: Response) => response);
	}*/

	//original method
	getProducts(): Observable<Producto[]> {
		var nutricionista_id   =   this.formControlData.nutricionista_id;
		return this.http.get( this.apiURL + 'productos/nutricionista/' + nutricionista_id)
		.map((response: Response) => response.json());
	}
	/*getProducts() {
		var nutricionista_id   =   this.formControlData.nutricionista_id;
		return this.http.get( this.apiURL + 'productos/nutricionista/' + nutricionista_id)
		.map((response: Response) => response);
	}*/


	buscarProductosDisponibles(query: string){
		let data = {
			nutricionista_id:  this.formControlData.nutricionista_id,
			query: query
		}
		return this.http.post( this.apiURL + 'productos/buscar', data).map((response:Response) => response.json());
	}


	/*buscarProductosDisponibles(query: string){
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		var data = {
			nutricionista_id:  this.formControlData.nutricionista_id,
			query: query
		}
		return this.http.post( this.apiURL + 'productos/buscar', data).map((response:Response) => response);
	}*/

	generarFactura(data: any){
		data.nutricionista_id = this.formControlData.nutricionista_id;
		return this.http.post( this.apiURL + 'facturacion/generar_factura', data).map((response:Response) => response.json());
	}

	/*generarFactura(data: any){
		data.nutricionista_id = this.formControlData.nutricionista_id;
		return this.http.post( this.apiURL + 'facturacion/generar_factura', data).map((response:Response) => response);
	}*/

	getMeasures(): Observable<Medida[]> {
		return this.http.get( this.apiURL + 'productos/medidas').map((response: Response) => response.json());
	}

	/*getMeasures() {
		return this.http.get( this.apiURL + 'productos/medidas').map((response: Response) => response);
	}*/

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
	addProducto(producto: Producto): Observable<Producto[]> {
		return this.http.post( this.apiURL + 'productos/nuevoproducto', producto).map((response: Response) => response.json());
	}
	/*addProducto(producto: Producto){
		return this.http.post( this.apiURL + 'productos/nuevoproducto', producto).map((response: Response) => response);
	}*/
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
		console.log('Service:' + module + '->sending...');
		console.log(data);
		var serviceUrl	=	this.apiURL;
		switch(module){
			case 'consulta':
				serviceUrl	+=	'consultas';
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
		console.log('Service:' + module + '->sending...');
		console.log(data);
		var serviceUrl	=	this.apiURL;
		switch(module){
			case 'objetivos':
				serviceUrl	+=	'objetivos/' + data.id + '/delete';
				break;
			case 'ejercicios':
				serviceUrl	+=	'ejercicios/' + data.id + '/delete';
				break;
		}
		return this.http.post( serviceUrl, data)
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

	addConsulta__0(paciente: Paciente): Observable<Consulta[]> {
		//let headers = new Headers({ 'Content-Type': 'application/json' });
		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' });
		let options = new RequestOptions({ headers: headers });
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
	}
	updateProducto(producto: Producto): Observable<Producto[]> {
		return this.http.post( this.apiURL + 'productos/editarproducto', producto).map((response: Response) => response.json());
	}
	/*updateProducto(producto: Producto) {
		return this.http.post( this.apiURL + 'productos/editarproducto', producto).map((response: Response) => response);
	}*/

	deleteProducto(producto: Producto){
		return this.http.post( this.apiURL + 'productos/'+producto+'/delete', {}).map((response: Response) => response);
	}

	deleteFactura(documento: any){
		return this.http.post( this.apiURL + 'facturacion/delete', documento).map((response: Response) => response);
	}

	getConsultasSinFacturar(): Observable<Consulta_s_f[]>{
		var nutricionista_id   =   this.formControlData.nutricionista_id;
		return this.http.get( this.apiURL + 'reportes/consultas_sin_facturar/nutricionista/'+nutricionista_id).map((response: Response) => response.json());
	}

	/*getConsultasSinFacturar(){
		var nutricionista_id   =   this.formControlData.nutricionista_id;
		return this.http.get( this.apiURL + 'reportes/consultas_sin_facturar/nutricionista/'+nutricionista_id).map((response: Response) => response);
	}*/
	updateConfiguracionFactura(nutri){
		return this.http.post( this.apiURL + 'nutricionistas/configFactura',nutri).map((response: Response) => response.json());
	}
	uploadImagen(image:any){
		var nutricionista_id   =   this.formControlData.nutricionista_id;
		let form: FormData  = new FormData();
    form.append('avatar', image);
		return this.http.post( this.apiURL + 'nutricionistas/uploadAvatar/'+nutricionista_id,form).map((response: Response) => response.json());
	}
	uploadCrypto(key:any){
		var nutricionista_id   =   this.formControlData.nutricionista_id;
		let form: FormData  = new FormData();
    form.append('cryptoKey', key);
		return this.http.post( this.apiURL + 'nutricionistas/uploadCrypto/'+nutricionista_id,form).map((response: Response) => response.json());
	}
}
