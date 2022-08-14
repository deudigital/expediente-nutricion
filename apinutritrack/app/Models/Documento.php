<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    use HasFactory;
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
		'monto_total',
		'pdf',
		'xml',
		'respuesta_code',
		'respuesta',
		'referencia',
		'estado'
	];
	public $timestamps	=	false;
}
