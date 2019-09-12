<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\GrupoAlimentoNutricionista;
use App\Prescripcion;
use App\DetalleDescripcion;
use App\PatronMenu;
use App\PatronMenuEjemplo;
use App\Helper;
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
    {/*return Helper::printRequest($request);*/
		/*$prescripcion	=	Prescripcion::where('consulta_id', $request->consulta_id)*/
		$prescripcion	=	Prescripcion::where('dieta_id', $request->dieta_id)
							->get()
							->first();
		/*$response	=	Response::json($prescripcion, 200, [], JSON_NUMERIC_CHECK);
		return $response;*/
		$operacion	=	'';
		if($prescripcion){
			$operacion	=	'update';
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
			$operacion	=	'Nuevo';
			/*$prescripcion	=	new Prescripcion(
						array(
							'carbohidratos'				=>	$request->carbohidratos, 
							'proteinas'					=>	$request->proteinas, 
							'grasas'	=>	$request->grasas, 
							'consulta_id'					=>	$request->consulta_id
						)
					);*/
			$prescripcion	=	new Prescripcion(
						array(
							'carbohidratos'				=>	$request->carbohidratos, 
							'proteinas'					=>	$request->proteinas, 
							'grasas'	=>	$request->grasas, 
							'dieta_id'					=>	$request->dieta_id
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
			'operacion'	=>	$operacion,
			'message'	=>	$message,
			'data'		=>	$prescripcion
		], 201);
		return $response;
    }
    public function belongsToPaciente__($id)
    {
		$registros = [];
		$prescripcions = DB::table('prescripcions')
							->join('dietas', 'dietas.id', '=', 'prescripcions.dieta_id')
							->join('consultas', 'consultas.id', '=', 'dietas.consulta_id')
							->where('consultas.paciente_id', $id)
							->where('consultas.estado', 1)
							->select(
										'dietas.id as dieta_id', 
										'dietas.nombre as dieta_nombre', 
										'dietas.variacion_calorica', 
										'dietas.consulta_id as dieta_consulta_id', 
										'prescripcions.id', 'consultas.id as consulta_id',  
										'consultas.fecha', 
										'prescripcions.carbohidratos', 
										'prescripcions.proteinas', 
										'prescripcions.grasas')
							->orderBy('consultas.fecha', 'DESC')
							->get();
		/*return Helper::printResponse($prescripcions);*/
		if(count($prescripcions)>0){
			foreach($prescripcions as $prescripcion){
				$dieta['id']	=	$prescripcion->dieta_id;
				$dieta['nombre']	=	$prescripcion->dieta_nombre;
				$dieta['variacion_calorica']	=	$prescripcion->variacion_calorica;
				$detalle_prescripcion	=	DB::table('detalle_prescripcion')
												->join('prescripcions', 'prescripcions.id', '=', 'detalle_prescripcion.prescripcion_id')
												->where('prescripcions.id', $prescripcion->id)
												->select('detalle_prescripcion.*')
												->get();
				if(count($detalle_prescripcion)>0){
					$items	=	array_fill ( 0 , 13 , '' );
					foreach($detalle_prescripcion as $item)						
						$items[$item->grupo_alimento_nutricionista_id]	=	$item->porciones;

					$prescripcion->items	=	$items;
					
					$patron_menus = DB::table('patron_menus')
									->join('dietas', 'dietas.id', '=', 'patron_menus.dieta_id')
									->join('consultas', 'consultas.id', '=', 'dietas.consulta_id')
									->join('tiempo_comidas', 'tiempo_comidas.id', '=', 'patron_menus.tiempo_comida_id')
									->where('consultas.id', $prescripcion->consulta_id)
									->select('patron_menus.*', 'tiempo_comidas.id as tiempo_comida_id', 'tiempo_comidas.nombre as tiempo_comida_nombre')
									->orderBy('patron_menus.tiempo_comida_id', 'ASC')
									->get();

					$res[]	=	$patron_menus;
					if(count($patron_menus)>0){
						$tiempo_comidas	=	array();
						$ar		=	array();
						$keys	=	array();
						foreach($patron_menus as $key=>$item){
							if(!in_array($item->tiempo_comida_id, $keys)){
								/*$ar[]	=	$item;*/
								$keys[]	=	$item->tiempo_comida_id;						
/*								$tiempo_comidas[]	=	array($item->tiempo_comida_id	=>	$item->tiempo_comida_nombre);*/
								$tiempo_comidas[]	=	array(
															'id'	=>	$item->tiempo_comida_id,
															'nombre'=>	$item->tiempo_comida_nombre,
															'items'	=>	array_fill ( 0 , 13 , '' ) 
														);
							}
						}
						$items	=	[];
						foreach($patron_menus as $item){
							$key = array_search($item->tiempo_comida_id, array_column($tiempo_comidas, 'id'));
							$tiempo_comidas[$key]['items'][$item->grupo_alimento_nutricionista_id]	=	$item->porciones;
						}
						$prescripcion->patron_menu	=	$tiempo_comidas;
					}
				}
				$dieta['prescripcion']	=	$prescripcion;
				/*$registros[]	=	$prescripcion;*/
				/*$registros[$prescripcion->consulta_id][$prescripcion->dieta_id]	=	$dieta;*/
				$registros[$prescripcion->consulta_id][]	=	$dieta;
			}
		}	
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
    }
    public function belongsToPaciente($id)
    {
		$registros = [];
		$prescripcions = DB::table('prescripcions')
							->join('dietas', 'dietas.id', '=', 'prescripcions.dieta_id')
							->join('consultas', 'consultas.id', '=', 'dietas.consulta_id')
							->where('consultas.paciente_id', $id)
							->where('consultas.estado', 1)
							->select('dietas.id as dieta_id', 'dietas.nombre as dieta_nombre', 'dietas.variacion_calorica', 
									'dietas.consulta_id as dieta_consulta_id', 
									'prescripcions.id', 
									'consultas.id as consulta_id',  'consultas.fecha',  'consultas.notas', 'prescripcions.carbohidratos', 'prescripcions.proteinas', 'prescripcions.grasas')
							->orderBy('consultas.fecha', 'DESC')
							->orderBy('dietas.id', 'ASC')
							->get();
		/*Helper::_print($prescripcions);exit;*/
		if(count($prescripcions)>0){
			foreach($prescripcions as $prescripcion){
				$detalle_prescripcion	=	DB::table('detalle_prescripcion')
												->join('prescripcions', 'prescripcions.id', '=', 'detalle_prescripcion.prescripcion_id')
												->where('prescripcions.id', $prescripcion->id)
												->select('detalle_prescripcion.*')
												->get();
				if(count($detalle_prescripcion)>0){
					$items	=	array_fill ( 0 , 13 , '' );
					foreach($detalle_prescripcion as $item)						
						$items[$item->grupo_alimento_nutricionista_id]	=	$item->porciones;

					$prescripcion->items	=	$items;

					$patron_menus = DB::table('patron_menus')
									->join('dietas', 'dietas.id', '=', 'patron_menus.dieta_id')
									->join('consultas', 'consultas.id', '=', 'dietas.consulta_id')
									->join('tiempo_comidas', 'tiempo_comidas.id', '=', 'patron_menus.tiempo_comida_id')
									->where('consultas.id', $prescripcion->consulta_id)
									->select('patron_menus.*', 'tiempo_comidas.id as tiempo_comida_id', 'tiempo_comidas.nombre as tiempo_comida_nombre')
									->orderBy('patron_menus.tiempo_comida_id', 'ASC')
									->get();

					$res[]	=	$patron_menus;
					if(count($patron_menus)>0){
						$tiempo_comidas	=	array();
						$ar		=	array();
						$keys	=	array();
						foreach($patron_menus as $key=>$item){
							if(!in_array($item->tiempo_comida_id, $keys)){
								/*$ar[]	=	$item;*/
								$keys[]	=	$item->tiempo_comida_id;						
/*								$tiempo_comidas[]	=	array($item->tiempo_comida_id	=>	$item->tiempo_comida_nombre);*/
								$tiempo_comidas[]	=	array(
															'id'	=>	$item->tiempo_comida_id,
															'nombre'=>	$item->tiempo_comida_nombre,
															'items'	=>	array_fill ( 0 , 13 , '' ) 
														);
							}
						}
						$items	=	[];
						foreach($patron_menus as $item){
							$key = array_search($item->tiempo_comida_id, array_column($tiempo_comidas, 'id'));
							$tiempo_comidas[$key]['items'][$item->grupo_alimento_nutricionista_id]	=	$item->porciones;
						}
						$prescripcion->patron_menu	=	$tiempo_comidas;
					}
				}
				/*$registros[]	=	$prescripcion;*/
				/*$registros[$prescripcion->dieta_id]	=	$prescripcion;*/
				$registros[$prescripcion->consulta_id]['consulta_id']	=	$prescripcion->dieta_consulta_id;
				$registros[$prescripcion->consulta_id]['consulta_fecha']	=	$prescripcion->fecha;
				$registros[$prescripcion->consulta_id]['consulta_notas']	=	$prescripcion->notas;
				$registros[$prescripcion->consulta_id]['dietas'][]	=	$prescripcion;
			}
		}	
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
    }
	public function lastBelongsToPaciente($id)
    {
		$registros = [];
		$prescripcions = DB::table('prescripcions')
            ->join('dietas', 'dietas.id', '=', 'prescripcions.dieta_id')
            ->join('consultas', 'consultas.id', '=', 'dietas.consulta_id')
            ->where('consultas.paciente_id', $id)
            ->where('consultas.estado', 1)
            ->select('prescripcions.id', 'consultas.id as consulta_id',  'consultas.fecha', 'prescripcions.carbohidratos', 'prescripcions.proteinas', 'prescripcions.grasas')
			->orderBy('consultas.fecha', 'DESC')
			->get()
			->first();

		if(count($prescripcions)>0){
			$prescripcion	=	$prescripcions;
			$detalle_prescripcion	=	DB::table('detalle_prescripcion')
										->join('prescripcions', 'prescripcions.id', '=', 'detalle_prescripcion.prescripcion_id')
										->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'detalle_prescripcion.grupo_alimento_nutricionista_id')
										->where('prescripcions.id', $prescripcion->id)
										->get();
/*Helper::_print($detalle_prescripcion->toArray());/*exit;*/
			if(count($detalle_prescripcion)>0){
				$gan	=	GrupoAlimentoNutricionista::all();
				
				$_new_detalle_prescripcion	=	array();
				$aDetalle_prescripcion	=	$detalle_prescripcion->toArray();
/*
 [0] => stdClass Object
        (
            [id] => 1
            [prescripcion_id] => 3753
            [grupo_alimento_nutricionista_id] => 1
            [porciones] => 1.00
            [carbohidratos] => 0.00
            [proteinas] => 0.00
            [grasas] => 0.00
            [dieta_id] => 6003
            [nombre] => Leche Descremada
        )
*/
				foreach($gan as $gan_key=>$gan_item){
					$_row	=	array();
					$_row['nombre']	=	$gan_item['nombre'];
					$_row['grupo_alimento_nutricionista_id']	=	$gan_item['id'];
					$_row['porciones']	=	0;
					$found_key	=	array_search($gan_item['id'], array_column($aDetalle_prescripcion, 'grupo_alimento_nutricionista_id'));
					/*Helper::_print('$aDetalle_prescripcion[' . $found_key . ']');
					Helper::_print($aDetalle_prescripcion[$found_key]);*/
					if($found_key>-1){
						$_row['porciones']	=	$aDetalle_prescripcion[$found_key]->porciones;
					}
					$_new_detalle_prescripcion[]	=	(object) $_row;
				}
				/*Helper::_print($_new_detalle_prescripcion);*/
				
				$items	=	[];
				$leches	=	0;
				$carnes	=	0;
				foreach($_new_detalle_prescripcion as $key=>$item){
					if( in_array( $item->grupo_alimento_nutricionista_id, array( 1,2,3,7,8,9) ) ){
						if( in_array( $item->grupo_alimento_nutricionista_id, array(1,2,3) ) )
							$leches	+=	$item->porciones;
						else
							$carnes	+=	$item->porciones;
					}else{
						$row['nombre']				=	$item->nombre;
						$row['porciones']			=	$item->porciones;
						$items[]					=	$row;
					}
				}
				$row['nombre']			=	'Lacteos';
				$row['porciones']		=	$leches;
				$items[]				=	$row;
				$row['nombre']			=	'Carnes';
				$row['porciones']		=	$carnes;
				$items[]				=	$row;
				$prescripcion->items	=	$items;
			}
			$registros[]	=	$prescripcion;
		}
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
    }
	public function copy(Request $request){
		$consulta_id		=	$request->consulta_id;
		$dieta_id			=	$request->dieta_id;
		$prescripcion_id	=	$request->prescripcion_id;
		$result['prescripcion_id']		=	$prescripcion_id;
		$result['consulta_id']			=	$consulta_id;
		$result['dieta_id']			=	$dieta_id;
	/*public function copy($prescripcion_id, $consulta_id){*/
		/*$response	=	Response::json($request, 200, [], JSON_NUMERIC_CHECK);
		return $response;*/
		
		/*DB::beginTransaction();*/
/*
prescripcion_id	3756
consulta_id	6006
dieta_id	3756
*/
		try {
			/*	Borrar si existe prescripcion, patronmenu para esta consulta	*/
			$current_prescripcion	=	Prescripcion::find($prescripcion_id);
/*			if($current_prescripcion){
				$deletedRows 			=	DetalleDescripcion::where('prescripcion_id', $current_prescripcion->id)->delete();
				$deletedRows 			=	Prescripcion::find($current_prescripcion->id)->delete();
			}

			$deletedRows 			=	PatronMenuEjemplo::where('dieta_id', $dieta_id)->delete();
			$deletedRows 			=	PatronMenu::where('dieta_id',  $dieta_id)->delete();
*/
			$prescripcion					=	Prescripcion::find($prescripcion_id);
			$result['prescripcion']			=	$prescripcion;
		
			$new_prescripcion		=	new Prescripcion( array(
															'carbohidratos'	=>	$prescripcion->carbohidratos, 
															'proteinas'		=>	$prescripcion->proteinas, 
															'grasas'		=>	$prescripcion->grasas, 
															'dieta_id'	=>	$dieta_id
														) );
			$new_prescripcion->save();			
			$result['new_prescripcion']		=	$new_prescripcion;
			
			$detalle_prescripcion			=	DetalleDescripcion::where('prescripcion_id', $current_prescripcion->id)
												->get();
			$result['detalle_prescripcion']	=	$detalle_prescripcion;
			

			if($detalle_prescripcion){
				
				foreach($detalle_prescripcion as $item){
					$new_detalleDescripcion	=	new DetalleDescripcion(
							array(
								'prescripcion_id'					=>	$new_prescripcion->id, 
								'grupo_alimento_nutricionista_id'	=>	$item['grupo_alimento_nutricionista_id'], 
								'porciones'							=>	$item['porciones'], 
							)
						);
					$new_detalleDescripcion->save();
				}
			}
			/*print_r($new_detalleDescripcion);exit;*/
			/*$patron_menu					=	PatronMenu::where('consulta_id', $prescripcion->consulta_id)*/
			$patron_menu					=	PatronMenu::where('dieta_id', $current_prescripcion->dieta_id)
												->get();
			$result['Patron_menu']			=	$patron_menu;

			if($patron_menu){
				foreach($patron_menu as $key=>$item){				
						$new_patronMenu	=	PatronMenu::create([
											'dieta_id'						=>	$dieta_id,
											'tiempo_comida_id'					=>	$item['tiempo_comida_id'],
											'grupo_alimento_nutricionista_id'	=>	$item['grupo_alimento_nutricionista_id'],
											'porciones'							=>	$item['porciones']
										]);
						$new_patronMenu->save();							
				}
			}				
			$patron_menu_ejemplo			=	PatronMenuEjemplo::where('dieta_id', $dieta_id)
												->get();
			$result['Patron_menu_ejemplo']	=	$patron_menu_ejemplo;

			if($patron_menu_ejemplo){
				
				foreach($patron_menu_ejemplo as $key=>$item){
					$new_patronMenuEjemplo	=	PatronMenuEjemplo::create([
										'dieta_id'		=>	$dieta_id,
										'tiempo_comida_id'	=>	$item['tiempo_comida_id'],
										'ejemplo'			=>	$item['ejemplo']
									]);
					$new_patronMenuEjemplo->save();						
				}
			}
			
			/*DB::commit();*/
			$message	=	array(
							'code'		=> '201',
							'message'	=> 'Datos copiados correctamente'
						);
			
		} catch (\Exception $e) {
			/*DB::rollback();*/
			$message['error']	=	$e->getMessage();

		}
		$result['message']	=	$message;
		$response	=	Response::json($result, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	public function repeated(Request $request){
		try {
			$prescripcions	=	Prescripcion::All();
			if($prescripcions){
				$_repeated	=	array();
				$_no_repeated	=	array();
				$_key_id_repeated	=	array();
				$keys	=	array();
				/*echo '<pre>' . print_r($detalle_prescripcion,true) . '</pre>';*/
				foreach($prescripcions as $index=>$prescripcion){
					$detalle_prescripcions	=	DetalleDescripcion::where('prescripcion_id', $prescripcion->id)
													->get();
					if(count($detalle_prescripcions)==0)
						continue;

					$aFields	=	array();
					$keys[]		=	$prescripcion->id;
					
					foreach($detalle_prescripcions as $key=>$detalle_prescripcion){
						$_key	=	$detalle_prescripcion->prescripcion_id;
						$_key	.=	'-' . $detalle_prescripcion->grupo_alimento_nutricionista_id;
						$_key	.=	'-' . $detalle_prescripcion->porciones;
						if(isset($aFields[$_key]) && !in_array($detalle_prescripcion->prescripcion_id, $_repeated)){
							$_repeated[]	=	$detalle_prescripcion->prescripcion_id;
							$_rep['prescripcion_id']	=	$detalle_prescripcion->prescripcion_id;
							$_rep['id_repeat']			=	$detalle_prescripcion->id;
							$_key_id_repeated[]	=	$_rep;
						}else{
							/*if(!isset($aFields[$_key]) && !in_array($detalle_prescripcion->prescripcion_id, $_no_repeated))
								$_no_repeated[]	=	$detalle_prescripcion->prescripcion_id;*/
						}
						$aFields[$_key]	=	$_key;
					}
				}
				$result['summary_repetidos']=	$_key_id_repeated;
				$result['no_repetidos']		=	array_diff($keys, $_repeated);
				$result['repetidos']		=	$_repeated;
				/*$result['no_repetidos']	=	$_no_repeated;*/
			}
			
			/*foreach($result['summary_repetidos'] as $key=>$value){*/
/*				$_for_delete	=	DetalleDescripcion::where('prescripcion_id', $value['prescripcion_id'])
									  ->where('id', '>=', $value['id_repeat'])
									  ->get();
				
				if($_for_delete)
					$result['for_delete'][]	=	$_for_delete;
*/				
/*
				
				$deletedRows = DetalleDescripcion::where('prescripcion_id', $value['prescripcion_id'])
												  ->where('id', '>=', $value['id_repeat'])
												  ->delete();
				if($deletedRows)
					$result['deleted'][]	=	$prescripcion->id . ' - ' . $deletedRows;

*/
			/*}*/
			
						
			/*DB::commit();*/
			$message	=	array(
							'code'		=> '201',
							'message'	=> 'Datos copiados correctamente'
						);
			
		} catch (\Exception $e) {
			$message['error']	=	$e->getMessage();

		}
		$result['message']	=	$message;
		$response	=	Response::json($result, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
}
