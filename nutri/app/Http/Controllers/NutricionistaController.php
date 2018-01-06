<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Nutricionista;
use DB;
class NutricionistaController extends Controller
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
		/*$registros	=	Nutricionista::find($id);*/
		$registros = DB::table('nutricionistas')
            ->join('personas', 'personas.id', '=', 'nutricionistas.persona_id')
            ->where('nutricionistas.persona_id', $id)
            ->get();
		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json(['message' => 'Record not found'], 204);

		/*$response	=	Response::json($response, 200, [], JSON_NUMERIC_CHECK);*/
		return $response;
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

    public function getTipoId()
    {
      try {
        $tipos=DB::table('tipo_identificacions')
        ->select('*')
        ->get();
        if(count($tipos)>0)
            $response   =   Response::json($tipos, 200, [], JSON_NUMERIC_CHECK);
        else
            $response   =   Response::json(['message' => 'Record not found'], 204);

      } catch(Illuminate\Database\QueryException $e) {
          dd($e);
      } catch(PDOException $e) {
          dd($e);
      }
      return $response;
    }

    public function configFactura(Request $request)
    {
      try {
        DB::table('nutricionistas')
          ->where('persona_id',$request->id)
          ->update([
            'nombre_comercial' => $request->nombre_comercial,
            'atv_ingreso_id' => $request->atv_ingreso_id,
            'atv_ingreso_contrasena' => $request->atv_ingreso_contrasena,
            'atv_clave_llave_criptografica' => $request->atv_clave_llave_criptografica
          ]);

      } catch(Illuminate\Database\QueryException $e) {
          dd($e);
      } catch(PDOException $e) {
          dd($e);
      }
      try {
        DB::table('personas')
          ->where('id',$request->id)
          ->update([
            'tipo_idenfificacion_id' => $request->tipo_idenfificacion_id,
            'cedula' => $request->cedula,
            'apartado_postal' => $request->apartado_postal,
            'telefono' => $request->telefono,
            'email' => $request->email,
            'ubicacion_id' => $request->ubicacion_id,
            'detalles_direccion' => $request->detalles_direccion
          ]);

      } catch(Illuminate\Database\QueryException $e) {
          dd($e);
      } catch(PDOException $e) {
          dd($e);
      }



      $message    =   'Su producto ha sido actualizado con exito';
      $response   =   Response::json([
          'message'   =>  $message
      ], 201);
      return $response;
    }

    public function uploadAvatar($id,Request $request){
      if($request->hasFile("avatar")) {   //  ALWAYS FALSE !!!!
           $avatar = $request->file("avatar");
           $filename = time() . "." . $avatar->getClientOriginalExtension();
           \Storage::disk('local')->put($filename,  \File::get($avatar));
           return response()->json(['message' => "Avatar added !"], 200);
       }

       return response()->json(['message' => "Error_setAvatar: No file provided !"], 200);
    }
}
