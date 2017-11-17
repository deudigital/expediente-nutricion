<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ValoracionAntropometricaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        //
		$obj	=	new ValoracionAntropometrica(
						array(
							'estatura'	=>	$request->estatura, 
							'circunferencia_muneca'	=>	$request->circunferencia_muneca, 
							'peso'	=>	$request->peso, 
							'grasa'	=>	$request->grasa, 
							'musculo'	=>	$request->musculo, 
							'agua'	=>	$request->agua, 
							'grasa_viceral'	=>	$request->grasa_viceral, 
							'hueso'	=>	$request->hueso, 
							'edad_metabolica'	=>	$request->edad_metabolica, 
							'circunferencia_cintura'	=>	$request->circunferencia_cintura, 
							'circunferencia_cadera'	=>	$request->circunferencia_cadera, 
							'consulta_id'	=>	$request->consulta_id
						)
					)
		$obj->save();
		$message	=	'Su Consulta ha sido añadida de modo correcto';
		$response	=	Response::json([
			'message'	=>	$message,
			'data'		=>	$obj
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
}
