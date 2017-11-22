<?php

namespace App\Http\Controllers;

use App\Persona;
use App\Paciente;
use App\HcpPatologia;
use App\PatologiasPaciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use DB;
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
		$paciente	=	Paciente::find($request->input('paciente_id'));
		$paciente	=	Paciente::find($request->input('hcp_patologia_id'));
		
		/*$pacientes->fill($request->all());*/
		$paciente->notas_medicamentos	=	$request->input('medicamentos');
		$paciente->save();
		/*$res		=	Response::json($request, 200);*/
		return $pacientes;
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
			$persona	=	Persona::find($request->id);
			$persona->cedula	=	$request->cedula;
			$persona->nombre	=	$request->nombre;
			$persona->genero	=	$request->genero;
			$persona->fecha_nac	=	$request->fecha_nac;
			$persona->save();
			$paciente	=	Paciente::find($request->id);
			$paciente->responsable_cedula		=	$request->responsable_cedula;
			$paciente->responsable_nombre		=	$request->responsable_nombre;
			$paciente->responsable_parentezco	=	$request->responsable_parentezco;
			$paciente->save();
		}else{
			/*	persona	*/
			$persona	=	Persona::create([
							/*	datos personales	*/
								'cedula'			=>	$request->input('cedula'),
								'nombre'			=>	$request->input('nombre'),
								'genero'			=>	$request->input('genero'),
								'fecha_nac'			=>	$request->input('fecha_nac'),						
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
}
