<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\PatronMenu;
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
		$items	=	$request->all();
		/*$response	=	Response::json($items, 200, [], JSON_NUMERIC_CHECK);
		return $response;*/
		$n	=	count($items);
		$datos	=	array();
		for($i=1;$i<$n;$i++){
			if(count($items[$i])>0){
				foreach($items[$i] as $key=>$item){
					if(empty($item))
						continue ;
					/*$patronMenu	=	PatronMenu::create([
								'grupo_alimento_nutricionista_id'	=>	$key,
								'tiempo_comida_id'					=>	$i,
								'consulta_id'						=>	100,
								'porciones'							=>	$item,						
								'ejemplo'							=>	'ejemplo'						
							]);*/
					$patronMenu	=	[
							/*	datos personales	*/
								'consulta_id'						=>	100,
								'tiempo_comida_id'					=>	$i,
								'grupo_alimento_nutricionista_id'	=>	$key,
								'porciones'							=>	$item,						
								'ejemplo'							=>	'ejemplo'						
							];
					$datos[]	=	$patronMenu;
				}
			}
		}
		//$response	=	Response::json($request->all(), 200, [], JSON_NUMERIC_CHECK);
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
