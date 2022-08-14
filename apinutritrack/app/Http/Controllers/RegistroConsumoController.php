<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;

use App\Models\RegistroConsumo;

class RegistroConsumoController extends Controller
{
    //
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
