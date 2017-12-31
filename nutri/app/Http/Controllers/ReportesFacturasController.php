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

    public function getDocumentos($id)
    {        
        try{
        $facturas = DB::table('documentos')->where('nutricionista_id', $id)->get();
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
