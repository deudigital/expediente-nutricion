<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Route;
use App\Persona;
use App\Paciente;
use App\Nutricionista;

//use Mail;
use DB;

use Illuminate\Routing\Controller;

class LoginController extends Controller
{
    function webcheck(Request $request) {
		/**/
		$user		=	$request->offsetGet('email');
		$password	=	$request->offsetGet('password');	
		$nutricionista	=	Nutricionista::where('usuario','=', $user)
								->where('contrasena','=', $password)->first();
		if(!$nutricionista){
			$response	=	array(	'error'=>'Unauthorized',
									'message'=>'Credenciales Inválidos',
									'hint'=>'Check the `username` parameter'
								);
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
        return $response;	
    }
    function check(Request $request) {
		$user		=	$request->offsetGet('username');
		$password	=	$request->offsetGet('password');	
		$paciente	=	Paciente::where('usuario','=', $user)
								->where('contrasena','=', $password)->first();
		if(!$paciente){
			$response	=	array(	'error'=>'Unauthorized',
									'message'=>'Credenciales Inválidos',
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
        /*$json['paciente']['telefono'] = $persona->telefono;
        $json['paciente']['celular'] = $persona->celular;*/
        $json['paciente']['email'] = $persona->email;
		
		$persona	=	Persona::find($paciente->nutricionista_id);
		/*$json['nutricionista']['id'] = $persona->id;*/
        $json['nutricionista']['nombre'] = $persona->nombre;
        $json['nutricionista']['genero'] = $persona->genero;
        $json['nutricionista']['telefono'] = $persona->telefono;
        $json['nutricionista']['celular'] = $persona->celular;
        $json['nutricionista']['email'] = $persona->email;
		
        $response->setContent(json_encode($json));
        return $response;	
    }

	public function reminder(Request $request)
    {	
		$email		=	$request->offsetGet('email');
/*
		$persona	=	Persona::where('email','=', $email)
								->first();
*/
		$paciente = DB::table('pacientes')
						->join('personas', 'personas.id', '=', 'pacientes.persona_id')
						->where('personas.email', $email)
						->get()
						->first();
		
		if(count($paciente)>0){
/*			$html 	= '<h3>Datos de Autenticacion</h3>';
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
			$html	.=	'</table>';*/
			$html	=	'<div style="text-align:center;margin-bottom:20px">';
			$html	.=	'<img src="https://expediente.nutricion.co.cr/mail/images/logo.png" width="180" />';
			$html	.=	'</div>';
			$html	.=	'<p>' . $paciente->nombre . ', recibimos una solicitud de reenviar tu contraseña de ingreso al app de NutriTrack, te recordamos que los credenciales para ingresar son los siguientes:</p>';
			$html	.=	'<p>Usuario: ' . $paciente->usuario . '</p>';
			$html	.=	'<p>Contraseña: ' . $paciente->contrasena . '</p>';
			$to			=	$paciente->email;
			$subject 	=	'NutriTrack- ¿Olvidó su contraseña?';
			$headers 	=	'From: info@nutricion.co.cr' . "\r\n";
			$headers   .=	'CC: danilo@deudigital.com' . "\r\n";
			$headers   .=	'Bcc: jaime@deudigital.com, inv_jaime@yahoo.com' . "\r\n";
			$headers   .=	'MIME-Version: 1.0' . "\r\n";
			$headers   .=	'Content-Type: text/html; charset=ISO-8859-1' . "\r\n";
			
			mail($to, $subject, utf8_decode($html), $headers);
			/*Mail::send('emails.reminder', ['persona' => $persona], function ($m) use ($persona) {
				$m->from('support@nutricion.co.cr', 'NUTRITRACK');

				//$m->to($persona->email, $persona->nombre)->subject('Your Reminder!');
				$m->to('inv_jaime@yahoo.com', $persona->nombre)->subject('Your Reminder!');
			});*/
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
	public function webReminder(Request $request)
    {	/*$response	=	Response::json($request->all(), 200);
		return $response;*/
		$email		=	$request->offsetGet('reminder');
		$nutricionista = DB::table('nutricionistas')
						->join('personas', 'personas.id', '=', 'nutricionistas.persona_id')
						->where('personas.email', $email)
						->get()
						->first();
		
		if(count($nutricionista)>0){
			$html	=	'<div style="text-align:center;margin-bottom:20px">';
			$html	.=	'<img src="https://expediente.nutricion.co.cr/mail/images/logo.png" width="180" />';
			$html	.=	'</div>';
			$html	.=	'<p>' . $nutricionista->nombre . ', recibimos una solicitud de reenviar tu contraseña de ingreso al sistema de expediente, le recordamos que tus credenciales son los siguientes:</p>';
			$html	.=	'<p>Usuario: ' . $nutricionista->usuario . '</p>';
			$html	.=	'<p>Contraseña: ' . $nutricionista->contrasena . '</p>';

			$to			=	'inv_jaime@yahoo.com';
			$subject 	=	'Credenciales Expediente NutriTrack';
			$headers 	=	'From: info@nutricion.co.cr' . "\r\n";
			$headers   .=	'CC: danilo@deudigital.com' . "\r\n";
			$headers   .=	'Bcc: jaime@deudigital.com, inv_jaime@yahoo.com' . "\r\n";
			$headers   .=	'MIME-Version: 1.0' . "\r\n";
			$headers   .=	'Content-Type: text/html; charset=ISO-8859-1' . "\r\n";
			
			mail($to, $subject, utf8_decode($html), $headers);
			$message	=	array(
								'code'		=> '201',
								'message'	=> 'Si el correo electrónico está registrado, te reenviaremos tus credenciales al mismo.'
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
