<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EjerciciosPaciente extends Model
{
    protected $fillable = [
		'ejercicio_id', 
		'paciente_id',
		'horas_semanales'
    ];
	
     
	public $timestamps = false;
}
