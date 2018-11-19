<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Persona;
use App\Cliente;
use App\Agenda;
use App\AgendaServicio;
use App\Helper;
use DB;
use Mail;

class AgendaController extends Controller
{
    //
	public function select($nutricionista_id, $date_epoch){
		$date		=	date("Y-m-d", substr($date_epoch, 0, 10));
		$registros	=	DB::table('agendas')
							->join('agenda_servicios', 'agenda_servicios.id', '=', 'agendas.agenda_servicio_id')
							->join('personas', 'personas.id', '=', 'agendas.persona_id')
							->where('agendas.nutricionista_id', $nutricionista_id)
							->where('agendas.status','>', 0)
							->where('agendas.date', $date)
							->select(	'agendas.*',
										'agenda_servicios.nombre as agenda_servicio_nombre', 'agenda_servicios.duracion as agenda_servicio_duracion', 
										'personas.nombre as persona_nombre', 'personas.email', 'personas.telefono')
							->orderBy('agendas.militartime', 'ASC')
							->get();

		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	public function selectServicios($nutricionista_id){
		$registros	=	AgendaServicio::where('nutricionista_id', $nutricionista_id)
						->get();
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	public function store(Request $request)
    {
		$date	=	date("Y-m-d", substr($request->date, 0, 10));
		$agenda	=	Agenda::where('militartime', $request->militartime)
							->where('status', '>', 0)
							->where('date', $date)
							->where('nutricionista_id', $request->nutricionista_id)
							->get()
							->first();

		if(isset($request->id) && $request->id > 0){
			$action	=	'editado';
			$agenda	=	Agenda::find( $request->id );
			$agenda->date				=	$date;
			$agenda->militartime		=	$request->militartime;
			$agenda->agenda_servicio_id	=	$request->agenda_servicio_id;
			$agenda->nutricionista_id	=	$request->nutricionista_id;
			$agenda->persona_id			=	$request->persona_id;
			$agenda->notas				=	$request->notas;
			$agenda->telefono			=	$request->telefono;
			$agenda->email				=	$request->email;
			$agenda->save();
		}else{
			if($agenda){
				$message	=	array(
								'code'		=> '208',
								'data'		=> $agenda,
								'message'	=> 'Ya haz agendado una Cita para este Horario'
							);
				$response	=	Response::json($message, 200, [], JSON_NUMERIC_CHECK);
				return $response;
			}
			$persona_id	=	$request['persona_id'];
			if($persona_id==0){
				$aPersona	=	array(
								'nombre'	=>	$request->input('persona_nombre'),
								'email'		=>	$request->input('email'),
								'telefono'	=>	$request->input('telefono'),
								'genero'	=>	'',
							);
				$persona	=	Persona::create($aPersona);
				$persona_id	=	$persona->id;
				$cliente	=	Cliente::create([
												'persona_id'			=>	$persona->id,
												'nutricionista_id'		=>	$request->input('nutricionista_id'),
												'tipo_identificacion_id'=>	1
											]);
				$cliente->save();
			}
			$action	=	'registrado';
			$agenda	=	Agenda::create([
										'date'				=>	$date,
										'militartime'		=>	$request['militartime'],
										'status'			=>	1,
										'token'				=>	str_random(40),
										'agenda_servicio_id'=>	$request['agenda_servicio_id'],
										'nutricionista_id'	=>	$request['nutricionista_id'],
										'persona_id'		=>	$persona_id,
										'notas'				=>	$request['notas'],
										'telefono'			=>	$request['telefono'],
										'email'				=>	$request['email'],
									]);
			/*	'persona_id'		=>	$request['persona_id'],	*/
			$agenda->date_epoc	=	$request->date;
			$this->sendEmails($agenda, 'nuevo');
		}
		$message	=	array(
							'code'		=> '201',
							'data'		=> $agenda,
							'message'	=> 'Se ha ' . $action . ' correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
	public function storeServicio(Request $request)
    {
        $agendaServicio	=	AgendaServicio::create([
													'nombre'			=>	$request['nombre'],
													'duracion'			=>	$request['duracion'],
													'nutricionista_id'	=>	$request['nutricionista_id'],
												]);

		$message	=	array(
							'code'		=> '201',
							'data'		=> $agendaServicio,
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
	public function deleteServicio(Request $request)
    {
		$deletedRows	=	AgendaServicio::where([
														['id', '=',$request->id],
													])
												->delete();
		$message	=	array(
							'code'		=> '201',
							'message'	=> 'Se ha eliminado correctamente'
						);
        $response	=	Response::json($message, 201);
		return $response;
    }
	
	public function confirmarAsistencia($token){
		$token_decoded	=	base64_decode(base64_decode($token));
		$params	=	explode('-', $token_decoded);
		$token		=	$params[0];
		$militarTime=	$params[1];
		$respuesta	=	$params[2];/*true/false*/
		$agenda	=	Agenda::where('militartime', $militarTime)
							->where('status', 1)
							->where('token', $token)
							->where('confirmado_por_correo', 0)
							->get()
							->first();
		if(!$agenda){
			/*$response	=	Response::json('Token Invalido', 201);
			return $response;*/
			return abort(404);
		}
		$agenda->status	=	$respuesta=='true'? 2:0;
		$agenda->confirmado_por_correo	=	1;
		$agenda->save();

		$data	=	array();
		return view('emails.confirmar_cita');
	}
	public function confirmar($agenda_id){
		$agenda	=	Agenda::find( $agenda_id );
		$agenda->status	=	2;
		$agenda->save();
		
		$this->sendEmails($agenda, 'confirmar');
		$message	=	array(
							'code'		=> '201',
							'data'		=> $agenda,
							'message'	=> 'La Cita Se ha Confirmado'
						);
		$response	=	Response::json($message, 201);
		return $response;
	}
	public function cancelar($agenda_id){
		$agenda	=	Agenda::find( $agenda_id );
		$agenda->status	=	0;
		$agenda->save();
		
		$this->sendEmails($agenda, 'cancelar');
		$message	=	array(
							'code'		=> '201',
							'data'		=> $agenda,
							'message'	=> 'La Cita Se ha Cancelado'
						);
		$response	=	Response::json($message, 201);
		return $response;
	}
	public function prepareDataForEmail($agenda, $action){
		$persona		=	Persona::find($agenda->persona_id);
		$nutricionista	=	DB::table('nutricionistas')
								->join('personas', 'personas.id', 'nutricionistas.persona_id')
								->where('nutricionistas.persona_id', $agenda->nutricionista_id)
								->get()
								->first();

		$agenda->date_epoc	=	strtotime($agenda->date);
		$image	=	'https://expediente.nutricion.co.cr/mail/images/logo.png';
		if($nutricionista->imagen)
			$image	=	$nutricionista->imagen;

		$_date	=	explode(',',date('w,j,n,Y', substr($agenda->date_epoc, 0, 10)));// 10, 3, 2001
		$meses	=	array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
		$dias	=	array('Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado');

		$time	=	Helper::convertTimeMilitarToTimeStandard( $agenda->militartime );
		$data	=	array(
							'logo'					=>	$image, 
							'nombre_paciente'		=>	$persona->nombre, 
							'dia_de_la_semana'		=>	$dias[$_date[0]], 
							'dia'					=>	$_date[1], 
							'mes_en_letras'			=>	$meses[$_date[2]-1],
							'aaaa'					=>	$_date[3], 
							'hhmm'					=>	$time->hm, 
							'ampm'					=>	$time->ampm,
							'nombre_nutricionista'	=>	$nutricionista->nombre
						);
		$persona->nutricionista_nombre	=	$nutricionista->nombre;
		$persona->nutricionista_email	=	$nutricionista->email;
		
		if($action=='confirmar_cita'){
			$token_si	=	base64_encode(base64_encode($agenda->token . '-' . $agenda->militartime . '-true'));
			$token_no	=	base64_encode(base64_encode($agenda->token . '-' . $agenda->militartime . '-false'));
			$data['link_confirmacion_de_cita_si']	=	env('APP_URL') . '/api/web/asistencia/' . $token_si;
			$data['link_confirmacion_de_cita_no']	=	env('APP_URL') . '/api/web/asistencia/' . $token_no;
		}		
		$app			=	app();
		$return			=	$app->make('stdClass');
		$return->persona=	$persona;
		$return->data	=	$data;
		return $return; 
	}
	
	public function sendEmails($agenda, $action){
		$res	=	$this->prepareDataForEmail($agenda, $action);
		$data	=	$res->data;
		$persona=	$res->persona;
		switch($action){
			case 'nuevo':
					Mail::send('emails.nueva_cita_paciente', $data, function($message) use ($persona) {
						$bcc		=	explode(',', env('APP_EMAIL_BCC'));
						$subject	=	$persona->nombre . ', tu cita con ' . $persona->nutricionista_nombre . ' ha sido agendada';						
						$args	=	array(
										'before_emoji'	=>	'tangerine',
									);
						$subject=	Helper::emailParseSubject( $subject, $args );						
						$message->subject( $subject );
						$message->to( $persona->email, $persona->nombre );
						$message->from( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->sender( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->bcc($bcc);
						$message->replyTo(env('APP_EMAIL_AGENDA_REPLYTO'));
					});

					Mail::send('emails.nueva_cita_nutricionista', $data, function($message) use ($persona) {
						$bcc		=	explode(',', env('APP_EMAIL_BCC'));
						$subject	=	' Tu cita con ' . $persona->nombre . ' ha sido agendada';
						$args	=	array(
										'before_emoji'	=>	'tangerine',
									);
						$subject=	Helper::emailParseSubject( $subject, $args );						
						$message->subject( $subject );
						$message->to( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->from( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->sender( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->bcc($bcc);
						$message->replyTo(env('APP_EMAIL_AGENDA_REPLYTO'));
					});
				break;
			case 'confirmar':
					Mail::send('emails.cita_confirmada_paciente', $data, function($message) use ($persona) {
						$bcc		=	explode(',', env('APP_EMAIL_BCC'));
						$subject	=	$persona->nombre . ', tu cita con ' . $persona->nutricionista_nombre . ' ha sido confirmada';
						$args	=	array(
								'before_emoji'	=>	'smiling_face_with_smiling_eyes',
								'after_emoji'	=>	'heavy_check_mark'
							);
						$subject=	Helper::emailParseSubject( $subject, $args );
						$message->subject( $subject );
						$message->to( $persona->email, $persona->nombre );
						$message->from( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->sender( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->bcc($bcc);
						$message->replyTo(env('APP_EMAIL_AGENDA_REPLYTO'));
					});
					Mail::send('emails.cita_confirmada_nutricionista', $data, function($message) use ($persona) {
						$bcc		=	explode(',', env('APP_EMAIL_BCC'));
						$subject	=	$persona->nutricionista_nombre . ', tu cita con ' . $persona->nombre . ' ha sido confirmada';
						$args	=	array(
								'before_emoji'	=>	'smiling_face_with_smiling_eyes',
								'after_emoji'	=>	'heavy_check_mark'
							);
						$subject=	Helper::emailParseSubject( $subject, $args );
						$message->subject( $subject );						
						$message->to( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->from( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->sender( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->bcc($bcc);
						$message->replyTo(env('APP_EMAIL_AGENDA_REPLYTO'));
					});
				break;
			case 'cancelar':
					$data['link_confirmacion_de_cita_si']	=	env('APP_URL') . '/api/web/asistencia/' . $agenda->token . '/true';
					$data['link_confirmacion_de_cita_no']	=	env('APP_URL') . '/api/web/asistencia/' . $agenda->token . '/false';
					Mail::send('emails.cita_cancelada_paciente', $data, function($message) use ($persona) {
						$bcc		=	explode(',', env('APP_EMAIL_BCC'));
						$subject	=	$persona->nombre . ', tu cita con ' . $persona->nutricionista_nombre . ' ha sido cancelada';
						$args	=	array(
								'before_emoji'	=>	'disappointed_face',
								'after_emoji'	=>	'heavy_multiplication_x'
							);
						$subject=	Helper::emailParseSubject( $subject, $args );						
						$message->subject( $subject );
						$message->to( $persona->email, $persona->nombre );
						$message->from( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->sender( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->bcc($bcc);
						$message->replyTo(env('APP_EMAIL_AGENDA_REPLYTO'));
					});
					Mail::send('emails.cita_cancelada_nutricionista', $data, function($message) use ($persona) {
						$bcc		=	explode(',', env('APP_EMAIL_BCC'));
						$subject	=	$persona->nutricionista_nombre . ', tu cita con ' . $persona->nombre . ' ha sido cancelada';
						$args	=	array(
								'before_emoji'	=>	'disappointed_face',
								'after_emoji'	=>	'heavy_multiplication_x'
							);
						$subject=	Helper::emailParseSubject( $subject, $args );						
						$message->subject( $subject );
						$message->to( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->from( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->sender( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->bcc($bcc);
						$message->replyTo(env('APP_EMAIL_AGENDA_REPLYTO'));
					});
				break;
			
			case 'confirmar_cita':
					Mail::send('emails.confirmar_cita', $data, function($message) use ($persona) {
						$bcc		=	explode(',', env('APP_EMAIL_BCC'));
						$subject	=	$persona->nombre . ', tu cita con ' . $persona->nutricionista_nombre . ' es mañana';
						$args	=	array(
								'before_emoji'	=>	'watermelon'
							);					
						$subject=	Helper::emailParseSubject( $subject );
						$message->subject( $subject );
						$message->to( $persona->email, $persona->nombre );
						$message->from( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->sender( $persona->nutricionista_email, $persona->nutricionista_nombre );
						$message->bcc($bcc);
						$message->replyTo(env('APP_EMAIL_AGENDA_REPLYTO'));
					});
				break;
		}
		
	}
	public function viewEmails($agenda, $action){
		$res	=	$this->prepareDataForEmail($agenda, $action);
		switch($action){
			case 'nuevo':
					$view	=	'<h3 style="text-align:center">Paciente</h3>';
					$view	.=	view('emails.nueva_cita_paciente', $res->data);
					$view	.=	'<h3 style="text-align:center">Nutricionista</h3>';
					$view	.=	view('emails.nueva_cita_nutricionista', $res->data);
					
				break;
			case 'confirmar':
					$view	=	'<h3 style="text-align:center">Paciente</h3>';
					$view	.=	view('emails.cita_confirmada_paciente', $res->data);
					$view	.=	'<h3 style="text-align:center">Nutricionista</h3>';
					$view	.=	view('emails.cita_confirmada_nutricionista', $res->data);					
				break;
			case 'cancelar':
					$view	=	'<h3 style="text-align:center">Paciente</h3>';
					$view	.=	view('emails.cita_cancelada_paciente', $res->data);
					$view	.=	'<h3 style="text-align:center">Nutricionista</h3>';
					$view	.=	view('emails.cita_cancelada_nutricionista', $res->data);
				break;
			case 'confirmar_cita':
					$view	=	'<h3 style="text-align:center">Paciente</h3>';
					$view	.=	view('emails.confirmar_cita', $res->data);
				break;
		}
		return $view;
	}
	public function test(){
		/*return str_random(40);*/
/*
		$subject=	'Sáléníócú Peña, tu cita con Freud ha sido confirmada';
		$args	=	array(
								'before_emoji'	=>	'smiling_face_with_smiling_eyes',
								'after_emoji'	=>	'heavy_check_mark'
							);
		return Helper::emailParseSubject( $subject, $args );
*/
		$data	=	array();
		$message	=	'Testing successfully';
		try{
			Mail::send('emails.test', $data, function($message){
				$subject=	' Sáléníócú Peña, tu cita con Freud ha sido confirmada ';
				/*$args	=	array(
								'before_emoji'	=>	'smiling_face_with_smiling_eyes',
								'after_emoji'	=>	'heavy_check_mark'
							);
				$subject=	Helper::emailParseSubject( $subject, $args );*/
				/*$args	=	array(
								'before_emoji'	=>	'smiling_face_with_smiling_eyes',
							);
				$subject=	Helper::emailParseSubject( $subject, $args );*/
				/*
				$args	=	array(
								'after_emoji'	=>	'heavy_check_mark'
							);
				$subject=	Helper::emailParseSubject( $subject, $args );
				*/
				$subject=	Helper::emailParseSubject( $subject );

				$bcc		=	explode(',', env('APP_EMAIL_BCC'));
				$message->subject( $subject );
				$message->to( 'jaime@deudigital.com' );
				$message->from(env('APP_EMAIL_FROM'), env('APP_EMAIL_FROM_NAME'));
				$message->bcc($bcc);
			});
		}
		catch(\Exception $e){
			$message	=	$e;
		}
					
		return $message;
	}


	public function testEmails($agenda_id, $mode, $action){
		$agenda	=	Agenda::find( $agenda_id );
		switch($mode){
			case 'view':
				echo $this->viewEmails($agenda, $action);
				break;
			case 'email':
				echo $this->sendEmails($agenda, $action);
				break;
		}
	}
	public function belongsToNutricionista($nutricionista_id){
		return Helper::getPacientesClientes( $nutricionista_id );
		
	}
	public function recordatorio($token){
		$access_token	=	array(
								'LrWnLh2EE7ZL0senjMgGA16A9N6gKBm2nrLpfDLn',
								'nEa08tDwBzXUHJ6ttivgBq6TdrRdrehB9b6lcFQq',
								'GVfPA24Hv4REhq0ZAZ8Vj7Sk6Ns6WFnMOPIko0iH',
								'fbjx0wf7p1iFmFs7ntIU9uaC7OXNbS3umSr0SYeJ',
								'mIhLvp0axy8udGkpRlbIDt2KBwvJhykAgBXiszWN'
							);
		if(!in_array($token, $access_token)){
			return abort(404);
		}
			
		$citas	=	Agenda::where('date', DB::raw('(CURDATE() + INTERVAL 1 DAY)'))
							->where('status', 1)
							->get();
		$nutricionista_id		=	0;
		$nutricionista_count	=	0;
		$emails_notificatified	=	array();
		if(count($citas)==0){
			$response	=	Response::json(array('mensaje'=>'No hay Citas programadas!'), 201);
			return $response;
		}

		foreach($citas as $agenda){
			$this->sendEmails($agenda, 'confirmar_cita');
			if($nutricionista_id!=$agenda->nutricionista_id){
				$nutricionista_id	=	$agenda->nutricionista_id;
				$nutricionista_count++;
			}
			$emails_notificatified[]	=	$agenda->nutricionista_id . ': ' . $agenda->date . ' - ' . $agenda->email . ' - ' . str_random(40);
		}
		$message	=	array(
							'resumen'		=>	array(
														'Emails de Notificion enviadas'	=>	count( $emails_notificatified ),
														'Nutricionistas con citas'		=>	$nutricionista_count
													),
							'detalle'	=>	$emails_notificatified
							);
		
		$response	=	Response::json($message, 201);
		return $response;
	}
}
