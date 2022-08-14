<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;

use App\Models\CategoriaAlimento;

class CategoriaAlimentoController extends Controller
{
    //
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
		$categorias	=	CategoriaAlimento::all();
		$response	=	Response::json($categorias, 200, [], JSON_NUMERIC_CHECK);
		return $response;
    }
}
