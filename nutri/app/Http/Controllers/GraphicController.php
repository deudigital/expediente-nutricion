<?php

namespace App\Http\Controllers;
use App\Paciente;
use App\Persona;
use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class GraphicController extends Controller
{
    //
	public function getIndicators($method, $indicator, $paciente_id)
    {
		$paciente	=	Persona::find($paciente_id);
		$paciente->edad		=	0;
		if($paciente->fecha_nac){
			$fecha_nac = explode('-', $paciente->fecha_nac);
			$edad	=	Carbon::createFromDate($fecha_nac[0], $fecha_nac[1], $fecha_nac[2])->age;          // int(41) calculated vs now in the same tz
			$paciente->fecha_nac=	$fecha_nac[2].'/'.$fecha_nac[1].'/'.$fecha_nac[0];
			$paciente->edad		=	$edad;
		}	
		$genero			=	'mujer';
		if($paciente->genero=='M')
			$genero			=	'hombre';

		$_indicators	=	array(
								'estatura-edad'	=>	'', 
								'estatura-peso'	=>	'', 
								'imc-edad'		=>	'', 
								'peso-edad'		=>	''
							);
/*echo $paciente->edad;*/
		if($method=='oms'){
			if($paciente->edad > 5){
				unset($_indicators['estatura-peso']);
				if($paciente->edad > 10)
					unset($_indicators['peso-edad']);
			}
		}
		if($method=='cdc'){
			if($paciente->edad < 3){
				unset($_indicators['imc-edad']);				
			}
		}
		$rangoEdad	=	'';
		foreach($_indicators as $key=>$value){
			$path	=	$method;
			$path	.=	'-' . $key;
			switch($method){
				case 'oms':
/*
Indicadores OMS
    Paciente de 0 a 5 años (la edad en los JSON esta en días)
        Estatura / Edad
        Estatura / Peso (2 diferentes graficas si esta entre 0 y 2 años o 2 y 5 - usar el respectivo)
        IMC / Edad
        Peso / Edad
    Paciente de 5 a 19 años (la edad en los JSON esta en meses)
        Estatura / Edad
        IMC / Edad
        Peso / Edad
*/
					if($key=='estatura-peso'){
						$rangoEdad	=	'0-2';
						if($paciente->edad > 2)
							$rangoEdad	=	'2-5';
					}else{
						$rangoEdad		=	'0-5';
						if($paciente->edad > 5){
/*							unset($_indicators['estatura-peso']);
							if($paciente->edad > 10)
								unset($_indicators['peso-edad']);
*/
							$rangoEdad		=	'5-19';
						}
					}
					break;
				case 'cdc':
/*
Indicadores CDC
	Paciente de 0 a 2 años (la edad en los JSON esta en meses)
		Estatura / Edad
		Estatura / Peso
		IMC / Edad
		Peso / Edad
	Paciente de 3 a 20 años (la edad en los JSON esta en meses)
		Estatura / Edad
		Estatura / Peso
		IMC / Edad
		Peso / Edad
*/
					$rangoEdad		=	'0-2';
					if($paciente->edad > 2)
						$rangoEdad		=	'2-20';

					break;				
			}
			
			$path	.=	'-' . $rangoEdad;			
			$path	.=	'-' . $genero;
			$path	.=	'.json';
			
			$path	=	'json-data/' . $path;
		
			$jsonURL	=	public_path( $path );
			$jsonFile	=	file_get_contents($jsonURL);
			
			$_indicators[$key]	=	$jsonFile;
		}
		/*echo '<pre>' . print_r($_indicators, true) . '</pre>';exit;*/
		return $_indicators;
    }
	public function getIndicators__oms($method, $indicator, $paciente_id)
    {
		$paciente	=	Persona::find($paciente_id);
		$paciente->edad		=	0;
		if($paciente->fecha_nac){
			$fecha_nac = explode('-', $paciente->fecha_nac);
			$edad	=	Carbon::createFromDate($fecha_nac[0], $fecha_nac[1], $fecha_nac[2])->age;          // int(41) calculated vs now in the same tz
			$paciente->fecha_nac=	$fecha_nac[2].'/'.$fecha_nac[1].'/'.$fecha_nac[0];
			$paciente->edad		=	$edad;
		}	
		$genero			=	'mujer';
		if($paciente->genero=='M')
			$genero			=	'hombre';

/*
Indicadores OMS
    Paciente de 0 a 5 años (la edad en los JSON esta en días)
        Estatura / Edad
        Estatura / Peso (2 diferentes graficas si esta entre 0 y 2 años o 2 y 5 - usar el respectivo)
        IMC / Edad
        Peso / Edad
    Paciente de 5 a 19 años (la edad en los JSON esta en meses)
        Estatura / Edad
        IMC / Edad
        Peso / Edad

Indicadores CDC
	Paciente de 0 a 2 años (la edad en los JSON esta en meses)
		Estatura / Edad
		Estatura / Peso
		IMC / Edad
		Peso / Edad
	Paciente de 3 a 20 años (la edad en los JSON esta en meses)
		Estatura / Edad
		Estatura / Peso
		IMC / Edad
		Peso / Edad
*/
		$_indicators	=	array(
								'estatura-edad'	=>	'', 
								'estatura-peso'	=>	'', 
								'imc-edad'		=>	'', 
								'peso-edad'		=>	''
							);

		$rangoEdad	=	'';
		foreach($_indicators as $key=>$value){
			$path	=	$method;
			$path	.=	'-' . $key;
			if($key=='estatura-peso'){
				$rangoEdad	=	'0-2';
				if($paciente->edad > 2)
					$rangoEdad	=	'2-5';
			}else{
				$rangoEdad		=	'0-5';
				if($paciente->edad > 5){
					unset($_indicators['estatura-peso']);
					$rangoEdad		=	'5-19';
				}
			}
			$path	.=	'-' . $rangoEdad;			
			$path	.=	'-' . $genero;
			$path	.=	'.json';
			
			$path	=	'json-data/' . $path;
		
			$jsonURL	=	public_path( $path );
			$jsonFile	=	file_get_contents($jsonURL);
			
			$_indicators[$key]	=	$jsonFile;
		}
		/*print_r($_indicators);exit;*/
		return $_indicators;
    }
	public function getIndicators__simple($method, $indicator, $paciente_id)
    {
		$paciente	=	Persona::find($paciente_id);
		$paciente->edad		=	0;
		if($paciente->fecha_nac){
			$fecha_nac = explode('-', $paciente->fecha_nac);
			$edad	=	Carbon::createFromDate($fecha_nac[0], $fecha_nac[1], $fecha_nac[2])->age;          // int(41) calculated vs now in the same tz
			$paciente->fecha_nac=	$fecha_nac[2].'/'.$fecha_nac[1].'/'.$fecha_nac[0];
			$paciente->edad		=	$edad;
		}	
		$genero			=	'mujer';
		if($paciente->genero=='M')
			$genero			=	'hombre';

		$rangoEdad	=	'';
		$rangoEdad		=	'0-5';
		if($paciente->edad > 5)
			$rangoEdad		=	'5-19';

		switch($indicator){
			case 'estatura-peso':
				$rangoEdad		=	'0-2';
				if($paciente->edad > 2)
					$rangoEdad		=	'2-5';
				
				break;
			/*case 'imc-edad':
			case 'estatura-edad':
			case 'peso-edad':
				$rangoEdad		=	'0-5';
				if($paciente->edad > 5)
					$rangoEdad		=	'5-19';
				
				break;*/
		}
		
		
		

		$path	=	$method;
		$path	.=	'-' . $indicator;
		$path	.=	'-' . $rangoEdad;
		$path	.=	'-' . $genero;
		$path	=	'json-data/' . $path . '.json';
		
		/*$tablaUtilizada	=	'oms';
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
		$jsonURL	=	public_path( $path );
		$path		=	'json-data/oms-peso-edad-5-19-mujer.json';
		*/
		$jsonURL	=	public_path( $path );/*die($jsonURL);*/
		$jsonFile	=	file_get_contents($jsonURL);
		return $jsonFile;
    }
    public function getIndicators__new($method, $indicator, $paciente_id)
    {
		$paciente	=	Paciente::find($paciente_id);
/*		$tablaUtilizada	=	'oms';
		$indicador		=	'peso-edad';*/
		$genero			=	'mujer';
		if($paciente->genero=='M')
			$genero			=	'hombre';
		
		$rangoEdad		=	'0-5';
		if($paciente->edad > 5)
			$rangoEdad		=	'5-19';

		
		$path	=	$method;
		$path	.=	'-' . $indicator;
		$path	.=	'-' . $rangoEdad;
		$path	.=	'-' . $genero;
		$path	=	'json-data/' . $path . '.json';

		$jsonURL	=	public_path( $path );/*die($jsonURL);*/
		$jsonFile	=	file_get_contents($jsonURL);
		//$response	=	Response::json($str, 200, [], JSON_NUMERIC_CHECK);
		return $jsonFile;
    }
}
