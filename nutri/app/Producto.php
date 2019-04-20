<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
	protected $fillable	=	[
		'descripcion',
		'nutricionista_id',
		'precio',
		'unidad_medida'
	];
	public $timestamps	=	false;
}