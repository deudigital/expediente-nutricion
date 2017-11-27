<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DetalleMusculo extends Model
{
    protected $fillable = [
        'tronco',  'brazo_izquierdo', 'brazo_derecho', 'pierna_izquierda', 'pierna_derecha', 'valoracion_antropometrica_id'
    ];
	public $timestamps = false;
}
