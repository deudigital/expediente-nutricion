<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Route;
use App\Persona;
use App\Paciente;
use App\Nutricionista;
use Mail;
use DB;

use Illuminate\Routing\Controller;

class LoginController extends Controller
{
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
/*
			$html 	= '<h3>Datos de Autenticacion</h3>';
			$html 	.= '<table rules="all" style="border-color: #666;" cellpadding="10">';
			$html	.=	'<tr style="background-color: #eee;">';
			$html	.=	'<th>Nombre</th>';
			$html	.=	'<td>' . $paciente->nombre . '</td>';
			$html	.=	'</tr>';
			$html	.=	'<tr>';
			$html	.=	'<th>Usuario</th>';
			$html	.=	'<td>' . $paciente->usuario . '</td>';
			$html	.=	'</tr>';
			$html	.=	'<tr>';
			$html	.=	'<th>Contrasena</th>';
			$html	.=	'<td>' . $paciente->contrasena . '</td>';
			$html	.=	'</tr>';
			$html	.=	'</table>';
			
			$to			=	$paciente->email;
			$subject 	=	'Recordatorio de datos autenticacion en NUTRITRACK';
			$headers 	=	'From: info@nutricion.co.cr' . "\r\n";
			$headers   .=	'Bcc: danilo@deudigital.com,jaime@deudigital.com' . "\r\n";
			$headers   .=	'MIME-Version: 1.0' . "\r\n";
			$headers   .=	'Content-Type: text/html; charset=ISO-8859-1' . "\r\n";
			
			mail($to, $subject, $html, $headers);
*/
			$data	=	array(
							'nombre'	=>	$paciente->nombre, 
							'usuario'	=>	$paciente->usuario, 
							'contrasena'=>	$paciente->contrasena
						);
		
			Mail::send('emails.recordatorio_contrasena', $data, function($message) use ($paciente) {	
				$bcc	=	explode(',', env('APP_EMAIL_BCC'));
				$message->to($paciente->email, $paciente->nombre)
						->subject('Credenciales NutriTrack App | ' . $paciente->nombre);
				$message->from(env('APP_EMAIL_FROM'), env('APP_EMAIL_FROM_NAME'));
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
/*
			$html 	= '<h3>Datos de Autenticacion</h3>';
			$html 	.= '<table rules="all" style="border-color: #666;" cellpadding="10">';
			$html	.=	'<tr style="background-color: #eee;">';
			$html	.=	'<th>Nombre</th>';
			$html	.=	'<td>' . $paciente->nombre . '</td>';
			$html	.=	'</tr>';
			$html	.=	'<tr>';
			$html	.=	'<th>Usuario</th>';
			$html	.=	'<td>' . $paciente->usuario . '</td>';
			$html	.=	'</tr>';
			$html	.=	'<tr>';
			$html	.=	'<th>Contrasena</th>';
			$html	.=	'<td>' . $paciente->contrasena . '</td>';
			$html	.=	'</tr>';
			$html	.=	'</table>';
			
			$to			=	$paciente->email;
			$subject 	=	'Recordatorio de datos autenticacion en NUTRITRACK';
			$headers 	=	'From: info@nutricion.co.cr' . "\r\n";
			$headers   .=	'Bcc: danilo@deudigital.com,jaime@deudigital.com' . "\r\n";
			$headers   .=	'MIME-Version: 1.0' . "\r\n";
			$headers   .=	'Content-Type: text/html; charset=ISO-8859-1' . "\r\n";
			
			mail($to, $subject, $html, $headers);
*/
			$data	=	array(
							'nombre'	=>	$paciente->nombre, 
							'usuario'	=>	$paciente->usuario, 
							'contrasena'=>	$paciente->contrasena
						);
			Mail::send('emails.paciente.change_password', $data, function($message) {
				$message->to($paciente->email, $paciente->nombre);
				$message->subject('Recordatorio de datos autenticacion en NUTRITRACK');
				
				$message->from(env('EMAIL_FROM'), env('EMAIL_FROM_NAME'));
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
