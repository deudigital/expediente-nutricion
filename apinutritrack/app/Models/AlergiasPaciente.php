<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlergiasPaciente extends Model
{
    use HasFactory;
    protected $fillable = [
		'alergia_id', 	
		'paciente_id'
    ];
	public $timestamps = false;
}
