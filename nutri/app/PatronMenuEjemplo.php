<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PatronMenuEjemplo extends Model
{
    protected $fillable = [
        'tiempo_comida_id',  'dieta_id', 'ejemplo'
    ];
	public $timestamps = false;
}
