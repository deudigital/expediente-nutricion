<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroConsumo extends Model
{
    use HasFactory;
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
