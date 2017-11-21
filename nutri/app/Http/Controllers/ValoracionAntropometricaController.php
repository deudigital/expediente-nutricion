<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\ValoracionAntropometrica;

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
		/**/
		
		$va	=	ValoracionAntropometrica::where('consulta_id', $request->consulta_id)
						->get()
						->first();
		
		if($va){
			/*$va->id	=	 1,*/
			$va->estatura				=	$request->estatura;
			$va->circunferencia_muneca	=	$request->circunferencia_muneca;
			$va->peso					=	$request->peso;
			$va->grasa					=	$request->grasa;
			$va->musculo				=	$request->musculo;
			$va->agua					=	$request->agua;
			$va->grasa_viceral			=	$request->grasa_viceral;
			$va->hueso					=	$request->hueso;
			$va->edad_metabolica		=	$request->edad_metabolica;
			$va->circunferencia_cintura	=	$request->circunferencia_cintura;
			$va->circunferencia_cadera	=	$request->circunferencia_cadera;
			/*"consulta_id": 1*/
			
		}else{
			$va	=	new ValoracionAntropometrica(
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
					);
		}
		$va->save();
		$message	=	'Su Consulta ha sido añadida de modo correcto';
		$response	=	Response::json([
			'message'	=>	$message,
			'data'		=>	$va
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
