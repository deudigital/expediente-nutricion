<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;

use App\Models\TiempoComida;

class TiempoComidaController extends Controller
{
    //
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $registros	=	TiempoComida::all();
		if(count($registros)>0)
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
		/*$response	=	Response::json($request, 201);
		return $response;*/
		$tiempoComida	=	TiempoComida::where('nombre', $request['tiempo_comida_nombre'])
							->where('nutricionista_id', $request['nutricionista_id'])
							->get()
							->first();
		if($tiempoComida){
			$message	=	array(
							'code'		=> '208',							
							'message'	=> 'Ya haz registrado este Nombre'
						);
			$response	=	Response::json($message, 200, [], JSON_NUMERIC_CHECK);
			return $response;
		}
		
		$tiempoComida	=	TiempoComida::create([
													'nombre' => $request['tiempo_comida_nombre'],
													'nutricionista_id' => $request['nutricionista_id'],
												]);
		$tiempoComida['ejemplo']	=	'';
		$tiempoComida['summary']	=	'';
		$tiempoComida['menu']		=	array();
		
		$message	=	array(
							'code'		=> '201',
							'data'		=> $tiempoComida,
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
}