<?php

namespace App\Http\Controllers;

use App\RegistroConsumo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class RegistroConsumoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $registros	=	RegistroConsumo::All();
		if(count($registros)>0)
			/*$response	=	Response::json($registros, 200);*/
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json('Sin Datos', 204);
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
        \App\RegistroConsumo::create([
            'fecha' => $request['fecha'],
            'harinas' => $request['harinas'],
            'carnes' => $request['carnes'],
            'vegetales' => $request['vegetales'],
            'frutas' => $request['frutas'],
            'lacteos' => $request['lacteos'],
            'grasas' => $request['grasas'],
            'azucares' => $request['azucares'],
            'agua' => $request['agua'],
            'ejercicio' => $request['ejercicio'],
            'paciente_id' => $request['paciente_id'],
        ]);
		
		$message	=	array(
							'code'		=> '201',
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\RegistroConsumo  $registroConsumo
     * @return \Illuminate\Http\Response
     */
    public function show(RegistroConsumo $registroConsumo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\RegistroConsumo  $registroConsumo
     * @return \Illuminate\Http\Response
     */
    public function edit(RegistroConsumo $registroConsumo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\RegistroConsumo  $registroConsumo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RegistroConsumo $registroConsumo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\RegistroConsumo  $registroConsumo
     * @return \Illuminate\Http\Response
     */
    public function destroy(RegistroConsumo $registroConsumo)
    {
        //
    }
	function belongsToPaciente($id){
		$registros	=	RegistroConsumo::where('paciente_id', $id)
						->get();
		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json('Sin Datos', 204);

		return $response;
	}
}
