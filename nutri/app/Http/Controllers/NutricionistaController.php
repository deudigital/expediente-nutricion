<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Nutricionista;
use App\Persona;
use DB;
class NutricionistaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
		$registros	=	Nutricionista::All();
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
		/*$registros	=	Nutricionista::find($id);*/
		$registros = DB::table('nutricionistas')
            ->join('personas', 'personas.id', '=', 'nutricionistas.persona_id')
            ->where('nutricionistas.persona_id', $id)
            ->get();
		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json(['message' => 'Record not found'], 204);
		
		/*$response	=	Response::json($response, 200, [], JSON_NUMERIC_CHECK);*/
		return $response;
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
    public function getNutricionistas()
    {
		$registros	=	DB::table('nutricionistas')
						->join('personas', 'personas.id', 'nutricionistas.persona_id')
						->select('*')
						->get();

		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json(['message' => 'Record not found'], 204);
		
		return $response;
    }
	public function backendStore(Request $request){
		$request	=	unserialize($request['request']);
		/*$response	=	Response::json($request, 200, [], JSON_NUMERIC_CHECK);
		return $response;*/
		$action	=	'editado';
		
/*
Array
(
    [id] => 199
    [nombre] => Pruebas DeuDigital Development abc
    [tipo_idenfificacion_id] => 2
    [cedula] => 3101671459666
    [email] => pruebas@deudigital.com
    [ubicacion_id] => 

    [nombre_comercial] => Anytime Nutrition, LLC abc
    [usuario] => 
    [contrasena] => probando abc
    [carne_cpn] => 
    [descuento_25_consultas] => 
    [activo] => on
)
*/
		/*if($request['persona_id'] && $request['persona_id']!=0){*/
		if($request['id'] && $request['id']!=0){
			$persona						=	Persona::find($request['id']);
			$persona->nombre				=	$request['nombre'];
			$persona->tipo_idenfificacion_id=	$request['tipo_idenfificacion_id'];
			$persona->cedula				=	$request['cedula'];
			$persona->email					=	$request['email'];
			$persona->ubicacion_id			=	$request['ubicacion_id'];
			$persona->save();

			$nutricionista									=	Nutricionista::find($request['id']);
			$nutricionista->nombre_comercial				=	$request['nombre_comercial'];
			$nutricionista->usuario							=	$request['usuario'];
			$nutricionista->contrasena						=	$request['contrasena'];
			$nutricionista->carne_cpn						=	$request['carne_cpn'];
			$nutricionista->descuento_25_consultas			=	$request['descuento_25_consultas'];
			/*$nutricionista->atv_ingreso_id					=	$request['atv_ingreso_id'];
			$nutricionista->atv_ingreso_contrasena			=	$request['atv_ingreso_contrasena'];
			$nutricionista->atv_llave_criptografica			=	$request['atv_llave_criptografica'];
			$nutricionista->atv_clave_llave_criptografica	=	$request['atv_clave_llave_criptografica'];*/
			$nutricionista->activo							=	$request['activo']=='on';
			$nutricionista->save();
		}else{$action	=	'registrado';
			/*	persona	*/
			$aPersona	=	array(
								'nombre'				=>	$request['nombre'],
								'tipo_idenfificacion_id'=>	$request['tipo_idenfificacion_id'],
								'cedula'				=>	$request['cedula'],
								'email'					=>	$request['email'],
								'ubicacion_id'			=>	$request['ubicacion_id']
							);

			$persona	=	Persona::create($aPersona);
			//$persona->save();
			if($persona->id){
				$nutricionista	=	Nutricionista::create([
								'persona_id'					=>	$persona->id,
								'nombre_comercial'				=>	$request['nombre_comercial'],
								'usuario'						=>	$request['usuario'],
								'contrasena'					=>	$request['contrasena'],
								'carne_cpn'						=>	$request['carne_cpn'],
								'descuento_25_consultas'		=>	$request['descuento_25_consultas'],
								/*'atv_ingreso_id'				=>	$request['atv_ingreso_id'],
								'atv_ingreso_contrasena'		=>	$request['atv_ingreso_contrasena'],
								'atv_llave_criptografica'		=>	$request['atv_llave_criptografica'],
								'atv_clave_llave_criptografica'	=>	$request['atv_clave_llave_criptografica'],*/
								'activo'						=>	$request['activo']=='on',
							]);
				$nutricionista->save();
			}
		}
		$response	=	Response::json(['result'=>'true'], 201, [], JSON_NUMERIC_CHECK);
		return $response;
	}
}
