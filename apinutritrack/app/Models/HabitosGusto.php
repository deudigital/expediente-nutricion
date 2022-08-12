<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HabitosGusto extends Model
{
    use HasFactory;
	protected $fillable = [
        //'id', 
		'comidas_favoritas', 
		'comidas_no_gustan', 
		'lugar_acostumbra_comer', 
		'lugar_caen_mal', 
		'notas', 
		'paciente_id'
    ];
	 
	public $timestamps = false;
}
