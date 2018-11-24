<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Mensaje;
use App\Helper;

class MensajeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $registros	=	Mensaje::all();
		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json('Sin Datos', 204);

		return $response;
    }
	private function __getFirstMessage($dia, $hora){
		$message	=	Mensaje::where('ultimo_enviado',null)
									->where('dia', $dia)
									->where('hora', $hora)
									->first();
		return $message;
	}
	private function __getNextMessage($message){
		$next_message	=	Mensaje::where('id', '>', $message->id)
									->where('dia', $message->dia)
									->where('hora', $message->hora)
									->first();
		if(!$next_message){
			$next_message	=	$this->__getFirstMessage($message->dia, $message->hora);
		}
		return $next_message;
	}
	private function __getLastMessage($dia, $hora){
		$message	=	Mensaje::where('ultimo_enviado',1)
									->where('dia', $dia)
									->where('hora', $hora)
									->orderBy('id', 'DESC')
									->first();
		return $message;
	}
	public function getMessage($dia, $hora){
		$message	=	$this->__getLastMessage($dia, $hora);
		if($message){			
			$_next_message	=	$this->__getNextMessage($message);
			$message->ultimo_enviado	=	null;
			$message->save();
			$_next_message->ultimo_enviado	=	1;
			$_next_message->save();
			$message	=	$_next_message;
			
		}else{
			$message	=	$this->__getFirstMessage($dia, $hora);
			$message->ultimo_enviado	=	1;
			$message->save();
		}
		return $message;
	}
	public function enviarMensaje($dia, $hora, $token) {
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
		if(!in_array($dia, array(-1,5,6,0)))
			return abort(404);
		
		if(!in_array($hora, array('am', 'pm')))
			return abort(404);
		
		$message	=	$this->getMessage($dia, $hora);
		
		$response	=	$this->sendToApi($message);
		$response	=	Response::json($response, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	public function sendToApi($message){
		$fields = array(
					'app_id'			=>	'be626b80-303d-4464-a29b-6071c12d47eb',
					'included_segments' =>	array(
												'pruebas'
											),
					'contents' 			=>	array(
												'en'=>	$message->texto,
												'es'=>	$message->texto
											),
					'data'				=>	array(
												'id'=>	$message->id
											)
				);
		$fields	=	json_encode($fields);
		$api_url		=	'https://onesignal.com/api/v1/notifications';
		$http_header	=	array(
								'Content-Type: application/json; charset=utf-8',
								'Authorization: Basic MzYxZjUyMGQtZmM5Yi00MjhjLTgyMzEtMGRmOGI0M2I3YWNh'
							);
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $api_url);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $http_header);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		curl_setopt($ch, CURLOPT_POST, TRUE);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);		
		$response	=	curl_exec($ch);
		curl_close($ch);		
		return $response;
	}
	public function ultimosMensajesEnviados(){
		$message	=	Mensaje::where('ultimo_enviado', 1)
								->get();
		$response	=	Response::json($message, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
/*
	$response = sendMessage();
	$return["allresponses"] = $response;
	$return = json_encode($return);

	$data = json_decode($response, true);
	print_r($data);
	$id = $data['id'];
	print_r($id);

	print("\n\nJSON received:\n");
	print($return);
	print("\n");
*/
}