<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\OtrosAlimento;

class OtrosAlimentoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {        
        $registros	=	OtrosAlimento::all();
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
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
        /*$response	=	Response::json($request->all(), 201);
		return $response;*/
		$otrosAlimento	=	new OtrosAlimento(
										array(
										
											'nombre'			=>	$request->nombre,
											'porciones'			=>	$request->porciones,
											'carbohidratos'		=>	$request->carbohidratos,
											'proteinas'			=>	$request->proteinas,
											'grasas'			=>	$request->grasas,
											'calorias'			=>	$request->calorias,
											'prescripcion_id'	=>	$request->prescripcion_id

										)
									);
		$otrosAlimento->save();
		$message	=	'Los Datos han sido almacenados correctamente';
		$response	=	Response::json([
			'message'	=>	$message,
			'code'		=> '201',
			'data'		=>	$otrosAlimento
		], 201);
		return $response;
		
    }
	 public function destroy($id)
    {
		OtrosAlimento::destroy($id);
		$message	=	array(
							'code'		=> '200',
							'message'	=> 'Se ha eliminado correctamente'
						);
        $response	=	Response::json($message, 201);
		return $response;
    }

}
