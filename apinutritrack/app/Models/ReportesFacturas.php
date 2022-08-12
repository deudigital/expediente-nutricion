<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportesFacturas extends Model
{
    use HasFactory;
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
