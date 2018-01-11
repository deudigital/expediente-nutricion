<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DetalleGrasa extends Model
{
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
		'pliegue_abdominal',
		'pliegue_cuadricipital',
		'pliegue_peroneal',
		'valor_antropometrica_id'
    ];
	public $timestamps = false;
}
