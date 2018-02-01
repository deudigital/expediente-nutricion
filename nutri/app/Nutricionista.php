<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Nutricionista extends Model
{
	protected $primaryKey='persona_id';
	protected $fillable	=	[
		'persona_id',
		'nombre_comercial',
		'imagen',
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
