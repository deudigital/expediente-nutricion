<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    //
	public $timestamps	=	false;
	 protected $fillable = [
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
		'detalles_direccion'
    ];
	
}
