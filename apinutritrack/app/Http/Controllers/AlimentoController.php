<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

use App\Models\Alimento;
use App\Models\CategoriaAlimento;
use App\Models\IndiceGlicemico;

use DB;

class AlimentoController extends Controller
{
    //
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
