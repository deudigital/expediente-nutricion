<?php

namespace App\Http\Controllers;
use App\Objetivo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ObjetivoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {$response	=	Response::json(['index'], 201);
		return $response;
        $registros	=	Objetivo::All();
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
    {$response	=	Response::json(['create'], 201);
		return $response;
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
        Objetivo::create([
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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $response	=	Response::json(['show'], 201);
		return $response;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
       $response	=	Response::json(['edit'], 201);
		return $response;
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
        $response	=	Response::json(['update'], 201);
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
							'code'		=> '201',
							'message'	=> 'Se ha eliminado correctamente'
						);
        $response	=	Response::json($message, 201);
		return $response;

    }
}
