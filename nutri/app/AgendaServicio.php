<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AgendaServicio extends Model
{
	protected $fillable = [
		'nombre', 
		'duracion',
		'nutricionista_id'
    ];
	
     
	public $timestamps = false;
}
