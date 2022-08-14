<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Response;
use Illuminate\Routing\Controller;

use App\Models\Persona;
use App\Models\Paciente;
use App\Models\Nutricionista;
use Route;
use Mail;
use DB;

class LoginController extends Controller
{
    //
    /*	App	*/
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
        $json['paciente']['email'] = $persona->email;
		
		$persona	=	Persona::find($paciente->nutricionista_id);
        $json['nutricionista']['nombre'] = $persona->nombre;
        $json['nutricionista']['genero'] = $persona->genero;
        $json['nutricionista']['telefono'] = $persona->telefono;
        $json['nutricionista']['celular'] = $persona->celular;
        $json['nutricionista']['email'] = $persona->email;
		
        $response->setContent(json_encode($json));
        return $response;	
    }
	public function reminder(Request $request){	
		$email		=	$request->offsetGet('email');
		$paciente = DB::table('pacientes')
						->join('personas', 'personas.id', '=', 'pacientes.persona_id')
						->where('personas.email', $email)
						->get()
						->first();
		/*print_r($paciente);*/
		if(count($paciente)>0){
			/*$nutricionista	=	Nutricionista::find($paciente->nutricionista_id);*/
			$nutricionista = DB::table('nutricionistas')
								->join('personas', 'personas.id', 'nutricionistas.persona_id')
								->where('nutricionistas.persona_id', $paciente->nutricionista_id)
								->get()
								->first();
			$paciente->nutricionista_nombre	=	$nutricionista->nombre;
			$paciente->nutricionista_email	=	$nutricionista->email;
		
			$data	=	array(
							'nombre'	=>	$paciente->nombre, 
							'usuario'	=>	$paciente->usuario, 
							'contrasena'=>	$paciente->contrasena,
							'logo'		=>	$nutricionista->imagen
						);
		
			Mail::send('emails.recordatorio_contrasena', $data, function($message) use ($paciente) {
				
				$subject	=	'Credenciales NutriTrack App | ' . $paciente->nombre;
				$subject	=	htmlentities($subject);
				$subject	=	str_replace('&ntilde;','=C3=B1',$subject);
				
				$bcc	=	explode(',', env('APP_EMAIL_BCC'));
				$message->to($paciente->email, $paciente->nombre)
						->subject('=?utf-8?Q?=F0=9F=94=91 ' . $subject . '?=');
				$message->from( $paciente->nutricionista_email, $paciente->nutricionista_nombre );
				$message->bcc($bcc);
				/*$message->replyTo(env('APP_EMAIL_REPLYTO'));*/
			});
			
			$message	=	array(
								'code'		=> '201',
								'message'	=> 'Se ha enviado un correo electronico con sus datos.'
							);
			$response	=	Response::json($message, 201);
		}else{
			$message	=	array(
								'code'		=> '204',
								'message'	=> 'El correo proporcionado no es valido o no esta registrado.'
							);
			$response	=	Response::json($message, 200);
		}		
		return $response;
    }	
	/*	Web	*/
	function statuscheck(Request $request) {
		/*$response	=	Response::json($request->all(), 200);
		return $response;*/
		$user_id		=	$request->offsetGet('user_id');
		$response	=	array(	'valid'		=>	0,
								'message'	=>	'',
								'action'	=>	'login'
							);
		try{
			$nutricionista	=	Nutricionista::find($user_id);
			if(!$nutricionista)
				return Response::json($response, 200);

			if(!$nutricionista->activo){
				$response['message']	=	'Su cuenta esta desactivada, favor ponerse en contacto con nosotros para solucionar este problema.';
				return Response::json($response, 200);
			}
			$response['valid']	=	1;
			$response['action']	=	'access';
		} catch (\Exception $e) {
			$response['hint']	=	$e->getMessage();
		}
        return $response;	
    }
	function webcheck(Request $request) {
		$response	=	array(	'error'=>'Unauthorized',
								'message'=>'invalid credentials.',
								'hint'=>'Check the `username` parameter'
							);
		try{
			$user		=	$request->offsetGet('email');
			$password	=	$request->offsetGet('password');	
			$nutricionista	=	Nutricionista::where('usuario','=', $user)
									->where('contrasena','=', $password)->first();
			
			if(!$nutricionista)
				return Response::json($response, 401);

			if(!$nutricionista->activo){
				$response['message']	=	'Su cuenta esta desactivada, favor ponerse en contacto con nosotros para solucionar este problema.';
				return Response::json($response, 401);
			}
			$request->offsetSet('client_id', '2');
			$request->offsetSet('client_secret', '0uoQGOsoRODwmhE3xhniXBZsxauD9qobeBFDJyNE');
			$request->offsetSet('grant_type', 'password');
			$request->offsetSet('scope', '*');
			$request->offsetSet('username', 'danilo@deudigital.com');
			$request->offsetSet('password', 'deudigit');
			$tokenRequest	=	$request->create('/oauth/token', 'POST', $request->all());
			$response		=	Route::dispatch($tokenRequest);
			$statusCode		=	$response->getStatusCode();
			if($statusCode!=200)
				return $response;

			$persona	=	Persona::find($nutricionista->persona_id);
			$json = (array) json_decode($response->getContent());		
			
			$json['nutricionista']['id'] = $persona->id;
			$json['nutricionista']['nombre'] = $persona->nombre;
			$json['nutricionista']['genero'] = $persona->genero;
			$json['nutricionista']['telefono'] = $persona->telefono;
			$json['nutricionista']['celular'] = $persona->celular;
			$json['nutricionista']['email'] = $persona->email;
			
			$response->setContent(json_encode($json));
		} catch (\Exception $e) {		
			// something went wrong
			$response['hint']	=	$e->getMessage();
		}
        return $response;	
    }
	public function webReminder(Request $request)
    {	$response	=	Response::json($request->all(), 200);
		return $response;
		$email		=	$request->offsetGet('email');
		$paciente = DB::table('pacientes')
						->join('personas', 'personas.id', '=', 'pacientes.persona_id')
						->where('personas.email', $email)
						->get()
						->first();
		
		if(count($paciente)>0){
			$nutricionista = DB::table('nutricionistas')
								->join('personas', 'personas.id', 'nutricionistas.persona_id')
								->where('nutricionistas.persona_id', $paciente->nutricionista_id)
								->get()
								->first();
			$paciente->nutricionista_nombre	=	$nutricionista->nombre;
			$paciente->nutricionista_email	=	$nutricionista->email;
		
			$data	=	array(
							'nombre'	=>	$paciente->nombre, 
							'usuario'	=>	$paciente->usuario, 
							'contrasena'=>	$paciente->contrasena
						);
			Mail::send('emails.paciente.change_password', $data, function($message) use ($paciente)  {
				$message->to($paciente->email, $paciente->nombre);
				$message->subject('Recordatorio de datos autenticacion en NUTRITRACK');
				$message->from( $paciente->nutricionista_email, $paciente->nutricionista_nombre );
				$message->bcc(env('EMAIL_BCC'));
				$message->replyTo(env('EMAIL_REPLYTO'));
			});
			
			$message	=	array(
								'code'		=> '201',
								'message'	=> 'Se ha enviado un correo electronico con sus datos.'
							);
			$response	=	Response::json($message, 201);
		}else{
			$message	=	array(
								'code'		=> '204',
								'message'	=> 'El correo proporcionado no es valido o no esta registrado.'
							);
			$response	=	Response::json($message, 200);
		}
		
		return $response;
    }	
}
