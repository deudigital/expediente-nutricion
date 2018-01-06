<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Rdd;
use App\ValoracionAntropometrica;

use DB;
class RddController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
		
		
		$rdd	=	Rdd::where('consulta_id', $request->consulta_id)
						->get()
						->first();

		if(count($rdd)>0){
			/*return $rdd;*/
			/*$va->id	=	 1,*/
			$rdd->metodo_calculo_gc				=	$request->metodo_calculo_gc;
			$rdd->peso_calculo					=	$request->peso_calculo;
			$rdd->factor_actividad_sedentaria	=	$request->factor_actividad_sedentaria;
			$rdd->promedio_gc_diario			=	$request->promedio_gc_diario;
			$rdd->variacion_calorica			=	$request->variacion_calorica;
			/*"consulta_id": 1*/
			
		}else{
			$rdd	=	new Rdd(
						array(
							'metodo_calculo_gc'				=>	$request->metodo_calculo_gc, 
							'peso_calculo'					=>	$request->peso_calculo, 
							'factor_actividad_sedentaria'	=>	$request->factor_actividad_sedentaria, 
							'promedio_gc_diario'			=>	$request->promedio_gc_diario, 
							'variacion_calorica'			=>	$request->variacion_calorica, 
							'consulta_id'					=>	$request->consulta_id
						)
					);
			//return $rdd;
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
    public function belongsToPaciente($id)
    {
		$registros = DB::table('rdds')
            ->join('consultas', 'consultas.id', '=', 'rdds.consulta_id')
            ->join('valor_antropometricas', 'valor_antropometricas.consulta_id', '=', 'rdds.consulta_id')
            ->join('personas', 'personas.id', '=', 'consultas.paciente_id')
            ->where('consultas.paciente_id', $id)
            ->where('consultas.estado', 1)
            ->select('consultas.fecha', 'rdds.*',DB::raw('TIMESTAMPDIFF(YEAR, personas.fecha_nac, consultas.fecha) as edad'),DB::raw('UNIX_TIMESTAMP(consultas.fecha) as date'), 'valor_antropometricas.estatura', 'valor_antropometricas.peso', 'valor_antropometricas.edad_metabolica')
			->orderBy('consultas.fecha', 'DESC')
			->get();
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
    }

}
