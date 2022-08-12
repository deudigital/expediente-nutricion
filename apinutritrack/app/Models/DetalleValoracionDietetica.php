<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleValoracionDietetica extends Model
{
    use HasFactory;
	protected $fillable	=	[
		'paciente_id',
		'categoria_valoracion_dietetica_id',
		'grupo_alimento_nutricionista_id',
		'porciones'
	];
	public $timestamps	=	false;
}
