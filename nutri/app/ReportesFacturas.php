<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReportesFacturas extends Model
{ 			
	protected $fillable	=	[
		'documento',
		'recetor',
		'tipo',
		'fecha',
		'moneda',
		'monto'
	];
	public $timestamps	=	false;
}