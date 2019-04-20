<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Objetivo extends Model
{
	protected $fillable	=	[
		'fecha',
		'descripcion',
		'paciente_id'
	];
	public $timestamps	=	false;
}
