<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\ValoracionAntropometrica;
use App\DetalleGrasa;
use App\DetalleMusculo;
use DB;
class ValoracionAntropometricaController extends Controller
{
    public function store(Request $request)
    {
		if(!$request->input('consulta_id')){
			$response	=	Response::json([
				'code'		=>	422,
				'message'	=>	'Datos de consulta es requerido, intente de nuevo',
				'data'		=>	$request->all()
			], 200);
			return $response;
		}
		$action	=	'editado';
		$va	=	ValoracionAntropometrica::where('consulta_id', $request->consulta_id)
						->get()
						->first();

		if($va){
			/*$va->id	=	 1,*/
			$va->estatura				=	$request->estatura;
			$va->circunferencia_muneca	=	$request->circunferencia_muneca;
			$va->peso					=	$request->peso;
			$va->grasa					=	$request->grasa;
			$va->musculo				=	$request->musculo;
			$va->agua					=	$request->agua;
			$va->grasa_viceral			=	$request->grasa_viceral;
			$va->hueso					=	$request->hueso;
			$va->edad_metabolica		=	$request->edad_metabolica;
			$va->circunferencia_cintura	=	$request->circunferencia_cintura;
			$va->circunferencia_cadera	=	$request->circunferencia_cadera;
			/*"consulta_id": 1*/

		}else{$action	=	'registrado';
			$va	=	new ValoracionAntropometrica(
						array(
							'estatura'	=>	$request->estatura,
							'circunferencia_muneca'	=>	$request->circunferencia_muneca,
							'peso'	=>	$request->peso,
							'grasa'	=>	$request->grasa,
							'musculo'	=>	$request->musculo,
							'agua'	=>	$request->agua,
							'grasa_viceral'	=>	$request->grasa_viceral,
							'hueso'	=>	$request->hueso,
							'edad_metabolica'	=>	$request->edad_metabolica,
							'circunferencia_cintura'	=>	$request->circunferencia_cintura,
							'circunferencia_cadera'	=>	$request->circunferencia_cadera,
							'consulta_id'	=>	$request->consulta_id
						)
					);
		}
		$va->save();

		if($request->detalleGrasa){
			$aDetalleGrasa	=	array(
								'segmentado_abdominal'			=>	$request->detalleGrasa['segmentado_abdominal'],
								'segmentado_brazo_derecho'		=>	$request->detalleGrasa['segmentado_brazo_derecho'],
								'segmentado_brazo_izquierdo'	=>	$request->detalleGrasa['segmentado_brazo_izquierdo'],
								'segmentado_pierna_derecha'		=>	$request->detalleGrasa['segmentado_pierna_derecha'],
								'segmentado_pierna_izquierda'	=>	$request->detalleGrasa['segmentado_pierna_izquierda'],
								'pliegue_bicipital'				=>	$request->detalleGrasa['pliegue_bicipital'],
								'pliegue_subescapular'			=>	$request->detalleGrasa['pliegue_subescapular'],
								'pliegue_supraliaco'			=>	$request->detalleGrasa['pliegue_supraliaco'],
								'pliegue_tricipital'			=>	$request->detalleGrasa['pliegue_tricipital'],
								'valoracion_antropometrica_id'	=>	$va->id

							);

			$detalleGrasa	=	DetalleGrasa::create($aDetalleGrasa);
		}
		if($request->detalleMusculo){
			$aDetalleMusculo	=	array(
								'tronco'						=>	$request->detalleMusculo['tronco'],
								'brazo_izquierdo'				=>	$request->detalleMusculo['brazo_izquierdo'],
								'brazo_derecho'					=>	$request->detalleMusculo['brazo_derecho'],
								'pierna_izquierda'				=>	$request->detalleMusculo['pierna_izquierda'],
								'pierna_derecha'				=>	$request->detalleMusculo['pierna_derecha'],
								'valoracion_antropometrica_id'	=>	$va->id

							);

			$detalleMusculo	=	DetalleMusculo::create($aDetalleMusculo);
		}
		$response	=	Response::json([
			'message'	=> 'Valoracion Antropometrica ' . $action . ' correctamente',
			'data'		=>	$va
		], 201);
		return $response;
    }
    public function belongsToPaciente($id)
    {
		$registros = DB::table('valor_antropometricas')
            ->join('consultas', 'consultas.id', '=', 'valor_antropometricas.consulta_id')
            ->join('personas', 'personas.id', '=', 'consultas.paciente_id')
            ->where('consultas.paciente_id', $id)
            ->where('consultas.estado', 1)
            ->select('consultas.fecha', DB::raw('UNIX_TIMESTAMP(consultas.fecha) as date'), DB::raw('TIMESTAMPDIFF(YEAR,personas.fecha_nac,consultas.fecha) as edad'), DB::raw('TRUNCATE(valor_antropometricas.peso/(valor_antropometricas.estatura*valor_antropometricas.estatura), 2) as imc'), 'valor_antropometricas.peso', 'valor_antropometricas.estatura', 'valor_antropometricas.grasa', 'valor_antropometricas.grasa_viceral', 'valor_antropometricas.musculo', 'valor_antropometricas.agua', 'valor_antropometricas.hueso', 'valor_antropometricas.edad_metabolica', 'valor_antropometricas.circunferencia_cintura', 'valor_antropometricas.circunferencia_cadera', 'valor_antropometricas.circunferencia_muneca')
			->orderBy('consultas.fecha', 'DESC')
			->get();
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
    }
}