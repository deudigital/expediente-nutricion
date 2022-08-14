<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;

use App\Models\Nutricionista;
use App\Models\Persona;
use App\Models\User;
use DB;

class NutricionistaController extends Controller
{
    //
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
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
		$registros = DB::table('nutricionistas')
            ->join('personas', 'personas.id', '=', 'nutricionistas.persona_id')
            ->where('nutricionistas.persona_id', $id)
            ->get();
		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json(['message' => 'Record not found'], 204);
		
		return $response;
    }

    public function getNutricionistas()
    {
		$registros	=	DB::table('nutricionistas')
						->join('personas', 'personas.id', 'nutricionistas.persona_id')
						->select('*')
						->orderBy('personas.id', 'DESC')
						->get();

		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json(['message' => 'Record not found'], 204);
		
		return $response;
    }
	public function backendStore(Request $request){
		
		$user = new User();
		$user->name		=	'jaime_isidro';/*$request->name;*/
		$user->email	=	'jaime_isidro@hotmail.com';/*$request->email;*/
		$user->password	=	bcrypt( $request->password );
		/*$user->remember_token	= $request->_token;*/
		$user->save();
		$message	=	array(
							'code'		=> '201',
							'message'	=> $user
						);
		$response	=	Response::json($message, 201);
		return $response;
		
		
		$request	=	unserialize($request['request']);
		$action	=	'editado';
		if($request['id'] && $request['id']!=0){
			$persona						=	Persona::find($request['id']);
			$persona->nombre				=	$request['nombre'];
			$persona->tipo_idenfificacion_id=	$request['tipo_idenfificacion_id'];
			$persona->genero				=	$request['genero'];
			$persona->cedula				=	$request['cedula'];
			$persona->email					=	$request['email'];
			$persona->ubicacion_id			=	$request['ubicacion_id'];
			$persona->save();

			$nutricionista									=	Nutricionista::find($request['id']);
			$nutricionista->nombre_comercial				=	$request['nombre_comercial'];
			$nutricionista->usuario							=	$request['email'];
			$nutricionista->contrasena						=	$request['contrasena'];
			$nutricionista->carne_cpn						=	$request['carne_cpn'];
			$nutricionista->descuento_25_consultas			=	$request['descuento_25_consultas'];
			$nutricionista->activo							=	$request['activo']=='on';
			$nutricionista->save();
		}else{$action	=	'registrado';
			$aPersona	=	array(
								'nombre'				=>	$request['nombre'],
								'tipo_idenfificacion_id'=>	$request['tipo_idenfificacion_id'],
								'genero'				=>	$request['genero'],
								'cedula'				=>	$request['cedula'],
								'email'					=>	$request['email'],
								'ubicacion_id'			=>	$request['ubicacion_id']
							);

			$persona	=	Persona::create($aPersona);
			if($persona->id){
				$nutricionista	=	Nutricionista::create([
								'persona_id'					=>	$persona->id,
								'nombre_comercial'				=>	$request['nombre_comercial'],
								'usuario'						=>	$request['email'],
								'contrasena'					=>	$request['contrasena'],
								'carne_cpn'						=>	$request['carne_cpn'],
								'descuento_25_consultas'		=>	$request['descuento_25_consultas'],
								'activo'						=>	$request['activo']=='on',
							]);
				$nutricionista->save();
			}
		}
		$response	=	Response::json(['result'=>true], 201, [], JSON_NUMERIC_CHECK);
		return $response;
	}

	public function status($id){
		$registros	=	Nutricionista::where('persona_id', $id)
						->where('nutricionistas.activo', '1')
						->get()
						->first();
		$response	=	Response::json(['activo' => count($registros)>0], 201);
		return $response;
    }
}
