<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatologiasPaciente extends Model
{
    use HasFactory;
    protected $fillable = [
		'hcp_patologia_id', 	
		'paciente_id'
    ];
	public $timestamps = false;
}
