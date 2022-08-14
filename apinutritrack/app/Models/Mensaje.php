<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mensaje extends Model
{
    use HasFactory;
	protected $fillable	=	[
		'texto',
		'dia',
		'hora',
		'ultimo_enviado'
	];
	public $timestamps	=	false;
}
