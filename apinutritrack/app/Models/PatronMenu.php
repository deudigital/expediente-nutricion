<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatronMenu extends Model
{
    use HasFactory;
    protected $fillable = [
        'grupo_alimento_nutricionista_id',  'tiempo_comida_id',  'dieta_id', 'porciones', 'ejemplo'
    ];
	public $timestamps = false;
}
