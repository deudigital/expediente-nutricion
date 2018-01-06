<?php

namespace App\Http\Controllers;

use View;
use App\Documento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use DB;

class FacturaController extends Controller
{

    /**
     * Handle all invoice operations, except by the invoices report
     *
     * @param  int  $id
     * @return Response
     */

    public function getConsultasSinFacturar($id)
    {        
        try{
            $consultas = DB::table('pacientes')
                        ->select('consultas.id', 'consultas.fecha', 'personas.nombre', 'pacientes.persona_id')
                        ->join('consultas', 'pacientes.persona_id', '=', 'consultas.paciente_id')
                        ->join('nutricionistas', 'pacientes.nutricionista_id', '=', 'nutricionistas.persona_id')
                        ->join('personas', 'pacientes.persona_id', '=', 'personas.id')
                        ->where('nutricionistas.persona_id','=',$id)
                        ->where('consultas.estado', '=', 1)->get();

            $consultas = $consultas->toArray();

            $consultas_a_eliminar = [];

            for($i = 0; $i < count($consultas); $i++){
                $consultas[$i] = json_decode(json_encode($consultas[$i]), True);
            }                    

            $documentos = DB::table('documentos')
                          ->select('id', 'consulta_id')                          
                          ->where('nutricionista_id', '=', $id)->get();

            $documentos = $documentos->toArray();
            
            for($i = 0; $i < count($documentos); $i++){
                $documentos[$i] = json_decode(json_encode($documentos[$i]), True);
            }

            for($i = 0; $i<count($consultas); $i++){
                for($j = 0; $j<count($documentos); $j++){
                    if($documentos[$j]['consulta_id'] == $consultas[$i]['id']){
                        array_push($consultas_a_eliminar,$i);
                    }
                }
            }

            for($i = 0; $i<count($consultas_a_eliminar); $i++){
                unset($consultas[$consultas_a_eliminar[$i]]);
            }                    

            $response   =   Response::json($consultas, 200, [], JSON_NUMERIC_CHECK);            
        }
        catch (Illuminate\Database\QueryException $e) {
            dd($e);
        } catch (PDOException $e) {
            dd($e);
        }
        return $response;
    }

