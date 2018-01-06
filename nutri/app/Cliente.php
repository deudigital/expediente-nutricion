<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
	protected $fillable	=	[
		'persona_id',
		'nutricionista_id',
		'tipo_identificacion_id'
	];
	public $timestamps	=	false;
}
