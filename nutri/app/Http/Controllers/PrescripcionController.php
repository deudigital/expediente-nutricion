<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Prescripcion;
use App\DetalleDescripcion;

class PrescripcionController extends Controller
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
		/*
		return Response::json([
					'message'	=>	'request received',
					'data'		=>	$request->items[0]['nombre']
				], 201);*/
		$prescripcion	=	Prescripcion::where('consulta_id', $request->consulta_id)
						->get()
						->first();
		
		if($prescripcion){
			/*$va->id	=	 1,*/
			$prescripcion->carbohidratos				=	$request->carbohidratos;
			$prescripcion->proteinas						=	$request->proteinas;
			$prescripcion->grasas		=	$request->grasas;
			/*"consulta_id": 1*/
			$prescripcion->save();
			
			$deletedRows = DetalleDescripcion::where('prescripcion_id', $prescripcion->id)->delete();
			
			foreach($request->items as $item){
				if($item['porciones']<1)
					continue ;
				
				$detalleDescripcion	=	new DetalleDescripcion(
						array(
							'prescripcion_id'					=>	$prescripcion->id, 
							'grupo_alimento_nutricionista_id'	=>	$item['id'], 
							'porciones'							=>	$item['porciones'], 
						)
					);
				$detalleDescripcion->save();
			}
			

		}else{
			$prescripcion	=	new ValoracionAntropometrica(
						array(
							'carbohidratos'				=>	$request->carbohidratos, 
							'proteinas'					=>	$request->proteinas, 
							'grasas'	=>	$request->grasas, 
							'consulta_id'					=>	$request->consulta_id
						)
					);
			$prescripcion->save();
			foreach($request->items as $item){
				if($item['porciones']<1)
					continue ;				
				$detalleDescripcion	=	new DetalleDescripcion(
						array(
							'prescripcion_id'					=>	$prescripcion->id, 
							'grupo_alimento_nutricionista_id'	=>	$item['id'], 
							'porciones'							=>	$item['porciones'], 
						)
					);
				$detalleDescripcion->save();
			}
		}		
		$message	=	'Su Consulta ha sido añadida de modo correcto';
		$response	=	Response::json([
			'message'	=>	$message,
			'data'		=>	$prescripcion
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
