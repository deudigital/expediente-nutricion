<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;

use App\Models\Persona;
use App\Models\Nutricionista;
use App\Models\ReportesFacturas;
use App\Models\Documento;
use App\Models\TiempoComida;
use DB;
use Mail;

class ReportesFacturasController extends Controller
{
    //
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
            ->select('personas.nombre',
                     'personas.cedula',
                     'documentos.id',
                     'documentos.consulta_id',
                     'documentos.nutricionista_id',
                     'documentos.persona_id',
                     'documentos.estado',
                     'documentos.fecha',
                     'documentos.medio_pago_id',
                     'documentos.pdf',
                     'documentos.numeracion_consecutiva',
                     'documentos.tipo_documento_id',
                     'documentos.monto_total as monto')  
            ->join('personas', 'documentos.persona_id', '=', 'personas.id')        
            ->where('nutricionista_id', '=',$id)
            ->get();
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
	public function getDocumentos__original($id)
    {
        try{
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
        if(count($registros)>0){
            $tiempoComidas	=	TiempoComida::where('nutricionista_id', $id)
								->orWhere('nutricionista_id','0')
								->select('*', DB::raw("'' as menu"), DB::raw("'' as ejemplo"), DB::raw("'' as summary"))
								->get();
			if($tiempoComidas)
				$registros['tiempo_comidas']	=	$tiempoComidas->toArray();

			$response = Response::json($registros, 200, [], JSON_NUMERIC_CHECK);			
        }else
            $response = Response::json(['message' => 'Record not found'], 204);
        return $response;
    }

    public function configFactura(Request $request)
    {
		$response   =   array(
			'message'   =>  'No se pudo actualizar la onfiguración, intente de nuevo',
		);
		if($request->input('id')){
			$nutricionista									=	Nutricionista::find($request->id);
			$nutricionista->nombre_comercial				=	$request->nombre_comercial;
			$nutricionista->atv_ingreso_id					=	$request->atv_ingreso_id;
			$nutricionista->atv_ingreso_contrasena			=	$request->atv_ingreso_contrasena;
			$nutricionista->atv_clave_llave_criptografica	=	$request->atv_clave_llave_criptografica;
			$nutricionista->save();
			
			$persona							=	Persona::find($request->id);
			$persona->tipo_idenfificacion_id	=	$request->tipo_idenfificacion_id;
			$persona->cedula					=	$request->cedula;
			$persona->nombre					=	$request->nombre;
			$persona->apartado_postal			=	$request->apartado_postal;
			$persona->telefono					=	$request->telefono;
			$persona->email						=	$request->email;
			$persona->ubicacion_id	=	$request->ubicacion_id;
			$persona->detalles_direccion	=	$request->detalles_direccion;
			$persona->save();
			$response['message']	=	'Su configuraciónd ha sido actualizado con exito';
			$response['persona']	=	$persona;
		}		
		$response	=	Response::json($response, 201);
		return $response;
    }
    public function configFactura__original(Request $request)
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

	$persona	=	Persona::find($request->id);

      $message    =   'Su configuraciónd ha sido actualizado con exito';
      $response   =   Response::json([
          'message'   =>  $message,
          'persona'   =>  $persona
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
            $filename = $cryptoKey->getClientOriginalName();
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

	public function updateMontoDocumentos(){
        try{
			$documentos	=	Documento::All();
			$registros	=	array();
			if(count($documentos)>0){
				
				foreach($documentos as $key=>$documento){
					$linea_detalles	=	DB::table('linea_detalles')
											->join('productos', 'productos.id', 'linea_detalles.producto_id')
											->where('linea_detalles.documento_id',  $documento->id)
											->get();
					$monto	=	0;
					$precios	=	array();
					foreach($linea_detalles as $linea_detalle){
						$monto	+=	$linea_detalle->precio;
						$precios[]	=	$linea_detalle->precio;
					}
					$row['documento_id']	=	$documento->id;
					$row['nutricionista_id']=	$documento->nutricionista_id;
					$row['monto']			=	$monto;
					
					DB::table('documentos')
							->where('id', $documento->id)
							->update(['monto_total' => $monto]);
							
					$registros[$documento->id]	=	$row;
				}				
			}
			$response   =   Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
        }
        catch (Illuminate\Database\QueryException $e) {
            dd($e);
        } catch (PDOException $e) {
            dd($e);
        }
        return $response;
    }
	public function documentoSinMonto(){
		$registros	=	Documento::Where('monto_total', 0)
						->get();;
		$response   =   Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
        return $response;
    }
	public function attachxmlemail($documento_id){
		$documento	=	Documento::find($documento_id);
		$info['file']		=	base64_decode( $documento->xml );		
		$info['filename']	=	$documento->clave . 'xml';
		$data	=	array();
		Mail::send('emails.test', $data, function($message) use ($info) {
			$bcc		=	explode(',', env('APP_EMAIL_BCC'));
			$subject	=	'testing xml attached';
			$message->subject( $subject );
			$message->to( 'jaime_isidro@hotmail.com', 'jaime web developer' );
			$message->from(env('APP_EMAIL_FROM'), env('APP_EMAIL_FROM_NAME'));
			$message->sender(env('APP_EMAIL_FROM'), env('APP_EMAIL_FROM_NAME'));
			$message->bcc($bcc);
			/*$message->attach($pdfPath);*/
			$message->attachData($info['file'], $info['filename'], [
                        'mime' => 'application/xml',
                    ]);
		});
		
		$response   =   Response::json(base64_decode( $documento->xml ), 200, [], JSON_NUMERIC_CHECK);
        return $response;
	}
}
