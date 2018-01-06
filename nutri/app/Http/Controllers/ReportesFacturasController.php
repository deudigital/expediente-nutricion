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
          $result = [];
          $facturas = DB::table('documentos')
            ->join('personas', 'personas.id', '=', 'documentos.persona_id')
            ->where('documentos.nutricionista_id', $id)
            ->get();
          $facturas = $facturas->toArray();
          for ($xi=0; $xi < count($facturas) ; $xi++) {
            $monto=0;
            $facturas[$xi] = json_decode(json_encode($facturas[$xi]),True);
            $productos = DB::table('linea_detalles')
              ->join('productos','productos.id','=','linea_detalles.producto_id')
              ->where('linea_detalles.documento_id',$facturas[$xi]['id'])
              ->get();
            $productos=$productos->toArray();
            for ($xii=0; $xii < count($productos) ; $xii++) {
              $productos[$xii]=json_decode(json_encode($productos[$xii]),True);
            }
            $facturas[$xi]['monto']=$productos;
            /*$obj->numeracion_consecutiva=$facturas[$xi]['numeracion_consecutiva'];
            $obj->nombre=$facturas[$xi]['nombre'];
            $obj->tipo_documento_id=$facturas[$xi]['tipo_documento_id'];
            $obj->fecha = $facturas[$xi]['fecha'];
            $obj->precio= $monto;
            $json= json_decode(json_encode($$obj),True);
            array_push($result,$json);*/
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
}
