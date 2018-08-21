<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Alimento;
use App\CategoriaAlimento;
use App\IndiceGlicemico;
use DB;

class AlimentoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
		$alimentos	=	Alimento::All();
		$registros	=	array();
		if(count($alimentos)>0){
			foreach($alimentos as $key=>$value){
				$alimento	=	$value;
				$composicion = DB::table('alimento_grupos')
									->join('grupo_alimentos', 'grupo_alimentos.id', '=', 'alimento_grupos.grupo_alimento_id')
									->where('alimento_grupos.alimento_id',  $value->id)
									->get();

				$alimento['composicion']	=	$composicion->toArray();
				$registros[]	=	$alimento;
			}
		}
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
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
	
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function categorias(){
		$registros	=	CategoriaAlimento::All();
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
    }
    public function categoriasbyid($id){
		$alimentos	=	Alimento::where('categoria_alimento_id', $id)
						->get();

		$registros	=	array();
		if(count($alimentos)>0){
			foreach($alimentos as $key=>$value){
				$alimento	=	$value;
				$composicion = DB::table('alimento_grupos')
									->join('grupo_alimentos', 'grupo_alimentos.id', '=', 'alimento_grupos.grupo_alimento_id')
									->where('alimento_grupos.alimento_id',  $value->id)
									->get();

				$alimento['composicion']	=	$composicion->toArray();
				$registros[]	=	$alimento;				
			}
		}
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
    }
}
