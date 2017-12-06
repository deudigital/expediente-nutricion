<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Route;
use App\Persona;
use App\Paciente;
use App\Consulta;

use Illuminate\Routing\Controller;

class LoginController extends Controller
{
    function check(Request $request) {
		$consulta	=	Consulta::find(6)
						->orderBy('consulta.fecha', 'DESC')
						-get();
		$response	=	Response::json($consulta, 201);
		return $response;
		$user		=	$request->offsetGet('username');
		$password	=	$request->offsetGet('password');	
		$paciente	=	Paciente::where('usuario','=', $user)
								->where('contrasena','=', $password)->first();
		if(!$paciente){
			$response	=	array(	'error'=>'Unauthorized',
									'message'=>'invalid credentials.',
									'hint'=>'Check the `username` parameter'
								);
			return Response::json($response, 401);
		}
		$request->offsetSet('username', 'danilo@deudigital.com');
		$request->offsetSet('password', 'deudigit');
		$tokenRequest	=	$request->create('/oauth/token', 'POST', $request->all());
        $response		=	Route::dispatch($tokenRequest);
		$statusCode		=	$response->getStatusCode();
		if($statusCode!=200)
			return $response;

		$persona	=	Persona::find($paciente->persona_id);
        $json = (array) json_decode($response->getContent());
		$json['paciente']['id'] = $persona->id;
        $json['paciente']['nombre'] = $persona->nombre;
        $json['paciente']['genero'] = $persona->genero;
        $json['paciente']['telefono'] = $persona->telefono;
        $json['paciente']['celular'] = $persona->celular;
        $json['paciente']['email'] = $persona->email;
		
		$persona	=	Persona::find($paciente->nutricionista_id);
		/*$json['nutricionista']['id'] = $persona->id;*/
        $json['nutricionista']['nombre'] = $persona->nombre;
        $json['nutricionista']['genero'] = $persona->genero;
        $json['nutricionista']['telefono'] = $persona->telefono;
        $json['nutricionista']['celular'] = $persona->celular;
        $json['nutricionista']['email'] = $persona->email;
		
		$paciente	=	Paciente::find($paciente->persona_id);
		$consulta	=	Consulta::find($paciente->persona_id);
		
        $response->setContent(json_encode($json));
        return $response;	
    }
}
