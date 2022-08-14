<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ValoracionAntropometrica extends Model
{
    use HasFactory;
    public $timestamps	=	false;
	protected $table	=	'valor_antropometricas';
	protected $fillable	=	[
						'estatura', 
						'circunferencia_muneca', 
						'peso', 
						'grasa', 
						'musculo', 
						'agua', 
						'grasa_viceral', 
						'hueso', 
						'edad_metabolica', 
						'circunferencia_cintura', 
						'circunferencia_cadera', 
						'consulta_id'
					];
}
