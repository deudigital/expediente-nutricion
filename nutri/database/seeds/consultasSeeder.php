<?php

use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
//use DB;
class consultasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
		$pacientes	=	array(6,7,8,16,17,18,19,20,21,22);
		$faker	=	Faker::create();
		$date_init	=	'2010-01-21';
		for($i=0;$i<7;$i++){
			$date	=	$faker->dateTimeInInterval($date_init, '+' . $i . ' years');
			for($j=0;$j<5;$j++){
				$d	=	$j+5;
				/*'fecha'	=>	$faker->dateTimeBetween('-5 years', '-1 year'), */
				$aConsulta	=	array(
									'fecha'	=>	$faker->dateTimeInInterval($date, '+' . $d . ' days'), 
									'notas'	=>	$faker->text,  
									'estado'	=>	1, 
									'paciente_id'	=>	$faker->randomElement($pacientes)
								);
				/*$consulta	=	\DB::table('consultas_1')->insert( $aConsulta );*/
				$consulta	=	\DB::table('consultas_1')->insertGetId( $aConsulta );
				
				$aVa	=	array(
									'estatura'	=>	$faker->randomFloat(2, 1.50, 1.95), 
									'circunferencia_muneca'	=>	$faker->randomFloat(0,15,25), 
									'peso'	=>	$faker->randomFloat(0,60,105),
									'edad_metabolica'	=>	$faker->randomFloat(0,15,25), 
									'circunferencia_cintura'	=>	$faker->randomFloat(0,75,125), 
									'circunferencia_cadera'	=>	$faker->randomFloat(0,80,130), 
									'consulta_id'	=>	$consulta
								);
				/*
													'grasa'	=>	0,  
									'musculo'	=>	0, 
									'agua'	=>	0, 
									'grasa_viceral'	=>	0, 
									'hueso'	=>	0, 
				*/
				$consulta	=	\DB::table('valor_antropometricas_1')->insert( $aVa );
				
				$metodos	=	array('mifflin', 'benedict', 'both');
				$pesos	=	array('actual', 'ideal', 'ideal-ajustado');
				$aRdd	=	array(
								'metodo_calculo_gc'	=>	$faker->randomElement($metodos),  
								'peso_calculo'	=>	$faker->randomElement($pesos), 
								'factor_actividad_sedentaria'	=>	$faker->randomFloat(2,1,1.5),
								'promedio_gc_diario'	=>	$faker->randomFloat(2,1,1.5),
								'variacion_calorica'	=>	$faker->randomFloat(0,-500,-550),
								'consulta_id'	=>	$consulta
							);
				\DB::table('rdds')->insert( $aRdd );
			}
			
		}
		
    }
}
