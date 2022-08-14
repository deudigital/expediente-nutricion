<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    use HasFactory;
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
