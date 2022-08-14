<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;
	protected $fillable	=	[
		'persona_id',
		'nutricionista_id',
		'tipo_identificacion_id'
	];
	public $timestamps	=	false;
}
