<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\PatronMenu;
use App\PatronMenuEjemplo;
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
    {
		/*$response	=	Response::json($request->all(), 200, []);
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
			$deletedRows = PatronMenuEjemplo::where('consulta_id', $request->consulta_id)->delete();
			
			foreach($tiempos as $key=>$item){
				if($item['tiempo_id']<1)
					continue ;
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
		$registros	=	DB::table('patron_menus')
							->join('consultas', 'consultas.id', '=', 'patron_menus.consulta_id')
							->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'patron_menus.grupo_alimento_nutricionista_id')
							->join('tiempo_comidas', 'tiempo_comidas.id', '=', 'patron_menus.tiempo_comida_id')
							->where('consultas.paciente_id', $id)
							->select('patron_menus.tiempo_comida_id', 'tiempo_comidas.nombre as tiempo_comida_nombre', 'patron_menus.grupo_alimento_nutricionista_id as grupo_alimento_id', 'grupo_alimento_nutricionistas.nombre as grupo_alimento_nombre', 'patron_menus.porciones', DB::Raw('IFNULL(patron_menus.ejemplo, \'\') as ejemplo'))
							->orderBy('tiempo_comida_id', 'ASC')
							->get();
		
		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json(['message' => 'Records not found'], 204);

		return $response;
	}
}
