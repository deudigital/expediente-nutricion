<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleMusculo extends Model
{
    use HasFactory;
    protected $fillable = [
        'tronco',  
		'brazo_izquierdo', 
		'brazo_derecho', 
		'pierna_izquierda', 
		'pierna_derecha', 
		'valoracion_antropometrica_id'
    ];
	public $timestamps = false;
}
