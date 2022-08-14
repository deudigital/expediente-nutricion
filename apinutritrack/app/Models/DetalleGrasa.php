<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleGrasa extends Model
{
    use HasFactory;
    protected $fillable = [
		'segmentado_abdominal',
		'segmentado_brazo_izquierdo',
		'segmentado_brazo_derecho',
		'segmentado_pierna_izquierda',
		'segmentado_pierna_derecha',
		'pliegue_subescapular',
		'pliegue_supraliaco',
		'pliegue_bicipital',
		'pliegue_tricipital',
		'valoracion_antropometrica_id'
		
		/*'pliegue_abdominal',
		'pliegue_cuadricipital',
		'pliegue_peroneal',*/
    ];
	public $timestamps = false;
}
