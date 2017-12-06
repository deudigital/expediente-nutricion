<?php

namespace App\Http\Controllers;

use App\Persona;
use App\Paciente;
use App\Objetivo;
use App\HcpPatologia;
use App\PatologiasPaciente;
use App\HabitosGusto;
use App\HabitosOtro;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use DB;
use Carbon\Carbon;
class PacienteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
		$registros	=	Paciente::All();
		/*$response	=	Response::json($pacientes, 200);*/
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
/*	persona	*/	
		$persona	=	Persona::create([
						/*	datos personales	*/
							'cedula'			=>	$request->input('cedula'),
							'nombre'			=>	$request->input('nombre'),
							'genero'			=>	$request->input('genero'),
							'fecha_nac'			=>	$request->input('fecha_nac'),
						/*	contacto	*/		
							'telefono'			=>	$request->input('telefono'),
							'celular'			=>	$request->input('celular'),
							'email'				=>	$request->input('email'),
							'provincia'			=>	$request->input('provincia'),
							'canton'			=>	$request->input('canton'),
							'distrito'			=>	$request->input('distrito'),
							'detalles_direccion'=>	$request->input('detalles_direccion')
						]);
		$paciente	=	Paciente::create([
							'persona_id'			=>	$persona->id,
							'notas_patologias'		=>	'',
							'otras_patologias'		=>	'',
							'notas_alergias'		=>	'',
							'notas_medicamentos'	=>	'',
							'notas_otros'			=>	'',
							'nutricionista_id'		=>	$request->input('nutricionista_id'),
							'responsable_id'		=>	null,
							'usuario'				=>	'',
							'contrasena'			=>	''
						]);
	
/*	paciente	*/
		/*$table->integer('persona_id')->unsigned();*/

