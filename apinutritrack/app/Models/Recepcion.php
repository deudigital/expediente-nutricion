<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recepcion extends Model
{
    use HasFactory;
	protected $fillable	=	[
		'clave',
		'fecha',
		'numeracion_consecutiva',
		'tipo_documento_id',
		'nutricionista_id',
		'emisor',
		'emisor_email',
		'emisor_cedula',
		'fecha_emision',
		'moneda',
		'monto',
		'respuesta_status',
		'respuesta_code',
		'respuesta_data',
		'respuesta_clave',
		'json',
		'respuesta_completa',
		'xml_url'
	];
	public $timestamps	=	false;
}
