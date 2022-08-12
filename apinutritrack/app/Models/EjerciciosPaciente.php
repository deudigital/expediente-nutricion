<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EjerciciosPaciente extends Model
{
    use HasFactory;
    protected $fillable = [
		'ejercicio_id', 
		'paciente_id',
		'horas_semanales'
    ];
	
     
	public $timestamps = false;
}
