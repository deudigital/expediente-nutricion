<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    //
	protected $fillable	=	[
		'date',
		'militartime',
		'status',
		'token',
		'agenda_servicio_id',
		'nutricionista_id',
		'persona_id',
		'notas',
		'telefono',
		'email',
	];
	public $timestamps	=	false;
}
