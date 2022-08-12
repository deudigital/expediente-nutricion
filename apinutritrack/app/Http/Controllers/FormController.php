<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;

use App\Models\HcpPatologia;
use App\Models\HcfPatologia;
use App\Models\Ejercicio;
use App\Models\Alergia;
use App\Models\GrupoAlimentoNutricionista;
use App\Models\TiempoComida;
use App\Models\Ubicacion;

class FormController extends Controller
{
    //
	function dataform(){
		$data	=	HcpPatologia::all();
		if($data)
			$response['hcp_patologias']	=	$data->toArray();

		$data	=	Alergia::all();
		if($data)
			$response['alergias']	=	$data->toArray();
			
		$data	=	Ejercicio::all();
		if($data)
			$response['ejercicios']	=	$data->toArray();
		
		$data	=	HcfPatologia::all();
		if($data)
			$response['hcf_patologias']	=	$data->toArray();
		
		$data	=	GrupoAlimentoNutricionista::all();
		if($data)
			$response['grupo_alimento_nutricionitas']	=	$data->toArray();
		
		$data	=	TiempoComida::all();
		if($data)
			$response['tiempo_comidas']	=	$data->toArray();
		$data	=	Ubicacion::all();
		if($data)
			$response['ubicaciones']	=	$data->toArray();
		
		$response	=	Response::json($response, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
}
