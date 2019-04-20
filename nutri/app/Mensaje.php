<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Mensaje extends Model
{
	protected $fillable	=	[
		'texto',
		'dia',
		'hora',
		'ultimo_enviado'
	];
	public $timestamps	=	false;
}
