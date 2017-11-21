<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DetalleDescripcion extends Model
{
	protected $table	=	'detalle_prescripcion';
    protected $fillable = [
        'prescripcion_id',  'grupo_alimento_nutricionista_id', 'porciones'
			 	 	 
    ];
	public $timestamps = false;
}
