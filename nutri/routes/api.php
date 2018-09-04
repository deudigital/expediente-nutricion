<?php
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
Route::group(['middleware' => 'cors'], function(){
	/*	Movil	*/
	Route::post('login', 'LoginController@check');
	Route::post('login/reminder', 'LoginController@reminder');
	/*	Web	*/
	Route::post('web/status', 'LoginController@statuscheck');
	Route::post('web/login', 'LoginController@webcheck');
	Route::post('web/login/reminder', 'LoginController@webReminder');
});
Route::group(['middleware' => ['cors'], 'prefix' => 'v0'], function(){
	/*v1*/
	Route::get('nutricionistas/{id}', 'ReportesFacturasController@getDataNutricionista');

	//Route::post('prescripcion/copy/{prescripcion_id}/{consulta_id}', 'PrescripcionController@copy');
	Route::post('prescripcion/copy', 'PrescripcionController@copy');
	Route::get('consultas/last/{id}', 'ConsultaController@lastOfPaciente');
	Route::get('nutricionistas/status/{id}', 'NutricionistaController@status');	
	Route::get('graphics/all/{id}', 'GraphicController@all');
	Route::get('graphics/{method}/{indicator}/{id}', 'GraphicController@getIndicators');
	Route::get('facturacion/consecutivo/{nutricionista_id}/{tipo_documento_id}', 'FacturaController@getLastNumberConsecutive');
	Route::post('external/nutricionistas', 'externalController@store');
	Route::get('recordatorios', 'RecordatorioController@index');
	Route::get('mensajes', 'MensajeController@index');
	Route::get('form/data', 'FormController@dataform');
	Route::get('dietas/paciente/{id}', 'DietaController@belongsToPaciente');
	Route::get('consultas/process', 'ConsultaController@process');
/*	consultas / del paciente / X	*/
	Route::get('consultas/paciente/{id}', 'ConsultaController@belongsToPaciente');
/*	consultas del nutricionista / X	*/
	Route::get('consultas/nutricionista/{id}', 'ConsultaController@belongsToNutricionista');
/*	consultas pendientes del nutricionista X	*/
	Route::get('consultas/nutricionista/{id}/pendientes/', 'ConsultaController@pendientes');
	Route::get('consultas/{id}/all/', 'ConsultaController@all');
	Route::get('consultas/{id}/resumen/', 'ConsultaController@generateResumenConsulta');

/*	Pacientes del Nutricionista / X	*/
	Route::get('pacientes/nutricionista/{id}', 'PacienteController@belongsToNutricionista');
	Route::post('pacientes/datos', 'PacienteController@storeDatosPersonales');
	Route::post('pacientes/contacto', 'PacienteController@storeDatosContacto');
	Route::post('pacientes/objetivos', 'PacienteController@storeDatosObjetivo');
	Route::post('pacientes/ejercicios', 'PacienteController@storeDatosEjercicio');
	Route::post('pacientes/gustos', 'PacienteController@storeDatosGustos');
	Route::post('pacientes/otros', 'PacienteController@storeDatosOtros');
	Route::post('pacientes/hcfpatologias', 'PacienteController@storeDatosHcfPatologia');
	Route::post('pacientes/hcppatologias', 'PacienteController@storeDatosHcpPatologia');
	Route::post('pacientes/alergias', 'PacienteController@storeDatosHcpAlergia');

	Route::post('valoraciondietetica', 'ValoracionDieteticaController@store');

	Route::post('consultas/musculo', 'ConsultaController@storeMusculo');
	Route::post('consultas/grasa', 'ConsultaController@storeGrasa');
	Route::post('consultas/notas', 'ConsultaController@storeNotas');
	Route::post('consultas/valoracion', 'ValoracionAntropometricaController@store');
	Route::get('rdds/paciente/{id}', 'RddController@belongsToPaciente');
	Route::post('consultas/rdd', 'RddController@store');
	Route::get('valoracionantropometrica/paciente/{id}', 'ValoracionAntropometricaController@belongsToPaciente');

	Route::resource('dietas', 'DietaController');
	Route::get('prescripcion/paciente/{id}', 'PrescripcionController@belongsToPaciente');
	Route::get('consultas/prescripcion/paciente/{id}', 'PrescripcionController@lastBelongsToPaciente');
	Route::post('consultas/prescripcion', 'PrescripcionController@store');
	Route::post('consultas/otros', 'OtrosAlimentoController@store');
	Route::post('consultas/otrosmultiple', 'OtrosAlimentoController@storemultiple');
	Route::post('consultas/{id}/delete', 'ConsultaController@destroy');
	Route::post('otrosalimentos/{id}/delete', 'OtrosAlimentoController@destroy');

	Route::get('pacientes/{id}/patologiashcp', 'PacienteController@patologiashcp');

	Route::post('pacientes/cambiarcontrasena', 'PacienteController@updateContrasena');
	Route::post('pacientes/patologiashcp', 'PacienteController@patologiashcp');
	Route::resource('patologiashcp', 'HcpPatologiaPacienteController');
	Route::post('pacientes/medicamentos', 'PacienteController@medicamentos');
	Route::post('pacientes/hcpotros', 'PacienteController@hcpOtros');
	Route::post('pacientes/hcpbioquimicas', 'PacienteController@hcpBioquimicas');
	Route::get('backend/nutricionistas', 'NutricionistaController@getNutricionistas');
	Route::post('backend/nutricionistas', 'NutricionistaController@backendStore');
	
	Route::post('nutricionistas/configFactura','ReportesFacturasController@configFactura');
	Route::post('nutricionistas/uploadAvatar/{id}','ReportesFacturasController@uploadAvatar');
	Route::post('nutricionistas/uploadCrypto/{id}','ReportesFacturasController@uploadCrypto');
	Route::get('nutricionistas/ubicacion/{ubicacion_id}','FacturaController@getUbicacion');
	Route::post('objetivos/{id}/delete', 'ObjetivoController@destroy');
	Route::resource('objetivos', 'ObjetivoController');
	Route::post('ejercicios/{id}/delete', 'EjerciciosPacienteController@destroy');
	Route::resource('ejercicios', 'EjercicioController');

	Route::resource('consultas', 'ConsultaController');
	Route::get('alimentos/categorias', 'AlimentoController@categorias');
	Route::get('alimentos/categorias/{id}', 'AlimentoController@categoriasbyid');

	/* Rutas para manejar los productos */
	Route::get('productos/medidas', 'ProductosController@getMeasures');
	Route::get('productos/nutricionista/{id}', 'ProductosController@getProducts');
	Route::post('productos/buscar', 'ProductosController@getProductsLike');
	Route::post('productos/nuevoproducto', 'ProductosController@storeProducts');
	Route::post('productos/{id}/delete', 'ProductosController@destroy');
	Route::post('productos/editarproducto', 'ProductosController@updateProduct');
	/* Manejo de Facturas */
	Route::get('reportes/tipos_documento', 'ReportesFacturasController@getTipo_Documento');
	Route::get('reportes/nutricionista/{id}', 'ReportesFacturasController@getDocumentos');
	Route::get('reportes/consultas_sin_facturar/nutricionista/{id}','FacturaController@getConsultasSinFacturar');
	Route::get('nutricionista/{nutricionista_id}/cliente/{persona_id}','FacturaController@getPaciente');
	Route::get('facturacion/tipos_identification', 'FacturaController@getTiposIdentificacion');
	Route::get('facturacion/medios_pagos', 'FacturaController@getMediosPagos');
	Route::post('facturacion/generar_factura', 'FacturaController@generarFactura');
	Route::post('facturacion/delete', 'FacturaController@deleteFactura');
	Route::post('facturacion/guardarPaciente', 'FacturaController@guardarPaciente');

	Route::resource('alimentos', 'AlimentoController', ['only' => ['index']]);
	Route::resource('tiempocomidas', 'TiempoComidaController', ['only' => ['index']]);
	Route::get('registroconsumos/paciente/{id}', 'RegistroConsumoController@belongsToPaciente');
	Route::resource('registroconsumos', 'RegistroConsumoController');
});
Route::group(['middleware' => ['auth:api', 'cors'], 'prefix' => 'v1'], function(){
	Route::get('nutricionistas/{id}', 'ReportesFacturasController@getDataNutricionista');
	Route::get('pacientes/nutricionista/{id}', 'PacienteController@belongsToNutricionista');
	
	Route::get('prescripcion/copy/{id}', 'PrescripcionController@copy');
	Route::get('consultas/last/{id}', 'ConsultaController@lastOfPaciente');
	Route::get('recordatorios', 'RecordatorioController@index');
	Route::get('mensajes', 'MensajeController@index');
	Route::get('form/data', 'FormController@dataform');
	Route::get('consultas/nutricionista/{id}/pendientes/', 'ConsultaController@pendientes');
	Route::get('dietas/paciente/{id}', 'DietaController@belongsToPaciente');
	Route::post('pacientes/cambiarcontrasena', 'PacienteController@updateContrasena');
	Route::post('pacientes/patologiashcp', 'PacienteController@patologiashcp');
	Route::resource('patologiashcp', 'HcpPatologiaPacienteController');
	Route::post('pacientes/medicamentos', 'PacienteController@medicamentos');
	Route::resource('pacientes', 'PacienteController');
	Route::resource('objetivos', 'ObjetivoController');

	Route::resource('consultas', 'ConsultaController');
	Route::get('alimentos/categorias', 'AlimentoController@categorias');
	Route::get('alimentos/categorias/{id}', 'AlimentoController@categoriasbyid');
	Route::resource('alimentos', 'AlimentoController', ['only' => ['index']]);
	Route::resource('tiempocomidas', 'TiempoComidaController', ['only' => ['index']]);
	Route::get('registroconsumos/paciente/{id}', 'RegistroConsumoController@belongsToPaciente');
	Route::resource('registroconsumos', 'RegistroConsumoController');
	Route::get('valoracionantropometrica/paciente/{id}', 'ValoracionAntropometricaController@belongsToPaciente');
	Route::get('consultas/prescripcion/paciente/{id}', 'PrescripcionController@lastBelongsToPaciente');
});