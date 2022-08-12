<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtrosAlimento extends Model
{
    use HasFactory;
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
