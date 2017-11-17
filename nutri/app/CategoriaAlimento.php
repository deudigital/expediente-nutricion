<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CategoriaAlimento extends Model
{
	public function alimentos(){
		return $this-> hasMany('App\Alimento');
	}
}
