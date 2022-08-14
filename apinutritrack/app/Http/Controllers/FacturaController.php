<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;

use App\Models\Documento;
use App\Models\Persona;
use App\Models\Nutricionista;
use App\Models\Helper;
use View;
use QRCode;
use DB;
use Mail;

class FacturaController extends Controller
{
    //

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
/*
          DB::table('documentos')                              
			  ->where('id', $request->id)
			  ->update([
				  'estado' => 0
			  ]);
*/

			$documento_elim			=	Documento::find( $request->id );
			$documento_elim->timestamps	= false;
			$documento_elim->estado	=	0;
			$documento_elim->save();

			$factura	=	array(
								'ive'			=>	0.0,
								'descuento'		=>	0.0,
								'subtotal'		=>	0.0,
								'total'			=>	0.0,
								'notas'			=>	'', 
								'medio_nombre'	=>	''
							);
			$products	=	array();
			$nutricionista	=	DB::table('personas')
									->join('nutricionistas', 'personas.id', '=', 'nutricionistas.persona_id')
									->where('personas.id', '=', $request->nutricionista_id)
									->get();

			$nutricionista	=	$nutricionista->toArray();
			for($i = 0; $i < count($nutricionista); $i++){
				$nutricionista[$i]	=	json_decode(json_encode($nutricionista[$i]), True);
			}
			$client =  DB::table('personas')
						 ->select('*')
						 ->where('id', '=', $request->persona_id)
						 ->get();                                                                            

			$client	=	$client->toArray();

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
			$lineas_detalles	=	DB::table('linea_detalles')
										->where('documento_id', '=', $request->id)
										->get();

			$lineas_detalles	=	$lineas_detalles->toArray();
			for($i = 0; $i < count($lineas_detalles); $i++){
				$lineas_detalles[$i] = json_decode(json_encode($lineas_detalles[$i]), True);
			}
			// Proceso para armar Numeracion Consecutiva perteneciente a la clave numérica
			$casa_matriz				=	'001';
			$terminal					=	'00001';
			$tipo						=	'03';
			$tipo_documento_id			=	3;
			$consecutivo_nutricionista	=	$this->getLastNumberConsecutive($request->nutricionista_id, $tipo_documento_id);
			$ceros_agregar	=	10-count(str_split($consecutivo_nutricionista));
			$ceros	= '';
			for($i=0; $i<$ceros_agregar; $i++){
				$ceros	.=	'0';
			}
			$numeracion_consecutiva		=	$casa_matriz.$terminal.$tipo.$ceros.$consecutivo_nutricionista;
			// Fin prceso de Numeracion Consecutiva
			// Proceso para armar Clave Numérica
			$codigo_pais	=	'506';
			$fecha			=	date("Y-m-d");
			$array_fecha	=	explode('-', $fecha);
			$array_year		=	str_split($array_fecha[0]);
			$dia	=	$array_fecha[2];
			$mes	=	$array_fecha[1];
			$anno	=	$array_year[2] . $array_year[3];

			$ceros_agregar	=	12-count(str_split($nutricionista[0]["cedula"]));
			$ceros	=	'';
			for($i=0; $i<$ceros_agregar; $i++){
				$ceros	.=	'0';
			}
			$emisor_id				=	$ceros.$nutricionista[0]["cedula"];
			$situacion_comprobante	=	'1';
			$codigo_seguridad		=	mt_rand(10000000,99999999);
			$clave_numerica			=	$codigo_pais.$dia.$mes.$anno.$emisor_id.$numeracion_consecutiva.$situacion_comprobante.$codigo_seguridad;
			// Fin de proceso de Clave Numérica

			// Proceso para armar factura
			for($j=0; $j<count($lineas_detalles); $j++){
				$precio_u = DB::table('productos')
							  ->select('precio')
							  ->where('id', '=', $lineas_detalles[$j]["producto_id"])
							  ->get();
				$precio_u	=	$precio_u->toArray();
				$precio_u	=	json_decode(json_encode($precio_u),True);
				
				$_precio_unitario	=	floatval($precio_u[0]['precio']);
				$_cantidad			=	floatval($lineas_detalles[$j]['cantidad']);
				$_descuento			=	floatval($lineas_detalles[$j]['descuento']);
				$_impuesto_venta	=	floatval($lineas_detalles[$j]['impuesto_venta']);
				$_sub_total			=	($_precio_unitario * $_cantidad) - $_descuento;
				$_total				=	$_sub_total + $_impuesto_venta;
/*				
				$lineas_detalles[$j]["precio"]	=	$precio_u[0]["precio"];
				$lineas_detalles[$j]["subtotal"]=	$precio_u[0]["precio"] * $lineas_detalles[$j]["cantidad"];
				$lineas_detalles[$j]["total"]	=  ($precio_u[0]["precio"] * $lineas_detalles[$j]["cantidad"]) + $lineas_detalles[$j]["impuesto_venta"] - $lineas_detalles[$j]["descuento"];
*/
				$lineas_detalles[$j]["precio"]	=	$_precio_unitario;
				$lineas_detalles[$j]["subtotal"]=	$_sub_total;
				$lineas_detalles[$j]["total"]	=	$_total;
/*
				$factura["ive"]			+=	$lineas_detalles[$j]["impuesto_venta"];
				$factura["descuento"]	+=	$lineas_detalles[$j]["descuento"];
				$factura["subtotal"]	+=	$precio_u[0]["precio"] *  $lineas_detalles[$j]["cantidad"];
				$factura["total"]		+=	$lineas_detalles[$j]["total"];
*/
				$factura["ive"]			+=	$_impuesto_venta;
				$factura["descuento"]	+=	$_descuento;
				$factura["subtotal"]	+=	$_sub_total;
				$factura["total"]		+=	$_total;
				
				// Proceso para armar Productos
				$descripcion	=	DB::table('productos')
										->select('productos.descripcion', 'unidad_medidas.nombre', 'unidad_medidas.id')
										->join('unidad_medidas', 'unidad_medidas.id', '=','productos.unidad_medida_id')
										->where('productos.id', '=', $lineas_detalles[$j]["producto_id"])
										->get();

				$descripcion	=	$descripcion->toArray();

				for($i = 0; $i < count($descripcion); $i++){
					$descripcion[$i] = json_decode(json_encode($descripcion[$i]), True);
				}

				$lineas_detalles[$j]["descripcion"]		=	$descripcion[0]['descripcion'];
				$lineas_detalles[$j]["unidad_nombre"]	=	$descripcion[0]['nombre'];
				$lineas_detalles[$j]["unidad_medida"]	=	$descripcion[0]['id'];
				$lineas_detalles[$j]["impuesto"]		=	$lineas_detalles[$j]["impuesto_venta"];

				$products[$j]	=	$lineas_detalles[$j];

				$medio_nombre	=	DB::table('medio_pagos')
										  ->select('nombre')
										  ->where('id', '=', $request->medio_pago_id)
										  ->get();

				$medio_nombre	=	$medio_nombre->toArray();
				for($i = 0; $i < count($medio_nombre); $i++){
					$medio_nombre[$i] = json_decode(json_encode($medio_nombre[$i]), True);
				}
				$factura["medio_nombre"]	=	$medio_nombre[0]["nombre"];
				// Fin proceso 
			}
			$factura["notas"] = "Factura Anulada";
/*Helper::_print($factura);
Helper::_print($lineas_detalles);
die('testing');*/
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

			/*$monto_total	=	0;*/
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
				/*$fijate 	+=	$lineas_detalles[$i]["precio"];*/
			}
			$documento	=	Documento::find( $request->id );
			DB::table('documentos')
				->where('id', $nota_credito_id)
				->update(['monto_total' => $documento->monto_total]);
			/*$this->notificarPorCorreo($nota_credito_id, $numeracion_consecutiva);*/

        } catch(Illuminate\Database\QueryException $e) {
            dd($e);
        } catch(PDOException $e) {
            dd($e);
        }
        $result = self::makeXML($codigo_seguridad, $nota_credito_id, $nutricionista, $client[0]["nombre"], $nutricionista_ubicacion[0], $products, $factura, $request->id, "03");
		
		$text_message	=	'Su factura ha sido anulada ';
		if(!isset($result['error'])){
			if( $result['code']==1 ){
				$text_message	.=	' exitosamente.';
			}
		}		
		
        $message    =   $text_message;
        /*$message    =   'Su factura ha sido anulada con exito';*/
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
		$monto_total	=	0;
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
				$monto_total	+=	$products[$i]["precio"];
			} catch(Illuminate\Database\QueryException $e) {
			  dd($e);
			} catch(PDOException $e) {
			  dd($e);
			}
		}
		DB::table('documentos')
			->where('id', $documento_id)
			->update(['monto_total' => $monto_total]);
		
        // Fin de proceso de creacion de lineas de detalle
		/*$result = self::makeXML($codigo_seguridad, $documento_id, $nutricionista, $client["nombre"], $nutricionista_ubicacion[0], $products, $factura, "", "01");*/
		$result	=	self::makeXML($codigo_seguridad, $documento_id, $nutricionista, $client["nombre"], $nutricionista_ubicacion[0], $products, $factura, "", "01");
		$text_message	=	'Proceso de facturacion finalizado';
		if(!isset($result['error'])){
			if( $result['code']==1 ){
				/*$this->notificarPorCorreo($documento_id, $numeracion_consecutiva);*/
				$text_message	.=	' exitosamente.';
			}
		}
		$response   =   Response::json(['message' => $text_message, 'data' => $result['json_sent']], 200);
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
		
		$_persona	=	Persona::find($documento[0]['persona_id']);
