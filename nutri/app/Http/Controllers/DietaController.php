<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\PatronMenu;
use App\PatronMenuEjemplo;
use App\TiempoComida;
use App\Consulta;
use App\Paciente;
use App\Prescripcion;
use App\DetalleDescripcion;
use App\OtrosAlimento;
use App\Helper;
use App\Dieta;
use DB;

class DietaController extends Controller
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

    public function storeNewDieta(Request $request)
    {       
        Dieta::create([
            'nombre' 		=>	$request['nombre'],
            'valoracion_calorica' 		=>	$request['valoracion_calorica'],
            'consulta_id'	=>	$request['consulta_id'],
        ]);
		
		$message	=	array(
							'code'		=> '201',
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {/*$response	=	Response::json($request, 200, [], JSON_NUMERIC_CHECK);
		return $response;*/
		$items	=	$request->items;
		if($items){
			$datos	=	array();			
			/*$deletedRows = PatronMenu::where('consulta_id', $request->consulta_id)->delete();*/
			$deletedRows = PatronMenu::where('dieta_id', $request->dieta_id)->delete();
					
			foreach($items as $key=>$item){
				foreach($item['porciones'] as $alimento=>$porciones){
					if(empty($porciones))
						continue ;

					/*$patronMenu	=	PatronMenu::create([
										'consulta_id'						=>	$request->consulta_id,
										'tiempo_comida_id'					=>	$item['tiempo_id'],
										'grupo_alimento_nutricionista_id'	=>	$alimento,
										'porciones'							=>	$porciones,
									]);*/
					$patronMenu	=	PatronMenu::create([
										'dieta_id'							=>	$request->dieta_id,
										'tiempo_comida_id'					=>	$item['tiempo_id'],
										'grupo_alimento_nutricionista_id'	=>	$alimento,
										'porciones'							=>	$porciones,
									]);
					$datos[]	=	$patronMenu;
					$patronMenu->save();
				}			
			}	
		}
		$tiempos	=	$request->tiempos;
		if($tiempos){
			$datos	=	array();			
			/*$deletedRows = PatronMenuEjemplo::where('consulta_id', $request->consulta_id)->delete();*/
			
			foreach($tiempos as $key=>$item){
				if($item['tiempo_id']<1)
					continue ;
				/*$deletedRows = PatronMenuEjemplo::where('consulta_id', $request->consulta_id)
												->where('tiempo_comida_id', '=', $item['tiempo_id'])
												->delete();*/
				$deletedRows = PatronMenuEjemplo::where('dieta_id', $request->dieta_id)
												->where('tiempo_comida_id', '=', $item['tiempo_id'])
												->delete();
				/*$patronMenuEjemplo	=	PatronMenuEjemplo::create([
									'consulta_id'		=>	$request->consulta_id,
									'tiempo_comida_id'	=>	$item['tiempo_id'],
									'ejemplo'			=>	$item['ejemplo']
								]);*/
				$patronMenuEjemplo	=	PatronMenuEjemplo::create([
									'dieta_id'		=>	$request->dieta_id,
									'tiempo_comida_id'	=>	$item['tiempo_id'],
									'ejemplo'			=>	$item['ejemplo']
								]);
				$datos[]	=	$patronMenuEjemplo;
				$patronMenuEjemplo->save();
						
			}	
		}
		
		$items	=	array();
		$patronMenu	=	PatronMenu::where('dieta_id', $request->dieta_id)
									->get();
		if(count($patronMenu)>0)
			$items['patron_menu']	=	$patronMenu->toArray();

		$patronMenuEjemplos	=	DB::table('patron_menu_ejemplos')
									->where('dieta_id',$request->dieta_id)
									->orderBy('tiempo_comida_id', 'ASC')
									->get();

		if(count($patronMenuEjemplos)>0)
			$items['patron_menu_ejemplos']	=	$patronMenuEjemplos->toArray();
				
				
		$result	=	array(
						'dieta_id'	=>	$request->dieta_id,
						'items'	=>	$items
					);
		
		/*$response	=	Response::json($datos, 200, [], JSON_NUMERIC_CHECK);*/
		$response	=	Response::json($result, 200, [], JSON_NUMERIC_CHECK);
		return $response;		
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
		function belongsToPaciente($id){				
		$consulta	=	Consulta::where('paciente_id', $id)
								->where('estado', '1')
								->orderBy('fecha', 'DESC')
								->get()
								->first();		
		if(!$consulta)
			return	Response::json(['message' => 'Records not exist'], 204);

		$tiempoComidas	=	TiempoComida::all();
		$_tiempo_comidas	=	array();
		if(count($tiempoComidas)>0){
			$aTiempoComidas	=	$tiempoComidas->toArray();			
			foreach($aTiempoComidas as $key=>$value){
				$_tiempo_comidas[$value['id']]['tiempo_comida_id']		=	$value['id'];
				$_tiempo_comidas[$value['id']]['tiempo_comida_nombre']	=	$value['nombre'];
				$_tiempo_comidas[$value['id']]['ejemplo']				=	'';
				$_tiempo_comidas[$value['id']]['alimentos']				=	array();
			}
		}
		$patronMenuEjemplo	=	PatronMenuEjemplo::where('consulta_id', $consulta->id)
									->get();
		
		if(count($patronMenuEjemplo)>0){
			$aPatronMenuEjemplo	=	$patronMenuEjemplo->toArray();
			foreach($aPatronMenuEjemplo as $key=>$value)
				$_tiempo_comidas[$value['tiempo_comida_id']]['ejemplo']	=	$value['ejemplo'];
		}

		$patronMenu	=	DB::table('patron_menus')
							->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'patron_menus.grupo_alimento_nutricionista_id')
							->join('tiempo_comidas', 'tiempo_comidas.id', '=', 'patron_menus.tiempo_comida_id')
							->where('patron_menus.consulta_id', $consulta->id)
							->select('patron_menus.*', 'grupo_alimento_nutricionistas.nombre as alimento' )
							->orderBy('patron_menus.tiempo_comida_id', 'ASC')
							->get();
		if(count($patronMenu)>0){
			$aPatronMenu	=	$patronMenu->toArray();
			foreach($aPatronMenu as $key=>$value){
				$_tiempo_comidas[$value->tiempo_comida_id]['alimentos'][]	=	array(
																					'grupo_alimento_id'		=>	$value->grupo_alimento_nutricionista_id,
																					'grupo_alimento_nombre'	=>	$value->alimento,
																					'porciones'				=>	$value->porciones
																				);
			}
		}
		$registros	=	array();
		if($_tiempo_comidas){			
			foreach($_tiempo_comidas as $tiempo=>$value)
				$registros[]	=	$value;
		}
		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json(['message' => 'Records not found'], 204);

		return $response;
	}
	function patronmenuBelongsToPaciente($id){
		$consulta	=	Consulta::where('paciente_id', $id)
								->where('estado', '1')
								->orderBy('fecha', 'DESC')
								->get()
								->first();
		if(!$consulta)
			return	Response::json(['message' => 'Records not exist'], 204);

		$paciente	=	Paciente::find($id);
		/*$tiempoComidas	=	TiempoComida::where('nutricionista_id','199')
								->orWhere('nutricionista_id','0')
								->get();*/
		$tiempoComidas	=	Helper::getTiposComida($paciente->nutricionista_id);
		$_tiempo_comidas	=	array();
		if(count($tiempoComidas)>0){
			$aTiempoComidas	=	$tiempoComidas->toArray();			
			foreach($aTiempoComidas as $key=>$value){
				$_tiempo_comidas[$value['id']]['tiempo_comida_id']		=	$value['id'];
				$_tiempo_comidas[$value['id']]['tiempo_comida_nombre']	=	$value['nombre'];
				$_tiempo_comidas[$value['id']]['ejemplo']				=	'';
				$_tiempo_comidas[$value['id']]['alimentos']				=	array();
			}
		}
		$patronMenuEjemplo	=	PatronMenuEjemplo::where('consulta_id', $consulta->id)
									->get();
		
		if(count($patronMenuEjemplo)>0){
			$aPatronMenuEjemplo	=	$patronMenuEjemplo->toArray();
			foreach($aPatronMenuEjemplo as $key=>$value){
				if(isset($_tiempo_comidas[$value['tiempo_comida_id']]))
					$_tiempo_comidas[$value['tiempo_comida_id']]['ejemplo']	=	$value['ejemplo'];
			}
		}

		$patronMenu	=	DB::table('patron_menus')
							->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'patron_menus.grupo_alimento_nutricionista_id')
							->join('tiempo_comidas', 'tiempo_comidas.id', '=', 'patron_menus.tiempo_comida_id')
							->where('patron_menus.consulta_id', $consulta->id)
							->select('patron_menus.*', 'grupo_alimento_nutricionistas.nombre as alimento' )
							->orderBy('patron_menus.tiempo_comida_id', 'ASC')
							->get();
		if(count($patronMenu)>0){
			$aPatronMenu	=	$patronMenu->toArray();
			foreach($aPatronMenu as $key=>$value){
				$_tiempo_comidas[$value->tiempo_comida_id]['alimentos'][]	=	array(
																					'grupo_alimento_id'		=>	$value->grupo_alimento_nutricionista_id,
																					'grupo_alimento_nombre'	=>	$value->alimento,
																					'porciones'				=>	$value->porciones
																				);
			}
		}
		$registros	=	array();
		if($_tiempo_comidas){
			foreach($_tiempo_comidas as $tiempo=>$value){
				if(!empty($value['ejemplo']) || count($value['alimentos'])>0 )
					$registros[]	=	$value;
			}
		}
		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json(['message' => 'Records not found'], 204);

		return $response;
	}
    public function storeDietas(Request $request)
    {
		/*return Helper::printResponse($request->dietas);*/
		if(!$request->consulta_id)
			return	Response::json(['message' => 'Consulta No Exite'], 204);
		if(!$request->dietas)
			return	Response::json(['message' => 'Dietas No Registradas'], 204);
		
		foreach($request->dietas as $key=>$dieta){
			
			/*Helper::_print($dieta);*/
			/*return Helper::printResponse($dieta['id']);*/
			if($dieta['id']){
				/*Helper::_print('editando-' . $dieta['id']);*/
				$_dieta	=	Dieta::find($dieta['id']);
				/*return Helper::printResponse($_dieta->nombre);*/
				$_dieta->nombre		=	$dieta['nombre'];
				$_dieta->variacion_calorica=	$dieta['variacion_calorica'];
				$_dieta->save();
			}else{
				/*Helper::_print('nuevo-' . $dieta['id']);*/
				 Dieta::create([
					'nombre' 				=>	$dieta['nombre'],
					'variacion_calorica'	=>	$dieta['variacion_calorica'],
					'consulta_id'			=>	$request->consulta_id
				]);
			}
		}
		
		$registros	=	array();
		$aDietas	=	array();
		$dietas		=	Dieta::where('consulta_id', $request->consulta_id)
										->get();

		/*return Helper::printResponse($dietas);*/
		if(count($dietas)>0){
			foreach($dietas as $dieta){
				$items	=	array();
				$items['dieta_id']	=	$dieta->id;
				$items['nombre']	=	$dieta->nombre;
				$items['variacion_calorica']	=	$dieta->variacion_calorica;
				$prescripcion	=	Prescripcion::where('dieta_id', $dieta->id)
									->get()
									->first();
				
				if(count($prescripcion)>0){
					$items['prescripcion']	=	$prescripcion->toArray();
					$detalleDescripcion	=	DB::table('detalle_prescripcion')
												->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'detalle_prescripcion.grupo_alimento_nutricionista_id')
												->where('detalle_prescripcion.prescripcion_id',$prescripcion->id)
												->orderBy('grupo_alimento_nutricionistas.id', 'ASC')
												->get();
					if(count($detalleDescripcion)>0){
						$items['prescripcion']['items']	=	$detalleDescripcion->toArray();
					}
					$items['prescripcion']['otros']	=	array();
					$otrosAlimento	=	OtrosAlimento::where('prescripcion_id', $prescripcion->id)
													->get();
					if(count($otrosAlimento)>0){
						$items['prescripcion']['otros']	=	$otrosAlimento->toArray();
					}
				}
				$patronMenu	=	PatronMenu::where('dieta_id', $dieta->id)
									->get();
				if(count($patronMenu)>0)
					$items['patron_menu']	=	$patronMenu->toArray();
					
		//										->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'detalle_prescripcion.grupo_alimento_nutricionista_id')
				$patronMenuEjemplos	=	DB::table('patron_menu_ejemplos')
											->where('dieta_id',$dieta->id)
											->orderBy('tiempo_comida_id', 'ASC')
											->get();

				if(count($patronMenuEjemplos)>0)
					$items['patron_menu_ejemplos']	=	$patronMenuEjemplos->toArray();

				if(count($items)>0)
				$registros['dieta'][]	=	$items;

			}
		}
		
		$message	=	array(
							'code'		=> '201',
							'message'	=> 'Se ha registrado correctamente',
							'dietas'	=>	$registros['dieta']
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
}
