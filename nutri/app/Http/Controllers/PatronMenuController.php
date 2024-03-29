<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\PatronMenu;
use App\Consulta;
use DB;

class PatronMenuController extends Controller
{
   /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $registros	=	PatronMenu::all();
		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json('Sin Datos', 204);

		return $response;
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
        //
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
	public function duplicados()
    {
		$result	=	array();
		/*$consultas	=	Consulta::All();*/
		$consultas	=	DB::table('consultas')
						->join('pacientes', 'pacientes.persona_id', '=', 'consultas.paciente_id')
						->get();
		if($consultas){
			foreach($consultas as $key=>$consulta){
				/*$consulta->PatronMenu	=	PatronMenu::where('consulta_id', $consulta->id)->get();*/
				$patronMenu	=	PatronMenu::where('consulta_id', $consulta->id)->get();
				$aPatronMenu	=	array();
				foreach($patronMenu as $pmkey=>$pmvalue){
					/*$aPatronMenu[$pmvalue->tiempo_comida_id][]	=	$pmvalue->grupo_alimento_nutricionista_id . ' - ' . $pmvalue->porciones;*/
					$aPatronMenu[$pmvalue->tiempo_comida_id][]	=	$pmvalue->grupo_alimento_nutricionista_id;
				}
				$aDuplicados	=	array();
				foreach($aPatronMenu as $pmkey=>$pmvalue){					
					$resultado = array_unique($pmvalue);
					if(count($pmvalue)>count($resultado))					
						$aDuplicados[$pmkey]	=	implode(',', $pmvalue);
				}
				if(count($aDuplicados)>0){
					/*$consulta->PatronMenu	=	$aPatronMenu;*/
					/*$result[$consulta->id]	=	$aDuplicados;*/
					$result[$consulta->nutricionista_id][$consulta->id . ' - ' . $consulta->estado]	=	$aDuplicados;
				}
			}
			$response	=	Response::json($result, 200, [], JSON_NUMERIC_CHECK);
			return $response;
			
		}
/*
		$patronMenu	=	DB::table('patron_menus')
							->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'patron_menus.grupo_alimento_nutricionista_id')
							->join('tiempo_comidas', 'tiempo_comidas.id', '=', 'patron_menus.tiempo_comida_id')
							->where('patron_menus.consulta_id', $consulta->id)
							->select('patron_menus.*', 'grupo_alimento_nutricionistas.nombre as alimento' )
							->orderBy('patron_menus.tiempo_comida_id', 'ASC')
							->get();
*/
    }
}
