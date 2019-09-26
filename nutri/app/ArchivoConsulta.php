<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ArchivoConsulta extends Model
{
	public $timestamps	=	false;
	protected $fillable = [
        'filename', 
        'path', 
		'fecha', 
		'owner', 
		'consulta_id'
    ];
}
