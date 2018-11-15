<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Recepcion extends Model
{
	protected $fillable	=	[
		'clave',
		'fecha',
		'numeracion_consecutiva',
		'tipo_documento_id',
		'nutricionista_id',
		'emisor',
		'emisor_email',
		'fecha_emision',
		'moneda',
		'monto',
		'respuesta_status',
		'respuesta_code',
		'respuesta_data',
		'respuesta_clave',
		'json',
		'respuesta_completa'
	];
	public $timestamps	=	false;
}
