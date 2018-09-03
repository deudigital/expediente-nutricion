<?php

namespace App\Http\Controllers;

use View;
use App\Documento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use DB;
use Mail;
use QRCode;
use App\Persona;
use App\Nutricionista;

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

    public function getUbicacion($ubicacion_id){
        $ubicacion =  DB::table('ubicacions')
                              ->where('ubicacions.id', '=', $ubicacion_id)->get();
        try{
            $ubicacion =  DB::table('ubicacions')
                              ->where('ubicacions.id', '=', $ubicacion_id)->get();
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

    public function deleteFactura(Request $request){
      try{
          DB::table('documentos')                              
          ->where('id', $request->id)
          ->update([
              'estado' => 0
          ]);

          $factura=array("ive"=>0.0,"descuento"=>0.0,"subtotal"=>0.0, "total"=> 0.0, "notas"=>"", "medio_nombre"=>"");
			$products = array();
			$nutricionista = DB::table('personas')
                            ->join('nutricionistas', 'personas.id', '=', 'nutricionistas.persona_id')
                            ->where('personas.id', '=', $request->nutricionista_id)
							->get();

          $nutricionista = $nutricionista->toArray();
          for($i = 0; $i < count($nutricionista); $i++){
              $nutricionista[$i] = json_decode(json_encode($nutricionista[$i]), True);
          }            

          $client =  DB::table('personas')
                     ->select('*')
                     ->where('id', '=', $request->persona_id)
                     ->get();                                                                            

          $client = $client->toArray();

          for($i = 0; $i < count($client); $i++){
              $client[$i] = json_decode(json_encode($client[$i]), True);
          }          

          $client_ubicacion =  DB::table('ubicacions')
                                      ->where('ubicacions.id', '=', $client[0]['ubicacion_id'])->get();

          for($i = 0; $i < count($client_ubicacion); $i++){
              $client_ubicacion[$i] = json_decode(json_encode($client_ubicacion[$i]), True);
          }

          $nutricionista_ubicacion =  DB::table('ubicacions')
                                      ->where('ubicacions.id', '=', $nutricionista[0]['ubicacion_id'])->get();

          $nutricionista_ubicacion = $nutricionista_ubicacion->toArray();

          for($i = 0; $i < count($nutricionista_ubicacion); $i++){
              $nutricionista_ubicacion[$i] = json_decode(json_encode($nutricionista_ubicacion[$i]), True);
          }

          $lineas_detalles = DB::table('linea_detalles')
                            ->where('documento_id', '=', $request->id)
                            ->get();          

          $lineas_detalles = $lineas_detalles->toArray();

          for($i = 0; $i < count($lineas_detalles); $i++){
              $lineas_detalles[$i] = json_decode(json_encode($lineas_detalles[$i]), True);
          }

          // Proceso para armar Numeracion Consecutiva perteneciente a la clave numérica
          $casa_matriz = '001';
          $terminal = '00001';
          $tipo = '03';
			$tipo_documento_id	=	3;
			$consecutivo_nutricionista	=	$this->getLastNumberConsecutive($request->nutricionista_id, $tipo_documento_id);


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
          $codigo_seguridad = mt_rand(10000000,99999999);
          $clave_numerica = $codigo_pais.$dia.$mes.$anno.$emisor_id.$numeracion_consecutiva.$situacion_comprobante.$codigo_seguridad;

          // Fin de proceso de Clave Numérica

          // Proceso para armar factura
          for($j=0; $j<count($lineas_detalles); $j++){
              $precio_u = DB::table('productos')
                          ->select('precio')
                          ->where('id', '=', $lineas_detalles[$j]["producto_id"])
                          ->get();
              $precio_u = $precio_u->toArray();
              
              $precio_u = json_decode(json_encode($precio_u),True);  
              $lineas_detalles[$j]["precio"] = $precio_u[0]["precio"];              
              $lineas_detalles[$j]["subtotal"] = $precio_u[0]["precio"] * $lineas_detalles[$j]["cantidad"];    
              $lineas_detalles[$j]["total"] = ($precio_u[0]["precio"] * $lineas_detalles[$j]["cantidad"]) + $lineas_detalles[$j]["impuesto_venta"] - $lineas_detalles[$j]["descuento"];      

              $factura["ive"] += $lineas_detalles[$j]["impuesto_venta"];
              $factura["descuento"] += $lineas_detalles[$j]["descuento"];
              $factura["subtotal"] += $precio_u[0]["precio"] *  $lineas_detalles[$j]["cantidad"];
              $factura["total"] += $lineas_detalles[$j]["total"];

              // Proceso para armar Productos
              $descripcion = DB::table('productos')
                            ->select('productos.descripcion', 'unidad_medidas.nombre', 'unidad_medidas.id')
                            ->join('unidad_medidas', 'unidad_medidas.id', '=','productos.unidad_medida_id')
                            ->where('productos.id', '=', $lineas_detalles[$j]["producto_id"])
                            ->get();

              $descripcion = $descripcion->toArray();

              for($i = 0; $i < count($descripcion); $i++){
                  $descripcion[$i] = json_decode(json_encode($descripcion[$i]), True);
              }      

              $lineas_detalles[$j]["descripcion"] = $descripcion[0]['descripcion'];
              $lineas_detalles[$j]["unidad_nombre"] = $descripcion[0]['nombre'];
              $lineas_detalles[$j]["unidad_medida"] = $descripcion[0]['id'];
              $lineas_detalles[$j]["impuesto"] = $lineas_detalles[$j]["impuesto_venta"];

              $products[$j] = $lineas_detalles[$j];              

              $medio_nombre = DB::table('medio_pagos')
                              ->select('nombre')
                              ->where('id', '=', $request->medio_pago_id)
                              ->get();                          

              $medio_nombre = $medio_nombre->toArray();

              for($i = 0; $i < count($medio_nombre); $i++){
                  $medio_nombre[$i] = json_decode(json_encode($medio_nombre[$i]), True);
              }

              $factura["medio_nombre"] = $medio_nombre[0]["nombre"];
              // Fin proceso 
          }
           
			$factura["notas"] = "Factura Anulada";
			// Fin proceso
			/*	
			* Se adicionó esto para corregir el error de eliminar Factura en Reportes
			*/
			$imagen_nutri = $nutricionista[0]["imagen"];
			if(empty($imagen_nutri)){
				$imagen_nutri	=	env('APP_URL') . '/images/logo.png';
			}
			view()->share('imagen', $imagen_nutri);
			view()->share('factura_numero', $numeracion_consecutiva);
			view()->share('nutricionista', $nutricionista[0]);
			view()->share('nutricionista_ubicacion', $nutricionista_ubicacion[0]);
			view()->share('client_ubicacion', $client_ubicacion[0]);
			view()->share('client', $client[0]);
			view()->share('factura', $factura);        
			view()->share('productos', $products);
			view()->share('fecha', date("d/m/Y"));
			view()->share('code',urlencode(\Storage::disk('deletePdf')->url($consecutivo_nutricionista."-".$request->nutricionista_id.".pdf")) );

			\PDF::loadView('templates.invoice')->save(\Storage::disk('deletePdf')->getDriver()->getAdapter()->getPathPrefix().$consecutivo_nutricionista."-".$request->nutricionista_id.".pdf")
										->stream('download.pdf');
			$PDF_ = \Storage::disk('deletePdf')->url($consecutivo_nutricionista."-".$request->nutricionista_id.".pdf");

			date_default_timezone_set("America/Chicago");
			$hoy = date("Y-m-d H:i:s");   

			$nota_credito_id = DB::table('documentos')->insertGetId(
				  [
				   'clave'                     => $clave_numerica,
				   'numeracion_consecutiva'    => $consecutivo_nutricionista,
				   'fecha'                     => $hoy,
				   'tipo_documento_id'         => 3,
				   'medio_pago_id'             => $request->medio_pago_id,
				   'persona_id'                => $request->persona_id,
				   'nutricionista_id'          => $request->nutricionista_id,
				   'consulta_id'               => $request->consulta_id,
				   'notas'                     => 'Factura Anulada',
				   'pdf'                       => $PDF_,
				   'estado'                    => 1,
				   'referencia'                => $request->id
				  ]
			);

			for($i=0; $i<count($lineas_detalles); $i++){
				$products[$i]["numero_linea"] = $i+1;
				$result = DB::table('linea_detalles')->insert(
					['documento_id'     => $nota_credito_id,
					 'numero_linea'     => $lineas_detalles[$i]['numero_linea'],
					 'producto_id'      => $lineas_detalles[$i]['producto_id'],
					 'cantidad'         => $lineas_detalles[$i]['cantidad'],
					 'descuento'        => $lineas_detalles[$i]["descuento"],
					 'impuesto_venta'   => $lineas_detalles[$i]["impuesto_venta"]
					]
				);
			}
		  $this->notificarPorCorreo($nota_credito_id, $numeracion_consecutiva);
        } catch(Illuminate\Database\QueryException $e) {
            dd($e);
        } catch(PDOException $e) {
            dd($e);
        }
        $result = self::makeXML($codigo_seguridad, $nota_credito_id, $nutricionista, $client[0]["nombre"], $nutricionista_ubicacion[0], $products, $factura, $request->id, "03");
        $message    =   'Su factura ha sido anulada con exito';
        $response   =   Response::json([
            'message'   =>  $message,
            'data'		=> $nota_credito_id
        ], 200);
        return $response;
    }

    public function generarFactura(Request $request){
		try{
			$client = $request->client;
			$products = $request->productos;
			$factura = $request->factura;
			$nutricionista = DB::table('personas')                            
								->join('nutricionistas', 'personas.id', '=', 'nutricionistas.persona_id')
								->where('personas.id', '=', $request->nutricionista_id)->get();

			$nutricionista = $nutricionista->toArray();

			for($i = 0; $i < count($nutricionista); $i++){
				$nutricionista[$i] = json_decode(json_encode($nutricionista[$i]), True);
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
			$tipo_documento_id			=	1;
			$consecutivo_nutricionista	=	$this->getLastNumberConsecutive($request->nutricionista_id, $tipo_documento_id);

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
			$codigo_seguridad = mt_rand(10000000,99999999);
			$clave_numerica = $codigo_pais.$dia.$mes.$anno.$emisor_id.$numeracion_consecutiva.$situacion_comprobante.$codigo_seguridad;
			// Fin de proceso de Clave Numérica
			// Verificación de existencia de Productos
			$index_product = 0;
			for($j=0; $j<count($products); $j++){
				if(!isset($products[$j]["id"])){              
					$new_product = $products[$j];
					$index_product = $j;
				}
			}
			// Fin de Verificación de existencia de Productos
			// Guardar producto en caso de no existir dentro de la DB
			if(isset($new_product)){
				$new_product["nutricionista_id"] = $request->nutricionista_id;

				try{
					$result = DB::table('productos')->insertGetId(
						[
						 'descripcion'      => $new_product["descripcion"],
						 'unidad_medida_id'    => $new_product["unidad_medida"],
						 'precio'           => $new_product["precio"],
						 'nutricionista_id' => $new_product["nutricionista_id"]
						]
					  );

				$products[$index_product]["id"] = $result;

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

        $imagen_nutri = $nutricionista[0]["imagen"];
        if(empty($imagen_nutri)|| $imagen_nutri==null){
			$imagen_nutri	=	env('APP_URL') . '/images/logo.png';
        }

        view()->share('imagen', $imagen_nutri);
        view()->share('factura_numero', $numeracion_consecutiva);
        view()->share('nutricionista', $nutricionista[0]);
        view()->share('nutricionista_ubicacion', $nutricionista_ubicacion[0]);
        view()->share('client_ubicacion', $client_ubicacion[0]);
        view()->share('client', $client);
        view()->share('factura', $factura);
        view()->share('productos', $products);
        view()->share('fecha', date("d/m/Y"));
        view()->share('code',urlencode(\Storage::disk('makePdf')->url($consecutivo_nutricionista."-".$request->nutricionista_id.".pdf")) );

        \PDF::loadView('templates.invoice')->save(\Storage::disk('makePdf')->getDriver()->getAdapter()->getPathPrefix().$consecutivo_nutricionista."-".$request->nutricionista_id.".pdf")
                                           ->stream('download.pdf');
        $PDF_ = \Storage::disk('makePdf')->url($consecutivo_nutricionista."-".$request->nutricionista_id.".pdf");
        // Proceso de almacenamiento de factura en la BD
         date_default_timezone_set("America/Chicago");
         $hoy = date("Y-m-d H:i:s");          

		try{
			$documento_id = DB::table('documentos')->insertGetId(
                        [
                         'clave'                     => $clave_numerica,
                         'numeracion_consecutiva'    => $consecutivo_nutricionista,
                         'fecha'                     => $hoy,
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
			$products[$i]["numero_linea"] = $i+1;
			try{
				$result = DB::table('linea_detalles')->insertGetId(
					  [
					   'documento_id'   => $documento_id,
					   'numero_linea'   => $i+1,
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
		$this->notificarPorCorreo($documento_id, $numeracion_consecutiva);
        // Fin de proceso de creacion de lineas de detalle
		$result = self::makeXML($codigo_seguridad, $documento_id, $nutricionista, $client["nombre"], $nutricionista_ubicacion[0], $products, $factura, "", "01");
		$response   =   Response::json(['message' => 'Proceso de facturacion finalizado exitosamente.', 'data' => $result], 200);
		return $response;
    }
    function makeXML($codigo_seguridad, $documento, $nutricionista, $cliente_nombre, $ubicacion, $productos, $factura, $referencia, $tipo){
		$documento = DB::table('documentos')
						  ->where('id', '=', $documento)->get();

		$documento = $documento->toArray();
		for($i = 0; $i < count($documento); $i++){
			$documento[$i] = json_decode(json_encode($documento[$i]), True);
		}
		$url = env('API_URL_FE');
		$date = date("Y-m-d");
		$hora = date("H:i:s");
		$fecha = $date."T".$hora."-06:00";
		$clave = [];
		$clave["sucursal"] = "1";
		$clave["terminal"] = "1";
		$clave["tipo"] = $tipo;
		$clave["comprobante"] = $documento[0]["numeracion_consecutiva"];
		$clave["pais"] = "506";
		$clave["dia"] = date("d"); 
		$clave["mes"] = date("m"); // mes fecha de factura
		$clave["anno"] = date("y"); // año fecha de factura
		$clave["situacion_presentacion"] = "1";
		$clave["codigo_seguridad"] = "".$codigo_seguridad;// codigo de seguridad

		$encabezado = [];
		$encabezado["fecha"] = $fecha;
		$encabezado["condicion_venta"] = "01";
		$encabezado["plazo_credito"] = "0";
		$encabezado["medio_pago"] = "0".$documento[0]["medio_pago_id"]; 

		$emisor = [];
		$emisor["nombre"] = $nutricionista[0]["nombre"];
		$emisor["identificacion"] = [];
		$emisor["identificacion"]["tipo"] = "0".$nutricionista[0]["tipo_idenfificacion_id"];
		$emisor["identificacion"]["numero"] = "".$nutricionista[0]["cedula"];

		$emisor["nombre_comercial"] = $nutricionista[0]["nombre_comercial"]; 

		$emisor["ubicacion"] = [];
		$emisor["ubicacion"]["provincia"] = $ubicacion["codigo_provincia"];
		$emisor["ubicacion"]["canton"] = $ubicacion["codigo_canton"];
		$emisor["ubicacion"]["distrito"] = $ubicacion["codigo_distrito"];
		$emisor["ubicacion"]["barrio"] = $ubicacion["codigo_barrio"];
		$emisor["ubicacion"]["sennas"] = $nutricionista[0]["detalles_direccion"];

		$emisor["telefono"] = [];
		$emisor["telefono"]["cod_pais"] = "506"; 
		$emisor["telefono"]["numero"] = $nutricionista[0]["telefono"];

		$emisor["correo_electronico"] = $nutricionista[0]["email"];

		$receptor = [];
		$receptor["nombre"] = $cliente_nombre;       

		$detalle = []; //armar detalle

		$impuesto = [];

		$total_servicio_gravado = 0;
		$total_servicio_exento = 0;

		for($i=0; $i<count($productos); $i++){
			$detalle[$i]["numero"] = "".$productos[$i]["numero_linea"];
			$detalle[$i]["cantidad"] = "".$productos[$i]["cantidad"];      	

			$unit_result = DB::table('unidad_medidas')
							  ->select("codigo")
							  ->where('id', '=', $productos[$i]["unidad_medida"])->get();

			$unit_result = $unit_result->toArray();
			for($j = 0; $j < count($unit_result); $j++){
				$unit_result[$j] = json_decode(json_encode($unit_result[$j]), True);
			}
			$detalle[$i]["unidad_medida"] = $unit_result[0]["codigo"];
			$detalle[$i]["detalle"] = $productos[$i]["descripcion"];
			$detalle[$i]["precio_unitario"] = "".$productos[$i]["precio"];
			$detalle[$i]["monto_total"] = "".($productos[$i]["precio"] * $productos[$i]["cantidad"]);
			if ($productos[$i]["descuento"] > 0) {
				$detalle[$i]["descuento"] = "".$productos[$i]["descuento"];
			}else{
				$detalle[$i]["descuento"] = "";
			}
			if($productos[$i]["impuesto"] > 0){
				$total_servicio_gravado += $detalle[$i]["monto_total"];
			}else{
				$total_servicio_exento += $detalle[$i]["monto_total"];
			}
			if($productos[$i]["descuento"] > 0){
				$detalle[$i]["naturaleza_descuento"] = "Descuento General";
			}else{
				$detalle[$i]["naturaleza_descuento"] = "";
			}
			$detalle[$i]["subtotal"] = "".($detalle[$i]["monto_total"] - $productos[$i]["descuento"]); 

			if ($productos[$i]["impuesto"] > 0) {
				$impuesto["codigo"] = "01";
				$impuesto["tarifa"] = "13.00";
				$impuesto["monto"] = "".$productos[$i]["impuesto"];
				$detalle[$i]["impuestos"][0] = $impuesto;
				$detalle[$i]["montototallinea"] ="". ($productos[$i]["subtotal"] + $detalle[$i]["impuestos"][0]['monto']);
			}else{
				$detalle[$i]["montototallinea"] ="". $productos[$i]["subtotal"];
			}
		}
		$resumen = [];
		$resumen["moneda"] = "CRC";
		$resumen["totalserviciogravado"] = "".$total_servicio_gravado;
		$resumen["totalservicioexento"] = "".$total_servicio_exento;
		$resumen["totalmercaderiagravado"] = "0";
		$resumen["totalmercaderiaexento"] = "0";
		$resumen["totalexento"] = "".$resumen["totalservicioexento"];
		$resumen["totalgravado"] = "".$resumen["totalserviciogravado"];
		$resumen["totalventa"] = "".($resumen["totalgravado"] + $resumen["totalexento"]);
		$resumen["totaldescuentos"] = "".$factura["descuento"];
		$resumen["totalventaneta"] = "".($resumen["totalventa"] - $resumen["totaldescuentos"]);
		$resumen["totalimpuestos"] = "".$factura["ive"];
		$resumen["totalcomprobante"] = "".($resumen["totalventaneta"] + $resumen["totalimpuestos"]);
		$otros = []; 
		$otros[0]["codigo"]="";
		$otros[0]["texto"]="";
		$otros[0]["contenido"]="";
		$datos_referencia = [];
		$json_data = [];      

		if($referencia != ""){
			$datos_referencia[0]["tipo_documento"] = "01";
			$datos_referencia[0]["numero_documento"] = "".$documento[0]["clave"];
			$datos_referencia[0]["fecha_emision"] = $fecha;
			$datos_referencia[0]["codigo"] = "01";
			$datos_referencia[0]["razon"] = "Anulacion Factura";
			$json_data["referencia"] = $datos_referencia;
		}
		$json_data["api_key"] = $nutricionista[0]['token'];
		$json_data["clave"] = $clave;
		$json_data["encabezado"] = $encabezado;
		$json_data["emisor"] = $emisor;
		$json_data["receptor"] = $receptor;
		$json_data["detalle"] = $detalle;
		$json_data["resumen"] = $resumen;
		$json_data["otros"] = $otros;
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
		$result= json_decode($result);
		try{
	      DB::table('documentos')
	        ->where('id', $documento[0]["id"])
	        ->update([
	            'clave' => $result->clave, 
	            'xml' => $result->data            
	        ]);
	    } catch(Illuminate\Database\QueryException $e) {
			dd($e);
        } catch(PDOException $e) {
			dd($e);
        }
		return json_encode($json_data);
    }
	function notificarPorCorreo($nota_credito_id, $numeracion_consecutiva){
		$nota_credito = DB::table('documentos')
						->join('personas', 'personas.id', '=', 'documentos.persona_id')
						->where('documentos.id', $nota_credito_id)
						->select('personas.nombre as nombre_persona', 'personas.email', 'documentos.*')
						->first();

		$nutricionista	=	Persona::find($nota_credito->nutricionista_id);	
		$nutricionista2	= Nutricionista::find($nota_credito->nutricionista_id);
			$url	=	'https://expediente.nutricion.co.cr/';
		if (empty($nutricionista2->imagen)) {
			$images  = $url . 'mail/images/logo.png';
		}else{
			$images = $nutricionista2->imagen;
		}
		$pdf	=	$url;  
/*
		$html	=	'<div style="text-align:center;margin-bottom:20px">';
		$html	.=	'<img src="' . $images . '" width="180" />';
		$html	.=	'</div>';
		$html	.=	'<p>' . $nota_credito->nombre_persona . ', </p>';
*/
		$template	=	'';
		switch($nota_credito->tipo_documento_id){
			case 1:
				$subject 	=	'Se ha enviado la Factura electrónica Nº ' . $numeracion_consecutiva . ' de la cuenta de ' . $nutricionista->nombre;
				$template	=	'factura';
/*
				$html	.=	'<p>Ha recibido la Factura Electr&oacute;nica : ';
				$html	.=	'N&deg; ' . $numeracion_consecutiva . ' de la cuenta de ' . $nutricionista->nombre . '.  ';
				$html	.=	'Puede verla y descargarla del siguiente enlace:</p>';			
				$html	.=	'<p><a href="' . $nota_credito->pdf . '">click aqui para ver la factura</a></p>';
*/
				break;
			case 3:
				$subject 	=	'Se ha enviado la Nota de Crédito Nº ' . $numeracion_consecutiva . ' de la cuenta de ' . $nutricionista->nombre;
				$template	=	'nota_credito';
/*
				$html	.=	'Ha recibido la Nota de Cr&eacute;dito (anulaci&oacute;n de factura): ';
				$html	.=	'N&deg; ' . $numeracion_consecutiva . ' de la cuenta de ' . $nutricionista->nombre . '. ';
				$html	.=	'Puede verla y descargarla del siguiente enlace:</p>';
				$html	.=	'<a href="' . $nota_credito->pdf . '">click aqui para ver la nota de cr&eacute;dito</a>';
*/
			break;
		}
/*
		$to			=	$nota_credito->email;
		$headers 	=	'From: info@nutricion.co.cr' . "\r\n";
		$headers   .=	'CC: ' . $nutricionista->email . "\r\n";
		$headers   .=	'Bcc: danilo@deudigital.com,jaime@deudigital.com, inv_jaime@yahoo.com' . "\r\n";
		$headers   .=	'MIME-Version: 1.0' . "\r\n";
		$headers   .=	'Content-Type: text/html; charset=ISO-8859-1' . "\r\n";
		mail($to, $subject, utf8_decode($html), $headers);
*/
		$data	=	array(
							'numeracion'			=>	$numeracion_consecutiva, 
							'nombre_persona'		=>	$nota_credito->nombre_persona, 
							'nombre_nutricionista'	=>	$nutricionista->nombre, 
							'pdf'					=>	$nota_credito->pdf, 
							'logo'					=>	$images
						);
		Mail::send('emails.' . $template . '_notificacion', $data, function($message) {
			$message->to($nota_credito->email, $nota_credito->nombre_persona);
			$message->subject($subject);			
			$message->from(env('EMAIL_FROM'), env('EMAIL_FROM_NAME'));
			$message->cc( $nutricionista->email );
			$message->bcc(env('EMAIL_BCC'));
			$message->replyTo(env('EMAIL_REPLYTO'));
		});
	}
	public function guardarPaciente(Request $request){
		try {
			$persona = DB::table('personas')->insertGetId(
												[
													'tipo_idenfificacion_id' => $request->tipo_idenfificacion_id,
													'cedula' => $request->cedula,
													'nombre' => $request->nombre,
													'genero' => $request->genero,
													'telefono' => $request->telefono,
													'email' => $request->email,
													'ubicacion_id' => $request->ubicacion_id,
													'detalles_direccion' => $request->detalles_direccion
												]
											);

			$cliente = DB::table('clientes')->insertGetId(
														[
															'persona_id'=>$persona,
															'nutricionista_id' => $request->nutricionista_id,
															'tipo_identificacion_id' => $request->tipo_idenfificacion_id
														]
													);
		} catch(Illuminate\Database\QueryException $e) {
			dd($e);
		} catch(PDOException $e) {
			dd($e);
		}
		$response   =   Response::json(['message' => 'Proceso de guardado de persona-cliente finalizado exitosamente.',
		'persona'=> $persona,
		'cliente'=>$cliente], 200);
		return $response;
	}
	public function getLastNumberConsecutive($nutricionista_id, $tipo_documento_id){
		$return	=	1;
		$response	=	DB::table('documentos')
							->where('nutricionista_id', '=', $nutricionista_id)
							->where('tipo_documento_id', '=', $tipo_documento_id)
							->orderBy('numeracion_consecutiva', 'DESC')
							->first();     

		if($response)
			$return	=	$response->numeracion_consecutiva + 1;

		return $return;
	}
}
