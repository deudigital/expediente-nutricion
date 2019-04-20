<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RegistroConsumo extends Model
{
	protected $fillable	=	[
		'fecha',
		'harinas',
		'carnes',
		'vegetales',
		'frutas',
		'lacteos',
		'grasas',
		'azucares',
		'agua',
		'ejercicio',
		'paciente_id'
	];
	public $timestamps	=	false;
}
