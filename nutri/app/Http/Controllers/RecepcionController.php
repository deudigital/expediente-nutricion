<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Nathanmac\Utilities\Parser\Parser;
use App\Recepcion;
use App\Nutricionista;
use App\Helper;
use DB;
use Mail;

class RecepcionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function importar(Request $request)
    {
		$file			=	$request->file('file');
		$destination	=	public_path('/recepcion');
		$filename		=	$request->nutricionista_id . '-' . time() . '.' . $file->getClientOriginalExtension();

		$file->move($destination, $filename);

		$xml_content	=	file_get_contents( $destination . '/' . $filename );
		$parser 		=	new Parser();
		$xml			=	$parser->xml( $xml_content );

		$errorMessage	=	$this->existeDatosErroneosXML($xml, $request->nutricionista_id);
		if($errorMessage){
			global $xml_missing;
			$response['error']	=	$errorMessage;
			$response['missing']=	$xml_missing;
			return Response::json($response, 200);
		}
		
		$_numeracion_consecutiva	=	Helper::getLastNumberConsecutiveRecepcion($request->nutricionista_id, $request->tipo_documento_id);
		
		$response['xml']	=	$xml;

		$emisor			=	$xml['Emisor'];
		$receptor		=	$xml['Receptor'];
		$resumen_factura=	$xml['ResumenFactura'];
/*
 *	05:	Confirmación de aceptación del comprobante electrónico (aceptación completa)
 *	06:	Confirmación de aceptación parcial del comprobante electrónico (aceptación parcial)
 *	07:	Confirmación de rechazo del comprobante electrónico (rechazo completo)
 */
		$tipo			=	'0' . $request->tipo_documento_id;
		/*$mensaje		=	1;*/
		$mensaje		=	$request->tipo_documento_id - 4;
		$detalle_mensaje=	$request->mensaje;
		$nutricionista	=	Nutricionista::find( $request->nutricionista_id );
		$_json['api_key']	=	$nutricionista->token;
		$_json['clave']		=	array(
									'tipo'						=>	$tipo,
									'sucursal'					=>	'1',
									'terminal'					=>	'1',
									'numero_documento'			=>	$xml['Clave'], /*'50601111700310138283800100001010000000041125653036',*/
									'numero_cedula_emisor'		=>	$emisor['Identificacion']['Numero'],/*'3101382836',*/
									'fecha_emision_doc'			=>	$xml['FechaEmision'], /*'2017-11-28T09:08:22-06:00',*/
									'mensaje'					=>	$mensaje,
									'detalle_mensaje'			=>	$detalle_mensaje,/*'COMENTARIOS GENERALES',*/
									'monto_total_impuesto'		=>	$resumen_factura['TotalImpuesto'],/*'0',*/
									'total_factura'				=>	$resumen_factura['TotalComprobante'],/*'2900',*/
									'numero_cedula_receptor'	=>	$receptor['Identificacion']['Numero'],/*'114470933',*/
									'num_consecutivo_receptor'	=>	$_numeracion_consecutiva
								);
		$_json['emisor']	=	array(
									'identificacion'	=>	array(
																'tipo'	=>	$emisor['Identificacion']['Tipo'],/*'02',*/
																'numero'=>	$emisor['Identificacion']['Numero']/*'3101382836'*/
															)
									);
		$response['json']	=	$_json;
/*
		$options	=	array(
							"ssl"	=>	array(
										"verify_peer"=>false,
										"verify_peer_name"=>false,
									),
							'http'	=>	array(
											'header'	=>	"Content-Type: application/json\r\n" .
															"Accept: application/json\r\n",
											'method'	=>	'POST',
											'content'	=>	json_encode($_json)
										)
						);
*/
		$options	=	array(
							'http'	=>	array(
											'header'	=>	"Content-Type: application/json\r\n" .
															"Accept: application/json\r\n",
											'method'	=>	'POST',
											'content'	=>	json_encode($_json)
										)
						);
		$url	=	env('API_URL_AB');
		$context=	stream_context_create($options);
		try{
			$result	=	file_get_contents($url, false, $context);
			$result	=	json_decode($result);
			$response['result']	=	$result;
/*
stdClass Object
(
	[code]				=>	1
	[status]			=>	200
	[data]				=>	PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPE1lbnNhamVSZWNlcHRvciB4bWxucz0iaHR0cHM6Ly90cmlidW5ldC5oYWNpZW5kYS5nby5jci9kb2NzL2VzcXVlbWFzLzIwMTcvdjQuMi9tZW5zYWplUmVjZXB0b3IiIHhtbG5zOmRzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIiB4bWxuczp4c2Q9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6c2NoZW1hTG9jYXRpb249Imh0dHBzOi8vdHJpYnVuZXQuaGFjaWVuZGEuZ28uY3IvZG9jcy9lc3F1ZW1hcy8yMDE3L3Y0LjIvbWVuc2FqZVJlY2VwdG9yIE1lbnNhamVSZWNlcHRvcl80LjIueHNkIj4KICA8Q2xhdmU+NTA2MDYxMTE4MDAzMTAxNzMxMzE0MDE1MDAwMDEwMTAwMDAwMDA0NjkxMDEwMDA0Njk8L0NsYXZlPgogIDxOdW1lcm9DZWR1bGFFbWlzb3I+MDAzMTAxNzMxMzE0PC9OdW1lcm9DZWR1bGFFbWlzb3I+CiAgPEZlY2hhRW1pc2lvbkRvYz4yMDE4LTExLTA2VDIwOjU1OjIwLTA2OjAwPC9GZWNoYUVtaXNpb25Eb2M+CiAgPE1lbnNhamU+MTwvTWVuc2FqZT4KICA8RGV0YWxsZU1lbnNhamU+Q09NRU5UQVJJT1MgR0VORVJBTEVTPC9EZXRhbGxlTWVuc2FqZT4KICA8TW9udG9Ub3RhbEltcHVlc3RvPjAuMDAwMDA8L01vbnRvVG90YWxJbXB1ZXN0bz4KICA8VG90YWxGYWN0dXJhPjIxMzc1LjMwMDAwPC9Ub3RhbEZhY3R1cmE+CiAgPE51bWVyb0NlZHVsYVJlY2VwdG9yPjAwMzEwMTY3MTQ1OTwvTnVtZXJvQ2VkdWxhUmVjZXB0b3I+CiAgPE51bWVyb0NvbnNlY3V0aXZvUmVjZXB0b3I+MDAxMDAwMDEwNTAwMDAwMDAwMDE8L051bWVyb0NvbnNlY3V0aXZvUmVjZXB0b3I+PGRzOlNpZ25hdHVyZSB4bWxuczpkcz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC8wOS94bWxkc2lnIyIgSWQ9IlNpZ25hdHVyZS0zNTcxMTgxMTYiPjxkczpTaWduZWRJbmZvPjxkczpDYW5vbmljYWxpemF0aW9uTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMteG1sLWMxNG4tMjAwMTAzMTUiLz48ZHM6U2lnbmF0dXJlTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxkc2lnLW1vcmUjcnNhLXNoYTUxMiIvPjxkczpSZWZlcmVuY2UgVVJJPSIiPjxkczpUcmFuc2Zvcm1zPjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjZW52ZWxvcGVkLXNpZ25hdHVyZSIvPjwvZHM6VHJhbnNmb3Jtcz48ZHM6RGlnZXN0TWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8wNC94bWxlbmMjc2hhNTEyIi8+PGRzOkRpZ2VzdFZhbHVlPjFPcVhMZEs1RUFTOHhyTzRUV0xLME9Vem1xSVdtRDRGTFdxbG1HUTU4OFlTZkRSWVVsSDJIejJYcmVDS1c3eHNSVUpRVng5QktaaWFPdHd2QXJaT1J3PT08L2RzOkRpZ2VzdFZhbHVlPjwvZHM6UmVmZXJlbmNlPjxkczpSZWZlcmVuY2UgVHlwZT0iaHR0cDovL3VyaS5ldHNpLm9yZy8wMTkwMyNTaWduZWRQcm9wZXJ0aWVzIiBVUkk9IiNTaWduZWRQcm9wZXJ0aWVzLTIwNzI2MTEwODgiPjxkczpEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjc2hhMSIvPjxkczpEaWdlc3RWYWx1ZT5iTnNHZEVsS2sycTZNUE8ybDBNTlBadzJtZW89PC9kczpEaWdlc3RWYWx1ZT48L2RzOlJlZmVyZW5jZT48L2RzOlNpZ25lZEluZm8+PGRzOlNpZ25hdHVyZVZhbHVlPlh4REVkK0FoSWtXdUQyOEhMSWl6ZXNQV2gySStYWmZhSHU0YXBPcTJvQS8yUmIxSldWQkk4UDFmZEpwUHBJc1dJRXZwbTNYMzZCTElDYy9ReGNPSkdEQlhma01PYVZPczI4T1hmdDFKaUZDajJ6TE04M0drNy8zMlVmVzdlVjJGSzcvVXJ6b3Vka2RHM0h6Y0ZCMDUxNlk5akdsUGFtSjJHOEpJd1BYbVBnTmdsdE9HcWdCdEFoMXk5blB2enZHYUhMam8xVyttWkh0WENFV0pSTGFaQ0dzanFIZG1CR1FWSXBZZnl2eW1zV2grWFltb2lHblRpWWxnYTF3eU5zTlhNTWg2aGxpR0grZkVCZGFENFVENk1uNnNQaE05UWM5azdFWXpVckVQNFpZR0FjV3ExWjFWb0ZSRWZITDhXQ1pEWTFJYmtkTHV4dFlvZUx6WkRULytWUT09PC9kczpTaWduYXR1cmVWYWx1ZT48ZHM6S2V5SW5mbz48ZHM6S2V5VmFsdWU+PGRzOlJTQUtleVZhbHVlPjxkczpNb2R1bHVzPnFqbGhLUmc1YWJQclVGWlpqMmxSK214VWJXa3pVcS9LRXZVYVhVTFdoc2NBOTV6cDBNb0lPalJ1R0gvQUhpS3M3ZEs4UXZmdWNadmFhd0twcFk3aUptb0R6UmtNQ1JyVzkwZXNmbXhrT2k4dmlzdXZFeTlOSlBialY4RkptVnVQajdQemJLcExzaGExQVdJODY3WmxUNzkxQ2t6ZGZKeDBBTi9pYmhhR3EweFYwRElGbEJuWkFNVENsak5aeEdyRnlEaHRoYTVZSitnR0ZGMTRqYVFOOXo2NlR1NDRJOWU1dm5pakNzUHdYNG5CR2sraUZGdVY3YVRGL1RLUHZMeU5XYlplL2NxODhHQXBWaU9hL3UwR2l0dFp6R1Fmb1NRSWIzVHJhRVVUckVMbjIvMGQzUFBCTXBiQ0QwTStVdzBDSHdTSFMzZGZleEllVWdSYlc0SWI2UT09PC9kczpNb2R1bHVzPjxkczpFeHBvbmVudD5BUUFCPC9kczpFeHBvbmVudD48L2RzOlJTQUtleVZhbHVlPjwvZHM6S2V5VmFsdWU+PGRzOlg1MDlEYXRhPjxkczpYNTA5SXNzdWVyU2VyaWFsPjxkczpYNTA5SXNzdWVyTmFtZT5DTj1DQSBQRVJTT05BIEpVUklESUNBIC0gU0FOREJPWCwgT1U9REdULCBPPU1JTklTVEVSSU8gREUgSEFDSUVOREEgLSBTQU5EQk9YLCBDPUNSPC9kczpYNTA5SXNzdWVyTmFtZT48ZHM6WDUwOVNlcmlhbE51bWJlcj4xNTE1MjE2MzE3NjUwPC9kczpYNTA5U2VyaWFsTnVtYmVyPjwvZHM6WDUwOUlzc3VlclNlcmlhbD48ZHM6WDUwOVN1YmplY3ROYW1lPkNOPURFVURJR0lUQUwgU09DSUVEQUQgQU5PTklNQSwgT1U9Q1BKLCBPPVBFUlNPTkEgSlVSSURJQ0EsIEM9Q1IsIDIuNS40LjQyPSMwQzFCNDQ0NTU1NDQ0OTQ3NDk1NDQxNEMyMDUzNEY0MzQ5NDU0NDQxNDQyMDQxNEU0RjRFNDk0RDQxLCAyLjUuNC40PSMwQzAwLCAyLjUuNC41PSMxMzEwNDM1MDRBMkQzMzJEMzEzMDMxMkQzNjM3MzEzNDM1Mzk8L2RzOlg1MDlTdWJqZWN0TmFtZT48ZHM6WDUwOUNlcnRpZmljYXRlPk1JSUZZakNDQTBxZ0F3SUJBZ0lHQVdESjdpelNNQTBHQ1NxR1NJYjNEUUVCQ3dVQU1HNHhDekFKQmdOVkJBWVRBa05TTVNrd0p3WURWUVFLRENCTlNVNUpVMVJGVWtsUElFUkZJRWhCUTBsRlRrUkJJQzBnVTBGT1JFSlBXREVNTUFvR0ExVUVDd3dEUkVkVU1TWXdKQVlEVlFRRERCMURRU0JRUlZKVFQwNUJJRXBWVWtsRVNVTkJJQzBnVTBGT1JFSlBXREFlRncweE9EQXhNRFl3TlRJMU1UZGFGdzB5TURBeE1EWXdOVEkxTVRkYU1JR29NUmt3RndZRFZRUUZFeEJEVUVvdE15MHhNREV0TmpjeE5EVTVNUWt3QndZRFZRUUVEQUF4SkRBaUJnTlZCQ29NRzBSRlZVUkpSMGxVUVV3Z1UwOURTVVZFUVVRZ1FVNVBUa2xOUVRFTE1Ba0dBMVVFQmhNQ1ExSXhHVEFYQmdOVkJBb01FRkJGVWxOUFRrRWdTbFZTU1VSSlEwRXhEREFLQmdOVkJBc01BME5RU2pFa01DSUdBMVVFQXd3YlJFVlZSRWxIU1ZSQlRDQlRUME5KUlVSQlJDQkJUazlPU1UxQk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBcWpsaEtSZzVhYlByVUZaWmoybFIrbXhVYldrelVxL0tFdlVhWFVMV2hzY0E5NXpwME1vSU9qUnVHSC9BSGlLczdkSzhRdmZ1Y1p2YWF3S3BwWTdpSm1vRHpSa01DUnJXOTBlc2ZteGtPaTh2aXN1dkV5OU5KUGJqVjhGSm1WdVBqN1B6YktwTHNoYTFBV0k4NjdabFQ3OTFDa3pkZkp4MEFOL2liaGFHcTB4VjBESUZsQm5aQU1UQ2xqTlp4R3JGeURodGhhNVlKK2dHRkYxNGphUU45ejY2VHU0NEk5ZTV2bmlqQ3NQd1g0bkJHaytpRkZ1VjdhVEYvVEtQdkx5TldiWmUvY3E4OEdBcFZpT2EvdTBHaXR0WnpHUWZvU1FJYjNUcmFFVVRyRUxuMi8wZDNQUEJNcGJDRDBNK1V3MENId1NIUzNkZmV4SWVVZ1JiVzRJYjZRSURBUUFCbzRIS01JSEhNQjhHQTFVZEl3UVlNQmFBRkt3b1JmZ3ZuVWhmTEI4QWtPc3l4YU1IVTREaE1CMEdBMVVkRGdRV0JCUmJTeGU1NVJXSnhUMWlOVXRwcnc2cmlWQm5wekFMQmdOVkhROEVCQU1DQnNBd0V3WURWUjBsQkF3d0NnWUlLd1lCQlFVSEF3UXdZd1lJS3dZQkJRVUhBUUVFVnpCVk1GTUdDQ3NHQVFVRkJ6QUNoa2RvZEhSd2N6b3ZMM0JyYVM1amIyMXdjbTlpWVc1MFpYTmxiR1ZqZEhKdmJtbGpiM011WjI4dVkzSXZjM1JoWnk5cGJuUmxjbTFsWkdsaGRHVXRjR290Y0dWdExtTnlkREFOQmdrcWhraUc5dzBCQVFzRkFBT0NBZ0VBV1VYbk0yU3ZmVEVIZURhamFxV1E1ZkVUMUxCclZEQjJXN1hUL2pHbUVwSGZHb0E3WDVDMUx1L3FSMFBSYzNlTlV3cFR5b1lPb1kvcmFWSHJxOG9GYjhES3ZXa2t6TEt1aHkraXVvK1d3bkxlVjNZbkdoc2thd0swZEh0VUNYM2o4QVV5UnhuZUpNQ1NZdHB2S1JkMk1SVWlQSUpRRnNJSGlFM3Y5Uzl6ejVyZFJIeW9mVE9ubVhRTnkrTHFjMXRmL3FCWkVzeldSMDZacEJjNnlpcXFXZTRyQ1pxbDRxU0NnSWFpVEtSUHhCa015WE5JZ3RsNFJ1bkNLbVpzemptWnVvVG1wd05rbENHTjhHeW85WEpOL083NFRpS1hhUEwwd0tsMkhJbzZrOTVTNzNKMlJwb2ZiM3N3N2pDZGkyQXRMTENlbnl0UnBiT0FzcVgzTm56U25HaFZiaElOY0tzcW9oa1BzSVUwOHdkczM4M1YreGpZZ3RZMzFtWmdMM201OHNRVFN1YXA1cVZIR1QwOGdxaVJIb0FXRzN1SVY5aTJvRFVxZkJKM05ST0JNeGJqTHJTQ0FsY295QUZ4Q3FiL1JIU3JwTXZPdGFnRUNQQUNnemxTYVpYK2NkTWZ1alNYQUxwMFIzV25PbnNmSmkvYzRmWWFWNmRqSkJoeXdKcDVmcDdFWUpKOG1vaWVvc2FhMStENVdMdEVaNVdhU2ppQlJpV1phTzZ4UkhOUElTSXZEeUllZFZsN2x1eEVWRC9oaE1zTmtPN0NmY0ttZyt5UGc5cU1OejhUNitBMnFYRUpqVkFzZ1pMS3JuTWZCWnlDNnBiWmlJeWV1OTlkdThjMnVNR1JUVDRUZi9leGxMNkFPS3lUeUVjdDB2ajhTOThDU2FWTzRUeWhMUjA9PC9kczpYNTA5Q2VydGlmaWNhdGU+PC9kczpYNTA5RGF0YT48L2RzOktleUluZm8+PGRzOk9iamVjdD48eGFkZXM6UXVhbGlmeWluZ1Byb3BlcnRpZXMgeG1sbnM6eGFkZXM9Imh0dHA6Ly91cmkuZXRzaS5vcmcvMDE5MDMvdjEuMy4yIyIgeG1sbnM6eGFkZXN2MTQxPSJodHRwOi8vdXJpLmV0c2kub3JnLzAxOTAzL3YxLjQuMSMiIFRhcmdldD0iI1NpZ25hdHVyZS0zNTcxMTgxMTYiPjx4YWRlczpTaWduZWRQcm9wZXJ0aWVzIElkPSJTaWduZWRQcm9wZXJ0aWVzLTIwNzI2MTEwODgiPjx4YWRlczpTaWduZWRTaWduYXR1cmVQcm9wZXJ0aWVzPjx4YWRlczpTaWduaW5nVGltZT4yMDE4LTExLTEyVDA1OjQ2OjExLjAwMFo8L3hhZGVzOlNpZ25pbmdUaW1lPjx4YWRlczpTaWduaW5nQ2VydGlmaWNhdGU+PHhhZGVzOkNlcnQ+PHhhZGVzOkNlcnREaWdlc3Q+PGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNzaGExIi8+PGRzOkRpZ2VzdFZhbHVlPkxjSnFBWkJyb0dzN2ZMTjQ4NERidkNNUjZ3QT08L2RzOkRpZ2VzdFZhbHVlPjwveGFkZXM6Q2VydERpZ2VzdD48eGFkZXM6SXNzdWVyU2VyaWFsPjxkczpYNTA5SXNzdWVyTmFtZT5DTj1DQSBQRVJTT05BIEpVUklESUNBIC0gU0FOREJPWCwgT1U9REdULCBPPU1JTklTVEVSSU8gREUgSEFDSUVOREEgLSBTQU5EQk9YLCBDPUNSPC9kczpYNTA5SXNzdWVyTmFtZT48ZHM6WDUwOVNlcmlhbE51bWJlcj4xNTE1MjE2MzE3NjUwPC9kczpYNTA5U2VyaWFsTnVtYmVyPjwveGFkZXM6SXNzdWVyU2VyaWFsPjwveGFkZXM6Q2VydD48L3hhZGVzOlNpZ25pbmdDZXJ0aWZpY2F0ZT48eGFkZXM6U2lnbmF0dXJlUG9saWN5SWRlbnRpZmllcj48eGFkZXM6U2lnbmF0dXJlUG9saWN5SWQ+PHhhZGVzOlNpZ1BvbGljeUlkPjx4YWRlczpJZGVudGlmaWVyPmh0dHBzOi8vd3d3LmhhY2llbmRhLmdvLmNyL0FUVi9Db21wcm9iYW50ZUVsZWN0cm9uaWNvL2RvY3MvZXNxdWVtYXMvMjAxNi92NC4yL0RHVF9SXzUxXzIwMTZfUmVzb2x1Y2lvbl9kZV9PYmxpZ2F0b3JpZWRhZF9wYXJhX2VsX1Vzb19kZV9sb3NfQ29tcHJvYmFudGVzX0VsZWN0cm9uaWNvc19WNC4yLnBkZjwveGFkZXM6SWRlbnRpZmllcj48L3hhZGVzOlNpZ1BvbGljeUlkPjx4YWRlczpTaWdQb2xpY3lIYXNoPjxkczpEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGVuYyNzaGE1MTIiLz48ZHM6RGlnZXN0VmFsdWU+Tm1JNU5qazFaVGhrTnpJME1tSXpNR0ptWkRBeU5EYzRZalV3Tnprek9ETTJOVEJpT1dVeE5UQmtNbUkyWWpnell6WmpNMkk1TlRabE5EUTRPV1F6TVE9PTwvZHM6RGlnZXN0VmFsdWU+PC94YWRlczpTaWdQb2xpY3lIYXNoPjwveGFkZXM6U2lnbmF0dXJlUG9saWN5SWQ+PC94YWRlczpTaWduYXR1cmVQb2xpY3lJZGVudGlmaWVyPjwveGFkZXM6U2lnbmVkU2lnbmF0dXJlUHJvcGVydGllcz48eGFkZXM6U2lnbmVkRGF0YU9iamVjdFByb3BlcnRpZXM+PHhhZGVzOkRhdGFPYmplY3RGb3JtYXQgT2JqZWN0UmVmZXJlbmNlPSIjci1pZC0xIj48eGFkZXM6TWltZVR5cGU+dGV4dC94bWw8L3hhZGVzOk1pbWVUeXBlPjwveGFkZXM6RGF0YU9iamVjdEZvcm1hdD48L3hhZGVzOlNpZ25lZERhdGFPYmplY3RQcm9wZXJ0aWVzPjwveGFkZXM6U2lnbmVkUHJvcGVydGllcz48L3hhZGVzOlF1YWxpZnlpbmdQcm9wZXJ0aWVzPjwvZHM6T2JqZWN0PjwvZHM6U2lnbmF0dXJlPgo8L01lbnNhamVSZWNlcHRvcj4K
	[clave] 			=>	50611111800310167145900100001050000000001134812983
	[hacienda_status]	=>	1
	[hacienda_mensaje]	=>	https://api.comprobanteselectronicos.go.cr/recepcion-sandbox/v1/recepcion/50611111800310167145900100001050000000001134812983-00100001050000000001
)
stdClass Object	
	code	28
	status	200
	data	Validation Error.
	error	02-02: Elementos de Clave requeridos faltantes.
	fecha	null

*/			
			$fecha_emision	=	explode('T',$xml['FechaEmision']);
			$fecha	=	$fecha_emision[0];
			$time	=	explode('-', $fecha_emision[1]);
			$time	=	$time[0];
			$fecha_emision	=	$fecha . ' ' . $time;
			
			
			$doc_recibido	=	array(
										'fecha'						=>	DB::raw('now()'),
										'clave'						=>	$xml['Clave'],
										'numeracion_consecutiva'	=>	$_numeracion_consecutiva,
										'tipo_documento_id'			=>	$request->tipo_documento_id,
										'nutricionista_id'			=>	$request->nutricionista_id,
										'emisor'					=>	$emisor['Nombre'],
										'emisor_email'				=>	$emisor['CorreoElectronico'],
										'emisor_cedula'				=>	$emisor['Identificacion']['Numero'],
										'fecha_emision'				=>	$fecha_emision,
										'moneda'					=>	$resumen_factura['CodigoMoneda'],
										'monto'						=>	$resumen_factura['TotalComprobante'],
										'respuesta_status'			=>	'',
										'respuesta_code'			=>	'',
										'respuesta_data'			=>	'',
										'respuesta_clave'			=>	'',
										'json'						=>	json_encode($_json),
										'respuesta_completa'		=>	json_encode($result),
									);

			if(isset($result->status))
				$doc_recibido['respuesta_status']	=	$result->status;
			if(isset($result->code))
				$doc_recibido['respuesta_code']	=	$result->code;
			if(isset($result->data))
				$doc_recibido['respuesta_data']	=	$result->data;
			if(isset($result->clave))
				$doc_recibido['respuesta_clave']	=	$result->clave;
			
			$recepcion			=	Recepcion::create( $doc_recibido );
			$response['stored']	=	$recepcion;
			if($recepcion->respuesta_code==1){
				$estado	=	'';
				switch($recepcion->tipo_documento_id){
					case 5;
						$estado	=	'Aceptado';
						break;
					case 6;
						$estado	=	'Aceptado Parcial';
						break;
					case 7;
						$estado	=	'Rechazado';
						break;
				}
				$recepcion->estado	=	$estado;
				$data	=	array(
								'estado'				=>	$recepcion->estado,
								'numero_consecutivo'	=>	$xml['NumeroConsecutivo']
							);
				Mail::send('emails.recepcion_documento', $data, function($message) use ($recepcion) {
					$bcc		=	explode(',', env('APP_EMAIL_BCC'));
					$subject	=	'Documento ' . $recepcion->estado;
					$subject	=	Helper::emailParseSubject( $subject );
					$message->subject( $subject );
					$message->to($recepcion->emisor_email, $recepcion->emisor);
					$message->from(env('APP_EMAIL_FROM'), env('APP_EMAIL_FROM_NAME'));
					$message->sender(env('APP_EMAIL_FROM'), env('APP_EMAIL_FROM_NAME'));
					$message->bcc($bcc);
				});
			}				

		} catch(Illuminate\Database\QueryException $e) {
			dd($e);			
			$response['error']	=	$e;
		} catch(PDOException $e) {
			dd($e);
			$response['error']	=	$e;
		}catch (Exception $e) {
			$response['error']	=	$e;
		}
		$code	=	200;
		if(isset($response['error']))
			$code	=	500;
		
		return Response::json($response, $code);
    }
	function existeDatosErroneosXML($xml, $nutricionista_id){
		/*if(
				!isset($xml['Clave']) || empty($xml['Clave']) || 
				!isset($xml['FechaEmision']) || empty($xml['FechaEmision']) || 
				!isset($xml['Emisor']) || empty($xml['Emisor']) || 
				!isset($xml['Emisor']['Nombre']) || empty($xml['Emisor']['Nombre']) || 
				!isset($xml['Emisor']['CorreoElectronico']) || empty($xml['Emisor']['CorreoElectronico']) || 
				!isset($xml['Emisor']['Identificacion']) || empty($xml['Emisor']['Identificacion']) || 
				!isset($xml['Emisor']['Identificacion']['Numero']) || empty($xml['Emisor']['Identificacion']['Numero']) || 
				!isset($xml['Emisor']['Identificacion']['Tipo']) || empty($xml['Emisor']['Identificacion']['Tipo']) || 
				!isset($xml['Receptor']) || empty($xml['Receptor']) || 
				!isset($xml['Receptor']['Identificacion']['Numero']) || empty($xml['Receptor']['Identificacion']['Numero']) || 
				!isset($xml['ResumenFactura']['TotalImpuesto']) || empty($xml['ResumenFactura']['TotalImpuesto']) || 
				!isset($xml['ResumenFactura']['TotalComprobante']) || empty($xml['ResumenFactura']['TotalComprobante']) || 
				!isset($xml['ResumenFactura']['CodigoMoneda']) || empty($xml['ResumenFactura']['CodigoMoneda'])			
			){
				return 'XML inválido.';
		}*/
		$_xml	=	array();
		if( !isset($xml['Clave']) || strlen($xml['Clave'])==0)
			$_xml[]	=	'Clave';
		if( !isset($xml['FechaEmision']) || strlen($xml['FechaEmision'])==0)
			$_xml[]	=	'FechaEmision';
		if( !isset($xml['Emisor']))
			$_xml[]	=	'Emisor';
		if( !isset($xml['Emisor']['Nombre']) || strlen($xml['Emisor']['Nombre'])==0)
			$_xml[]	=	'Emisor->Nombre';
		if( !isset($xml['Emisor']['CorreoElectronico']) || strlen($xml['Emisor']['CorreoElectronico'])==0)
			$_xml[]	=	'Emisor->CorreoElectronico';
		if( !isset($xml['Emisor']['Identificacion']))
			$_xml[]	=	'Emisor->Identificacion';
		if( !isset($xml['Emisor']['Identificacion']['Numero']) || strlen($xml['Emisor']['Identificacion']['Numero'])==0)
			$_xml[]	=	'Emisor->Identificacion->Numero';
		if( !isset($xml['Emisor']['Identificacion']['Tipo']) || strlen($xml['Emisor']['Identificacion']['Tipo'])==0)
			$_xml[]	=	'Emisor->Identificacion->Tipo';
		if( !isset($xml['Receptor']))
			$_xml[]	=	'Receptor';
		if( !isset($xml['Receptor']['Identificacion']['Numero']) || strlen($xml['Receptor']['Identificacion']['Numero'])==0)
			$_xml[]	=	'Receptor->Identificacion->Numero';
		if( !isset($xml['ResumenFactura']['TotalImpuesto']) || strlen($xml['ResumenFactura']['TotalImpuesto'])==0)
			$_xml[]	=	'ResumenFactura->TotalImpuesto';
		if( !isset($xml['ResumenFactura']['TotalComprobante']) || strlen($xml['ResumenFactura']['TotalComprobante'])==0)
			$_xml[]	=	'ResumenFactura->TotalComprobante';
		if( !isset($xml['ResumenFactura']['CodigoMoneda']) || strlen($xml['ResumenFactura']['CodigoMoneda'])==0)
			$_xml[]	=	'ResumenFactura->CodigoMoneda';
		if(count( $_xml )>0){
			global $xml_missing;
			$xml_missing	=	$_xml;
			return 'XML inválido.';
		}

		$registros = DB::table('recepcions')
						->where('nutricionista_id', '=',$nutricionista_id)
						->where('clave', '=',$xml['Clave'])
						->where('respuesta_code', '=',1)
						->get()
						->first();
		if($registros){
			return 'Documento XML ya fue recibido y procesado previamente';
		}
		
		return false;
	}
	
	function reporte($nutricionista_id){
		/*$registros	=	Recepcion::Where('nutricionista_id', $nutricionista_id)
							->get();*/
		 $registros = DB::table('recepcions')  
						->select('recepcions.*', DB::raw('SUBSTRING(respuesta_clave, 22, 20) AS clave'))
						->where('nutricionista_id', '=',$nutricionista_id)
						->get();
			
		/*$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);*/
		$response	=	Response::json($registros, 200, []);
		return $response;
	}

}

