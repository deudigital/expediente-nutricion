<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class HabitosOtro extends Model
{
	protected $fillable = [
        //'id', 
		'ocupacion',
		'ocupacion_horas',
		'ocupacion_frecuencia',
		'sueno',
		'fumado',
		'fuma_cantidad',
		'fuma_frecuencia',
		'alcohol',
		'alcohol_cantidad',
		'alcohol_frecuencia',
		'notas',
		'paciente_id', 
    ];
	
     
	public $timestamps = false;
}
