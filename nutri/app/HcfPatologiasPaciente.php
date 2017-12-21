<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HcfPatologiasPaciente extends Model
{
    protected $fillable = [
		'hcf_patologia_id', 	
		'paciente_id',
		'notas'
    ];
	
     
	public $timestamps = false;
}
