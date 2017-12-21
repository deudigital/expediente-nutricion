<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PatologiasPaciente extends Model
{
    protected $fillable = [
		'hcp_patologia_id', 	
		'paciente_id'
    ];
	public $timestamps = false;
}
