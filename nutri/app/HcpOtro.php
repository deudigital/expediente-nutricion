<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HcpOtro extends Model
{
    protected $fillable = [
		'ciclos_menstruales', 
		'notas', 
		'paciente_id'
    ];
	
     
	public $timestamps = false;
}
