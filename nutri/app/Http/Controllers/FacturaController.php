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
                        ->where('nutricionistas.persona_id','=',$id)->get();

            $consultas = $consultas->toArray();

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
                        unset($consultas[$i]);
                    }
                }
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

    public function getPersona($id){
        try{
            $persona = DB::table('personas')
                        ->select('*')
                        ->where('id','=',$id)->get();

            $response   =   Response::json($persona, 200, [], JSON_NUMERIC_CHECK);                   
            
        }catch (Illuminate\Database\QueryException $e) {
            dd($e);
        } catch (PDOException $e) {
            dd($e);
        }
        return $response;
    }
}