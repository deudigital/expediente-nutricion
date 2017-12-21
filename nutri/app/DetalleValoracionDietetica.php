<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DetalleValoracionDietetica extends Model
{
	protected $fillable	=	[
		'paciente_id',
		'categoria_valoracion_dietetica_id',
		'grupo_alimento_nutricionista_id',
		'porciones'
	];
	public $timestamps	=	false;
}