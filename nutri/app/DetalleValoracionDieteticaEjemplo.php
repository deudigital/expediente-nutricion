<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DetalleValoracionDieteticaEjemplo extends Model
{
	protected $fillable	=	[
		'paciente_id',
		'categoria_valoracion_dietetica_id',
		'ejemplo'
	];
	public $timestamps	=	false;
}