<?php

namespace App\Http\Controllers;

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
}