<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class BioquimicaClinica extends Model
{
	public $timestamps	=	false;
	protected $fillable = [
        'filename', 
		'fecha', 
		'paciente_id'
    ];
}
