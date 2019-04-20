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
		$otrosAlimento	=	new OtrosAlimento(
										array(
											'nombre'		=>	$request->nombre,
											'porciones'		=>	$request->porciones,
											'carbohidratos'	=>	$request->carbohidratos,
											'proteinas'		=>	$request->proteinas,
											'grasas'		=>	$request->grasas,
											'calorias'		=>	$request->calorias,
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
    public function storemultiple(Request $request)
    {
		if(!$request->items){
			$response	=	Response::json([
				'code'		=>	204,
				'message'	=>	'Sin datos para registrar',
			], 200);
			return $response;
		}

		$array= Array();
		foreach($request->items as $item){
			$otrosAlimento	=	new OtrosAlimento(
										array(
											'nombre'		=>	$item['nombre'],
											'porciones'		=>	$item['porciones'],
											'carbohidratos'	=>	$item['carbohidratos'],
											'proteinas'		=>	$item['proteinas'],
											'grasas'		=>	$item['grasas'],
											'calorias'		=>	$item['calorias'],
											'prescripcion_id'	=>	$request->prescripcion_id
										)
									);
			$otrosAlimento->save();
			$array[]	=	$otrosAlimento;	
		}
		$message	=	'Los Datos han sido almacenados correctamente';
		$response	=	Response::json([
			'message'	=>	$message,
			'code'		=> '201',
			'data'		=>	$array
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
