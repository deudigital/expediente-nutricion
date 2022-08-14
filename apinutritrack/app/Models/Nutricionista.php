<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nutricionista extends Model
{
    use HasFactory;
	protected $primaryKey='persona_id';
	protected $fillable	=	[
		'persona_id',
		'nombre_comercial',
		'imagen',
		'imagen_base64',
		'usuario',
		'contrasena',
		'carne_cpn',
		'descuento_25_consultas',
		'token',
		'atv_ingreso_id',
		'atv_ingreso_contrasena',
		'atv_llave_criptografica',
		'atv_clave_llave_criptografica',
		'pe',
		'activo'
	];
	public $timestamps	=	false;
}
