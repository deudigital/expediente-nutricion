<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Recepcion extends Model
{
	protected $fillable	=	[
		'numeracion_consecutiva',
		'fecha',
		'tipo_documento_id',
		'nutricionista_id',
		'emisor',
		'estado',
		'fecha_emision',
		'moneda',
		'monto',
		'clave',
		'respuesta_status',
		'respuesta_code',
		'respuesta_data',
		'respuesta_clave',
		'json',
		'respuesta_completa'
	];
	public $timestamps	=	false;
}