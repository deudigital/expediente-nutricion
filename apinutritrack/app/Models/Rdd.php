<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rdd extends Model
{
    use HasFactory;
    protected $fillable = [
        'metodo_calculo_gc',  'peso_calculo', 'factor_actividad_sedentaria', 'promedio_gc_diario', 'variacion_calorica', 'consulta_id'
    ];
	public $timestamps = false;
}
