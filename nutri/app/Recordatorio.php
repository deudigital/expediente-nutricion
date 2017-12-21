<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Recordatorio extends Model
{
	protected $fillable	=	[
		'texto'
	];
	public $timestamps	=	false;
}
