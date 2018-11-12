<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Recepcion extends Model
{
	protected $fillable	=	[
		'fecha',
		'nutricionista_id',
		'emisor',
		'estado',
		'fecha_emision',
		'moneda',
		'monto',
		'respuesta_status',
		'respuesta_code',
		'respuesta_data',
		'json',
		'respuesta_completa'
	];
	public $timestamps	=	false;
}