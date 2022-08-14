<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatronMenuEjemplo extends Model
{
    use HasFactory;
    protected $fillable = [
        'tiempo_comida_id',  'dieta_id', 'ejemplo'
    ];
	public $timestamps = false;
}
