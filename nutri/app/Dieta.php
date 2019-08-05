<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Dieta extends Model
{
    protected $fillable = [
        'nombre', 'variacion_calorica', 'consulta_id'
    ];
	public $timestamps = false;
}
