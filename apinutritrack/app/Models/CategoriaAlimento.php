<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoriaAlimento extends Model
{
    use HasFactory;

	public function alimentos(){
		return $this-> hasMany('App\Alimento');
	}
}