    public function getTiposIdentificacion(){
        try{
            $tipos = DB::table('tipo_identificacions')
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

    public function getPaciente($nutricionista_id, $persona_id){
        try{
            $clientes = DB::table('clientes')
                        ->select('personas.id',
                                 'personas.apartado_postal',
                                 'personas.canton',
                                 'personas.cedula',
                                 'personas.celular',
                                 'personas.detalles_direccion',
                                 'personas.distrito',
                                 'personas.email',
                                 'personas.fecha_nac',
                                 'personas.genero',
                                 'personas.nombre',
                                 'personas.provincia',
                                 'personas.telefono',
                                 'personas.tipo_idenfificacion_id',
                                 'personas.ubicacion_id')
                        ->join('nutricionistas', 'clientes.nutricionista_id', '=', 'nutricionistas.persona_id')
                        ->join('personas', 'personas.id', '=', 'clientes.persona_id')
                        ->where('nutricionista_id','=',$nutricionista_id)->get();

            $clientes = $clientes->toArray();

            for($i = 0; $i < count($clientes); $i++){
                $clientes[$i] = json_decode(json_encode($clientes[$i]), True);
            }      

            for($i = 0; $i<count($clientes); $i++){
               if($clientes[$i]['id'] == $persona_id){
                    $response = Response::json($clientes[$i], 200, [], JSON_NUMERIC_CHECK);   
                    return $response; 
                }
            } 
            $response = Response::json('No existe el cliente seleccionado para el actual nutricionista', 200);                                                
        }catch (Illuminate\Database\QueryException $e) {
            dd($e);
        } catch (PDOException $e) {
            dd($e);
        }
        return $response;
    }

    public function getMediosPagos(){
      try{
            $medios = DB::table('medio_pagos')
                        ->select('*')->get();

            if(count($medios)>0)
                    $response   =   Response::json($medios, 200, [], JSON_NUMERIC_CHECK);
                else
                    $response   =   Response::json(['message' => 'Record not found'], 204);                                             
        }catch (Illuminate\Database\QueryException $e) {
            dd($e);
        } catch (PDOException $e) {
            dd($e);
        }
        return $response;
    }

    public function generarFactura(Request $request){
      try{
          $client = $request->client;          

          $products = $request->productos;          

          $factura = $request->factura;          

          $documentos = DB::table('documentos')                          
                          ->where('nutricionista_id', '=', $request->nutricionista_id)->get();    
          
          $documentos = $documentos->toArray();            

          for($i = 0; $i < count($documentos); $i++){
              $documentos[$i] = json_decode(json_encode($documentos[$i]), True);
          }                      

          $nutricionista = DB::table('personas')
                            ->select('personas.cedula', 'personas.nombre', 'personas.ubicacion_id', 'personas.detalles_direccion', 'personas.telefono', 'personas.email')                            
                            ->where('personas.id', '=', $request->nutricionista_id)->get();
          
          $nutricionista = $nutricionista->toArray();           

          for($i = 0; $i < count($nutricionista); $i++){
              $nutricionista[$i] = json_decode(json_encode($nutricionista[$i]), True);
          } 

          $nutricionista_ATV = DB::table('nutricionistas')
                                ->select('atv_ingreso_id', "atv_ingreso_contrasena")                            
                                ->where('persona_id', '=', $request->nutricionista_id)->get();

          $nutricionista_ATV = $nutricionista_ATV->toArray();           

          for($i = 0; $i < count($nutricionista_ATV); $i++){
              $nutricionista_ATV[$i] = json_decode(json_encode($nutricionista_ATV[$i]), True);
          }                                

          $nutricionista_ubicacion =  DB::table('ubicacions')
                                      ->where('ubicacions.id', '=', $nutricionista[0]['ubicacion_id'])->get();  

          $nutricionista_ubicacion = $nutricionista_ubicacion->toArray();           

          for($i = 0; $i < count($nutricionista_ubicacion); $i++){
              $nutricionista_ubicacion[$i] = json_decode(json_encode($nutricionista_ubicacion[$i]), True);
          }

          $client_ubicacion =  DB::table('ubicacions')
                                      ->where('ubicacions.id', '=', $client['ubicacion_id'])->get();                

          for($i = 0; $i < count($client_ubicacion); $i++){
              $client_ubicacion[$i] = json_decode(json_encode($client_ubicacion[$i]), True);
          } 


          // Proceso para armar Numeracion Consecutiva perteneciente a la clave numérica
          $casa_matriz = '001';
          $terminal = '00001';
          $tipo = '01';
          $ultimo_consecutivo = $documentos[count($documentos)-1]["numeracion_consecutiva"];
          $array_ultimo_consecutivo = str_split($ultimo_consecutivo);
          $ultimo_digito_consecutivo = $array_ultimo_consecutivo[count($array_ultimo_consecutivo)-1];          
          $consecutivo_nutricionista = $ultimo_consecutivo.$ultimo_digito_consecutivo+1;

          $ceros_agregar = 10-count(str_split($consecutivo_nutricionista));
          $ceros = "";

          for($i=0; $i<$ceros_agregar; $i++){
            $ceros .= '0';
          }

          $numeracion_consecutiva = $casa_matriz.$terminal.$tipo.$ceros.$consecutivo_nutricionista;

          // Fin prceso de Numeracion Consecutiva

          // Proceso para armar Clave Numérica
          $codigo_pais = '506';
          $fecha = date("Y-m-d");
          $array_fecha =  explode('-', $fecha);
          $array_year = str_split($array_fecha[0]);
          $dia = $array_fecha[2];
          $mes = $array_fecha[1];
          $anno = $array_year[2].$array_year[3];

          $ceros_agregar = 12-count(str_split($nutricionista[0]["cedula"]));
          $ceros = "";

          for($i=0; $i<$ceros_agregar; $i++){
            $ceros .= '0';
          }

          $emisor_id = $ceros.$nutricionista[0]["cedula"];
          $situacion_comprobante = '1';
          $codigo_seguridad = mt_rand(100000,999999);
          $clave_numerica = $codigo_pais.$dia.$mes.$anno.$emisor_id.$numeracion_consecutiva.$situacion_comprobante.$codigo_seguridad;         

          // Fin de proceso de Clave Numérica

          // Verificación de existencia de Productos
          for($j=0; $j<count($products); $j++){
            if(!isset($products[$j]["id"])){
              $new_product = $products[$j];                
            }
          }
          // Fin de Verificación de existencia de Productos

          // Verificar existencia de usuario en API externo antes de guardar datos en DB            
            /*if(!isset($nutricionista_ATV[0]['atv_ingreso_id']) || !isset($nutricionista_ATV[0]['atv_ingreso_contrasena'])){
              $response   =   Response::json(['message' => 'No se puede validar, por favor configure su usuario'], 200); 
              return $response;
            }

            $verificationResult = self::verifyUser($nutricionista_ATV[0]['atv_ingreso_id'], $nutricionista_ATV[0]['atv_ingreso_contrasena']);

            if(!$verificationResult){
              $response   =   Response::json(['message' => 'No se puede validar, por favor configure su usuario'], 200); 
              return $response;
            }*/
          // Fin verificacion

          // Guardar producto en caso de no existir dentro de la DB
          if(isset($new_product)){
            $new_product["nutricionista_id"] = $request->nutricionista_id;

            try{            
              $result = DB::table('productos')->insert(
                        [
                         'descripcion'      => $new_product["descripcion"], 
                         'unidad_medida'    => $new_product["unidad_medida"], 
                         'precio'           => $new_product["precio"],
                         'nutricionista_id' => $new_product["nutricionista_id"]
                        ]
                      );
            } catch(Illuminate\Database\QueryException $e) {
                dd($e);
            } catch(PDOException $e) {
                dd($e);
            }                 
          }       
          // Fin de guardado                                                     
        }catch (Illuminate\Database\QueryException $e) {
            dd($e);
        } catch (PDOException $e) {
            dd($e);
        }

        if(!isset($factura['notas'])){
          $factura['notas']="";
        }

        view()->share('nutricionista', $nutricionista[0]);  
        view()->share('nutricionista_ubicacion', $nutricionista_ubicacion[0]);  
        view()->share('client_ubicacion', $client_ubicacion[0]);
        view()->share('client', $client);
        view()->share('factura', $factura);
        view()->share('productos', $products);
        view()->share('fecha', date("d/m/Y"));

        $env_route = "C:/Users/Jesus Soto/Dropbox/Freelance/Expediente Nutricion (320$)/expediente-nutricion/nutri";

        \PDF::loadView('templates.invoice')->save($env_route."/public/invoices/".$consecutivo_nutricionista."-".$request->nutricionista_id.".pdf")
                                           ->stream('download.pdf');
        $PDF_ = $env_route."/public/invoices/".$consecutivo_nutricionista."-".$request->nutricionista_id.".pdf";

        // Proceso de almacenamiento de factura en la BD
          try{            
              $documento_id = DB::table('documentos')->insertGetId(
                        [
                         'clave'                     => $clave_numerica, 
                         'numeracion_consecutiva'    => $consecutivo_nutricionista, 
                         'fecha'                     => date("Y-m-d"),
                         'tipo_documento_id'         => 1,
                         'medio_pago_id'             => $factura['medio'],
                         'persona_id'                => $client['id'],
                         'nutricionista_id'          => $request->nutricionista_id,
                         'consulta_id'               => $request->consulta,
                         'notas'                     => $factura['notas'],
                         'pdf'                       => $PDF_,
                         'estado'                    => 1
                        ]
                      );
            } catch(Illuminate\Database\QueryException $e) {
                dd($e);
            } catch(PDOException $e) {
                dd($e);
            } 
        // Fin del proceso del almacenamiento de factura en la BD                

        // Proceso creacion de lineas de detalle
          for($i=0; $i<count($products); $i++)  {
            try{            
                $result = DB::table('linea_detalles')->insertGetId(
                          [
                           'documento_id'   => $documento_id, 
                           'numero_linea'   => $i,
                           'producto_id'    => $products[$i]['id'],
                           'cantidad'       => $products[$i]['cantidad'],
                           'descuento'      => $products[$i]['descuento'],
                           'impuesto_venta' => $products[$i]['impuesto']
                           
                          ]
                        );
              } catch(Illuminate\Database\QueryException $e) {
                  dd($e);
              } catch(PDOException $e) {
                  dd($e);
              } 
          }
        // Fin de proceso de creacion de lineas de detalle

       $response   =   Response::json(['message' => 'Proceso de facturacion finalizado exitosamente.'], 200); 
       return $response;
    }

    function makeXML(){

    }

    function verifyUser($user, $password){
      $url = 'https://www.facturaenlineacr.com/api/client.php?action=verify_user';
      $json_data = [];
      $json_data["api_key"] = "-dYSrMCCTX0";
      // Ambiente de prueba staging
      $json_data["frm_ws_ambiente"] = "c3RhZw==";

      $json_data["frm_usuario"] = $user;
      $json_data["frm_password"] = $password;

      $options = array(
          'http' => array(
              'header'  => "Content-Type: application/json\r\n" .
                            "Accept: application/json\r\n",
              'method'  => 'POST',
              'content' => json_encode($json_data)
          )
      );

    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    print_r($result);

    if ($result === FALSE) { 
      return false;
    }
    return false;
  }
}