/*		$request->input('');
		$request->input('');
		$request->input('');
		$request->input('');
		$request->input('');

		$request->input('');
		$request->input('');
		$request->input('');
		$request->input('');
*/
		
		
		$message	=	array(
							'code'		=> '201',
							'id'		=> $persona->id,
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Paciente  $paciente
     * @return \Illuminate\Http\Response
     */
    public function show(Paciente $paciente)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Paciente  $paciente
     * @return \Illuminate\Http\Response
     */
    public function edit(Paciente $paciente)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Paciente  $paciente
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Paciente $paciente)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Paciente  $paciente
     * @return \Illuminate\Http\Response
     */
    public function destroy(Paciente $paciente)
    {
        //
    }
	public function patologiashcp($id){
		$registros = DB::table('hcf_patologias_pacientes')
            ->join('hcf_patologias', 'hcf_patologias.id', '=', 'hcf_patologias_pacientes.hcf_patologia_id')
            ->where('hcf_patologias_pacientes.paciente_id', $id)
            ->get();
/*
select * 
from `hcf_patologias_pacientes` 
	inner join `hcf_patologias` on 
		`hcf_patologias`.`id` = `hcf_patologia_pacientes`.`hcf_patologia_id` 
		where `hcf_patologias_pacientes`.`paciente_id` = 6
*/
			
		/*$patologias	=	PatologiasPaciente::where('paciente_id', $id)
						->get();*/
		
		/*$paciente	=	Paciente::find($request->input('paciente_id'));*/
		return $registros;
	}
	public function medicamentos(Request $request){
		$paciente	=	Paciente::find($request->input('id'));	
		$paciente->notas_medicamentos	=	$request->input('notas_medicamentos');
		$paciente->save();
				
		$message	=	array(
							'code'		=> '201',
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
	}
	
	function belongsToNutricionista($id){
		$registros = DB::table('pacientes')
            ->join('personas', 'personas.id', '=', 'pacientes.persona_id')
            ->where('pacientes.nutricionista_id', $id)
            ->get();		
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	public function testing(){
		$message	=	array(
							'code'		=> '201',
							'message'	=> 'Testing Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
	}
	
	
    public function storeDatosPersonales(Request $request)
    {
		/*$response	=	Response::json($request->all(), 201);
		return $response;*/
		$persona	=	false;
		if($request->input('id')){			
			$fecha	=	explode('/', $request->fecha_nac);
			$fecha_nac	=	$fecha[2].'-'.$fecha[1].'-'.$fecha[0];
			$persona	=	Persona::find($request->id);
			$persona->cedula	=	$request->cedula;
			$persona->nombre	=	$request->nombre;
			$persona->genero	=	$request->genero;
			$persona->fecha_nac	=	$fecha_nac;
			$persona->save();
			$paciente	=	Paciente::find($request->id);
			$paciente->responsable_cedula		=	$request->responsable_cedula;
			$paciente->responsable_nombre		=	$request->responsable_nombre;
			$paciente->responsable_parentezco	=	$request->responsable_parentezco;
			$paciente->save();
		}else{
			/*	persona	*/
			$fecha	=	explode('/', $request->input('fecha_nac'));
			$fecha_nac	=	$fecha[2].'-'.$fecha[1].'-'.$fecha[0];
			$persona	=	Persona::create([
							/*	datos personales	*/
								'cedula'			=>	$request->input('cedula'),
								'nombre'			=>	$request->input('nombre'),
								'genero'			=>	$request->input('genero'),
								'fecha_nac'			=>	$fecha_nac,
							]);
			$persona->save();
			$paciente	=	Paciente::create([
							/*	datos personales	*/
								'persona_id'			=>	$persona->id,
								'responsable_cedula'	=>	$request->responsable_cedula,
								'responsable_nombre'	=>	$request->responsable_nombre,
								'responsable_parentezco'=>	$request->responsable_parentezco,						
							]);
			$paciente->save();
		}
				
		$message	=	array(
							'code'		=> '201',
							'id'		=> $persona->id,
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
    public function storeDatosContacto(Request $request)
    {
		/*$response	=	Response::json($request->all(), 201);
		return $response;*/
		$persona	=	false;
		if($request->input('id')){
			$persona			=	Persona::find($request->id);
			$persona->telefono	=	$request->telefono;
			$persona->celular	=	$request->celular;
			$persona->email		=	$request->email;
			$persona->provincia	=	$request->provincia;
			$persona->canton	=	$request->canton;
			$persona->distrito	=	$request->distrito;
			$persona->detalles_direccion	=	$request->detalles_direccion;
			$persona->save();
			$paciente	=	Paciente::find($request->id);
			$paciente->responsable_telefono		=	$request->responsable_telefono;
			$paciente->responsable_email		=	$request->responsable_email;
			$paciente->save();
		}else{
			$persona	=	Persona::create([
							'telefono'			=>	$request->telefono,
							'celular'			=>	$request->celular,
							'email'				=>	$request->email,
							'provincia'			=>	$request->provincia,
							'canton'			=>	$request->canton,
							'distrito'			=>	$request->distrito,
							'detalles_direccion'=>	$request->detalles_direccion					
							]);
			$persona->save();
			$paciente	=	Paciente::create([

								'responsable_telefono'	=>	$request->responsable_telefono,
								'responsable_email'		=>	$request->responsable_email,						
							]);
			$paciente->save();
		}
				
		$message	=	array(
							'code'		=> '201',
							'id'		=> $persona->id,
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
    public function storeDatosObjetivo(Request $request)
    {
		/*$response	=	Response::json($request->all(), 201);
		return $response;*/
		if($request->input('id')){
			$objetivo			=	Objetivo::find($request->id);
			$objetivo->descripcion	=	$request->descripcion;
		}else{
			$objetivo	=	Objetivo::create([
								'fecha'			=>	DB::raw('UNIX_TIMESTAMP()'),//Carbon::now()->timestamp,
								'descripcion'	=>	$request->descripcion,
								'paciente_id'	=>	$request->paciente_id					
							]);
			
		}
		$objetivo->save();
		$objetivo			=	Objetivo::find($objetivo->id);
		$objetivo->fecha	=	gmdate("d/m/Y", $objetivo->fecha);
		$message	=	array(
							'code'		=> '201',
							'data'		=> $objetivo,
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
	public function storeDatosEjercicio(Request $request)
    {
		$response	=	Response::json($request->input('ejercicio_id'), 201);
		return $response;
		
		
	
		$deletedRows = EjerciciosPaciente::where('paciente_id', $request->paciente_id)->delete();
		
		if($request->input('paciente_id')){
			$ejerciciosPaciente			=	EjerciciosPaciente::find($request->id);
			$objetivo->ejercicio_id		=	$ejercicio_id;
			$objetivo->horas_semanales	=	$request->horas_semanales;
		}else{
			$ejerciciosPaciente	=	EjerciciosPaciente::create([
								'ejercicio_id'		=>	$ejercicio_id,
								'horas_semanales'	=>	$request->horas_semanales,
								'paciente_id'		=>	$request->paciente_id					
							]);
			
		}
		$ejerciciosPaciente->save();
		
		$message	=	array(
							'code'		=> '201',
							'data'		=> $ejerciciosPaciente,
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
	public function storeDatosGustos(Request $request){
		/*$response	=	Response::json($request->all(), 201);
		return $response;*/
		if($request->input('id')){
			$gusto			=	HabitosGusto::find($request->id);
			$gusto->comidas_favoritas		=	$request->comidas_favoritas;
			$gusto->comidas_no_gustan		=	$request->comidas_no_gustan;
			$gusto->lugar_acostumbra_comer	=	$request->lugar_acostumbra_comer;
			$gusto->lugar_caen_mal			=	$request->lugar_caen_mal;
			$gusto->notas					=	$request->notas;
			$gusto->paciente_id				=	$request->paciente_id;
		}else{
			$gusto	=	Gusto::create([
								'comidas_favoritas'		=>	$request->comidas_favoritas,					
								'comidas_no_gustan'		=>	$request->comidas_no_gustan,
								'lugar_acostumbra_comer'=>	$request->lugar_acostumbra_comer,
								'lugar_caen_mal'		=>	$request->lugar_caen_mal,	
								'notas'					=>	$request->notas,
								'paciente_id'			=>	$request->paciente_id
							]);
		}
		$gusto->save();
		$message	=	array(
							'code'		=> '201',
							'data'		=> $gusto,
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
	public function storeDatosOtros(Request $request){
		/*$response	=	Response::json($request->all(), 201);
		return $response;*/
		if($request->input('id')){
			$habitosOtro						=	HabitosOtro::find($request->id);
			$habitosOtro->alcohol				=	$request->alcohol;
			$habitosOtro->alcohol_cantidad		=	$request->alcohol_cantidad;
			$habitosOtro->alcohol_frecuencia	=	$request->alcohol_frecuencia;
			$habitosOtro->fumado				=	$request->fumado;
			$habitosOtro->fuma_cantidad			=	$request->fuma_cantidad;
			$habitosOtro->fuma_frecuencia		=	$request->fuma_frecuencia;
			$habitosOtro->ocupacion				=	$request->ocupacion;
			$habitosOtro->ocupacion_frecuencia	=	$request->ocupacion_frecuencia;
			$habitosOtro->ocupacion_horas		=	$request->ocupacion_horas;
			$habitosOtro->notas					=	$request->notas;
			$habitosOtro->sueno					=	$request->sueno;
		}else{
			$habitosOtro	=	HabitosOtro::create([
								'alcohol'				=>	$request->alcohol,
								'alcohol_cantidad'		=>	$request->alcohol_cantidad,
								'alcohol_frecuencia'	=>	$request->alcohol_frecuencia,
								'fumado'				=>	$request->fumado,
								'fuma_cantidad'			=>	$request->fuma_cantidad,
								'fuma_frecuencia'		=>	$request->fuma_frecuencia,
								'ocupacion'				=>	$request->ocupacion,
								'ocupacion_frecuencia'	=>	$request->ocupacion_frecuencia,
								'ocupacion_horas'		=>	$request->ocupacion_horas,
								'sueno'					=>	$request->sueno,
								'notas'					=>	$request->notas,
								'paciente_id'			=>	$request->paciente_id,
							]);
		}
		$habitosOtro->save();
		$message	=	array(
							'code'		=> '201',
							'data'		=> $habitosOtro,
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
}
