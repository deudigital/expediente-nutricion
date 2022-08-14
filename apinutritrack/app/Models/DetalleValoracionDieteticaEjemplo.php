<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleValoracionDieteticaEjemplo extends Model
{
    use HasFactory;
	protected $fillable	=	[
		'paciente_id',
		'categoria_valoracion_dietetica_id',
		'ejemplo'
	];
	public $timestamps	=	false;
}
