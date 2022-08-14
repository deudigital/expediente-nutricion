<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;

use App\Models\ubicacion;
use DB;

class UbicacionController extends Controller
{
    //
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
