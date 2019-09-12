<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ArchivoConsulta extends Model
{
	public $timestamps	=	false;
	protected $fillable = [
        'filename', 
		'fecha', 
		'owner', 
		'consulta_id'
    ];
}
