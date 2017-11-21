<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Prescripcion extends Model
{
    protected $fillable = [
        'carbohidratos',  'proteinas', 'grasas'
    ];
	public $timestamps = false;
}
