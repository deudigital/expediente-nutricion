<?php

namespace App\Http\Controllers;

use App\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use DB;

class ProductosController extends Controller
{
    /**
     * Gets and save products from a given nutritionist.
     *
     * @param  int  $id
     * @return Response
     */

    public function getMeasures(){
        try{
        $measures = DB::table('unidad_medidas')->select('*')->get();
            if(count($measures)>0)
                $response   =   Response::json($measures, 200, [], JSON_NUMERIC_CHECK);
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

    public function getProducts($id)
    {        
        try{
        $products = DB::table('productos')->where('nutricionista_id', $id)->get();
            if(count($products)>0)
                $response   =   Response::json($products, 200, [], JSON_NUMERIC_CHECK);
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

    public function storeProducts(Request $request)
    {
        try{
            $id= DB::table('productos')->insertGetId([
                 'descripcion' => $request->descripcion, 
                 'unidad_medida' => $request->unidad_medida, 
                 'precio' => $request->precio,
                 'nutricionista_id' => $request->nutricionista_id]);
        } catch(Illuminate\Database\QueryException $e) {
            dd($e);
        } catch(PDOException $e) {
            dd($e);
        }

        $message    =   'Su producto ha sido añadido de modo correcto';
        $data       =   $id;
        $response   =   Response::json([
            'message'   =>  $message,
            'data'      =>  $data
        ], 201);
        return $response;
    }

    public function updateProduct(Request $request)
    {
        try{
            DB::table('productos')
            ->where('id', $request->id)
            ->update([
                'descripcion' => $request->descripcion, 
                'unidad_medida' => $request->unidad_medida, 
                'precio' => $request->precio
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

    public function destroy($id)
    {
        DB::table('productos')->where('id', '=', $id)->delete();
        $message    =   array(
                            'code'      => '200',
                            'message'   => 'Se ha eliminado correctamente'
                        );
        $response   =   Response::json($message, 201);
        return $response;
    }
}