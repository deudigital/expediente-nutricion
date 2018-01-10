<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    //
	public $timestamps	=	false;
	 protected $fillable = [
        'tipo_idenfificacion_id',
        'cedula',
		'nombre',
		'genero',
		'fecha_nac',
		'telefono',
		'celular', 
		'email', 
		'provincia', 
		'canton',
		'distrito', 
		'detalles_direccion',
		'ubicacion_id'
    ];
	
}
