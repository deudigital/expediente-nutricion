<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Prescripcion;
use App\DetalleDescripcion;
use DB;

class PrescripcionController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
		$prescripcion	=	Prescripcion::where('consulta_id', $request->consulta_id)
							->get()
							->first();
		
		if($prescripcion){
			$prescripcion->carbohidratos				=	$request->carbohidratos;
			$prescripcion->proteinas						=	$request->proteinas;
			$prescripcion->grasas		=	$request->grasas;
			$prescripcion->save();
			
			$deletedRows = DetalleDescripcion::where('prescripcion_id', $prescripcion->id)->delete();
			
			foreach($request->items as $item){
				if(!$item['porciones'])
					continue;
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
			$prescripcion	=	new Prescripcion(
						array(
							'carbohidratos'				=>	$request->carbohidratos, 
							'proteinas'					=>	$request->proteinas, 
							'grasas'	=>	$request->grasas, 
							'consulta_id'					=>	$request->consulta_id
						)
					);
			$prescripcion->save();
			foreach($request->items as $item){
				if(!$item['porciones'])
					continue;
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
    }
    public function belongsToPaciente($id)
    {
		/*$registros = DB::table('detalle_prescripcion')
            ->join('prescripcions', 'prescripcions.id', '=', 'detalle_prescripcion.prescripcion_id')
            ->join('consultas', 'consultas.id', '=', 'prescripcions.consulta_id')
            ->where('consultas.paciente_id', $id)
            ->where('consultas.estado', 1)
            ->select('prescripcions.id', 'consultas.fecha', 'prescripcions.carbohidratos', 'prescripcions.proteinas', 'prescripcions.grasas', 'detalle_prescripcion.*')
			->orderBy('consultas.fecha', 'DESC')
			->get();
		*/
		$registros = [];
		$prescripcions = DB::table('prescripcions')
            ->join('consultas', 'consultas.id', '=', 'prescripcions.consulta_id')
            ->where('consultas.paciente_id', $id)
            ->where('consultas.estado', 1)
            ->select('prescripcions.id', 'consultas.id as consulta_id',  'consultas.fecha', 'prescripcions.carbohidratos', 'prescripcions.proteinas', 'prescripcions.grasas')
			->orderBy('consultas.fecha', 'DESC')
			->get();

		if(count($prescripcions)>0){
			$registros['prescripcions']	=	$prescripcions;
			foreach($prescripcions as $prescripcion){
			
				$detalle_prescripcion	=	DB::table('detalle_prescripcion')
												->join('prescripcions', 'prescripcions.id', '=', 'detalle_prescripcion.prescripcion_id')
												->where('prescripcions.id', $prescripcion->id)
												->select('detalle_prescripcion.*')
												->get();				
					
				if(count($detalle_prescripcion)>0){
					$items	=	[];
/*
prescripcion_id	34
grupo_alimento_nutricionista_id	12
porciones	5
*/
					for($i=0;$i<13;$i++)
						$items[]	=	'';
					foreach($detalle_prescripcion as $item)						
						$items[$item->grupo_alimento_nutricionista_id]	=	$item->porciones;

					$prescripcion->items	=	$items;					
					
					$patron_menus = DB::table('patron_menus')
									->join('consultas', 'consultas.id', '=', 'patron_menus.consulta_id')
									->where('consultas.id', $prescripcion->consulta_id)
									->select('patron_menus.*')
									->orderBy('patron_menus.tiempo_comida_id', 'ASC')
									->get();
					if(count($patron_menus)>0){
						$items	=	[];
/*
0	
grupo_alimento_nutricionista_id	7
tiempo_comida_id	1
consulta_id	34
porciones	5
*/
						for($i=0;$i<7;$i++)
							for($j=0;$j<13;$j++)
								$items[$i][$j]	=	'';
						foreach($patron_menus as $item)						
							$items[$item->tiempo_comida_id][$item->grupo_alimento_nutricionista_id]	=	$item->porciones;						

						$prescripcion->patron_menu	=	$items;
					}
				}
				$registros[]	=	$prescripcion;
			}
		}
			
		
		
			
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
    }

}
