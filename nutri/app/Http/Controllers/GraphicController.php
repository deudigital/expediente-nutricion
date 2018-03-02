<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class GraphicController extends Controller
{
    //
	
    public function index()
    {
/*
        $registros	=	Mensaje::all();
		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json('Sin Datos', 204);
*/		

		$tablaUtilizada	=	'oms';
		$indicador		=	'peso-edad';
		$rangoEdad		=	'5-19';
		$genero			=	'mujer';
		$x_label			=	'Edad';
		$y_label			=	'Peso';
		$alturaPaciente	=	115;
		$pesoPaciente	=	25;
		$edadPaciente	=	2;

		$path	=	'json-data/';
		$path	.=	$tablaUtilizada;
		$path	.=	'-' . $indicador;
		$path	.=	'-' . $rangoEdad;
		$path	.=	'-' . $genero;
		$path	.=	'.json';

		$jsonURL	=	public_path( $path );/*die($jsonURL);*/
		$jsonFile	=	file_get_contents($jsonURL);
		//$response	=	Response::json($str, 200, [], JSON_NUMERIC_CHECK);
		return $jsonFile;
    }
}
