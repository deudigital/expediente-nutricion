<?php

namespace App\Http\Controllers;
use Exception;

use App\Consulta;
use App\Paciente;
use App\Persona;
use App\ValoracionAntropometrica;
use App\Rdd;
use App\Prescripcion;
use App\PatronMenu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use DB;
class ConsultaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $consultas	=	Consulta::all();
		/*$response	=	Response::json($consultas, 200);*/
		$response	=	Response::json($consultas, 200, [], JSON_NUMERIC_CHECK);
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
		/*		*/
        //if(!$request->notas || !$request->paciente_id){
        if(!$request->paciente_id){
			$response	=	Response::json([
				'message'	=>	'Por Favor escriba los campos requeridos'
			], 422);
			return $response;
		}
		$consulta	=	new Consulta(array(
			'fecha'	=>	DB::raw('now()'),
			'notas'	=>	trim($request->notas), 
			'paciente_id'	=>	trim($request->paciente_id)
		));
		$consulta->save();
		$message	=	'Su Consulta ha sido añadida de modo correcto';
		$response	=	Response::json([
			'message'	=>	$message,
			'data'		=>	$consulta
		], 201);
		return $response;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
	
	
    public function process()
    {
        $consultas	=	Consulta::all();
		if(!$consultas){
			return Response::json('Sin Datos', 204);
		}
		
		/*$response	=	Response::json($consultas, 200);*/
		$registros	=	Array();
		foreach($consultas as $consulta){
			$_item['id']		=	$consulta->id;
			$_item['fecha']		=	$consulta->fecha;
			$_item['notas']		=	$consulta->notas;
			$_item['estado']	=	$consulta->estado;
			$_item['paciente_id']=	$consulta->paciente_id;
			$_item['paciente']	=	Paciente::find( $consulta->paciente_id );
			$_item['persona']	=	Persona::find( $consulta->paciente_id );
			$registros[]			=	$_item;
		}
		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json('Sin Datos', 204);
		return $response;
    }
	function belongsToPaciente($id){
		$registros	=	Consulta::where('paciente_id', $id)
						->get();
		
		/*$paciente	=	Paciente::find($request->input('paciente_id'));*/
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	function pendientes($id){
		try{
		$registros = DB::table('consultas')
            ->join('pacientes', 'pacientes.persona_id', '=', 'consultas.paciente_id')
            ->join('personas', 'personas.id', '=', 'pacientes.persona_id')
            ->where('consultas.estado', 0)
            ->where('pacientes.nutricionista_id', $id)
            ->select('consultas.id', 'consultas.fecha', 'consultas.notas', 'personas.id as persona_id', 'personas.nombre as paciente_nombre', 'personas.telefono', 'pacientes.nutricionista_id as nutricionista')
            ->get();
			if(count($registros)>0)
				$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
			else
				$response	=	Response::json(['message' => 'Record not found'], 204);
		}
		catch (Illuminate\Database\QueryException $e) {
			dd($e);
		} catch (PDOException $e) {
			dd($e);
		}
		return $response;
	}
	function belongsToNutricionista($id){
		$registros = DB::table('consultas')
            ->join('pacientes', 'pacientes.persona_id', '=', 'consultas.paciente_id')
            ->join('personas', 'personas.id', '=', 'pacientes.persona_id')
            ->where('pacientes.nutricionista_id', $id)
            ->select('consultas.*', 'personas.id as persona_id', 'personas.nombre as paciente_nombre', 'personas.telefono')
            ->get();

			
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	function getAllInfoConsulta($id){
		$registros	=	array();
		if(count($valoracionAntropometrica)>0)
			$registros['va']	=	$valoracionAntropometrica->toArray();
		
		$rdd	=	Rdd::where('consulta_id', $id)
										->get();
		if(count($rdd)>0)
			$registros['rdd']	=	$rdd->toArray();
		
		$prescripcion	=	Prescripcion::where('consulta_id', $id)
										->get();
		if(count($prescripcion)>0)
			$registros['dieta']['prescripcion']	=	$prescripcion->toArray();
		
		$patronMenu	=	PatronMenu::where('consulta_id', $id)
										->get();
		if(count($patronMenu)>0)
			$registros['dieta']['patron_menu']	=	$patronMenu->toArray();
		return true;
	}
	function all($id){
		$consulta	=	Consulta::find($id);
		if(count($consulta)==0)
			return Response::json(['message' => 'Record not found'], 204);
		$registros	=	$consulta->toArray();
/*
Enviar usuario y contrasena?????? por ahora si... 
*/
		$paciente = DB::table('pacientes')
            ->join('personas', 'personas.id', '=', 'pacientes.persona_id')
            ->where('pacientes.persona_id', $consulta->paciente_id)
			->get();
/*
		$paciente	=	Paciente::where('persona_id', $consulta->paciente_id)
										->get();
*/
		if(count($paciente)>0){
			$registros['paciente']	=	$paciente->toArray();
			$registros['edad']		=	31;
			
		}
		
		$hcf_patologias = DB::table('hcf_patologias_pacientes')
				->join('hcf_patologias', 'hcf_patologias.id', '=', 'hcf_patologias_pacientes.hcf_patologia_id')
				->where('hcf_patologias_pacientes.paciente_id',  $consulta->paciente_id)
				->get();

		if(count($hcf_patologias)>0)
			$registros['paciente']['hcf']['patologias']	=	$hcf_patologias->toArray();
		
		$hcp_patologias = DB::table('patologias_pacientes')
				->join('hcp_patologias', 'hcp_patologias.id', '=', 'patologias_pacientes.hcp_patologia_id')
				->where('patologias_pacientes.paciente_id',  $consulta->paciente_id)
				->get();

		if(count($hcp_patologias)>0)
			$registros['paciente']['hcp']['patologias']	=	$hcp_patologias->toArray();
		
		$alergias = DB::table('alergias_pacientes')
				->join('alergias', 'alergias.id', '=', 'alergias_pacientes.alergia_id')
				->where('alergias_pacientes.paciente_id',  $consulta->paciente_id)
				->get();

		if(count($alergias)>0)
			$registros['paciente']['hcp']['alergias']	=	$alergias->toArray();
		
		$bioquimicas	=	DB::table('bioquimica_clinicas')
				->where('bioquimica_clinicas.paciente_id',  $consulta->paciente_id)
				->get();

		if(count($alergias)>0)
			$registros['paciente']['hcp']['bioquimicas']	=	$bioquimicas->toArray();
		
		$objetivos	=	DB::table('objetivos')
				->where('objetivos.paciente_id',  $consulta->paciente_id)
				->get();

		if(count($objetivos)>0)
			$registros['paciente']['objetivos']	=	$objetivos->toArray();
		
		
		$ejercicios	=	DB::table('ejercicios_pacientes')
				->join('ejercicios', 'ejercicios.id', '=', 'ejercicios_pacientes.ejercicio_id')
				->where('ejercicios_pacientes.paciente_id',  $consulta->paciente_id)
				->get();

		if(count($ejercicios)>0)
			$registros['paciente']['habitos']['ejercicios']	=	$ejercicios->toArray();
		
		$gustos	=	DB::table('habitos_gustos')
				->where('habitos_gustos.paciente_id',  $consulta->paciente_id)
				->get();

		if(count($gustos)>0)
			$registros['paciente']['habitos']['gustos']	=	$ejercicios->toArray();
		
		
		$habitos_otros	=	DB::table('habitos_otros')
				->where('habitos_otros.paciente_id',  $consulta->paciente_id)
				->get();

		if(count($habitos_otros)>0)
			$registros['paciente']['habitos']['otros']	=	$habitos_otros->toArray();
		
		
		
		
		
		
		
		$valoracionAntropometrica	=	ValoracionAntropometrica::where('consulta_id', $id)
										->get();
		if(count($valoracionAntropometrica)>0)
			$registros['va']	=	$valoracionAntropometrica->toArray();
		
		$rdd	=	Rdd::where('consulta_id', $id)
										->get();
		if(count($rdd)>0)
			$registros['rdd']	=	$rdd->toArray();
		
		$prescripcion	=	Prescripcion::where('consulta_id', $id)
										->get();
		if(count($prescripcion)>0)
			$registros['dieta']['prescripcion']	=	$prescripcion->toArray();
		
		$patronMenu	=	PatronMenu::where('consulta_id', $id)
										->get();
		if(count($patronMenu)>0)
			$registros['dieta']['patron_menu']	=	$patronMenu->toArray();
		
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	function setConsultaForPaciente($id){
		$consulta	=	new Consulta(array(
			'fecha'	=>	DB::raw('now()'),
			'notas'	=>	'', 
			'paciente_id'	=>	$id
		));
		
		$consulta->save();
		$registros	=	$consulta->toArray();
		$paciente = DB::table('pacientes')
            ->join('personas', 'personas.id', '=', 'pacientes.persona_id')
            ->where('pacientes.persona_id', $consulta->paciente_id)
			->get();

		if(count($paciente)>0)
			$registros['paciente']	=	$paciente->toArray();
		
		
		$this-> getAllInfoConsulta($id)();
		
		return Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
	}
	function storeNotas(Request $request){
		if(!$request->input('id'))
			return Response::json(['message' => 'Record not found'], 204);
		
		
		$consulta	=	Consulta::find($request->input('id'));
		if($consulta){
			$consulta->notas	=	$request->notas;
			$consulta->save();
		}
		$response	=	Response::json($consulta, 200, [], JSON_NUMERIC_CHECK);
		return $response;
		
	}

	
	
}
