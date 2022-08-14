<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dieta extends Model
{
    use HasFactory;
    protected $fillable = [
        'nombre', 'variacion_calorica', 'consulta_id'
    ];
	public $timestamps = false;
}
