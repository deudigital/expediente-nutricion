<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Rdd;

class RddController extends Controller
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
		/**/
		
		$rdd	=	Rdd::where('consulta_id', $request->consulta_id)
						->get()
						->first();
		
		if($rdd){
			/*$va->id	=	 1,*/
			$rdd->metodo_calculo_gc				=	$request->metodo_calculo_gc;
			$rdd->peso_calculo					=	$request->peso_calculo;
			$rdd->factor_actividad_sedentaria	=	$request->factor_actividad_sedentaria;
			$rdd->promedio_gc_diario				=	$request->promedio_gc_diario;
			$rdd->variacion_calorica				=	$request->variacion_calorica;
			/*"consulta_id": 1*/
			
		}else{
			$rdd	=	new ValoracionAntropometrica(
						array(
							'metodo_calculo_gc'				=>	$request->metodo_calculo_gc, 
							'peso_calculo'					=>	$request->peso_calculo, 
							'factor_actividad_sedentaria'	=>	$request->factor_actividad_sedentaria, 
							'promedio_gc_diario'			=>	$request->promedio_gc_diario, 
							'variacion_calorica'			=>	$request->variacion_calorica, 
							'consulta_id'					=>	$request->consulta_id
						)
					);
		}
		$rdd->save();
		$message	=	'Su Consulta ha sido añadida de modo correcto';
		$response	=	Response::json([
			'message'	=>	$message,
			'data'		=>	$rdd
		], 201);
		return $response;
		
		/**/
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
