<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HcfPatologiaPaciente extends Model
{
    use HasFactory;
    protected $fillable = [
		'hcf_patologia_id', 	
		'paciente_id',
		'notas'
    ];
	
     
	public $timestamps = false;
}
