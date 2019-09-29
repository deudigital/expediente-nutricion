<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PatronMenu extends Model
{
    protected $fillable = [
        'grupo_alimento_nutricionista_id',  'tiempo_comida_id',  'dieta_id', 'porciones', 'ejemplo'
    ];
	public $timestamps = false;
}
