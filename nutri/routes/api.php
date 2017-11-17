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
	Route::post('login', 'LoginController@check');
});



Route::group(['middleware' => ['cors'], 'prefix' => 'v0'], function(){

	Route::get('consultas/new/{id}', 'ConsultaController@setConsultaForPaciente');	
	Route::get('consultas/process', 'ConsultaController@process');	
/*	consultas / del paciente / X	*/
	Route::get('consultas/paciente/{id}', 'ConsultaController@belongsToPaciente');
/*	consultas del nutricionista / X	*/
	Route::get('consultas/nutricionista/{id}', 'ConsultaController@belongsToNutricionista');
/*	consultas pendientes del nutricionista X	*/
	Route::get('consultas/nutricionista/{id}/pendientes/', 'ConsultaController@pendientes');	
	Route::get('consultas/{id}/all/', 'ConsultaController@all');	
	
/*	Pacientes del Nutricionista / X	*/
	Route::get('pacientes/nutricionista/{id}', 'PacienteController@belongsToNutricionista');
	
	
	Route::get('pacientes/{id}/patologiashcp', 'PacienteController@patologiashcp');
	Route::resource('patologiashcp', 'HcpPatologiaPacienteController');	
	Route::post('pacientes/medicamentos', 'PacienteController@medicamentos');
	Route::resource('nutricionistas', 'NutricionistaController');
	Route::resource('pacientes', 'PacienteController');
	Route::resource('objetivos', 'ObjetivoController');	
	Route::resource('ejercicios', 'EjercicioController');	
	
	Route::resource('consultas', 'ConsultaController');	
	Route::get('alimentos/categorias', 'AlimentoController@categorias');
	Route::get('alimentos/categorias/{id}', 'AlimentoController@categoriasbyid');
	Route::resource('alimentos', 'AlimentoController');
	Route::resource('registroconsumos', 'RegistroConsumoController');
});
Route::group(['middleware' => ['auth:api', 'cors'], 'prefix' => 'v1'], function(){	
	Route::post('pacientes/patologiashcp', 'PacienteController@patologiashcp');
	Route::resource('patologiashcp', 'HcpPatologiaPacienteController');	
	Route::post('pacientes/medicamentos', 'PacienteController@medicamentos');
	Route::resource('nutricionistas', 'NutricionistaController');
	Route::resource('pacientes', 'PacienteController');
	Route::resource('objetivos', 'ObjetivoController');	
	Route::resource('consultas', 'ConsultaController');	
	Route::get('alimentos/categorias', 'AlimentoController@categorias');
	Route::get('alimentos/categorias/{id}', 'AlimentoController@categoriasbyid');
	Route::resource('alimentos', 'AlimentoController');
	Route::resource('registroconsumos', 'RegistroConsumoController');
});