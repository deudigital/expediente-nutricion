<?php

namespace App\Http\Controllers;

use App\ReportesFacturas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use DB;

class ReportesFacturasController extends Controller
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
     * @param  \App\ReportesFacturas  $reportesFacturas
     * @return \Illuminate\Http\Response
     */
    public function show(ReportesFacturas $reportesFacturas)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\ReportesFacturas  $reportesFacturas
     * @return \Illuminate\Http\Response
     */
    public function edit(ReportesFacturas $reportesFacturas)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\ReportesFacturas  $reportesFacturas
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ReportesFacturas $reportesFacturas)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ReportesFacturas  $reportesFacturas
     * @return \Illuminate\Http\Response
     */
    public function destroy(ReportesFacturas $reportesFacturas)
    {
        //
    }

    public function getTipo_Documento(){
        try{
            $tipos = DB::table('tipo_documentos')
              ->select('*')
              ->get();
                if(count($tipos)>0)
                    $response   =   Response::json($tipos, 200, [], JSON_NUMERIC_CHECK);
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

    public function getDocumentos($id)
    {
        try{

        $facturas = DB::table('documentos')
          ->join('personas', 'personas.id', '=', 'documentos.persona_id')
          ->leftjoin('productos','productos.id', '=', 'documentos.consulta_id')
          ->where('documentos.nutricionista_id', $id)       
          ->get();

          $result = [];
          $facturas = DB::table('documentos')  
            ->select('personas.nombre',
                     'documentos.id',
                     'documentos.consulta_id',
                     'documentos.nutricionista_id',
                     'documentos.persona_id',
                     'documentos.estado',
                     'documentos.fecha',
                     'documentos.medio_pago_id',
                     'documentos.pdf',
                     'documentos.numeracion_consecutiva',
                     'documentos.tipo_documento_id')  
            ->join('personas', 'documentos.persona_id', '=', 'personas.id')        
            ->where('nutricionista_id', '=',$id)
            ->get();

          $facturas = $facturas->toArray();

          for ($i=0; $i < count($facturas) ; $i++) {

            $facturas[$i] = json_decode(json_encode($facturas[$i]),True);            
            $facturas[$i]["monto"] = 0;

            $lineas = DB::table('linea_detalles')
              ->select('*')
              ->where('documento_id', '=', $facturas[$i]["id"])
              ->get();

            $lineas=$lineas->toArray();

            $lineas = json_decode(json_encode($lineas),True);

            for($j=0; $j<count($lineas); $j++){
                $precio_u = DB::table('productos')
                            ->select('precio')
                            ->where('id', '=', $lineas[$j]["producto_id"])
                            ->get();
                $precio_u = $precio_u->toArray();
                
                $precio_u = json_decode(json_encode($precio_u),True);                 
                $lineas[$j]["total"] = ($precio_u[0]["precio"] * $lineas[$j]["cantidad"]) + $lineas[$j]["impuesto_venta"] - $lineas[$j]["descuento"];
                $facturas[$i]["monto"] += $lineas[$j]["total"];
            }
          }            

            if(count($facturas)>0)
                $response   =   Response::json($facturas, 200, [], JSON_NUMERIC_CHECK);
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

    public function getDataNutricionista($id){
        $registros = DB::table('nutricionistas')
            ->join('personas', 'personas.id', '=', 'nutricionistas.persona_id')
            ->where('nutricionistas.persona_id', $id)
            ->get();
        if(count($registros)>0)
            $response = Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
        else
            $response = Response::json(['message' => 'Record not found'], 204);
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
            'nombre' => $request->nombre,
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



      $message    =   'Su configuraciónd ha sido actualizado con exito';
      $response   =   Response::json([
          'message'   =>  $message
      ], 201);
      return $response;
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

    public function uploadAvatar($id,Request $request){
        if($request->hasFile("avatar")) {   //  ALWAYS FALSE !!!!
             $avatar = $request->file("avatar");
             $filename = "logo_". $id . "." . $avatar->getClientOriginalExtension();
             \Storage::disk('logos')->put($filename,  \File::get($avatar));
             try {
               DB::table('nutricionistas')
                ->where('persona_id',$id)
                ->update([
                  'imagen'=>\Storage::disk('logos')->url($filename)
                ]);
             } catch(Illuminate\Database\QueryException $e) {
                 dd($e);
             } catch(PDOException $e) {
                 dd($e);
             }

             $message    =   'Avatar Agregado';
             $response   =   Response::json([
                 'message'   =>  $message
             ], 201);
             return $response;
         }

         return response()->json(['message' => "Error_setAvatar: No file provided !"], 200);
      }

    public function uploadCrypto($id, Request $request){
        if ($request->hasFile("cryptoKey")) {
            $cryptoKey = $request->file('cryptoKey');
            $filename = "key_". $id .".". $cryptoKey->getClientOriginalExtension();
            \Storage::disk('cryptoKey')->put($filename,\File::get($cryptoKey));
            try {
                DB::table('nutricionistas')
                    ->where('persona_id',$id)
                    ->update([
                        'atv_llave_criptografica' => \Storage::disk('cryptoKey')->url($filename)
                    ]);
            } catch(Illuminate\Database\QueryException $e) {
                 dd($e);
             } catch(PDOException $e) {
                 dd($e);
             }
             $message    =   'Llave Criptografica Agregada';
             $response   =   Response::json([
                 'message'   =>  $message
             ], 201);
             return $response;
        }        
         return response()->json(['message' => "Error_setAvatar: No file provided !"], 200);
    }
}
