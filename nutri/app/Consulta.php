<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Consulta extends Model
{
    protected $fillable = [
        'fecha',  'notas',  'notas_paciente', 'estado', 'paciente_id'
    ];
	public $timestamps = false;
}
