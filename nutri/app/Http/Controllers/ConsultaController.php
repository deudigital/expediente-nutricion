<?php
namespace App\Http\Controllers;
use Exception;
use App\Consulta;
use App\Paciente;
use App\Persona;
use App\Nutricionista;
use App\ValoracionAntropometrica;
use App\Rdd;
use App\Prescripcion;
use App\DetalleDescripcion;
use App\OtrosAlimento;
use App\TiempoComida;
use App\PatronMenu;
use App\PatronMenuEjemplo;
use App\DetalleMusculo;
use App\DetalleGrasa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Helper;
use DB;
use Mail;
use Carbon\Carbon;
use Auth;
class ConsultaController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $consultas	=	Consulta::all();
		$response	=	Response::json($consultas, 200, [], JSON_NUMERIC_CHECK);
		return $response;
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(!$request->persona_id){
			$response	=	Response::json([
				'code'	=>	422,
				'message'	=>	'Por Favor escriba los campos requeridos'
			], 200);
			return $response;
		}
		$last_valor_antropometrica	=	DB::table('valor_antropometricas')
            ->join('consultas', 'consultas.id', '=', 'valor_antropometricas.consulta_id')
            ->where('consultas.paciente_id', $request->persona_id)
			->orderBy('consultas.fecha', 'DESC')
			->first();
		$consulta	=	new Consulta(array(
			'fecha'	=>	DB::raw('now()'),
			'notas'	=>	trim($request->notas),
			'paciente_id'	=>	trim($request->persona_id)
		));
		if($consulta->save()){
			$response	=	array(
					'message'	=>	'Consulta registrada correctamente',
					'data'		=>	$consulta
				);
		}
		if(count($last_valor_antropometrica)>0)
			$response['va']	=	$last_valor_antropometrica;
		$response	=	Response::json($response, 201);
		return $response;
    }
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
		$message	=	array(
							'code'		=> '500',
							'message'	=> 'Se produjo un error interno al procesar la solicitud. Inténtalo de nuevo'
						);
		$consulta_id	=	$id;
		DB::beginTransaction();
		try {
			$valoracionAntropometrica	=	ValoracionAntropometrica::where('consulta_id', $consulta_id)
											->get()
											->first();

			if(count($valoracionAntropometrica)>0){
				DetalleMusculo::where('valoracion_antropometrica_id', $valoracionAntropometrica->id)->delete();
				DetalleGrasa::where('valoracion_antropometrica_id', $valoracionAntropometrica->id)->delete();
			}
			$prescripcion	=	Prescripcion::where('consulta_id', $consulta_id)
										->get()
										->first();

			if(count($prescripcion)>0){
				DetalleDescripcion::where('prescripcion_id', $prescripcion->id)->delete();
				OtrosAlimento::where('prescripcion_id', $prescripcion->id)->delete();
			}
			ValoracionAntropometrica::where('consulta_id', $consulta_id)->delete();
			Prescripcion::where('consulta_id', $consulta_id)->delete();
			Rdd::where('consulta_id', $consulta_id)->delete();
			PatronMenu::where('consulta_id', $consulta_id)->delete();
			PatronMenuEjemplo::where('consulta_id', $consulta_id)->delete();

			Consulta::destroy($consulta_id);

			DB::commit();
			// all good
			$message	=	array(
							'code'		=> '204',
							'message'	=> 'Se ha eliminado correctamente'
						);
		} catch (\Exception $e) {
			DB::rollback();
			// something went wrong
			$message['error']	=	$e->getMessage();

		}
        $response	=	Response::json($message, 201);
		return $response;
    }
    public function process()
    {
        $consultas	=	Consulta::all();
		if(!$consultas){
			return Response::json('Sin Datos', 204);
		}
		$registros	=	Array();
		foreach($consultas as $consulta){
			$_item['id']		=	$consulta->id;
			$_item['fecha']		=	$consulta->fecha;
			$_item['notas']		=	$consulta->notas;
			$_item['estado']	=	$consulta->estado;
			$_item['paciente_id']=	$consulta->paciente_id;
			$_item['paciente']	=	Paciente::find( $consulta->paciente_id );
			$_item['persona']	=	Persona::find( $consulta->paciente_id );
			$registros[]			=	$_item;
		}
		if(count($registros)>0)
			$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		else
			$response	=	Response::json('Sin Datos', 204);
		return $response;
    }
	function belongsToPaciente($id){
		$registros	=	Consulta::where('paciente_id', $id)
						->where('consultas.estado', 1)
						->orderBy('consultas.fecha', 'DESC')
						->get();
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	function pendientes($id){
		try{
		$registros = DB::table('consultas')
            ->join('pacientes', 'pacientes.persona_id', '=', 'consultas.paciente_id')
            ->join('personas', 'personas.id', '=', 'pacientes.persona_id')
            ->where('consultas.estado', 0)
            ->where('pacientes.nutricionista_id', $id)
            ->select('consultas.id', 'consultas.fecha', 'consultas.notas', 'personas.id as persona_id', 'personas.nombre as paciente_nombre', 'personas.telefono', 'pacientes.nutricionista_id as nutricionista', DB::raw('TIMESTAMPDIFF(YEAR,personas.fecha_nac,now()) as edad'), 'personas.genero')
			->orderBy('consultas.id', 'DESC')
            ->get();
			if(count($registros)>0)
				$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
			else
				$response	=	Response::json(['message' => 'Record not found'], 204);
		}
		catch (Illuminate\Database\QueryException $e) {
			dd($e);
		} catch (PDOException $e) {
			dd($e);
		}
		return $response;
	}
	function belongsToNutricionista($id){
		$registros = DB::table('consultas')
            ->join('pacientes', 'pacientes.persona_id', '=', 'consultas.paciente_id')
            ->join('personas', 'personas.id', '=', 'pacientes.persona_id')
            ->where('pacientes.nutricionista_id', $id)
            ->select('consultas.*', 'personas.id as persona_id', 'personas.nombre as paciente_nombre', 'personas.telefono')
            ->get();

		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	function getAllInfoConsulta($id){
		$registros	=	array();
		if(count($valoracionAntropometrica)>0)
			$registros['va']	=	$valoracionAntropometrica->toArray();

		$rdd	=	Rdd::where('consulta_id', $id)
										->get();
		if(count($rdd)>0)
			$registros['rdd']	=	$rdd->toArray();

		$prescripcion	=	Prescripcion::where('consulta_id', $id)
										->get();
		if(count($prescripcion)>0)
			$registros['dieta']['prescripcion']	=	$prescripcion->toArray();

		$patronMenu	=	PatronMenu::where('consulta_id', $id)
										->get();
		if(count($patronMenu)>0)
			$registros['dieta']['patron_menu']	=	$patronMenu->toArray();
		return true;
	}
	function all($id){
		$consulta	=	Consulta::find($id);
		if(count($consulta)==0)
			return Response::json(['message' => 'Record not found'], 204);
		$registros	=	$consulta->toArray();
/*
Enviar usuario y contrasena?????? por ahora si...
*/

		$prom_mes		=	'30.4375';
		$prom_anho		=	'365.25';
		$anhos			=	'TIMESTAMPDIFF( YEAR, personas.fecha_nac, CURRENT_DATE())';
		$meses			=	'TIMESTAMPDIFF( MONTH, personas.fecha_nac, CURRENT_DATE())';
		$dias			=	'TIMESTAMPDIFF( DAY, personas.fecha_nac, CURRENT_DATE())';
		
		$meses_residuo	=	'(' . $meses . '%12)';
		$dias_residuo	=	'(' . $dias . ' % ' . $prom_mes . ' )';

		$meses_residuo_total=	'(' . $meses_residuo . ' + (' . $dias_residuo . '/' . $prom_mes . '))';/*	meses + dias/mes	*/
		$anhos_residuo_total=	'(' . $meses_residuo_total . '/' . $prom_anho . ')';/*	años + meses_residuo_total/*/
		$anhos_real			=	'(' . $anhos . ' + ' . $anhos_residuo_total . ')';/*	años + meses_residuo_total/*/
		
		$meses_total	=	'(' . $anhos . '*12) +' . $meses_residuo_total;

		$paciente 		=	DB::table('pacientes')
							->join('personas', 'personas.id', '=', 'pacientes.persona_id')
							->where('pacientes.persona_id', $consulta->paciente_id)
							->select('*', DB::raw('DATE_FORMAT(personas.fecha_nac,\'%d/%m/%Y\')  as fecha_nac'), DB::raw( $anhos_real . ' as edad' ), DB::raw( $meses_total . ' as edad_meses' ), DB::raw( $dias . ' as edad_dias' ))
							->get()
							->first();

		if(count($paciente)>0){
			$registros['paciente']	=	(array)$paciente;
		}

		$hcf_patologias = DB::table('hcf_patologias_pacientes')
				->join('hcf_patologias', 'hcf_patologias.id', '=', 'hcf_patologias_pacientes.hcf_patologia_id')
				->where('hcf_patologias_pacientes.paciente_id',  $consulta->paciente_id)
				->get();
		if(count($hcf_patologias)>0)
			$registros['paciente']['hcf']['patologias']	=	$hcf_patologias->toArray();

		$hcp_patologias = DB::table('patologias_pacientes')
				->join('hcp_patologias', 'hcp_patologias.id', '=', 'patologias_pacientes.hcp_patologia_id')
				->where('patologias_pacientes.paciente_id',  $consulta->paciente_id)
				->get();
		if(count($hcp_patologias)>0)
			$registros['paciente']['hcp']['patologias']	=	$hcp_patologias->toArray();

		$alergias = DB::table('alergias_pacientes')
				->join('alergias', 'alergias.id', '=', 'alergias_pacientes.alergia_id')
				->where('alergias_pacientes.paciente_id',  $consulta->paciente_id)
				->get();
		if(count($alergias)>0)
			$registros['paciente']['hcp']['alergias']	=	$alergias->toArray();

		$bioquimicas	=	DB::table('bioquimica_clinicas')
				->where('bioquimica_clinicas.paciente_id',  $consulta->paciente_id)
				->select('bioquimica_clinicas.*', DB::raw('SUBSTRING_INDEX(filename,\'/\', -1) as file'), DB::raw('date_format(bioquimica_clinicas.fecha,\'%d/%m/%Y\') as fecha'))
				->get();
		if(count($bioquimicas)>0)
			$registros['paciente']['hcp']['bioquimicas']	=	$bioquimicas->toArray();
		$hcpOtros	=	DB::table('hcp_otros')
				->where('hcp_otros.paciente_id',  $consulta->paciente_id)
				->get()
				->first();
		if(count($hcpOtros)>0)
			$registros['paciente']['hcp']['otros']	=	$hcpOtros;

		$objetivos	=	DB::table('objetivos')
				->where('objetivos.paciente_id',  $consulta->paciente_id)
				->select('objetivos.*', DB::raw('date_format(from_unixtime(objetivos.fecha),\'%d/%m/%Y\') as fecha'))
				->get();
		if(count($objetivos)>0)
			$registros['paciente']['objetivos']	=	$objetivos->toArray();

		$ejercicios	=	DB::table('ejercicios_pacientes')
				->join('ejercicios', 'ejercicios.id', '=', 'ejercicios_pacientes.ejercicio_id')
				->where('ejercicios_pacientes.paciente_id',  $consulta->paciente_id)
				->get();
		if(count($ejercicios)>0)
			$registros['paciente']['habitos']['ejercicios']	=	$ejercicios->toArray();

		$gustos	=	DB::table('habitos_gustos')
				->where('habitos_gustos.paciente_id',  $consulta->paciente_id)
				->get()
				->first();
		if(count($gustos)>0)
			$registros['paciente']['habitos']['gustos']	=	$gustos;


		$habitos_otros	=	DB::table('habitos_otros')
				->where('habitos_otros.paciente_id',  $consulta->paciente_id)
				->get()
				->first();
		if(count($habitos_otros)>0)
			$registros['paciente']['habitos']['otros']	=	$habitos_otros;

		$valoracion_dietetica	=	DB::table('detalle_valoracion_dieteticas')
				->where('detalle_valoracion_dieteticas.paciente_id',  $consulta->paciente_id)
				->get();
		if(count($valoracion_dietetica)>0)
			$registros['paciente']['habitos']['valoracionDietetica']	=	$valoracion_dietetica->toArray();

		$detalleValoracionDieteticaEjemplo	=	DB::table('detalle_valoracion_dietetica_ejemplos')
									->where('detalle_valoracion_dietetica_ejemplos.paciente_id',  $consulta->paciente_id)
									->orderBy('categoria_valoracion_dietetica_id', 'ASC')
									->get();
		if(count($detalleValoracionDieteticaEjemplo)>0){
			$registros['paciente']['habitos']['valoracionDieteticaEjemplo']	=	$detalleValoracionDieteticaEjemplo->toArray();
		}
		/*	CONTROL	*/
		$valoracionAntropometrica	=	ValoracionAntropometrica::where('consulta_id', $id)
										->get()
										->first();
		if(count($valoracionAntropometrica)>0){
			$aVa	=	$valoracionAntropometrica->toArray();
			$aVa['circunferencia_muneca']	=	intval($aVa['circunferencia_muneca']);
			$registros['va']	=	$aVa;

			$detalleMusculo	=	DetalleMusculo::where('valoracion_antropometrica_id', $valoracionAntropometrica->id)
											->get()
											->first();
			if(count($detalleMusculo)>0){
				$registros['va']['detalleMusculo']	=	$detalleMusculo->toArray();
			}
			$detalleGrasa	=	DetalleGrasa::where('valoracion_antropometrica_id', $valoracionAntropometrica->id)
											->get()
											->first();
			if(count($detalleGrasa)>0){
				$registros['va']['detalleGrasa']	=	$detalleGrasa->toArray();
			}
		}

		$rdd	=	Rdd::where('consulta_id', $id)
										->get()
										->first();
		if(count($rdd)>0)
			$registros['rdd']	=	$rdd->toArray();

		$prescripcion	=	Prescripcion::where('consulta_id', $id)
										->get()
										->first();

		if(count($prescripcion)>0){
			$registros['dieta']['prescripcion']	=	$prescripcion->toArray();
			$detalleDescripcion	=	DB::table('detalle_prescripcion')
										->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'detalle_prescripcion.grupo_alimento_nutricionista_id')
										->where('detalle_prescripcion.prescripcion_id',$prescripcion->id)
										->orderBy('grupo_alimento_nutricionistas.id', 'ASC')
										->get();
			if(count($detalleDescripcion)>0){
				$registros['dieta']['prescripcion']['items']	=	$detalleDescripcion->toArray();
			}

			$otrosAlimento	=	OtrosAlimento::where('prescripcion_id', $prescripcion->id)
											->get();
			if(count($otrosAlimento)>0){
				$registros['dieta']['prescripcion']['otros']	=	$otrosAlimento->toArray();
			}else
				$registros['dieta']['prescripcion']['otros']	=	array();

		}
		$patronMenu	=	PatronMenu::where('consulta_id', $id)
										->get();
		if(count($patronMenu)>0)
			$registros['dieta']['patron_menu']	=	$patronMenu->toArray();
			
//										->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'detalle_prescripcion.grupo_alimento_nutricionista_id')
		$patronMenuEjemplos	=	DB::table('patron_menu_ejemplos')
									->where('consulta_id',$id)
									->orderBy('tiempo_comida_id', 'ASC')
									->get();

		if(count($patronMenuEjemplos)>0)
			$registros['dieta']['patron_menu_ejemplos']	=	$patronMenuEjemplos->toArray();

		$prom_mes		=	'30.4375';
		$prom_anho		=	'365.25';
		$anhos			=	'TIMESTAMPDIFF( YEAR, personas.fecha_nac, consultas.fecha)';
		$meses			=	'TIMESTAMPDIFF( MONTH, personas.fecha_nac, consultas.fecha)';
		$dias			=	'TIMESTAMPDIFF( DAY, personas.fecha_nac, consultas.fecha)';
		
		$meses_residuo	=	'(' . $meses . '%12)';
		$dias_residuo	=	'(' . $dias . ' % ' . $prom_mes . ' )';

		$meses_residuo_total=	'(' . $meses_residuo . ' + (' . $dias_residuo . '/' . $prom_mes . '))';/*	meses + dias/mes	*/
		$anhos_residuo_total=	'(' . $meses_residuo_total . '/' . $prom_anho . ')';/*	años + meses_residuo_total/*/
		$anhos_real			=	'(' . $anhos . ' + ' . $anhos_residuo_total . ')';/*	años + meses_residuo_total/*/
		
		$meses_total	=	'(' . $anhos . '*12) +' . $meses_residuo_total;

		$va_historial = DB::table('valor_antropometricas')
            ->join('consultas', 'consultas.id', '=', 'valor_antropometricas.consulta_id')
            ->join('personas', 'personas.id', '=', 'consultas.paciente_id')
            ->where('consultas.paciente_id', $consulta->paciente_id)
            ->where('consultas.estado', 1)
            ->select('consultas.fecha', DB::raw('DATE_FORMAT(consultas.fecha,\'%d/%m/%Y\')  as date_formatted'), DB::raw('UNIX_TIMESTAMP(consultas.fecha) as date'), DB::raw( $anhos_real . ' as edad' ), DB::raw( $meses_total . ' as edad_meses' ), DB::raw( $dias . ' as edad_dias' ), DB::raw('TIMESTAMPDIFF(YEAR,personas.fecha_nac,consultas.fecha) as edad'), 
			DB::raw('TRUNCATE(valor_antropometricas.peso/(valor_antropometricas.estatura*valor_antropometricas.estatura), 2) as imc'), 'valor_antropometricas.peso', 'valor_antropometricas.estatura', 'valor_antropometricas.grasa', 'valor_antropometricas.grasa_viceral', 'valor_antropometricas.musculo', 'valor_antropometricas.agua', 'valor_antropometricas.hueso', 'valor_antropometricas.edad_metabolica', 'valor_antropometricas.circunferencia_cintura', 'valor_antropometricas.circunferencia_cadera', 'valor_antropometricas.circunferencia_muneca')
			->orderBy('consultas.fecha', 'DESC')
			->get();

		if(count($va_historial)>0)
			$registros['va']['historial']	=	$va_historial->toArray();
		
		
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	function setConsultaForPaciente($id){
		$consulta	=	new Consulta(array(
			'fecha'	=>	DB::raw('now()'),
			'notas'	=>	'',
			'paciente_id'	=>	$id
		));

		$consulta->save();
		$registros	=	$consulta->toArray();
		$paciente = DB::table('pacientes')
            ->join('personas', 'personas.id', '=', 'pacientes.persona_id')
            ->where('pacientes.persona_id', $consulta->paciente_id)
			->get();
		if(count($paciente)>0)
			$registros['paciente']	=	$paciente->toArray();
		$this-> getAllInfoConsulta($id)();
		return Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
	}
	function storeMusculo(Request $request){
		if(!$request->input('valoracion_antropometrica_id')){
			$response	=	Response::json([
				'code'		=>	422,
				'message'	=>	'Datos de Valoracion Antropometrica son requeridos, intente de nuevo',
				'data'		=>	$request->all()
			], 200);
			return $response;
		}		
		if($request->input('id')){
			$detalleMusculo									=	DetalleMusculo::where('valoracion_antropometrica_id', $request->valoracion_antropometrica_id)
																					->get()
																					->first();

			$detalleMusculo->tronco							=	$request->tronco;
			$detalleMusculo->brazo_izquierdo				=	$request->brazo_izquierdo;
			$detalleMusculo->brazo_derecho					=	$request->brazo_derecho;
			$detalleMusculo->pierna_izquierda				=	$request->pierna_izquierda;
			$detalleMusculo->pierna_derecha					=	$request->pierna_derecha;
			$detalleMusculo->valoracion_antropometrica_id	=	$request->valoracion_antropometrica_id;
		}else{
			$detalleMusculo	=	DetalleMusculo::create([
							'tronco'						=>	$request->tronco,
							'brazo_izquierdo'				=>	$request->brazo_izquierdo,
							'brazo_derecho'					=>	$request->brazo_derecho,
							'pierna_izquierda'				=>	$request->pierna_izquierda,
							'pierna_derecha'				=>	$request->pierna_derecha,
							'valoracion_antropometrica_id'	=>	$request->valoracion_antropometrica_id
							]);
		}
		$detalleMusculo->save();
		$message	=	array(
							'code'		=> '201',
							'id'		=> $detalleMusculo->id,
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
	}
	function storeGrasa(Request $request){
		if(!$request->input('valoracion_antropometrica_id')){
			$response	=	Response::json([
				'code'		=>	422,
				'message'	=>	'Datos de Valoracion Antropometrica son requeridos, intente de nuevo',
				'data'		=>	$request->all()
			], 200);
			return $response;
		}		
		if($request->input('id')){
			$detalleGrasa									=	DetalleGrasa::find($request->id);

			$detalleGrasa->segmentado_abdominal			=	$request->segmentado_abdominal;
			$detalleGrasa->segmentado_brazo_derecho		=	$request->segmentado_brazo_derecho;
			$detalleGrasa->segmentado_brazo_izquierdo	=	$request->segmentado_brazo_izquierdo;
			$detalleGrasa->segmentado_pierna_derecha	=	$request->segmentado_pierna_derecha;
			$detalleGrasa->segmentado_pierna_izquierda	=	$request->segmentado_pierna_izquierda;
			$detalleGrasa->pliegue_bicipital			=	$request->pliegue_bicipital;
			$detalleGrasa->pliegue_subescapular			=	$request->pliegue_subescapular;
			$detalleGrasa->pliegue_supraliaco			=	$request->pliegue_supraliaco;
			$detalleGrasa->pliegue_tricipital			=	$request->pliegue_tricipital;
			$detalleGrasa->valoracion_antropometrica_id	=	$request->valoracion_antropometrica_id;
		}else{
			$detalleGrasa	=	array(
								'segmentado_abdominal'			=>	$request->segmentado_abdominal,
								'segmentado_brazo_derecho'		=>	$request->segmentado_brazo_derecho,
								'segmentado_brazo_izquierdo'	=>	$request->segmentado_brazo_izquierdo,
								'segmentado_pierna_derecha'		=>	$request->segmentado_pierna_derecha,
								'segmentado_pierna_izquierda'	=>	$request->segmentado_pierna_izquierda,
								'pliegue_bicipital'				=>	$request->pliegue_bicipital,
								'pliegue_subescapular'			=>	$request->pliegue_subescapular,
								'pliegue_supraliaco'			=>	$request->pliegue_supraliaco,
								'pliegue_tricipital'			=>	$request->pliegue_tricipital,
								'valoracion_antropometrica_id'	=>	$request->valoracion_antropometrica_id
							);
			$detalleGrasa	=	DetalleGrasa::create($detalleGrasa);
		}
		$detalleGrasa->save();
		$message	=	array(
							'code'		=> '201',
							'id'		=> $detalleGrasa->id,
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
	}
	function storeNotas(Request $request){
		if(!$request->input('id'))
			return Response::json(['message' => 'Record not found'], 204);

		$aResponse	=	array();
		$consulta	=	Consulta::find($request->input('id'));
		if($consulta){
			$notas	=	$request->notas;
			if($notas)
				$consulta->notas	=	$request->notas[0];

			if($request->input('finalizar'))
				$consulta->estado	=	1;

			$consulta->save();

			if($consulta->estado){
				$persona		=	Persona::find($consulta->paciente_id);
				$paciente = DB::table('pacientes')
								->join('personas', 'personas.id', '=', 'pacientes.persona_id')
								->where('pacientes.persona_id', $consulta->paciente_id)
								->get()
								->first();
				
				if(count($paciente)>0){
					$aResponse['nutricionista']	=	Nutricionista::find($paciente->nutricionista_id);
					if($paciente->email || $paciente->responsable_email){
						$this->generatePacienteCredentials($persona, $aResponse['nutricionista']->imagen);
						$this->generateResumenConsulta($consulta->id);
					}
				}
			}
			$aResponse['consulta']	=	$consulta;
		}
		$response	=	Response::json($aResponse, 201, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	function generatePacienteCredentials($persona, $logo){
		$paciente		=	Paciente::find($persona->id);
		$nutricionista	=	Persona::find($paciente->nutricionista_id);
		if($paciente->usuario)
			return ;

		$paciente->usuario		=	$persona->email;
		$paciente->contrasena	=	rand ( 1234 , 9999 );
		$paciente->save();

		$paciente->email				=	$persona->email;
		$paciente->nombre				=	$persona->nombre;
		$paciente->nombre_nutricionista	=	$nutricionista->nombre;
		$paciente->email_nutricionista	=	$nutricionista->email;
		$data	=	array(
							'nombre'	=>	$persona->nombre, 
							'usuario'	=>	$paciente->usuario, 
							'contrasena'=>	$paciente->contrasena,
							'logo'		=>	$logo
					);
		Mail::send('emails.credenciales_nutritrack', $data, function($message) use ($paciente) {
			$subject	=	'Credenciales NutriTrack App | ' . $paciente->nombre;
			$subject	=	htmlentities($subject);
			$subject	=	str_replace('&ntilde;','=C3=B1',$subject);
			
			$bcc	=	explode(',', env('APP_EMAIL_BCC'));			
			$message->subject('=?utf-8?Q?=F0=9F=94=91 ' . $subject . '?=');
			$message->to($paciente->email, $paciente->nombre);
			$message->from($paciente->email_nutricionista, $paciente->nombre_nutricionista);
			$message->cc($paciente->email_nutricionista, $paciente->nombre_nutricionista);
			$message->bcc($bcc);
			/*$message->replyTo(env('EMAIL_REPLYTO'));*/
		});		
/*
 * Al finalizar la primera consulta,
 * se deben crear las credenciales para el acceso al app
 * para el usuario, las credenciales a crear son:
 * Usuario: [correo electrónico]
 * Password: [crear numero aleatorio de 4 dígitos]
 * Una vez creados y almacenados los credenciales en la base de datos,
 * se debe enviar la informacion de los mismos al correo del usuario.
 * Subject: Credenciales NutriTrack
 * Body: [documento adjunto] (ver zip para imagenes de descarga en tiendas
 * de app y play)
 * Importante: Esto únicamente es necesario al finalizar la primera consulta de un paciente, no es necesario en consultas recurrentes
 */
	}

	function _get_info_va(){
		$_info_va['estatura']				=	array(
													'titulo'=>	'Estatura',
													'unidad'=>	'm'
													);
		$_info_va['circunferencia_muneca']	=	array(
													'titulo'=>	'Mu&ntilde;eca',
													'unidad'=>	'cm'
													);
		$_info_va['peso']					=	array(
													'titulo'=>	'Peso',
													'unidad'=>	'Kg'
													);
		$_info_va['grasa']					=	array(
													'titulo'=>	'Grasa',
													'unidad'=>	'%'
													);
		$_info_va['musculo']				=	array(
													'titulo'=>	'M&uacute;sculo',
													'unidad'=>	'Kg'
													);
		$_info_va['agua']					=	array(
													'titulo'=>	'Agua',
													'unidad'=>	'%'
													);
		$_info_va['grasa_viceral']			=	array(
													'titulo'=>	'Grasa Visceral',
													'unidad'=>	''
													);
		$_info_va['hueso']					=	array(
													'titulo'=>	'Hueso',
													'unidad'=>	'Kg'
													);
		$_info_va['edad_metabolica']		=	array(
													'titulo'=>	'Edad Metab&oacute;lica',
													'unidad'=>	'a&ntilde;os'
													);
		$_info_va['circunferencia_cintura']	=	array(
													'titulo'=>	'Circunferencia Cintura',
													'unidad'=>	'cm'
													);
		$_info_va['circunferencia_cadera']	=	array(
													'titulo'=>	'Circunferencia Cadera',
													'unidad'=>	'cm'
													);
		
		$_info_va['segmentado_abdominal']		=	array(
														'titulo'=>	'Abdominal',
														'unidad'=>	'%'
														);
		$_info_va['segmentado_brazo_izquierdo']	=	array(
														'titulo'=>	'Brazo Izquierdo',
														'unidad'=>	'%'
														);
		$_info_va['segmentado_brazo_derecho']	=	array(
														'titulo'=>	'Brazo Derecho',
														'unidad'=>	'%'
														);
		$_info_va['segmentado_pierna_izquierda']=	array(
														'titulo'=>	'Pierna Izquierda',
														'unidad'=>	'%'
														);
		$_info_va['segmentado_pierna_derecha']	=	array(
														'titulo'=>	'Pierna Derecha',
														'unidad'=>	'%'
														);

		$_info_va['tronco']				=	array(
												'titulo'=>	'Tronco',
												'unidad'=>	'Kg'
												);
		$_info_va['brazo_izquierdo']	=	array(
												'titulo'=>	'Brazo Izquierdo',
												'unidad'=>	'Kg'
												);
		$_info_va['brazo_derecho']		=	array(
												'titulo'=>	'Brazo Derecho',
												'unidad'=>	'Kg'
												);
		$_info_va['pierna_izquierda']	=	array(
												'titulo'=>	'Pierna Izquierda',
												'unidad'=>	'Kg'
												);
		$_info_va['pierna_derecha']		=	array(
												'titulo'=>	'Pierna Derecha',
												'unidad'=>	'Kg'
												);
		return $_info_va;
	}

	function prepareData($consulta){
		$paciente	=	DB::table('pacientes')
							->join('personas', 'personas.id', '=', 'pacientes.persona_id')
							->where('pacientes.persona_id', $consulta->paciente_id)
							->get()
							->first();

		$_info_va	=	$this->_get_info_va();

		$valoracionAntropometrica	=	ValoracionAntropometrica::where('consulta_id', $consulta->id)
										->get()
										->first();
		if(count($valoracionAntropometrica)>0){
			$aValoracionAntropometrica	=	$valoracionAntropometrica->toArray();
			
			$aDetalleMusculo	=	DetalleMusculo::where('valoracion_antropometrica_id', $valoracionAntropometrica->id)
						->get()
						->first();
			$aDetalleGrasa		=	DetalleGrasa::where('valoracion_antropometrica_id', $valoracionAntropometrica->id)
						->get()
						->first();

			$i	=	0;
			$blade['va']	=	array();
			foreach($aValoracionAntropometrica as $key=>$value){
				if(in_array($key,['id','consulta_id', 'percentil_analisis']) || floatval($value)==0)
					continue;

				$bva	=	array();
				switch($key){
					case 'agua':
						$bva['icono']	=	'agua-corp';
						break;
					case 'grasa':
						$bva['icono']	=	'grasa-corp';
						break;
					case 'grasa_viceral':
						$bva['icono']	=	'grasa-visc';
						break;
					case 'edad_metabolica':
						$bva['icono']	=	'edad-meta';
						break;
					case 'circunferencia_muneca':
						$bva['icono']	=	'munneca';
						break;
					case 'circunferencia_cintura':
						$bva['icono']	=	'cintura';
						break;
					case 'circunferencia_cadera':
						$bva['icono']	=	'cadera';
						break;
					default:
						$bva['icono']	=	$key;
				}				
				$bva['titulo']	=	$_info_va[$key]['titulo'];
				$bva['unidad']	=	$_info_va[$key]['unidad'];
				if($key=='edad_metabolica')
					$bva['unidad']	=	' ' . $bva['unidad'];

				if(is_int($value))
					$bva['value']	=	intval($value);
				else
					$bva['value']	=	floatval($value);
				
				if($key=='grasa' && $aDetalleGrasa){
					$aDetalleGrasa	=	$aDetalleGrasa->toArray();
					$grasa_detalle	=	array();
					foreach($aDetalleGrasa as $mkey=>$mvalue){
						$grasa_detalle[$mkey]	=	intval($mvalue);
					}
					$bva['grasa_detalle']	=	$grasa_detalle;
				}
				if($key=='musculo' && $aDetalleMusculo){
					$aDetalleMusculo	=	$aDetalleMusculo->toArray();			
					$musculo_detalle	=	array();
					foreach($aDetalleMusculo as $mkey=>$mvalue){
						$musculo_detalle[$mkey]	=	intval($mvalue);
					}
					$bva['musculo_detalle']	=	$musculo_detalle;
				}
				$blade['va'][$key]	=	$bva;
			}
			if(count($blade)>0){
				$order	=	array('estatura', 'peso', 'grasa', 'musculo', 'circunferencia_muneca', 'agua', 'grasa_viceral', 'hueso', 'edad_metabolica', 'circunferencia_cintura', 'circunferencia_cadera');
				$aNew	=	array();
				foreach($order as $key){
					if(!isset($blade['va'][$key]))
						continue;
					$aNew[$key]	=	$blade['va'][$key];
				}
				$blade['va']	=	$aNew;
			}			
		}

		$prescripcion	=	Prescripcion::where('consulta_id', $consulta->id)
										->get()
										->first();
		if(count($prescripcion)>0){
			$aPrescripcion	=	$prescripcion->toArray();
			$detalleDescripcion	=	DB::table('detalle_prescripcion')
										->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'detalle_prescripcion.grupo_alimento_nutricionista_id')
										->where('detalle_prescripcion.prescripcion_id',$prescripcion->id)
										->orderBy('grupo_alimento_nutricionistas.id', 'ASC')
										->get();
			$aPrescripcionItems	=	array();
			if(count($detalleDescripcion)>0){
				$aPrescripcionItems	=	$detalleDescripcion->toArray();
			}
			if(count($aPrescripcionItems)>0){
				for($i=0;$i<count($aPrescripcionItems);$i++){
					switch($aPrescripcionItems[$i]->grupo_alimento_nutricionista_id){
						case '1':
							$aPrescripcionItems[$i]->grupo_alimento_nutricionista_imagen	=	'leche-descremada.png';
							break;
						case 2:
							$aPrescripcionItems[$i]->grupo_alimento_nutricionista_imagen	=	'leche2.png';
							break;
						case 3:
							$aPrescripcionItems[$i]->grupo_alimento_nutricionista_imagen	=	'leche-entera.png';
							break;
						case 4:
							$aPrescripcionItems[$i]->grupo_alimento_nutricionista_imagen	=	'vegetales.png';
							break;
						case 5:
							$aPrescripcionItems[$i]->grupo_alimento_nutricionista_imagen	=	'frutas.png';
							break;
						case 6:
							$aPrescripcionItems[$i]->grupo_alimento_nutricionista_imagen	=	'harinas.png';
							break;
						case 7:
							$aPrescripcionItems[$i]->grupo_alimento_nutricionista_imagen	=	'carne-magra.png';
							break;
						case 8:
							$aPrescripcionItems[$i]->grupo_alimento_nutricionista_imagen	=	'carne-int.png';
							break;
						case 9:
							$aPrescripcionItems[$i]->grupo_alimento_nutricionista_imagen	=	'carne-grasa.png';
							break;
						case 10:
							$aPrescripcionItems[$i]->grupo_alimento_nutricionista_imagen	=	'azucar.png';
							break;
						case 11:
							$aPrescripcionItems[$i]->grupo_alimento_nutricionista_imagen	=	'grasa.png';
							break;
						case 12:
							$aPrescripcionItems[$i]->grupo_alimento_nutricionista_imagen	=	'agua.png';
							break;
					}
					
				}
			}
			$blade['prescripcion']	=	$aPrescripcionItems;
		}
		$tiempoComidas	=	TiempoComida::all();
		if(count($tiempoComidas)>0){
			$aTiempoComidas	=	$tiempoComidas->toArray();
			$_tiempo_comidas	=	array();
			foreach($aTiempoComidas as $key=>$value){
				$_tiempo_comidas[$value['id']]['nombre']	=	htmlentities($value['nombre']);
				$_tiempo_comidas[$value['id']]['ejemplo']	=	'';
				$_tiempo_comidas[$value['id']]['menu']		=	array();
			}
		}
		$patronMenuEjemplo	=	PatronMenuEjemplo::where('consulta_id', $consulta->id)
									->get();
		if(count($patronMenuEjemplo)>0){
			$aPatronMenuEjemplo	=	$patronMenuEjemplo->toArray();
			foreach($aPatronMenuEjemplo as $key=>$value)
				$_tiempo_comidas[$value['tiempo_comida_id']]['ejemplo']	=	$value['ejemplo'];
		}
		$patronMenu	=	DB::table('patron_menus')
							->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'patron_menus.grupo_alimento_nutricionista_id')
							->join('tiempo_comidas', 'tiempo_comidas.id', '=', 'patron_menus.tiempo_comida_id')
							->where('patron_menus.consulta_id', $consulta->id)
							->select('patron_menus.*', 'grupo_alimento_nutricionistas.nombre as alimento' )
							->orderBy('patron_menus.tiempo_comida_id', 'ASC')
							->get();
		if(count($patronMenu)>0){
			$aPatronMenu	=	$patronMenu->toArray();
			foreach($aPatronMenu as $key=>$value)
				$_tiempo_comidas[$value->tiempo_comida_id]['menu'][]	=	($value->porciones + 0) . ' ' . $value->alimento;
		}
		$blade['patron_menu']	=	$_tiempo_comidas;		
		$nutricionista	=	DB::table('nutricionistas')
								->join('personas', 'personas.id', 'nutricionistas.persona_id')
								->where('nutricionistas.persona_id', $paciente->nutricionista_id)
								->get()
								->first();

		$images	=	'https://expediente.nutricion.co.cr/mail/images/';	
		$image	=	$images . 'logo.png';
		if($nutricionista->imagen)
			$image	=	$nutricionista->imagen;

		$to		=	array();
		if(!empty( $paciente->email ))
			$to[]	=	$paciente->email;
		if(!empty( $paciente->responsable_email ))
			$to[]	=	$paciente->responsable_email;

		$paciente->to	=	implode(',', $to);
		$paciente->nutricionista_nombre	=	$nutricionista->nombre;
		$paciente->nutricionista_email	=	$nutricionista->email;
		$paciente->consulta_fecha		=	$consulta->fecha;
		$data	=	array(
							'logo'					=>	$image, 
							'consulta_id'			=>	$consulta->id, 
							'paciente'				=>	$paciente, 
							'paciente_nombre'		=>	$paciente->nombre, 
							'paciente_usuario'		=>	$paciente->usuario, 
							'paciente_contrasena'	=>	$paciente->contrasena, 
						);
		if(isset($blade['va']))
			$data['bva']	=	$blade['va'];
		if(isset($blade['prescripcion']))
			$data['bprescripcion']	=	$blade['prescripcion'];
		if(isset($blade['patron_menu']))
			$data['bpatronmenu']	=	$blade['patron_menu'];
/*Helper::_print($data);*/
		return $data;
	}
	
	function generateResumenConsulta($consulta_id){
		$consulta	=	Consulta::find( $consulta_id );
		if(count($consulta)==0)
			return Response::json(['message' => 'Record not found'], 204);
		
		$data	=	$this->prepareData($consulta);
		$this->sendEmail( $data );

	}
	function lastOfPaciente($paciente_id){
		$registros	=	Consulta::where('paciente_id', $paciente_id)
						->where('consultas.estado', 1)
						->select('consultas.*', DB::raw('UNIX_TIMESTAMP(consultas.fecha) as date_epoch'))
						->orderBy('consultas.fecha', 'DESC')
						->get()
						->first();

		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	public function sendEmail($data, $test=false){
		$paciente	=	$data['paciente'];
		if($test){
			$paciente->email	=	'danilo@deudigital.com';
		}
		/*Helper::_print($paciente);
		Helper::_print($data);		
		die('sending email');*/

		Mail::send('emails.resumen_consulta', $data, function($message) use ($paciente) {
			$bcc	=	explode(',', env('APP_EMAIL_BCC'));			
			$subject=	'Resumen Consulta Nutricional ' . date('d/m/Y', strtotime( $paciente->consulta_fecha )) . ' | ' . $paciente->nombre;
			$args	=	array(
							'before_emoji'	=>	'memo',
						);
			$subject=	Helper::emailParseSubject( $subject, $args );						
			$message->subject( $subject );
			$message->to( $paciente->email, $paciente->nombre );
			$message->cc( $paciente->nutricionista_email );
			$message->from( $paciente->nutricionista_email, $paciente->nutricionista_nombre );
			$message->bcc($bcc);
			$message->replyTo( $paciente->nutricionista_email );
		});
	}
	public function viewEmail($data){
		echo view('emails.resumen_consulta', $data);
	}
	public function testResumen($consulta_id, $mode){
		$consulta	=	Consulta::find( $consulta_id );
		if(count($consulta)==0)
			return Response::json(['message' => 'Record not found'], 204);
		$data	=	$this->prepareData($consulta);
		switch($mode){
			case 'view':
				echo $this->viewEmail( $data );
				break;
			case 'email':
				echo $this->sendEmail( $data, true );
				break;
		}
	}
}
