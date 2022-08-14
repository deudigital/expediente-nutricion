<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;
use App\Models\Paciente;
use App\Models\DetalleValoracionDietetica;
use App\Models\DetalleValoracionDieteticaEjemplo;
use DB;

class ValoracionDieteticaController extends Controller
{
    //
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
		$message	=	array(
							'code'		=> '201',
							'message'	=> 'Se ha registrado correctamente'
						);
		$notas	=	$request->notas;
		if($notas){
			$paciente	=	Paciente::find($request->paciente_id);
			$paciente->notas_valoracion_dietetica	=	$request->notas[0];
			$paciente->save();
		}
		$items	=	$request->items;
		if($items){
			$datos	=	array();
			$deletedRows = DetalleValoracionDietetica::where('paciente_id', $request->paciente_id)->delete();

			foreach($items as $key=>$item){
				foreach($item['porciones'] as $alimento=>$porciones){
					if(empty($porciones))
						continue ;
					$detalleValoracionDietetica	=	DetalleValoracionDietetica::create([
										'paciente_id'						=>	$request->paciente_id,
										'categoria_valoracion_dietetica_id'	=>	$item['tiempo_id'],
										'grupo_alimento_nutricionista_id'	=>	$alimento,
										'porciones'							=>	$porciones,
									]);
					$datos[]	=	$detalleValoracionDietetica;
					$message['datos']	=	$datos;
				}
			}
		}
		$tiempos	=	$request->tiempos;
		if($tiempos){
			$datos	=	array();
			$deletedRows = DetalleValoracionDieteticaEjemplo::where('paciente_id', $request->paciente_id)->delete();

			foreach($tiempos as $key=>$item){
				if($item['tiempo_id']<1)
					continue ;
				$detalleValoracionDieteticaEjemplo	=	DetalleValoracionDieteticaEjemplo::create([
									'paciente_id'						=>	$request->paciente_id,
									'categoria_valoracion_dietetica_id'	=>	$item['tiempo_id'],
									'ejemplo'							=>	$item['ejemplo']
								]);
				$datos[]	=	$detalleValoracionDieteticaEjemplo;
				$detalleValoracionDieteticaEjemplo->save();

			}
		}
		$response	=	Response::json($message, 200, [], JSON_NUMERIC_CHECK);
		return $response;
    }
}
