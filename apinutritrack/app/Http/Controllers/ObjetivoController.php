<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;

use App\Models\Objetivo;

class ObjetivoController extends Controller
{
    //
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $registros	=	Objetivo::All();
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
        \App\Objetivo::create([
            'fecha' => $request['fecha'],            
            'descripcion' => $request['descripcion'],
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
		Objetivo::destroy($id);
		$message	=	array(
							'code'		=> '200',
							'message'	=> 'Se ha eliminado correctamente'
						);
        $response	=	Response::json($message, 201);
		return $response;
    }
}
