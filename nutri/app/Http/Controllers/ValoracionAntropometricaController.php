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
		$consulta_id	=	false;
		if($request->input('va'))
			$consulta_id	=	$request->input('va')['consulta_id'];
		else
			$consulta_id	=	$request->input('consulta_id');
		/*$response	=	Response::json($consulta_id, 201);
		return $response;*/
		//if(!$request->input('consulta_id')){
		if(!$consulta_id){
			$response	=	Response::json([
				'code'		=>	422,
				'message'	=>	'Datos de consulta es requerido, intente de nuevo',
				'data'		=>	$request->all()
			], 200);
			return $response;
		}
		
		$_detalle_grasa		=	false;
		$_detalle_musculo	=	false;

		if($request->input('detalle_grasa'))
			$_detalle_grasa		=	$request->input('detalle_grasa');

		if($request->input('detalle_musculo'))
			$_detalle_musculo	=	$request->input('detalle_musculo');		
		
		if($request->input('va'))
			$request	=	(Object)$request->input('va');		
		
		
		
		$action	=	'editado';
		/*$va	=	ValoracionAntropometrica::where('consulta_id', $request->consulta_id)*/
		$va	=	ValoracionAntropometrica::where('consulta_id', $consulta_id)
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
			$va->save();
		}else{$action	=	'registrado';
			/*$va	=	new ValoracionAntropometrica(
						array(
							'estatura'				=>	$request->estatura,
							'circunferencia_muneca'	=>	$request->circunferencia_muneca,
							'peso'					=>	$request->peso,
							'grasa'					=>	$request->grasa,
							'musculo'				=>	$request->musculo,
							'agua'					=>	$request->agua,
							'grasa_viceral'			=>	$request->grasa_viceral,
							'hueso'					=>	$request->hueso,
							'edad_metabolica'		=>	$request->edad_metabolica,
							'circunferencia_cintura'=>	$request->circunferencia_cintura,
							'circunferencia_cadera'	=>	$request->circunferencia_cadera,
							'consulta_id'			=>	$request->consulta_id
						)
					);*/
			$aVa	=	array(
							'estatura'				=>	$request->estatura,
							'circunferencia_muneca'	=>	$request->circunferencia_muneca,
							'peso'					=>	$request->peso,
							'grasa'					=>	$request->grasa,
							'musculo'				=>	$request->musculo,
							'agua'					=>	$request->agua,
							'grasa_viceral'			=>	$request->grasa_viceral,
							'hueso'					=>	$request->hueso,
							'edad_metabolica'		=>	$request->edad_metabolica,
							'circunferencia_cintura'=>	$request->circunferencia_cintura,
							'circunferencia_cadera'	=>	$request->circunferencia_cadera,
							'consulta_id'			=>	$request->consulta_id
						);
			$va		=	ValoracionAntropometrica::create($aVa);
		}

		//if($_detalle_grasa){
		if($_detalle_grasa){
			$aDetalleGrasa	=	array(
								'segmentado_abdominal'			=>	$_detalle_grasa['segmentado_abdominal'],
								'segmentado_brazo_derecho'		=>	$_detalle_grasa['segmentado_brazo_derecho'],
								'segmentado_brazo_izquierdo'	=>	$_detalle_grasa['segmentado_brazo_izquierdo'],
								'segmentado_pierna_derecha'		=>	$_detalle_grasa['segmentado_pierna_derecha'],
								'segmentado_pierna_izquierda'	=>	$_detalle_grasa['segmentado_pierna_izquierda'],
								'pliegue_bicipital'				=>	$_detalle_grasa['pliegue_bicipital'],
								'pliegue_subescapular'			=>	$_detalle_grasa['pliegue_subescapular'],
								'pliegue_supraliaco'			=>	$_detalle_grasa['pliegue_supraliaco'],
								'pliegue_tricipital'			=>	$_detalle_grasa['pliegue_tricipital'],
								'valoracion_antropometrica_id'	=>	$va->id

							);

			$detalleGrasa	=	DetalleGrasa::create($aDetalleGrasa);
		}
		if($_detalle_musculo){
			$aDetalleMusculo	=	array(
								'tronco'						=>	$_detalle_musculo['tronco'],
								'brazo_izquierdo'				=>	$_detalle_musculo['brazo_izquierdo'],
								'brazo_derecho'					=>	$_detalle_musculo['brazo_derecho'],
								'pierna_izquierda'				=>	$_detalle_musculo['pierna_izquierda'],
								'pierna_derecha'				=>	$_detalle_musculo['pierna_derecha'],
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