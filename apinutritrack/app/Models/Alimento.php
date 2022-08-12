<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alimento extends Model
{
    use HasFactory;
    public function categoria(){
		return $this->belongsTo('App\CategoriaAlimento');
	}
}
