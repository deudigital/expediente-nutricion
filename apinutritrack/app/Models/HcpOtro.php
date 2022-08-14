<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HcpOtro extends Model
{
    use HasFactory;
    protected $fillable = [
		'ciclos_menstruales', 
		'notas', 
		'paciente_id'
    ];
	
     
	public $timestamps = false;
}
