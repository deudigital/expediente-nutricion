<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Rdd extends Model
{
    protected $fillable = [
        'metodo_calculo_gc',  'peso_calculo', 'factor_actividad_sedentaria', 'promedio_gc_diario', 'variacion_calorica'
    ];
	public $timestamps = false;
}