/*
 *	Adicion de Cedula al Receptor
 */
		$json_data['receptor']['identificacion'] = array(
											'tipo'	=>	'0' . $_persona->tipo_idenfificacion_id,
											'numero'=>	$_persona->cedula,
										);
/*
 *	envio:	Elemento opcional, que aplica para el envío de PDF y XML al cliente final.
 *
 */
		$_persona		=	Persona::find($documento[0]['persona_id']);
/*
		if (empty($nutricionista[0]["imagen"])) {
			$logo  = 'https://expediente.nutricion.co.cr/mail/images/logo.png';
		}else{
			$logo = $nutricionista[0]["imagen"];
		}
/*
 * 	convertir logo a base64
 */
		/*$_path_logo		=	$logo;
		$type			=	pathinfo($_path_logo, PATHINFO_EXTENSION);
		$_data_logo			=	file_get_contents($_path_logo);
		$logo_base64	=	'data:image/' . $type . ';base64,' . base64_encode($_data_logo);*/
/*
 *	Convert Image to jpg
 */
/*
		$_path_logo		=	$logo;
		$type			=	pathinfo($_path_logo, PATHINFO_EXTENSION);
		$_path_logo		=	'images/logo/logo_' . $nutricionista[0]['persona_id'] . '.' .  $type;
		$_path_logo		=	public_path( $_path_logo );
		$image	=	imagecreatefrompng($_path_logo);
		$bg		=	imagecreatetruecolor(imagesx($image), imagesy($image));
		imagefill($bg, 0, 0, imagecolorallocate($bg, 255, 255, 255));
		imagealphablending($bg, TRUE);
		imagecopy($bg, $image, 0, 0, 0, 0, imagesx($image), imagesy($image));
		imagedestroy($image);
		$quality = 50; // 0 = worst / smaller file, 100 = better / bigger file 
		$data	=	imagejpeg($bg, $_path_logo . ".jpg", $quality);
		imagedestroy($bg);
		$logo_base64	=	'data:image/jpg;base64,' . base64_encode($data);
*/
/*	
 *	logo Nutritrack jpg en base64	
 */
		$logo_base64	=	'data:image/jpeg;base64,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';
		if (!empty($nutricionista[0]['imagen_base64']))
			$logo_base64	=	$nutricionista[0]["imagen_base64"];
/*
 * 	convertir text a base64
 */
		$texto_base64	=	'';
		$_notas			=	trim($documento[0]['notas']);
		if(!empty($_notas))
			$texto_base64	=	base64_encode( $_notas );
		
		$envio	=	array(
						'aplica'	=>	'1',
						'emisor'	=>	array(
											'correo'	=>	$emisor['correo_electronico']
										),
						'receptor'	=>	array(
											'correo'	=>	$_persona->email . ';' . $emisor['correo_electronico'] . ';danilo@deudigital.com'
										),
						'logo'		=>	$logo_base64,
						'texto'		=>	$texto_base64
					);
		
		$json_data['envio']	=	$envio;
		
