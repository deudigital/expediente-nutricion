<?php

namespace App\Http\Controllers;
use Exception;

use App\Consulta;
use App\Paciente;
use App\Persona;
use App\ValoracionAntropometrica;
use App\Rdd;
use App\Prescripcion;
use App\DetalleDescripcion;
use App\OtrosAlimento;
use App\PatronMenu;
use App\PatronMenuEjemplo;
use App\DetalleMusculo;
use App\DetalleGrasa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use DB;
use Carbon\Carbon;
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
		/*$response	=	Response::json($consultas, 200);*/
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
		/*		*/
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
		/*$response	=	Response::json($id, 200, []);
		return $response;*/
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
	public function destroy__old($id)
    {
		DB::beginTransaction();
		try {
			$consulta_id	=	$id;
			$valoracionAntropometrica	=	ValoracionAntropometrica::where('consulta_id', $consulta_id);
			if(count($valoracionAntropometrica)>0){
				DetalleMusculo::where('valoracion_antropometrica_id', $valoracionAntropometrica->id)->delete();
				DetalleGrasa::where('valoracion_antropometrica_id', $valoracionAntropometrica->id)->delete();
				ValoracionAntropometrica::where('consulta_id', $consulta_id)->delete();
			}
			$rdd	=	Rdd::where('consulta_id', $consulta_id);
			if(count($rdd)>0)
				Rdd::where('consulta_id', $consulta_id)->delete();
				
			$prescripcion		=	Prescripcion::where('consulta_id', $consulta_id);
			if(count($prescripcion)>0){
				DetalleDescripcion::where('prescripcion_id', $prescripcion->id)->delete();
				OtrosAlimento::where('prescripcion_id', $prescripcion->id)->delete();
				Prescripcion::where('consulta_id', $consulta_id)->delete();
			}
			$patronMenu			=	PatronMenu::where('consulta_id', $consulta_id);
			if(count($patronMenu)>0)
				PatronMenu::where('consulta_id', $consulta_id)->delete();

			$patronMenuEjemplo	=	PatronMenuEjemplo::where('consulta_id', $consulta_id);
			if(count($patronMenuEjemplo)>0)
				PatronMenuEjemplo::where('consulta_id', $consulta_id)->delete();

			DB::commit();
			// all good
		} catch (\Exception $e) {
			DB::rollback();
			// something went wrong
		}
    }
	
	
    public function process()
    {
        $consultas	=	Consulta::all();
		if(!$consultas){
			return Response::json('Sin Datos', 204);
		}
		
		/*$response	=	Response::json($consultas, 200);*/
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
						->get();
		
		/*$paciente	=	Paciente::find($request->input('paciente_id'));*/
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
            ->select('consultas.id', 'consultas.fecha', 'consultas.notas', 'personas.id as persona_id', 'personas.nombre as paciente_nombre', 'personas.telefono', 'pacientes.nutricionista_id as nutricionista')
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
		$paciente = DB::table('pacientes')
            ->join('personas', 'personas.id', '=', 'pacientes.persona_id')
            ->where('pacientes.persona_id', $consulta->paciente_id)
			->get()
			->first();
/*
		$paciente	=	Paciente::where('persona_id', $consulta->paciente_id)
										->get();
*/
		if(count($paciente)>0){
			$paciente->edad		=	0;
			if($paciente->fecha_nac){
				$fecha_nac = explode('-', $paciente->fecha_nac);
				$edad	=	Carbon::createFromDate($fecha_nac[0], $fecha_nac[1], $fecha_nac[2])->age;          // int(41) calculated vs now in the same tz
				$paciente->fecha_nac=	$fecha_nac[2].'/'.$fecha_nac[1].'/'.$fecha_nac[0];
				$paciente->edad		=	$edad;	
			}
			
			
			/*$response	=	Response::json($paciente, 200, [], JSON_NUMERIC_CHECK);
		return $response;*/

				
			
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
				->get();

		if(count($alergias)>0)
			$registros['paciente']['hcp']['bioquimicas']	=	$bioquimicas->toArray();
		
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
	
		
		
		
		
		
		
		$valoracionAntropometrica	=	ValoracionAntropometrica::where('consulta_id', $id)
										->get()
										->first();
		if(count($valoracionAntropometrica)>0){
			$registros['va']	=	$valoracionAntropometrica->toArray();
			//$registros['va']	=	(array)$valoracionAntropometrica;
			$detalleMusculo	=	DetalleMusculo::where('valoracion_antropometrica_id', $valoracionAntropometrica->id)
											->get()
											->first();
			if(count($detalleMusculo)>0){
				$registros['va']['detalleMusculo']	=	$detalleMusculo->toArray();
				//$registros['va']	=	(array)$valoracionAntropometrica;
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
		
		/*$registros['dieta']['prescripcion']	=	array();
		$registros['dieta']['prescripcion']['items']	=	array();*/
		
		if(count($prescripcion)>0){
			$registros['dieta']['prescripcion']	=	$prescripcion->toArray();
			/*$detalleDescripcion	=	DetalleDescripcion::where('prescripcion_id', $prescripcion->id)
											->get();*/
			/*$detalleDescripcion	=	DB::table('grupo_alimento_nutricionistas')
										->leftJoin('detalle_prescripcion', 'grupo_alimento_nutricionistas.id', '=', 'detalle_prescripcion.grupo_alimento_nutricionista_id')
										->orderBy('grupo_alimento_nutricionistas.id', 'ASC')
										->get();*/
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
		/*$response	=	Response::json($request->all(), 200, [], JSON_NUMERIC_CHECK);
		return $response;*/
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

	function storeNotas(Request $request){
		if(!$request->input('id'))
			return Response::json(['message' => 'Record not found'], 204);
		
		
		$consulta	=	Consulta::find($request->input('id'));
		if($consulta){
			$notas	=	$request->notas;
			if($notas)
				$consulta->notas	=	$request->notas[0];

			if($request->input('finalizar')){
				$consulta->estado	=	1;
				$persona		=	Persona::find($consulta->paciente_id);
				//if(is_null($persona->email) || !$persona->email)
				if($persona->email)
					$this->generatePacienteCredentials($persona);			
			}
			$consulta->save();
			
		}
		$response	=	Response::json($consulta, 201, [], JSON_NUMERIC_CHECK);
		return $response;
		
	}
	function generatePacienteCredentials($persona){
		$paciente		=	Paciente::find($persona->id);		
		if($paciente->usuario)
			return ;

		$paciente->usuario		=	$persona->email;
		$paciente->contrasena	=	rand ( 1234 , 9999 );
		$paciente->save();
		
		$images	=	'https://expediente.nutricion.co.cr/mail/images/';
		
		$html	=	'<div style="text-align:center;margin-bottom:20px">';
		$html	.=	'<img src="' . $images . 'logo.png" width="180" />';
		$html	.=	'</div>';
		$html	.=	'<p>' . $persona->nombre . ', puedes descargar el app de <strong>NutriTrack</strong> completamente <strong>GRATIS</strong>, en las tiendas de iPhone y Android.  Tus credenciales para usarla son:</p>';
		$html	.=	'<p>Usuario: ' . $paciente->usuario . '</p>';
		$html	.=	'<p>Contraseña: ' . $paciente->contrasena . '</p>';
		
		$html	.=	'<div style="text-align:center;margin-bottom:20px;margin-top:20px;display:inline-block;width:100%">';
		$html	.=	'	<div style="@media(min-width:768px){width:45%;float:left;padding-right:5%;text-align:right;}">';
		$html	.=	'		<img src="' . $images . 'appstore.png" width="180" />';
		$html	.=	'	</div>';
		$html	.=	'	<div style="@media(min-width:768px){width:45%;float:left;padding-left:5%;text-align:left;}">';
		$html	.=	'		<img src="' . $images . 'googleplay.png" width="180" />';
		$html	.=	'	</div>';
		$html	.=	'</div>';
		
		$html	.=	'<p>En esta app vas a poder:</p>';
		
		$html	.=	'<ul>';
		$html	.=	'<li>Llevar el control de lo que comes día a día.</li>';
		$html	.=	'<li>Ver el historial de tus medidas.</li>';
		$html	.=	'<li>Ver listados de comidas y sus equivalencias en porciones.</li>';
		$html	.=	'<li>Ver los ejemplos y porciones que te indico el nutricionista en tu consulta.</li>';
		$html	.=	'<li>Motivarte todos los días para cumplir tus metas.</li>';
		$html	.=	'<li>Habilitar recordatorios para los diferentes tiempos de comida.</li>';
		$html	.=	'</ul>';

		$to			=	$persona->email;
		$subject 	=	'Credenciales NutriTrack';
		$headers 	=	'From: info@nutricion.co.cr' . "\r\n";
		$headers   .=	'CC: danilo@deudigital.com' . "\r\n";
		$headers   .=	'Bcc: jaime@deudigital.com, inv_jaime@yahoo.com' . "\r\n";
		$headers   .=	'MIME-Version: 1.0' . "\r\n";
		$headers   .=	'Content-Type: text/html; charset=ISO-8859-1' . "\r\n";

		mail($to, $subject, utf8_decode($html), $headers);
/*
Al finalizar la primera consulta, 
se deben crear las credenciales para el acceso al app 
para el usuario, las credenciales a crear son:

Usuario: [correo electrónico]
Password: [crear numero aleatorio de 4 dígitos]

Una vez creados y almacenados los credenciales en la base de datos, 
se debe enviar la informacion de los mismos al correo del usuario.

Subject: Credenciales NutriTrack
Body: [documento adjunto] (ver zip para imagenes de descarga en tiendas 
de app y play)

Importante: Esto únicamente es necesario al finalizar la primera consulta de un paciente, no es necesario en consultas recurrentes

*/
	}
	function generateResumenConsulta($id){
		$consulta	=	Consulta::find($id);
		if(count($consulta)==0)
			return Response::json(['message' => 'Record not found'], 204);
		
		$registros	=	$consulta->toArray();
		$paciente = DB::table('pacientes')
            ->join('personas', 'personas.id', '=', 'pacientes.persona_id')
            ->where('pacientes.persona_id', $consulta->paciente_id)
			->get()
			->first();

		if(count($paciente)>0){			
			$registros['paciente']	=	(array)$paciente;
		}		
		$_resumen['va']	=	'';
		$valoracionAntropometrica	=	ValoracionAntropometrica::where('consulta_id', $id)
										->get()
										->first();
		//echo '<pre>' . print_r($valoracionAntropometrica, true) . '</pre>';
		if(count($valoracionAntropometrica)>0){
			$aValoracionAntropometrica	=	$valoracionAntropometrica->toArray();
			$html	=	'<table>';
			foreach($aValoracionAntropometrica as $key=>$value){
				if(in_array($key,['id','consulta_id']) || floatval($value)==0)
					continue;
				$html	.=	'<tr><th>' . $key . ':</th><td>' . $value . '</td></tr>';
			}
			$html	.=	'</table>';
		}
		$_resumen['va']	=	$html;		
		$prescripcion	=	Prescripcion::where('consulta_id', $id)
										->get()
										->first();

		if(count($prescripcion)>0){
			$aPrescripcion	=	$prescripcion->toArray();
			$detalleDescripcion	=	DB::table('detalle_prescripcion')
										->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'detalle_prescripcion.grupo_alimento_nutricionista_id')
										->where('detalle_prescripcion.prescripcion_id',$prescripcion->id)
										->orderBy('grupo_alimento_nutricionistas.id', 'ASC')
										->get();
			if(count($detalleDescripcion)>0){
				$aPrescripcionItems	=	$detalleDescripcion->toArray();
				$array	=	array();
				foreach($aPrescripcionItems as $key=>$value){
					if(in_array($value->grupo_alimento_nutricionista_id,[1,2,3])){
						if(isset($array['Lacteos']))
							$array['Lacteos']	=	$array['Lacteos'] + $value->porciones;
						else
							$array['Lacteos']	=	$value->porciones;
					}						
					else{
						if(in_array($value->grupo_alimento_nutricionista_id,[7,8,9])){
							if(isset($array['Carnes']))
								$array['Carnes']	=	$array['Carnes'] + $value->porciones;
							else
								$array['Carnes']	=	$value->porciones;
						}							
						else
							$array[$value->nombre]	=	$value->porciones;
					}
				}
				$html	=	'<ul>';
				foreach($array as $nombre=>$valor)
					$html	.=	'<li>[' . $valor . '] ' . $nombre . '</li>';

				$html	.=	'</ul>';
			}
			/*$otrosAlimento	=	OtrosAlimento::where('prescripcion_id', $prescripcion->id)
											->get();
			if(count($otrosAlimento)>0){
				$registros['dieta']['prescripcion']['otros']	=	$otrosAlimento->toArray();
			}*/			
			$_resumen['porciones']	=	$html;
		}		
		
		/*$patronMenu	=	PatronMenu::where('consulta_id', $id)
										->get();*/
		/*$patronMenuEjemplo	=	DB::table('patron_menus')
										->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'patron_menus.grupo_alimento_nutricionista_id')
										->join('tiempo_comidas', 'tiempo_comidas.id', '=', 'patron_menus.tiempo_comida_id')
										->where('patron_menus.consulta_id',$id)
										->select('patron_menus.*', 'grupo_alimento_nutricionistas.nombre as alimento' )
										->orderBy('patron_menus.tiempo_comida_id', 'ASC')
										->get();*/
		$patronMenuEjemplo	=	PatronMenuEjemplo::where('consulta_id', $id)
									->get();
		
		$aEjemplo	=	array();
		if(count($patronMenuEjemplo)>0){
			$aPatronMenuEjemplo	=	$patronMenuEjemplo->toArray();
			foreach($aPatronMenuEjemplo as $key=>$value)
				$aEjemplo[$value['tiempo_comida_id']]	=	$value['ejemplo'];
		}
		/*echo '<pre>' . print_r($aEjemplo, true) . '</pre>';
		exit;*/
		$patronMenu	=	DB::table('patron_menus')
							->join('grupo_alimento_nutricionistas', 'grupo_alimento_nutricionistas.id', '=', 'patron_menus.grupo_alimento_nutricionista_id')
							->join('tiempo_comidas', 'tiempo_comidas.id', '=', 'patron_menus.tiempo_comida_id')
							->where('patron_menus.consulta_id',$id)
							->select('patron_menus.*', 'grupo_alimento_nutricionistas.nombre as alimento' )
							->orderBy('patron_menus.tiempo_comida_id', 'ASC')
							->get();
		if(count($patronMenu)>0){
			$aPatronMenu	=	$patronMenu->toArray();
			$html	=	'';
			$array	=	array();
			foreach($aPatronMenu as $key=>$value){
				switch($value->tiempo_comida_id){
					case 1:
						$array['Desayuno']['menu'][]	=	$value->porciones . ' ' . $value->alimento;
						if(isset($aEjemplo[1]))
							$array['Desayuno']['ejemplo']	=	$aEjemplo[1];
						
						break;
					case 2:
						$array['Media Mañana']['menu'][]	=	$value->porciones . ' ' . $value->alimento;
						if(isset($aEjemplo[2]))
							$array['Media Mañana']['ejemplo']	=	$aEjemplo[2];
						break;
					case 3:
						$array['Almuerzo']['menu'][]	=	$value->porciones . ' ' . $value->alimento;
						if(isset($aEjemplo[3]))
							$array['Almuerzo']['ejemplo']	=	$aEjemplo[3];
						break;
					case 4:
						$array['Media Tarde']['menu'][]	=	$value->porciones . ' ' . $value->alimento;
						if(isset($aEjemplo[4]))
							$array['Media Tarde']['ejemplo']	=	$aEjemplo[4];
						break;
					case 5:
						$array['Cena']['menu'][]	=	$value->porciones . ' ' . $value->alimento;
						if(isset($aEjemplo[5]))
							$array['Cena']['ejemplo']	=	$aEjemplo[5];
						break;
					case 6:
						$array['Antes de Dormir']['menu'][]	=	$value->porciones . ' ' . $value->alimento;
						if(isset($aEjemplo[6]))
							$array['Antes de Dormir']['ejemplo']	=	$aEjemplo[6];
						break;
				}
				
			}/**/
				//echo '<pre>' . print_r($array, true) . '</pre>';
				//exit;
			//$_resumen['porciones']	=	$html;
			$html='';
			foreach($array as $key=>$value){
				$html	.=	'<h4>' . $key . '</h4>'; 
				$html	.=	'<p>' . implode(', ', $value['menu']) . '</p>';

				if(isset($value['ejemplo']))
					$html	.=	'<p><strong>Ejemplo:</strong> ' . $value['ejemplo'] . '</p>';
			}
			$_resumen['patronMenu']	=	$html;
			//echo '<pre>' . print_r($array, true) . '</pre>';
		}
		//exit;

		$images	=	'https://expediente.nutricion.co.cr/mail/images/';
		
		$html	=	'<div style="text-align:center;margin-bottom:20px">';
		$html	.=	'<img src="' . $images . 'logo.png" width="180" />';
		$html	.=	'</div>';
		
		$html	.=	'<p>' . $paciente->nombre . ', a continuación, un resumen de las medidas en esta consulta:</p>';
		$html	.=	$_resumen['va'];

		$html	.=	'<p>Asimismo, acá tienes el total de porciones que debes comer día a día según lo indicado por la nutricionista:</p>';
		$html	.=	$_resumen['porciones'];

		$html	.=	'<p>Además, acá tienes el detalle de como dividir estas porciones en los diferentes tiempos de comida con sus respectivos ejemplos:</p>';

		$html	.=	$_resumen['patronMenu'];

		$html	.=	'<p>Finalmente, toda esta información y otras herramientas para llevar el registro de lo que comes día a día y ayudarte a cumplir tus objetivos, están disponibles en el app de NutriTrack, si aún no la tienes descárgala GRATIS en las tiendas de iPhone y Android</p>';	
		
		$html	.=	'<div style="text-align:center;margin-bottom:20px;margin-top:20px;display:inline-block;width:100%">';
		$html	.=	'	<div style="@media(min-width:768px){width:45%;float:left;padding-right:5%;text-align:right;}">';
		$html	.=	'		<img src="' . $images . 'appstore.png" width="180" />';
		$html	.=	'	</div>';
		$html	.=	'	<div style="@media(min-width:768px){width:45%;float:left;padding-left:5%;text-align:left;}">';
		$html	.=	'		<img src="' . $images . 'googleplay.png" width="180" />';
		$html	.=	'	</div>';
		$html	.=	'</div>';
		
		$html	.=	'<p>Te recordamos tus credenciales:</p>';
		$html	.=	'<p>Usuario: ' . $paciente->usuario . '</p>';
		$html	.=	'<p>Contraseña: ' . $paciente->contrasena . '</p>';
		echo $html;
/*
		$to			=	$paciente->email;
		$subject 	=	'Credenciales NutriTrack';
		$headers 	=	'From: info@nutricion.co.cr' . "\r\n";
		$headers   .=	'CC: danilo@deudigital.com' . "\r\n";
		$headers   .=	'Bcc: jaime@deudigital.com, inv_jaime@yahoo.com' . "\r\n";
		$headers   .=	'MIME-Version: 1.0' . "\r\n";
		$headers   .=	'Content-Type: text/html; charset=ISO-8859-1' . "\r\n";

		mail($to, $subject, utf8_decode($html), $headers);
*/
		
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	
}
