<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\PatronMenu;
use App\PatronMenuEjemplo;
use App\TiempoComida;
use App\Consulta;
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
			$deletedRows = PatronMenu::where('consulta_id', $request->consulta_id)->delete();
					
			foreach($items as $key=>$item){
				foreach($item['porciones'] as $alimento=>$porciones){
					if(empty($porciones))
						continue ;

					$patronMenu	=	PatronMenu::create([
										'consulta_id'						=>	$request->consulta_id,
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
				$deletedRows = PatronMenuEjemplo::where('consulta_id', $request->consulta_id)
												->where('tiempo_comida_id', '=', $item['tiempo_id'])
												->delete();
				$patronMenuEjemplo	=	PatronMenuEjemplo::create([
									'consulta_id'		=>	$request->consulta_id,
									'tiempo_comida_id'	=>	$item['tiempo_id'],
									'ejemplo'			=>	$item['ejemplo']
								]);
				$datos[]	=	$patronMenuEjemplo;
				$patronMenuEjemplo->save();
						
			}	
		}
		$response	=	Response::json($datos, 200, [], JSON_NUMERIC_CHECK);
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

}
