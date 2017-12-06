<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HabitosGusto extends Model
{
	protected $fillable = [
        //'id', 
		'comidas_favoritas', 
		'comidas_no_gustan', 
		'lugar_acostumbra_comer', 
		'lugar_caen_mal', 
		'notas', 
		'paciente_id'
    ];
	
     
	public $timestamps = false;
}