/**/

		$return	=	array(
						'json_sent'	=>	json_encode($json_data)
						);
							
		$options = array(
		  'http' => array(
			  'header'  => "Content-Type: application/json\r\n" .
							"Accept: application/json\r\n",
			  'method'  => 'POST',
			  'content' => json_encode($json_data)
		  )
		);
		$context	=	stream_context_create($options);
		try{
			$api_response	=	file_get_contents($url, false, $context);
/*
 *	Respuesta en formato JSON
 *	{"fecha":"2018-11-22T10:00:00-06:00","emisor":{"tipoIdentificacion":"02","numeroIdentificacion":"3101671459"},"clave":"50622111800310167145900100001010000000014147837777","code":1,"data":"PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPEZhY3R1cmFFbGVjdHJvbmljYSB4bWxucz0iaHR0cHM6Ly90cmlidW5ldC5oYWNpZW5kYS5nby5jci9kb2NzL2VzcXVlbWFzLzIwMTcvdjQuMi9mYWN0dXJhRWxlY3Ryb25pY2EiIHhtbG5zOmRzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIiB4bWxuczp4c2Q9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6c2NoZW1hTG9jYXRpb249Imh0dHBzOi8vdHJpYnVuZXQuaGFjaWVuZGEuZ28uY3IvZG9jcy9lc3F1ZW1hcy8yMDE3L3Y0LjIvZmFjdHVyYUVsZWN0cm9uaWNhIEZhY3R1cmFFbGVjdHJvbmljYV9WLjQuMi54c2QiPgogIDxDbGF2ZT41MDYyMjExMTgwMDMxMDE2NzE0NTkwMDEwMDAwMTAxMDAwMDAwMDAxNDE0NzgzNzc3NzwvQ2xhdmU+CiAgPE51bWVyb0NvbnNlY3V0aXZvPjAwMTAwMDAxMDEwMDAwMDAwMDE0PC9OdW1lcm9Db25zZWN1dGl2bz4KICA8RmVjaGFFbWlzaW9uPjIwMTgtMTEtMjJUMTA6MDA6MDAtMDY6MDA8L0ZlY2hhRW1pc2lvbj4KICA8RW1pc29yPgogICAgPE5vbWJyZT5QcnVlYmFzIERldURpZ2l0YWwgRGV2ZWxvcG1lbnQ8L05vbWJyZT4KICAgIDxJZGVudGlmaWNhY2lvbj4KICAgICAgPFRpcG8+MDI8L1RpcG8+CiAgICAgIDxOdW1lcm8+MzEwMTY3MTQ1OTwvTnVtZXJvPgogICAgPC9JZGVudGlmaWNhY2lvbj4KICAgIDxOb21icmVDb21lcmNpYWw+QW55dGltZSBOdXRyaXRpb24sIExMQzwvTm9tYnJlQ29tZXJjaWFsPgogICAgPFViaWNhY2lvbj4KICAgICAgPFByb3ZpbmNpYT40PC9Qcm92aW5jaWE+CiAgICAgIDxDYW50b24+MDQ8L0NhbnRvbj4KICAgICAgPERpc3RyaXRvPjAxPC9EaXN0cml0bz4KICAgICAgPEJhcnJpbz4wMTwvQmFycmlvPgogICAgICA8T3RyYXNTZW5hcz5Db25kbyBCZWxsYSBWaXN0YSAtIFRvcnJlIDEgQXB0IDEwMTwvT3RyYXNTZW5hcz4KICAgIDwvVWJpY2FjaW9uPgogICAgPFRlbGVmb25vPgogICAgICA8Q29kaWdvUGFpcz41MDY8L0NvZGlnb1BhaXM+CiAgICAgIDxOdW1UZWxlZm9ubz4yNDQyMjkxNjwvTnVtVGVsZWZvbm8+CiAgICA8L1RlbGVmb25vPgogICAgPENvcnJlb0VsZWN0cm9uaWNvPnBydWViYXNAZGV1ZGlnaXRhbC5jb208L0NvcnJlb0VsZWN0cm9uaWNvPgogIDwvRW1pc29yPgogIDxSZWNlcHRvcj4KICAgIDxOb21icmU+amFpbWUgaXNpZHJvPC9Ob21icmU+CiAgPC9SZWNlcHRvcj4KICA8Q29uZGljaW9uVmVudGE+MDE8L0NvbmRpY2lvblZlbnRhPgogIDxQbGF6b0NyZWRpdG8+MDwvUGxhem9DcmVkaXRvPgogIDxNZWRpb1BhZ28+MDI8L01lZGlvUGFnbz4KICA8RGV0YWxsZVNlcnZpY2lvPgogICAgPExpbmVhRGV0YWxsZT4KICAgICAgPE51bWVyb0xpbmVhPjE8L051bWVyb0xpbmVhPgogICAgICA8Q2FudGlkYWQ+MTwvQ2FudGlkYWQ+CiAgICAgIDxVbmlkYWRNZWRpZGE+a2c8L1VuaWRhZE1lZGlkYT4KICAgICAgPERldGFsbGU+T3RyYSBtYXM8L0RldGFsbGU+CiAgICAgIDxQcmVjaW9Vbml0YXJpbz41NTQ1NDA8L1ByZWNpb1VuaXRhcmlvPgogICAgICA8TW9udG9Ub3RhbD41NTQ1NDA8L01vbnRvVG90YWw+CiAgICAgIDxTdWJUb3RhbD41NTQ1NDA8L1N1YlRvdGFsPgogICAgICA8TW9udG9Ub3RhbExpbmVhPjU1NDU0MDwvTW9udG9Ub3RhbExpbmVhPgogICAgPC9MaW5lYURldGFsbGU+CiAgPC9EZXRhbGxlU2VydmljaW8+CiAgPFJlc3VtZW5GYWN0dXJhPgogICAgPENvZGlnb01vbmVkYT5DUkM8L0NvZGlnb01vbmVkYT4KICAgIDxUb3RhbFNlcnZHcmF2YWRvcz4wPC9Ub3RhbFNlcnZHcmF2YWRvcz4KICAgIDxUb3RhbFNlcnZFeGVudG9zPjU1NDU0MDwvVG90YWxTZXJ2RXhlbnRvcz4KICAgIDxUb3RhbE1lcmNhbmNpYXNHcmF2YWRhcz4wPC9Ub3RhbE1lcmNhbmNpYXNHcmF2YWRhcz4KICAgIDxUb3RhbE1lcmNhbmNpYXNFeGVudGFzPjA8L1RvdGFsTWVyY2FuY2lhc0V4ZW50YXM+CiAgICA8VG90YWxHcmF2YWRvPjA8L1RvdGFsR3JhdmFkbz4KICAgIDxUb3RhbEV4ZW50bz41NTQ1NDA8L1RvdGFsRXhlbnRvPgogICAgPFRvdGFsVmVudGE+NTU0NTQwPC9Ub3RhbFZlbnRhPgogICAgPFRvdGFsVmVudGFOZXRhPjU1NDU0MDwvVG90YWxWZW50YU5ldGE+CiAgICA8VG90YWxJbXB1ZXN0bz4wPC9Ub3RhbEltcHVlc3RvPgogICAgPFRvdGFsQ29tcHJvYmFudGU+NTU0NTQwPC9Ub3RhbENvbXByb2JhbnRlPgogIDwvUmVzdW1lbkZhY3R1cmE+CiAgPE5vcm1hdGl2YT4KICAgIDxOdW1lcm9SZXNvbHVjaW9uPkRHVC1SLTQ4LTIwMTY8L051bWVyb1Jlc29sdWNpb24+CiAgICA8RmVjaGFSZXNvbHVjaW9uPjA3LTEwLTIwMTYgMDg6MDA6MDA8L0ZlY2hhUmVzb2x1Y2lvbj4KICA8L05vcm1hdGl2YT4KICA8T3Ryb3M+CiAgICA8T3Ryb1RleHRvIGNvZGlnbz0iIj5HZW5lcmFkbyBwb3I6IHd3dy5jb21wcm9iYW50ZXNlbGVjdHJvbmljb3Njci5jb208L090cm9UZXh0bz4KICA8L090cm9zPjxkczpTaWduYXR1cmUgeG1sbnM6ZHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiIElkPSJTaWduYXR1cmUtNjQzMjA4MDgyIj48ZHM6U2lnbmVkSW5mbz48ZHM6Q2Fub25pY2FsaXphdGlvbk1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnL1RSLzIwMDEvUkVDLXhtbC1jMTRuLTIwMDEwMzE1Ii8+PGRzOlNpZ25hdHVyZU1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZHNpZy1tb3JlI3JzYS1zaGE1MTIiLz48ZHM6UmVmZXJlbmNlIFVSST0iIj48ZHM6VHJhbnNmb3Jtcz48ZHM6VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI2VudmVsb3BlZC1zaWduYXR1cmUiLz48L2RzOlRyYW5zZm9ybXM+PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTUxMiIvPjxkczpEaWdlc3RWYWx1ZT5jNCtoUFprZkJ6ZnI3SUR2UjZxeWw4RFIzeVFFMFY3REFNTXRLMTJoWFNDN3VISjJzeDN3RENkTS95blpkdUM2ZEtMMkZ2U2h4ZytlWnN1SGxYbXVNdz09PC9kczpEaWdlc3RWYWx1ZT48L2RzOlJlZmVyZW5jZT48ZHM6UmVmZXJlbmNlIFR5cGU9Imh0dHA6Ly91cmkuZXRzaS5vcmcvMDE5MDMjU2lnbmVkUHJvcGVydGllcyIgVVJJPSIjU2lnbmVkUHJvcGVydGllcy0zNzEzOTA3NDEiPjxkczpEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjc2hhMSIvPjxkczpEaWdlc3RWYWx1ZT5yeUM1SVhCc04rMklKNXBNa1VEUzM0elRFQkk9PC9kczpEaWdlc3RWYWx1ZT48L2RzOlJlZmVyZW5jZT48L2RzOlNpZ25lZEluZm8+PGRzOlNpZ25hdHVyZVZhbHVlPlpxakluaGRGVThkM3I0VzJ4MzJEQVE0RmlGYmUvZ2NtQVRodDhJcWdsbTN2bUVTM0ZQOHVOc1VCaFhZZ3BpUFo5YzNaK1cwNk9uN0Nmb1ZuUTM5VG9hajRPejRlRXBVTzZCRmRsYm4wQUpZMUVBR2o1N05XMmVvQ0krRzZkWUpiTlg1RXlqN2dyTGttZ3poR2Y2WUV4L1d3RjdDSTlVMlhGVlFVYlpwNHhUbFhwK05ET3Z2dW5GK1RaaXROZ2tLTjc3VVpkbCtxWFBObDNncFRSOXJoaC9yMHBsSVRMZGVOZzN4VlBZdkpWNGY1cmEwZWM3amQrUlVaQmQ2ci9Ic0dCMFhyYVRmRU9Ib2xIS2RSQkVRaGsvOUdiYzRJdlpXWXFnekRsalJLMXpjTVpqSGVFZm9IYUNwRVJsQUhkK2h5azBjNGkrTGNNU2ZuYmZSc1JvSkI0QT09PC9kczpTaWduYXR1cmVWYWx1ZT48ZHM6S2V5SW5mbz48ZHM6S2V5VmFsdWU+PGRzOlJTQUtleVZhbHVlPjxkczpNb2R1bHVzPnFqbGhLUmc1YWJQclVGWlpqMmxSK214VWJXa3pVcS9LRXZVYVhVTFdoc2NBOTV6cDBNb0lPalJ1R0gvQUhpS3M3ZEs4UXZmdWNadmFhd0twcFk3aUptb0R6UmtNQ1JyVzkwZXNmbXhrT2k4dmlzdXZFeTlOSlBialY4RkptVnVQajdQemJLcExzaGExQVdJODY3WmxUNzkxQ2t6ZGZKeDBBTi9pYmhhR3EweFYwRElGbEJuWkFNVENsak5aeEdyRnlEaHRoYTVZSitnR0ZGMTRqYVFOOXo2NlR1NDRJOWU1dm5pakNzUHdYNG5CR2sraUZGdVY3YVRGL1RLUHZMeU5XYlplL2NxODhHQXBWaU9hL3UwR2l0dFp6R1Fmb1NRSWIzVHJhRVVUckVMbjIvMGQzUFBCTXBiQ0QwTStVdzBDSHdTSFMzZGZleEllVWdSYlc0SWI2UT09PC9kczpNb2R1bHVzPjxkczpFeHBvbmVudD5BUUFCPC9kczpFeHBvbmVudD48L2RzOlJTQUtleVZhbHVlPjwvZHM6S2V5VmFsdWU+PGRzOlg1MDlEYXRhPjxkczpYNTA5SXNzdWVyU2VyaWFsPjxkczpYNTA5SXNzdWVyTmFtZT5DTj1DQSBQRVJTT05BIEpVUklESUNBIC0gU0FOREJPWCwgT1U9REdULCBPPU1JTklTVEVSSU8gREUgSEFDSUVOREEgLSBTQU5EQk9YLCBDPUNSPC9kczpYNTA5SXNzdWVyTmFtZT48ZHM6WDUwOVNlcmlhbE51bWJlcj4xNTE1MjE2MzE3NjUwPC9kczpYNTA5U2VyaWFsTnVtYmVyPjwvZHM6WDUwOUlzc3VlclNlcmlhbD48ZHM6WDUwOVN1YmplY3ROYW1lPkNOPURFVURJR0lUQUwgU09DSUVEQUQgQU5PTklNQSwgT1U9Q1BKLCBPPVBFUlNPTkEgSlVSSURJQ0EsIEM9Q1IsIDIuNS40LjQyPSMwQzFCNDQ0NTU1NDQ0OTQ3NDk1NDQxNEMyMDUzNEY0MzQ5NDU0NDQxNDQyMDQxNEU0RjRFNDk0RDQxLCAyLjUuNC40PSMwQzAwLCAyLjUuNC41PSMxMzEwNDM1MDRBMkQzMzJEMzEzMDMxMkQzNjM3MzEzNDM1Mzk8L2RzOlg1MDlTdWJqZWN0TmFtZT48ZHM6WDUwOUNlcnRpZmljYXRlPk1JSUZZakNDQTBxZ0F3SUJBZ0lHQVdESjdpelNNQTBHQ1NxR1NJYjNEUUVCQ3dVQU1HNHhDekFKQmdOVkJBWVRBa05TTVNrd0p3WURWUVFLRENCTlNVNUpVMVJGVWtsUElFUkZJRWhCUTBsRlRrUkJJQzBnVTBGT1JFSlBXREVNTUFvR0ExVUVDd3dEUkVkVU1TWXdKQVlEVlFRRERCMURRU0JRUlZKVFQwNUJJRXBWVWtsRVNVTkJJQzBnVTBGT1JFSlBXREFlRncweE9EQXhNRFl3TlRJMU1UZGFGdzB5TURBeE1EWXdOVEkxTVRkYU1JR29NUmt3RndZRFZRUUZFeEJEVUVvdE15MHhNREV0TmpjeE5EVTVNUWt3QndZRFZRUUVEQUF4SkRBaUJnTlZCQ29NRzBSRlZVUkpSMGxVUVV3Z1UwOURTVVZFUVVRZ1FVNVBUa2xOUVRFTE1Ba0dBMVVFQmhNQ1ExSXhHVEFYQmdOVkJBb01FRkJGVWxOUFRrRWdTbFZTU1VSSlEwRXhEREFLQmdOVkJBc01BME5RU2pFa01DSUdBMVVFQXd3YlJFVlZSRWxIU1ZSQlRDQlRUME5KUlVSQlJDQkJUazlPU1UxQk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBcWpsaEtSZzVhYlByVUZaWmoybFIrbXhVYldrelVxL0tFdlVhWFVMV2hzY0E5NXpwME1vSU9qUnVHSC9BSGlLczdkSzhRdmZ1Y1p2YWF3S3BwWTdpSm1vRHpSa01DUnJXOTBlc2ZteGtPaTh2aXN1dkV5OU5KUGJqVjhGSm1WdVBqN1B6YktwTHNoYTFBV0k4NjdabFQ3OTFDa3pkZkp4MEFOL2liaGFHcTB4VjBESUZsQm5aQU1UQ2xqTlp4R3JGeURodGhhNVlKK2dHRkYxNGphUU45ejY2VHU0NEk5ZTV2bmlqQ3NQd1g0bkJHaytpRkZ1VjdhVEYvVEtQdkx5TldiWmUvY3E4OEdBcFZpT2EvdTBHaXR0WnpHUWZvU1FJYjNUcmFFVVRyRUxuMi8wZDNQUEJNcGJDRDBNK1V3MENId1NIUzNkZmV4SWVVZ1JiVzRJYjZRSURBUUFCbzRIS01JSEhNQjhHQTFVZEl3UVlNQmFBRkt3b1JmZ3ZuVWhmTEI4QWtPc3l4YU1IVTREaE1CMEdBMVVkRGdRV0JCUmJTeGU1NVJXSnhUMWlOVXRwcnc2cmlWQm5wekFMQmdOVkhROEVCQU1DQnNBd0V3WURWUjBsQkF3d0NnWUlLd1lCQlFVSEF3UXdZd1lJS3dZQkJRVUhBUUVFVnpCVk1GTUdDQ3NHQVFVRkJ6QUNoa2RvZEhSd2N6b3ZMM0JyYVM1amIyMXdjbTlpWVc1MFpYTmxiR1ZqZEhKdmJtbGpiM011WjI4dVkzSXZjM1JoWnk5cGJuUmxjbTFsWkdsaGRHVXRjR290Y0dWdExtTnlkREFOQmdrcWhraUc5dzBCQVFzRkFBT0NBZ0VBV1VYbk0yU3ZmVEVIZURhamFxV1E1ZkVUMUxCclZEQjJXN1hUL2pHbUVwSGZHb0E3WDVDMUx1L3FSMFBSYzNlTlV3cFR5b1lPb1kvcmFWSHJxOG9GYjhES3ZXa2t6TEt1aHkraXVvK1d3bkxlVjNZbkdoc2thd0swZEh0VUNYM2o4QVV5UnhuZUpNQ1NZdHB2S1JkMk1SVWlQSUpRRnNJSGlFM3Y5Uzl6ejVyZFJIeW9mVE9ubVhRTnkrTHFjMXRmL3FCWkVzeldSMDZacEJjNnlpcXFXZTRyQ1pxbDRxU0NnSWFpVEtSUHhCa015WE5JZ3RsNFJ1bkNLbVpzemptWnVvVG1wd05rbENHTjhHeW85WEpOL083NFRpS1hhUEwwd0tsMkhJbzZrOTVTNzNKMlJwb2ZiM3N3N2pDZGkyQXRMTENlbnl0UnBiT0FzcVgzTm56U25HaFZiaElOY0tzcW9oa1BzSVUwOHdkczM4M1YreGpZZ3RZMzFtWmdMM201OHNRVFN1YXA1cVZIR1QwOGdxaVJIb0FXRzN1SVY5aTJvRFVxZkJKM05ST0JNeGJqTHJTQ0FsY295QUZ4Q3FiL1JIU3JwTXZPdGFnRUNQQUNnemxTYVpYK2NkTWZ1alNYQUxwMFIzV25PbnNmSmkvYzRmWWFWNmRqSkJoeXdKcDVmcDdFWUpKOG1vaWVvc2FhMStENVdMdEVaNVdhU2ppQlJpV1phTzZ4UkhOUElTSXZEeUllZFZsN2x1eEVWRC9oaE1zTmtPN0NmY0ttZyt5UGc5cU1OejhUNitBMnFYRUpqVkFzZ1pMS3JuTWZCWnlDNnBiWmlJeWV1OTlkdThjMnVNR1JUVDRUZi9leGxMNkFPS3lUeUVjdDB2ajhTOThDU2FWTzRUeWhMUjA9PC9kczpYNTA5Q2VydGlmaWNhdGU+PC9kczpYNTA5RGF0YT48L2RzOktleUluZm8+PGRzOk9iamVjdD48eGFkZXM6UXVhbGlmeWluZ1Byb3BlcnRpZXMgeG1sbnM6eGFkZXM9Imh0dHA6Ly91cmkuZXRzaS5vcmcvMDE5MDMvdjEuMy4yIyIgeG1sbnM6eGFkZXN2MTQxPSJodHRwOi8vdXJpLmV0c2kub3JnLzAxOTAzL3YxLjQuMSMiIFRhcmdldD0iI1NpZ25hdHVyZS02NDMyMDgwODIiPjx4YWRlczpTaWduZWRQcm9wZXJ0aWVzIElkPSJTaWduZWRQcm9wZXJ0aWVzLTM3MTM5MDc0MSI+PHhhZGVzOlNpZ25lZFNpZ25hdHVyZVByb3BlcnRpZXM+PHhhZGVzOlNpZ25pbmdUaW1lPjIwMTgtMTEtMjJUMTY6MDA6MDIuMDAwWjwveGFkZXM6U2lnbmluZ1RpbWU+PHhhZGVzOlNpZ25pbmdDZXJ0aWZpY2F0ZT48eGFkZXM6Q2VydD48eGFkZXM6Q2VydERpZ2VzdD48ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI3NoYTEiLz48ZHM6RGlnZXN0VmFsdWU+TGNKcUFaQnJvR3M3ZkxONDg0RGJ2Q01SNndBPTwvZHM6RGlnZXN0VmFsdWU+PC94YWRlczpDZXJ0RGlnZXN0Pjx4YWRlczpJc3N1ZXJTZXJpYWw+PGRzOlg1MDlJc3N1ZXJOYW1lPkNOPUNBIFBFUlNPTkEgSlVSSURJQ0EgLSBTQU5EQk9YLCBPVT1ER1QsIE89TUlOSVNURVJJTyBERSBIQUNJRU5EQSAtIFNBTkRCT1gsIEM9Q1I8L2RzOlg1MDlJc3N1ZXJOYW1lPjxkczpYNTA5U2VyaWFsTnVtYmVyPjE1MTUyMTYzMTc2NTA8L2RzOlg1MDlTZXJpYWxOdW1iZXI+PC94YWRlczpJc3N1ZXJTZXJpYWw+PC94YWRlczpDZXJ0PjwveGFkZXM6U2lnbmluZ0NlcnRpZmljYXRlPjx4YWRlczpTaWduYXR1cmVQb2xpY3lJZGVudGlmaWVyPjx4YWRlczpTaWduYXR1cmVQb2xpY3lJZD48eGFkZXM6U2lnUG9saWN5SWQ+PHhhZGVzOklkZW50aWZpZXI+aHR0cHM6Ly93d3cuaGFjaWVuZGEuZ28uY3IvQVRWL0NvbXByb2JhbnRlRWxlY3Ryb25pY28vZG9jcy9lc3F1ZW1hcy8yMDE2L3Y0LjIvREdUX1JfNTFfMjAxNl9SZXNvbHVjaW9uX2RlX09ibGlnYXRvcmllZGFkX3BhcmFfZWxfVXNvX2RlX2xvc19Db21wcm9iYW50ZXNfRWxlY3Ryb25pY29zX1Y0LjIucGRmPC94YWRlczpJZGVudGlmaWVyPjwveGFkZXM6U2lnUG9saWN5SWQ+PHhhZGVzOlNpZ1BvbGljeUhhc2g+PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTUxMiIvPjxkczpEaWdlc3RWYWx1ZT5ObUk1TmprMVpUaGtOekkwTW1Jek1HSm1aREF5TkRjNFlqVXdOemt6T0RNMk5UQmlPV1V4TlRCa01tSTJZamd6WXpaak0ySTVOVFpsTkRRNE9XUXpNUT09PC9kczpEaWdlc3RWYWx1ZT48L3hhZGVzOlNpZ1BvbGljeUhhc2g+PC94YWRlczpTaWduYXR1cmVQb2xpY3lJZD48L3hhZGVzOlNpZ25hdHVyZVBvbGljeUlkZW50aWZpZXI+PC94YWRlczpTaWduZWRTaWduYXR1cmVQcm9wZXJ0aWVzPjx4YWRlczpTaWduZWREYXRhT2JqZWN0UHJvcGVydGllcz48eGFkZXM6RGF0YU9iamVjdEZvcm1hdCBPYmplY3RSZWZlcmVuY2U9IiNyLWlkLTEiPjx4YWRlczpNaW1lVHlwZT50ZXh0L3htbDwveGFkZXM6TWltZVR5cGU+PC94YWRlczpEYXRhT2JqZWN0Rm9ybWF0PjwveGFkZXM6U2lnbmVkRGF0YU9iamVjdFByb3BlcnRpZXM+PC94YWRlczpTaWduZWRQcm9wZXJ0aWVzPjwveGFkZXM6UXVhbGlmeWluZ1Byb3BlcnRpZXM+PC9kczpPYmplY3Q+PC9kczpTaWduYXR1cmU+CjwvRmFjdHVyYUVsZWN0cm9uaWNhPgo=","hacienda_status":"1","hacienda_mensaje":"https:\/\/api.comprobanteselectronicos.go.cr\/recepcion-sandbox\/v1\/recepcion\/50622111800310167145900100001010000000014147837777","status":"200"}
*/
			$result	=	json_decode($api_response);
/*
 *	Respuesta Decodificada a Object
 *	
stdClass Object
(
	[fecha] => 2018-11-22T10:00:00-06:00
	[emisor] => stdClass Object
		(
			[tipoIdentificacion] => 02
			[numeroIdentificacion] => 3101671459
		)
	[clave] => 50622111800310167145900100001010000000014147837777
	[code] => 1
	[data] => PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPEZhY3R1cmFFbGVjdHJvbmljYSB4bWxucz0iaHR0cHM6Ly90cmlidW5ldC5oYWNpZW5kYS5nby5jci9kb2NzL2VzcXVlbWFzLzIwMTcvdjQuMi9mYWN0dXJhRWxlY3Ryb25pY2EiIHhtbG5zOmRzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIiB4bWxuczp4c2Q9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6c2NoZW1hTG9jYXRpb249Imh0dHBzOi8vdHJpYnVuZXQuaGFjaWVuZGEuZ28uY3IvZG9jcy9lc3F1ZW1hcy8yMDE3L3Y0LjIvZmFjdHVyYUVsZWN0cm9uaWNhIEZhY3R1cmFFbGVjdHJvbmljYV9WLjQuMi54c2QiPgogIDxDbGF2ZT41MDYyMjExMTgwMDMxMDE2NzE0NTkwMDEwMDAwMTAxMDAwMDAwMDAxNDE0NzgzNzc3NzwvQ2xhdmU+CiAgPE51bWVyb0NvbnNlY3V0aXZvPjAwMTAwMDAxMDEwMDAwMDAwMDE0PC9OdW1lcm9Db25zZWN1dGl2bz4KICA8RmVjaGFFbWlzaW9uPjIwMTgtMTEtMjJUMTA6MDA6MDAtMDY6MDA8L0ZlY2hhRW1pc2lvbj4KICA8RW1pc29yPgogICAgPE5vbWJyZT5QcnVlYmFzIERldURpZ2l0YWwgRGV2ZWxvcG1lbnQ8L05vbWJyZT4KICAgIDxJZGVudGlmaWNhY2lvbj4KICAgICAgPFRpcG8+MDI8L1RpcG8+CiAgICAgIDxOdW1lcm8+MzEwMTY3MTQ1OTwvTnVtZXJvPgogICAgPC9JZGVudGlmaWNhY2lvbj4KICAgIDxOb21icmVDb21lcmNpYWw+QW55dGltZSBOdXRyaXRpb24sIExMQzwvTm9tYnJlQ29tZXJjaWFsPgogICAgPFViaWNhY2lvbj4KICAgICAgPFByb3ZpbmNpYT40PC9Qcm92aW5jaWE+CiAgICAgIDxDYW50b24+MDQ8L0NhbnRvbj4KICAgICAgPERpc3RyaXRvPjAxPC9EaXN0cml0bz4KICAgICAgPEJhcnJpbz4wMTwvQmFycmlvPgogICAgICA8T3RyYXNTZW5hcz5Db25kbyBCZWxsYSBWaXN0YSAtIFRvcnJlIDEgQXB0IDEwMTwvT3RyYXNTZW5hcz4KICAgIDwvVWJpY2FjaW9uPgogICAgPFRlbGVmb25vPgogICAgICA8Q29kaWdvUGFpcz41MDY8L0NvZGlnb1BhaXM+CiAgICAgIDxOdW1UZWxlZm9ubz4yNDQyMjkxNjwvTnVtVGVsZWZvbm8+CiAgICA8L1RlbGVmb25vPgogICAgPENvcnJlb0VsZWN0cm9uaWNvPnBydWViYXNAZGV1ZGlnaXRhbC5jb208L0NvcnJlb0VsZWN0cm9uaWNvPgogIDwvRW1pc29yPgogIDxSZWNlcHRvcj4KICAgIDxOb21icmU+amFpbWUgaXNpZHJvPC9Ob21icmU+CiAgPC9SZWNlcHRvcj4KICA8Q29uZGljaW9uVmVudGE+MDE8L0NvbmRpY2lvblZlbnRhPgogIDxQbGF6b0NyZWRpdG8+MDwvUGxhem9DcmVkaXRvPgogIDxNZWRpb1BhZ28+MDI8L01lZGlvUGFnbz4KICA8RGV0YWxsZVNlcnZpY2lvPgogICAgPExpbmVhRGV0YWxsZT4KICAgICAgPE51bWVyb0xpbmVhPjE8L051bWVyb0xpbmVhPgogICAgICA8Q2FudGlkYWQ+MTwvQ2FudGlkYWQ+CiAgICAgIDxVbmlkYWRNZWRpZGE+a2c8L1VuaWRhZE1lZGlkYT4KICAgICAgPERldGFsbGU+T3RyYSBtYXM8L0RldGFsbGU+CiAgICAgIDxQcmVjaW9Vbml0YXJpbz41NTQ1NDA8L1ByZWNpb1VuaXRhcmlvPgogICAgICA8TW9udG9Ub3RhbD41NTQ1NDA8L01vbnRvVG90YWw+CiAgICAgIDxTdWJUb3RhbD41NTQ1NDA8L1N1YlRvdGFsPgogICAgICA8TW9udG9Ub3RhbExpbmVhPjU1NDU0MDwvTW9udG9Ub3RhbExpbmVhPgogICAgPC9MaW5lYURldGFsbGU+CiAgPC9EZXRhbGxlU2VydmljaW8+CiAgPFJlc3VtZW5GYWN0dXJhPgogICAgPENvZGlnb01vbmVkYT5DUkM8L0NvZGlnb01vbmVkYT4KICAgIDxUb3RhbFNlcnZHcmF2YWRvcz4wPC9Ub3RhbFNlcnZHcmF2YWRvcz4KICAgIDxUb3RhbFNlcnZFeGVudG9zPjU1NDU0MDwvVG90YWxTZXJ2RXhlbnRvcz4KICAgIDxUb3RhbE1lcmNhbmNpYXNHcmF2YWRhcz4wPC9Ub3RhbE1lcmNhbmNpYXNHcmF2YWRhcz4KICAgIDxUb3RhbE1lcmNhbmNpYXNFeGVudGFzPjA8L1RvdGFsTWVyY2FuY2lhc0V4ZW50YXM+CiAgICA8VG90YWxHcmF2YWRvPjA8L1RvdGFsR3JhdmFkbz4KICAgIDxUb3RhbEV4ZW50bz41NTQ1NDA8L1RvdGFsRXhlbnRvPgogICAgPFRvdGFsVmVudGE+NTU0NTQwPC9Ub3RhbFZlbnRhPgogICAgPFRvdGFsVmVudGFOZXRhPjU1NDU0MDwvVG90YWxWZW50YU5ldGE+CiAgICA8VG90YWxJbXB1ZXN0bz4wPC9Ub3RhbEltcHVlc3RvPgogICAgPFRvdGFsQ29tcHJvYmFudGU+NTU0NTQwPC9Ub3RhbENvbXByb2JhbnRlPgogIDwvUmVzdW1lbkZhY3R1cmE+CiAgPE5vcm1hdGl2YT4KICAgIDxOdW1lcm9SZXNvbHVjaW9uPkRHVC1SLTQ4LTIwMTY8L051bWVyb1Jlc29sdWNpb24+CiAgICA8RmVjaGFSZXNvbHVjaW9uPjA3LTEwLTIwMTYgMDg6MDA6MDA8L0ZlY2hhUmVzb2x1Y2lvbj4KICA8L05vcm1hdGl2YT4KICA8T3Ryb3M+CiAgICA8T3Ryb1RleHRvIGNvZGlnbz0iIj5HZW5lcmFkbyBwb3I6IHd3dy5jb21wcm9iYW50ZXNlbGVjdHJvbmljb3Njci5jb208L090cm9UZXh0bz4KICA8L090cm9zPjxkczpTaWduYXR1cmUgeG1sbnM6ZHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiIElkPSJTaWduYXR1cmUtNjQzMjA4MDgyIj48ZHM6U2lnbmVkSW5mbz48ZHM6Q2Fub25pY2FsaXphdGlvbk1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnL1RSLzIwMDEvUkVDLXhtbC1jMTRuLTIwMDEwMzE1Ii8+PGRzOlNpZ25hdHVyZU1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZHNpZy1tb3JlI3JzYS1zaGE1MTIiLz48ZHM6UmVmZXJlbmNlIFVSST0iIj48ZHM6VHJhbnNmb3Jtcz48ZHM6VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI2VudmVsb3BlZC1zaWduYXR1cmUiLz48L2RzOlRyYW5zZm9ybXM+PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTUxMiIvPjxkczpEaWdlc3RWYWx1ZT5jNCtoUFprZkJ6ZnI3SUR2UjZxeWw4RFIzeVFFMFY3REFNTXRLMTJoWFNDN3VISjJzeDN3RENkTS95blpkdUM2ZEtMMkZ2U2h4ZytlWnN1SGxYbXVNdz09PC9kczpEaWdlc3RWYWx1ZT48L2RzOlJlZmVyZW5jZT48ZHM6UmVmZXJlbmNlIFR5cGU9Imh0dHA6Ly91cmkuZXRzaS5vcmcvMDE5MDMjU2lnbmVkUHJvcGVydGllcyIgVVJJPSIjU2lnbmVkUHJvcGVydGllcy0zNzEzOTA3NDEiPjxkczpEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjc2hhMSIvPjxkczpEaWdlc3RWYWx1ZT5yeUM1SVhCc04rMklKNXBNa1VEUzM0elRFQkk9PC9kczpEaWdlc3RWYWx1ZT48L2RzOlJlZmVyZW5jZT48L2RzOlNpZ25lZEluZm8+PGRzOlNpZ25hdHVyZVZhbHVlPlpxakluaGRGVThkM3I0VzJ4MzJEQVE0RmlGYmUvZ2NtQVRodDhJcWdsbTN2bUVTM0ZQOHVOc1VCaFhZZ3BpUFo5YzNaK1cwNk9uN0Nmb1ZuUTM5VG9hajRPejRlRXBVTzZCRmRsYm4wQUpZMUVBR2o1N05XMmVvQ0krRzZkWUpiTlg1RXlqN2dyTGttZ3poR2Y2WUV4L1d3RjdDSTlVMlhGVlFVYlpwNHhUbFhwK05ET3Z2dW5GK1RaaXROZ2tLTjc3VVpkbCtxWFBObDNncFRSOXJoaC9yMHBsSVRMZGVOZzN4VlBZdkpWNGY1cmEwZWM3amQrUlVaQmQ2ci9Ic0dCMFhyYVRmRU9Ib2xIS2RSQkVRaGsvOUdiYzRJdlpXWXFnekRsalJLMXpjTVpqSGVFZm9IYUNwRVJsQUhkK2h5azBjNGkrTGNNU2ZuYmZSc1JvSkI0QT09PC9kczpTaWduYXR1cmVWYWx1ZT48ZHM6S2V5SW5mbz48ZHM6S2V5VmFsdWU+PGRzOlJTQUtleVZhbHVlPjxkczpNb2R1bHVzPnFqbGhLUmc1YWJQclVGWlpqMmxSK214VWJXa3pVcS9LRXZVYVhVTFdoc2NBOTV6cDBNb0lPalJ1R0gvQUhpS3M3ZEs4UXZmdWNadmFhd0twcFk3aUptb0R6UmtNQ1JyVzkwZXNmbXhrT2k4dmlzdXZFeTlOSlBialY4RkptVnVQajdQemJLcExzaGExQVdJODY3WmxUNzkxQ2t6ZGZKeDBBTi9pYmhhR3EweFYwRElGbEJuWkFNVENsak5aeEdyRnlEaHRoYTVZSitnR0ZGMTRqYVFOOXo2NlR1NDRJOWU1dm5pakNzUHdYNG5CR2sraUZGdVY3YVRGL1RLUHZMeU5XYlplL2NxODhHQXBWaU9hL3UwR2l0dFp6R1Fmb1NRSWIzVHJhRVVUckVMbjIvMGQzUFBCTXBiQ0QwTStVdzBDSHdTSFMzZGZleEllVWdSYlc0SWI2UT09PC9kczpNb2R1bHVzPjxkczpFeHBvbmVudD5BUUFCPC9kczpFeHBvbmVudD48L2RzOlJTQUtleVZhbHVlPjwvZHM6S2V5VmFsdWU+PGRzOlg1MDlEYXRhPjxkczpYNTA5SXNzdWVyU2VyaWFsPjxkczpYNTA5SXNzdWVyTmFtZT5DTj1DQSBQRVJTT05BIEpVUklESUNBIC0gU0FOREJPWCwgT1U9REdULCBPPU1JTklTVEVSSU8gREUgSEFDSUVOREEgLSBTQU5EQk9YLCBDPUNSPC9kczpYNTA5SXNzdWVyTmFtZT48ZHM6WDUwOVNlcmlhbE51bWJlcj4xNTE1MjE2MzE3NjUwPC9kczpYNTA5U2VyaWFsTnVtYmVyPjwvZHM6WDUwOUlzc3VlclNlcmlhbD48ZHM6WDUwOVN1YmplY3ROYW1lPkNOPURFVURJR0lUQUwgU09DSUVEQUQgQU5PTklNQSwgT1U9Q1BKLCBPPVBFUlNPTkEgSlVSSURJQ0EsIEM9Q1IsIDIuNS40LjQyPSMwQzFCNDQ0NTU1NDQ0OTQ3NDk1NDQxNEMyMDUzNEY0MzQ5NDU0NDQxNDQyMDQxNEU0RjRFNDk0RDQxLCAyLjUuNC40PSMwQzAwLCAyLjUuNC41PSMxMzEwNDM1MDRBMkQzMzJEMzEzMDMxMkQzNjM3MzEzNDM1Mzk8L2RzOlg1MDlTdWJqZWN0TmFtZT48ZHM6WDUwOUNlcnRpZmljYXRlPk1JSUZZakNDQTBxZ0F3SUJBZ0lHQVdESjdpelNNQTBHQ1NxR1NJYjNEUUVCQ3dVQU1HNHhDekFKQmdOVkJBWVRBa05TTVNrd0p3WURWUVFLRENCTlNVNUpVMVJGVWtsUElFUkZJRWhCUTBsRlRrUkJJQzBnVTBGT1JFSlBXREVNTUFvR0ExVUVDd3dEUkVkVU1TWXdKQVlEVlFRRERCMURRU0JRUlZKVFQwNUJJRXBWVWtsRVNVTkJJQzBnVTBGT1JFSlBXREFlRncweE9EQXhNRFl3TlRJMU1UZGFGdzB5TURBeE1EWXdOVEkxTVRkYU1JR29NUmt3RndZRFZRUUZFeEJEVUVvdE15MHhNREV0TmpjeE5EVTVNUWt3QndZRFZRUUVEQUF4SkRBaUJnTlZCQ29NRzBSRlZVUkpSMGxVUVV3Z1UwOURTVVZFUVVRZ1FVNVBUa2xOUVRFTE1Ba0dBMVVFQmhNQ1ExSXhHVEFYQmdOVkJBb01FRkJGVWxOUFRrRWdTbFZTU1VSSlEwRXhEREFLQmdOVkJBc01BME5RU2pFa01DSUdBMVVFQXd3YlJFVlZSRWxIU1ZSQlRDQlRUME5KUlVSQlJDQkJUazlPU1UxQk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBcWpsaEtSZzVhYlByVUZaWmoybFIrbXhVYldrelVxL0tFdlVhWFVMV2hzY0E5NXpwME1vSU9qUnVHSC9BSGlLczdkSzhRdmZ1Y1p2YWF3S3BwWTdpSm1vRHpSa01DUnJXOTBlc2ZteGtPaTh2aXN1dkV5OU5KUGJqVjhGSm1WdVBqN1B6YktwTHNoYTFBV0k4NjdabFQ3OTFDa3pkZkp4MEFOL2liaGFHcTB4VjBESUZsQm5aQU1UQ2xqTlp4R3JGeURodGhhNVlKK2dHRkYxNGphUU45ejY2VHU0NEk5ZTV2bmlqQ3NQd1g0bkJHaytpRkZ1VjdhVEYvVEtQdkx5TldiWmUvY3E4OEdBcFZpT2EvdTBHaXR0WnpHUWZvU1FJYjNUcmFFVVRyRUxuMi8wZDNQUEJNcGJDRDBNK1V3MENId1NIUzNkZmV4SWVVZ1JiVzRJYjZRSURBUUFCbzRIS01JSEhNQjhHQTFVZEl3UVlNQmFBRkt3b1JmZ3ZuVWhmTEI4QWtPc3l4YU1IVTREaE1CMEdBMVVkRGdRV0JCUmJTeGU1NVJXSnhUMWlOVXRwcnc2cmlWQm5wekFMQmdOVkhROEVCQU1DQnNBd0V3WURWUjBsQkF3d0NnWUlLd1lCQlFVSEF3UXdZd1lJS3dZQkJRVUhBUUVFVnpCVk1GTUdDQ3NHQVFVRkJ6QUNoa2RvZEhSd2N6b3ZMM0JyYVM1amIyMXdjbTlpWVc1MFpYTmxiR1ZqZEhKdmJtbGpiM011WjI4dVkzSXZjM1JoWnk5cGJuUmxjbTFsWkdsaGRHVXRjR290Y0dWdExtTnlkREFOQmdrcWhraUc5dzBCQVFzRkFBT0NBZ0VBV1VYbk0yU3ZmVEVIZURhamFxV1E1ZkVUMUxCclZEQjJXN1hUL2pHbUVwSGZHb0E3WDVDMUx1L3FSMFBSYzNlTlV3cFR5b1lPb1kvcmFWSHJxOG9GYjhES3ZXa2t6TEt1aHkraXVvK1d3bkxlVjNZbkdoc2thd0swZEh0VUNYM2o4QVV5UnhuZUpNQ1NZdHB2S1JkMk1SVWlQSUpRRnNJSGlFM3Y5Uzl6ejVyZFJIeW9mVE9ubVhRTnkrTHFjMXRmL3FCWkVzeldSMDZacEJjNnlpcXFXZTRyQ1pxbDRxU0NnSWFpVEtSUHhCa015WE5JZ3RsNFJ1bkNLbVpzemptWnVvVG1wd05rbENHTjhHeW85WEpOL083NFRpS1hhUEwwd0tsMkhJbzZrOTVTNzNKMlJwb2ZiM3N3N2pDZGkyQXRMTENlbnl0UnBiT0FzcVgzTm56U25HaFZiaElOY0tzcW9oa1BzSVUwOHdkczM4M1YreGpZZ3RZMzFtWmdMM201OHNRVFN1YXA1cVZIR1QwOGdxaVJIb0FXRzN1SVY5aTJvRFVxZkJKM05ST0JNeGJqTHJTQ0FsY295QUZ4Q3FiL1JIU3JwTXZPdGFnRUNQQUNnemxTYVpYK2NkTWZ1alNYQUxwMFIzV25PbnNmSmkvYzRmWWFWNmRqSkJoeXdKcDVmcDdFWUpKOG1vaWVvc2FhMStENVdMdEVaNVdhU2ppQlJpV1phTzZ4UkhOUElTSXZEeUllZFZsN2x1eEVWRC9oaE1zTmtPN0NmY0ttZyt5UGc5cU1OejhUNitBMnFYRUpqVkFzZ1pMS3JuTWZCWnlDNnBiWmlJeWV1OTlkdThjMnVNR1JUVDRUZi9leGxMNkFPS3lUeUVjdDB2ajhTOThDU2FWTzRUeWhMUjA9PC9kczpYNTA5Q2VydGlmaWNhdGU+PC9kczpYNTA5RGF0YT48L2RzOktleUluZm8+PGRzOk9iamVjdD48eGFkZXM6UXVhbGlmeWluZ1Byb3BlcnRpZXMgeG1sbnM6eGFkZXM9Imh0dHA6Ly91cmkuZXRzaS5vcmcvMDE5MDMvdjEuMy4yIyIgeG1sbnM6eGFkZXN2MTQxPSJodHRwOi8vdXJpLmV0c2kub3JnLzAxOTAzL3YxLjQuMSMiIFRhcmdldD0iI1NpZ25hdHVyZS02NDMyMDgwODIiPjx4YWRlczpTaWduZWRQcm9wZXJ0aWVzIElkPSJTaWduZWRQcm9wZXJ0aWVzLTM3MTM5MDc0MSI+PHhhZGVzOlNpZ25lZFNpZ25hdHVyZVByb3BlcnRpZXM+PHhhZGVzOlNpZ25pbmdUaW1lPjIwMTgtMTEtMjJUMTY6MDA6MDIuMDAwWjwveGFkZXM6U2lnbmluZ1RpbWU+PHhhZGVzOlNpZ25pbmdDZXJ0aWZpY2F0ZT48eGFkZXM6Q2VydD48eGFkZXM6Q2VydERpZ2VzdD48ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnI3NoYTEiLz48ZHM6RGlnZXN0VmFsdWU+TGNKcUFaQnJvR3M3ZkxONDg0RGJ2Q01SNndBPTwvZHM6RGlnZXN0VmFsdWU+PC94YWRlczpDZXJ0RGlnZXN0Pjx4YWRlczpJc3N1ZXJTZXJpYWw+PGRzOlg1MDlJc3N1ZXJOYW1lPkNOPUNBIFBFUlNPTkEgSlVSSURJQ0EgLSBTQU5EQk9YLCBPVT1ER1QsIE89TUlOSVNURVJJTyBERSBIQUNJRU5EQSAtIFNBTkRCT1gsIEM9Q1I8L2RzOlg1MDlJc3N1ZXJOYW1lPjxkczpYNTA5U2VyaWFsTnVtYmVyPjE1MTUyMTYzMTc2NTA8L2RzOlg1MDlTZXJpYWxOdW1iZXI+PC94YWRlczpJc3N1ZXJTZXJpYWw+PC94YWRlczpDZXJ0PjwveGFkZXM6U2lnbmluZ0NlcnRpZmljYXRlPjx4YWRlczpTaWduYXR1cmVQb2xpY3lJZGVudGlmaWVyPjx4YWRlczpTaWduYXR1cmVQb2xpY3lJZD48eGFkZXM6U2lnUG9saWN5SWQ+PHhhZGVzOklkZW50aWZpZXI+aHR0cHM6Ly93d3cuaGFjaWVuZGEuZ28uY3IvQVRWL0NvbXByb2JhbnRlRWxlY3Ryb25pY28vZG9jcy9lc3F1ZW1hcy8yMDE2L3Y0LjIvREdUX1JfNTFfMjAxNl9SZXNvbHVjaW9uX2RlX09ibGlnYXRvcmllZGFkX3BhcmFfZWxfVXNvX2RlX2xvc19Db21wcm9iYW50ZXNfRWxlY3Ryb25pY29zX1Y0LjIucGRmPC94YWRlczpJZGVudGlmaWVyPjwveGFkZXM6U2lnUG9saWN5SWQ+PHhhZGVzOlNpZ1BvbGljeUhhc2g+PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvMDQveG1sZW5jI3NoYTUxMiIvPjxkczpEaWdlc3RWYWx1ZT5ObUk1TmprMVpUaGtOekkwTW1Jek1HSm1aREF5TkRjNFlqVXdOemt6T0RNMk5UQmlPV1V4TlRCa01tSTJZamd6WXpaak0ySTVOVFpsTkRRNE9XUXpNUT09PC9kczpEaWdlc3RWYWx1ZT48L3hhZGVzOlNpZ1BvbGljeUhhc2g+PC94YWRlczpTaWduYXR1cmVQb2xpY3lJZD48L3hhZGVzOlNpZ25hdHVyZVBvbGljeUlkZW50aWZpZXI+PC94YWRlczpTaWduZWRTaWduYXR1cmVQcm9wZXJ0aWVzPjx4YWRlczpTaWduZWREYXRhT2JqZWN0UHJvcGVydGllcz48eGFkZXM6RGF0YU9iamVjdEZvcm1hdCBPYmplY3RSZWZlcmVuY2U9IiNyLWlkLTEiPjx4YWRlczpNaW1lVHlwZT50ZXh0L3htbDwveGFkZXM6TWltZVR5cGU+PC94YWRlczpEYXRhT2JqZWN0Rm9ybWF0PjwveGFkZXM6U2lnbmVkRGF0YU9iamVjdFByb3BlcnRpZXM+PC94YWRlczpTaWduZWRQcm9wZXJ0aWVzPjwveGFkZXM6UXVhbGlmeWluZ1Byb3BlcnRpZXM+PC9kczpPYmplY3Q+PC9kczpTaWduYXR1cmU+CjwvRmFjdHVyYUVsZWN0cm9uaWNhPgo=
	[hacienda_status] => 1
	[hacienda_mensaje] => https://api.comprobanteselectronicos.go.cr/recepcion-sandbox/v1/recepcion/50622111800310167145900100001010000000014147837777
	[status] => 200
)
*/						
			$documento	=	Documento::find( $documento[0]["id"] );
			$documento->timestamps	= false;
			$documento->respuesta	=	$api_response;
			if(isset($result->code) || isset($result->data) || isset($result->clave)){
				/*$documento	=	Documento::find( $documento[0]["id"] );
				$documento->timestamps	= false;
				$documento->respuesta	=	$api_response;*/
				if(isset($result->code)){
					$documento->respuesta_code	=	$result->code;
					$return['code']				=	$result->code;
				}
				if(isset($result->clave)){
					$documento->clave=	$result->clave;
				}
				if(isset($result->data)){
					$documento->xml	=	$result->data;
				}
				/*$documento->save();*/
			}
			$documento->save();

		} catch(Illuminate\Database\QueryException $e) {
			dd($e);
			$return['error']	=	$e;
		} catch(PDOException $e) {
			dd($e);
			$return['error']	=	$e;
		}catch (Exception $e) {
			dd($e);
			$return['error']	=	$e;
		}
		return $return;
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
		$template	=	'';
		$tipo_doc	=	'';
		$titulo		=	'';
		switch($nota_credito->tipo_documento_id){
			case 1:
				$subject 	=	'Se ha enviado la Factura electrónica Nº ' . $numeracion_consecutiva . ' de la cuenta de ' . $nutricionista->nombre;
				$template	=	'factura';
				$tipo_doc	=	'Factura Electrónica';
				$titulo		=	'Factura';
				break;
			case 3:
				$subject 	=	'Se ha enviado la Nota de Crédito Nº ' . $numeracion_consecutiva . ' de la cuenta de ' . $nutricionista->nombre;
				$template	=	'nota_credito';
				$tipo_doc	=	'Nota Crédito';
				$titulo		=	'Nota Cr=c3=a9dito';
			break;
		}
		$data	=	array(
							'numeracion'			=>	$numeracion_consecutiva, 
							'nombre_persona'		=>	$nota_credito->nombre_persona, 
							'nombre_nutricionista'	=>	$nutricionista->nombre, 
							'pdf'					=>	$nota_credito->pdf, 
							'tipo_doc'					=>	$tipo_doc, 
							'titulo'					=>	$titulo, 
							'logo'					=>	$images
						);
		$nota_credito->titulo		=	$titulo;
		$nota_credito->numeracion	=	$numeracion_consecutiva;
		$nota_credito->nutricionista=	$nutricionista->nombre;
		$nota_credito->nutricionista_email=	$nutricionista->email;
		Mail::send('emails.documento', $data, function($message) use ($nota_credito) {			
			$bcc	=	explode(',', env('APP_EMAIL_BCC'));
			/*$subject	=	$nota_credito->titulo . ' N=c2=b0' . $nota_credito->numeracion .' del Emisor: '.$nota_credito->nutricionista;
			$subject	=	str_replace('&ntilde;','=C3=B1',$subject);
			$message->subject('=?utf-8?Q?=F0=9F=93=9D ' . $subject . '?=');*/
			
			$subject	=	$nota_credito->titulo . ' N=c2=b0' . $nota_credito->numeracion .' del Emisor: '.$nota_credito->nutricionista;
			$args	=	array(
										'before_emoji'	=>	'memo',
									);
			$subject=	Helper::emailParseSubject( $subject, $args );						
			$message->subject( $subject );
			
			$message->to($nota_credito->email, $nota_credito->nombre_persona);
			$message->from( $nota_credito->nutricionista_email, $nota_credito->nutricionista );
			$message->cc( $nota_credito->nutricionista_email );
			$message->bcc($bcc);
			
			$file		=	base64_decode( $nota_credito->xml );
			$filename	=	$nota_credito->clave . '.xml';
			$message->attachData($file, $filename, [
                        'mime' => 'application/xml',
                    ]);
		});
	}
	public function deleteFactura__original(Request $request){
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
	public function generarFactura__original(Request $request){
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
		$monto_total	=	0;
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
				$monto_total	+=	$products[$i]["precio"];
			} catch(Illuminate\Database\QueryException $e) {
			  dd($e);
			} catch(PDOException $e) {
			  dd($e);
			}
		}
		DB::table('documentos')
			->where('id', $documento_id)
			->update(['monto_total' => $monto_total]);

		$this->notificarPorCorreo($documento_id, $numeracion_consecutiva);
        // Fin de proceso de creacion de lineas de detalle
		$result = self::makeXML($codigo_seguridad, $documento_id, $nutricionista, $client["nombre"], $nutricionista_ubicacion[0], $products, $factura, "", "01");
		$response   =   Response::json(['message' => 'Proceso de facturacion finalizado exitosamente.', 'data' => $result], 200);
		return $response;
    }
	function makeXML__original($codigo_seguridad, $documento, $nutricionista, $cliente_nombre, $ubicacion, $productos, $factura, $referencia, $tipo){
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
	function notificarPorCorreo__original($nota_credito_id, $numeracion_consecutiva){
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
		$template	=	'';
		$tipo_doc	=	'';
		$titulo		=	'';
		switch($nota_credito->tipo_documento_id){
			case 1:
				$subject 	=	'Se ha enviado la Factura electrónica Nº ' . $numeracion_consecutiva . ' de la cuenta de ' . $nutricionista->nombre;
				$template	=	'factura';
				$tipo_doc	=	'Factura Electrónica';
				$titulo		=	'Factura';
				break;
			case 3:
				$subject 	=	'Se ha enviado la Nota de Crédito Nº ' . $numeracion_consecutiva . ' de la cuenta de ' . $nutricionista->nombre;
				$template	=	'nota_credito';
				$tipo_doc	=	'Nota Crédito';
				$titulo		=	'Nota Cr=c3=a9dito';
			break;
		}
		$data	=	array(
							'numeracion'			=>	$numeracion_consecutiva, 
							'nombre_persona'		=>	$nota_credito->nombre_persona, 
							'nombre_nutricionista'	=>	$nutricionista->nombre, 
							'pdf'					=>	$nota_credito->pdf, 
							'tipo_doc'					=>	$tipo_doc, 
							'titulo'					=>	$titulo, 
							'logo'					=>	$images
						);
		$nota_credito->titulo		=	$titulo;
		$nota_credito->numeracion	=	$numeracion_consecutiva;
		$nota_credito->nutricionista=	$nutricionista->nombre;
		$nota_credito->nutricionista_email=	$nutricionista->email;
		Mail::send('emails.documento', $data, function($message) use ($nota_credito) {			
			$bcc	=	explode(',', env('APP_EMAIL_BCC'));
			$subject	=	$nota_credito->titulo . ' N=c2=b0' . $nota_credito->numeracion .' del Emisor: '.$nota_credito->nutricionista;
			$subject	=	str_replace('&ntilde;','=C3=B1',$subject);
			/*$subject	=	$nota_credito->titulo . ' N=c2=b0' . $subject;*/

			$message->subject('=?utf-8?Q?=F0=9F=93=9D ' . $subject . '?=');				
			
			$message->to($nota_credito->email, $nota_credito->nombre_persona);
			$message->from( $nota_credito->nutricionista_email, $nota_credito->nutricionista );
			$message->cc( $nota_credito->nutricionista_email );
			$message->bcc($bcc);
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
