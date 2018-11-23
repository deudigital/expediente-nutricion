<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Response;
use DB;

class Helper
{
    
	private static $emojis	=	array(
					'calendar'						=>	'=?utf-8?Q?=F0=9F=93=85',
					'memo'							=>	'=?utf-8?Q?=F0=9F=93=9D',
					'heavy_check_mark'				=>	'=?utf-8?Q?=E2=9C=94',
					'heavy_multiplication_x'		=>	'=?utf-8?Q?=E2=9C=96',
					'smiling_face_with_smiling_eyes'=>	'=?utf-8?Q?=F0=9F=98=8A',
					'disappointed_face'				=>	'=?utf-8?Q?=F0=9F=98=9E',
					'tangerine'						=>	'=?utf-8?Q?=F0=9F=8D=8A',
					'watermelon'					=>	'=?utf-8?Q?=F0=9F=8D=89'
				);
	private $_search	=	array('&aacute;', '&eacute;', '&iacute;', '&oacute;', '&uacute;', '&ntilde;','&Aacute;', '&Eacute;', '&Iacute;', '&Oacute;', '&Uacute;', '&Ntilde;');
	private $_replace	=	array('=c3=a1', '=c3=a9', '=c3=ad', '=c3=b3', '=c3=ba', '=c3=b1', '=c3=81', '=c3=89', '=c3=8d', '=c3=9a', '=c3=91');
	
	private static $search	=	array('&aacute;', '&eacute;', '&iacute;', '&oacute;', '&uacute;', '&ntilde;','&Aacute;', '&Eacute;', '&Iacute;', '&Oacute;', '&Uacute;', '&Ntilde;');
	private static $replace	=	array('=c3=a1', '=c3=a9', '=c3=ad', '=c3=b3', '=c3=ba', '=c3=b1', '=c3=81', '=c3=89', '=c3=8d', '=c3=9a', '=c3=91');
/*
 *	self::_print($data);
 */
	public static function _print($data){
		echo '<pre>' . print_r($data, true) . '</pre>';		
	}
	public static function convertTimeMilitarToTimeStandard($timeMilitar){
		/*return _convertTimeMilitarToTimeStandard($timeMilitar);
	}
	public function _convertTimeMilitarToTimeStandard($timeMilitar){*/
		$limitador	=	1;
		if(strlen($timeMilitar)>3)
			$limitador	=	2;
		/*static::_print(strlen($timeMilitar));
		static::_print($timeMilitar);*/
		/*$h	=	substr($timeMilitar,0,2);*/
		$h	=	substr($timeMilitar,0,$limitador);
		/*static::_print($h);*/
		/*$m	=	substr($timeMilitar,2,2);*/
		$m	=	substr($timeMilitar,$limitador,2);
		/*static::_print($m);*/
		$ampm	=	$h>11? 'pm':'am';
		if($h>12)
			$h	=	$h%12;
		
		$app					=	app();
		$timeStandard			=	$app->make('stdClass');
		$timeStandard->hour		=	$h;
		$timeStandard->minutes	=	$m;
		$timeStandard->ampm		=	$ampm;
		$timeStandard->hm	 	=	$timeStandard->hour . ':' . $timeStandard->minutes;
		$timeStandard->hms	 	=	$timeStandard->hour . ':' . $timeStandard->minutes . ':' . $timeStandard->ampm;
		return $timeStandard;
	}
/*
 *	Helper::emailParseSubject( $subject, $args );
 */
	public static function emailParseSubject( $subject, $args=array() ){
		$defaults	=	array(
								'before_emoji'	=>	'',
								'after_emoji'	=>	'',
								'before'		=>	'',
								'after'			=>	''
							);
		$args		=	array_merge($defaults, $args);
		$subject    =	' ' . $subject;
		$subject   .=	'?= ';
		$subject	=	htmlentities($subject);
		$subject	=	str_replace(static::$search, static::$replace, $subject);
		if(!empty($args['before']))
			$subject	=	$args['before'] . $subject;

		if(isset(static::$emojis[$args['before_emoji']]))
			$subject	=	static::$emojis[$args['before_emoji']] . $subject;
		else
			$subject	=	'=?utf-8?Q?' . $subject;

		if(isset(static::$emojis[$args['after_emoji']]))
			$subject	=	$subject . static::$emojis[$args['after_emoji']] . '?=';

		if(!empty($args['after']))
			$subject	=	$subject . $args['after'];
					
		return $subject;
	}
	public static function printRequest($request){
		$response	=	Response::json($request->All(), 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}

	public static function getPacientesClientes( $nutricionista_id ){
		/*$pacientes	=	DB::table('pacientes')
							->join('personas', 'personas.id', '=', 'pacientes.persona_id')
							->where('pacientes.nutricionista_id', $nutricionista_id);

		$registros	=	DB::table('clientes')
							->where('clientes.nutricionista_id', $nutricionista_id)
							->union($pacientes)
							->get();*/
		$pacientes	=	DB::table('personas')
							->join('pacientes', 'pacientes.persona_id', '=', 'personas.id')
							->where('pacientes.nutricionista_id', $nutricionista_id)
							->select('personas.*');

		$registros	=	DB::table('personas')
							->join('clientes', 'clientes.persona_id', '=', 'personas.id')
							->where('clientes.nutricionista_id', $nutricionista_id)
							->select('personas.*')
							->union($pacientes)
							->get();

		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
/*
 *
 */
	public static function getLastNumberConsecutiveRecepcion($nutricionista_id, $tipo_documento_id){
		$return	=	1;
		$response	=	DB::table('recepcions')
							->where('nutricionista_id', '=', $nutricionista_id)
							->where('tipo_documento_id', '=', $tipo_documento_id)
							->orderBy('numeracion_consecutiva', 'DESC')
							->first();

		if($response)
			$return	=	$response->numeracion_consecutiva + 1;

		return $return;
	}
	
/*
 *	return Helper::testStatic();
 */
	public static function testStatic(){
		return 'soy el static helper';
	}
/*
 *	$helper	=	new Helper();
 *	return $helper->test();
 */
	public function test(){
		return 'soy el helper';
	}
/*
 *	Convert Epoch to Date Format
 *	---------------------------------
 *	$date	=	date("Y-m-d H:i:s", substr($date_epoch, 0, 10));
 */ 
/*	Enable DB Queries Log
 *	----------------------
 *	DB::enableQueryLog();
 *	$registros	=	DB::table() ... ;
 *	dd(DB::getQueryLog());
 */
}
