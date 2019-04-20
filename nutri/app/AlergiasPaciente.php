<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AlergiasPaciente extends Model
{
    protected $fillable = [
		'alergia_id', 	
		'paciente_id'
    ];
	public $timestamps = false;
}
