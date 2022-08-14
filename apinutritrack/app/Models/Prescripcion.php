<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prescripcion extends Model
{
    use HasFactory;
    protected $fillable = [
        'carbohidratos',  'proteinas', 'grasas', 'dieta_id'
    ];
	public $timestamps = false;
}
