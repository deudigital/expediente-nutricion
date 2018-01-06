<?php

namespace App\Http\Controllers;

use App\ubicacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use DB;

class UbicationsController extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\ubicacion  $ubicacion
     * @return \Illuminate\Http\Response
     */
    public function show(ubicacion $ubicacion)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\ubicacion  $ubicacion
     * @return \Illuminate\Http\Response
     */
    public function edit(ubicacion $ubicacion)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ubicacion  $ubicacion
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ubicacion $ubicacion)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ubicacion  $ubicacion
     * @return \Illuminate\Http\Response
     */
    public function destroy(ubicacion $ubicacion)
    {
        //
    }

    public function getProvincia()
    {
      try{
          $ubicacion = DB::table('ubicacions')
            ->select('codigo_provincia','nombre_provincia')
            ->distinct()
            ->get();
              if(count($ubicacion)>0)
                  $response   =   Response::json($ubicacion, 200, [], JSON_NUMERIC_CHECK);
              else
                  $response   =   Response::json(['message' => 'Record not found'], 204);
      }
      catch (Illuminate\Database\QueryException $e) {
          dd($e);
      } catch (PDOException $e) {
          dd($e);
      }
      return $response;
    }

    public function getCanton($id)
    {
      try {
        $canton = DB::table('ubicacions')
          ->select('codigo_canton','nombre_canton')
          ->distinct()
          ->get();
          if(count($canton)>0)
              $response   =   Response::json($canton, 200, [], JSON_NUMERIC_CHECK);
          else
              $response   =   Response::json(['message' => 'Record not found'], 204);

      } catch (Illuminate\Database\QueryException $e) {
          dd($e);
      } catch (PDOException $e) {
          dd($e);
      }
      return $response;
    }
}
