<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TiempoComida extends Model
{    
	protected $fillable	=	[
		'nombre',
		'nutricionista_id'
	];
	public $timestamps	=	false;
}
