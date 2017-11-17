<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    protected $primaryKey='persona_id';
	public $timestamps	=	false;
	protected $fillable = [
        'persona_id',
		'notas_patologias',
		'otras_patologias',
		'notas_alergias',
		'notas_medicamentos',
		'notas_otros', 
		'nutricionista_id', 
		'responsable_id', 
		'usuario',
		'contrasena'
    ];
}
