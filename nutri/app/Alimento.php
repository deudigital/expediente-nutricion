<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Alimento extends Model
{
    //
	public function categoria(){
		return $this->belongsTo('App\CategoriaAlimento');
	}
/*	public function alimentos(){
		return $this-> hasMany('App\Alimento');
	}*/
}
