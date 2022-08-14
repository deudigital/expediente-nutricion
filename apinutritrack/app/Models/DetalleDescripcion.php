<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetalleDescripcion extends Model
{
    use HasFactory;
	protected $table	=	'detalle_prescripcion';
    protected $fillable = [
        'prescripcion_id',  'grupo_alimento_nutricionista_id', 'porciones'
			 	 	 
    ];
	public $timestamps = false;
}
