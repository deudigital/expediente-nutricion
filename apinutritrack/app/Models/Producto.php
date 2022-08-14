<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;
	protected $fillable	=	[
		'descripcion',
		'nutricionista_id',
		'precio',
		'unidad_medida'
	];
	public $timestamps	=	false;
}
