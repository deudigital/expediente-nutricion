<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Route;
use App\Persona;
use App\Paciente;

use Illuminate\Routing\Controller;

class LoginController extends Controller
{
    function check(Request $request) {
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
        $response->setContent(json_encode($json));
        return $response;	
    }
}
