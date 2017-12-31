<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
	protected $fillable	=	[
		'clave',
		'numeracion_consecutiva',
		'fecha',
		'tipo_documento_id',
		'medio_pago_id',
		'persona_id',
		'nutricionista_id',
		'consulta_id',
		'notas',
		'pdf',
		'xml',
		'referencia',
		'estado'
	];
	public $timestamps	=	true;
}