<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HabitosOtro extends Model
{
    use HasFactory;
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
