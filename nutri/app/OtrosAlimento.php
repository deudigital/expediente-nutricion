<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OtrosAlimento extends Model
{
	protected $fillable	=	[
		'nombre',
		'porciones',
		'carbohidratos',
		'proteinas',
		'grasas',
		'calorias',
		'prescripcion_id'
	];
	public $timestamps	=	false;
}