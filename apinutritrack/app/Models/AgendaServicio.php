<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgendaServicio extends Model
{
    use HasFactory;
	protected $fillable = [
		'nombre', 
		'duracion',
		'nutricionista_id'
    ];
	
     
	public $timestamps = false;
}
