<?php
namespace App\Http\Controllers;
use App\Persona;
use App\Paciente;
use App\Nutricionista;
use App\Cliente;
use App\Objetivo;
use App\HcpPatologia;
use App\BioquimicaClinica;
use App\HcpOtro;
use App\HcfPatologiasPaciente;
use App\PatologiasPaciente;
use App\AlergiasPaciente;
use App\HabitosGusto;
use App\HabitosOtro;
use App\EjerciciosPaciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use DB;
use Mail;
use Carbon\Carbon;
class PacienteController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
		$registros	=	Paciente::All();
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
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
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Paciente  $paciente
     * @return \Illuminate\Http\Response
     */
    public function show(Paciente $paciente)
    {
        //
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Paciente  $paciente
     * @return \Illuminate\Http\Response
     */
    public function edit(Paciente $paciente)
    {
        //
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Paciente  $paciente
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Paciente $paciente)
    {
        //
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Paciente  $paciente
     * @return \Illuminate\Http\Response
     */
    public function destroy(Paciente $paciente)
    {
        //
    }
	public function patologiashcp($id){
		$registros = DB::table('hcf_patologias_pacientes')
            ->join('hcf_patologias', 'hcf_patologias.id', '=', 'hcf_patologias_pacientes.hcf_patologia_id')
            ->where('hcf_patologias_pacientes.paciente_id', $id)
            ->get();
		return $registros;
	}
	public function medicamentos(Request $request){
		$paciente	=	Paciente::find($request->input('id'));
		$paciente->notas_medicamentos	=	$request->input('notas_medicamentos');
		$paciente->save();
		$message	=	array(
							'code'		=> '201',
							'message'	=> 'Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
	}
	public function hcpOtros(Request $request){
		if(!$request->input('paciente_id')){
			$response	=	Response::json([
				'code'		=>	422,
				'message'	=>	'Datos de Paciente son requeridos, Intente de nuevo',
				'data'		=>	$request->all()
			], 200);
			return $response;
		}
		$action	=	'editado';
		$persona	=	false;
		if($request->input('id') && $request->id!=0){
			$hcpOtro					=	HcpOtro::find($request->id);
			$hcpOtro->ciclos_menstruales=	$request->ciclos_menstruales;
			$hcpOtro->notas				=	$request->notas;
			$hcpOtro->save();
		}
		else{
			$action	=	'registrado';
			$hcpOtro	=	HcpOtro::create([
									'ciclos_menstruales'=>	$request->input('ciclos_menstruales'),
									'notas'				=>	$request->input('notas'),
									'paciente_id'		=>	$request->input('paciente_id')
								]);
		}		
		$message	=	array(
							'code'		=> '201',
							'data'		=>	$hcpOtro,
							'message'	=> 'Hcp Otros ' . $action . ' correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
	}
	function belongsToNutricionista($id){
		$registros = DB::table('pacientes')
            ->join('personas', 'personas.id', '=', 'pacientes.persona_id')
            ->where('pacientes.nutricionista_id', $id)
            ->get();
		$response	=	Response::json($registros, 200, [], JSON_NUMERIC_CHECK);
		return $response;
	}
	public function testing(){
		$message	=	array(
							'code'		=> '201',
							'message'	=> 'Testing Se ha registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
	}
    public function storeDatosPersonales(Request $request)
    {
		if(!$request->input('nombre') || !$request->input('genero') || !$request->input('fecha_nac')){
			$response	=	Response::json([
				'code'		=>	422,
				'message'	=>	'Datos Personales son requeridos, intente de nuevo',
				'data'		=>	$request->all()
			], 200);
			return $response;
		}
		$action	=	'editado';
		$persona	=	false;
		if($request->input('id') && $request->id!=0){
			$persona	=	Persona::find($request->id);
			$persona->cedula	=	$request->cedula;
			$persona->nombre	=	$request->nombre;
			$persona->genero	=	$request->genero;
			if($request->input('fecha_nac')){
				$fecha	=	explode('/', $request->fecha_nac);
				$fecha_nac	=	$fecha[2].'-'.$fecha[1].'-'.$fecha[0];
				$persona->fecha_nac	=	$fecha_nac;
			}
			$persona->save();
			$paciente	=	Paciente::find($request->id);
			$paciente->responsable_cedula		=	$request->responsable_cedula;
			$paciente->responsable_nombre		=	$request->responsable_nombre;
			$paciente->responsable_parentezco	=	$request->responsable_parentezco;
			$paciente->save();
		}else{$action	=	'registrado';
			$aPersona	=	array(
								'cedula'			=>	$request->input('cedula'),
								'nombre'			=>	$request->input('nombre'),
								'genero'			=>	$request->input('genero'),
							);

			if($request->input('fecha_nac')){
				$fecha	=	explode('/', $request->input('fecha_nac'));
				$fecha_nac	=	$fecha[2].'-'.$fecha[1].'-'.$fecha[0];
				$aPersona['fecha_nac']	=	$fecha_nac;

			}
			$persona	=	Persona::create($aPersona);
			$persona->save();
			if($persona->id){
				$paciente	=	Paciente::create([
								'persona_id'			=>	$persona->id,
								'responsable_cedula'	=>	$request->input('responsable_cedula'),
								'responsable_nombre'	=>	$request->input('responsable_nombre'),
								'responsable_parentezco'=>	$request->input('responsable_parentezco'),
								'nutricionista_id'		=>	$request->input('nutricionista_id'),
							]);
				$paciente->save();
				$cliente	=	Cliente::create([
												'persona_id'			=>	$persona->id,
												'nutricionista_id'		=>	$request->input('nutricionista_id'),
												'tipo_identificacion_id'=>	1
											]);
				$cliente->save();
			}
		}
		$message	=	array(
							'code'		=> '201',
							'id'		=> $persona->id,
							'message'	=> 'Datos Personales ' . $action . ' correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
    public function storeDatosContacto(Request $request)
    {
		$action	=	'editado';
		$persona	=	false;
		if($request->input('id')){
			$persona			=	Persona::find($request->id);
			$persona->telefono	=	$request->telefono;
			$persona->celular	=	$request->celular;
			$persona->email		=	$request->email;
			$persona->provincia	=	$request->provincia;
			$persona->canton	=	$request->canton;
			$persona->distrito	=	$request->distrito;
			$persona->detalles_direccion	=	$request->detalles_direccion;
			$persona->ubicacion_id	=	$request->ubicacion_id;
			$persona->save();
			$paciente	=	Paciente::find($request->id);
			$paciente->responsable_telefono		=	$request->responsable_telefono;
			$paciente->responsable_email		=	$request->responsable_email;
			
			if(!empty($paciente->usuario))
				$paciente->usuario		=	$persona->email;

			$paciente->save();			
		}else{$action	=	'registrado';
			$new	=	array(
							'telefono'			=>	$request->input('telefono'),
							'celular'			=>	$request->input('celular'),
							'email'				=>	$request->input('email'),
							'provincia'			=>	$request->input('provincia'),
							'canton'			=>	$request->input('canton'),
							'distrito'			=>	$request->input('distrito'),
							'detalles_direccion'=>	$request->input('detalles_direccion')
						);
			$new['ubicacion_id']	=	$request->input('ubicacion_id');
			$persona	=	Persona::create($new);
			$persona->save();
			$paciente	=	Paciente::create([
								'responsable_telefono'	=>	$request->input('responsable_cedula'),
								'responsable_email'=>	$request->input('responsable_parentezco'),
							]);
			$paciente->save();
		}
		$message	=	array(
							'code'		=> '201',
							'id'		=> $persona->id,
							'message'	=> 'Datos de Contacto ' . $action . ' correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
	 public function storeDatosObjetivo(Request $request)
    {
		$action	=	'editado';
		if($request->input('id')){
			$objetivo			=	Objetivo::find($request->id);
			$objetivo->descripcion	=	$request->descripcion;
		}else{$action	=	'registrado';
			$objetivo	=	Objetivo::create([
								'fecha'			=>	DB::raw('UNIX_TIMESTAMP()'),//Carbon::now()->timestamp,
								'descripcion'	=>	$request->descripcion,
								'paciente_id'	=>	$request->paciente_id
							]);

		}
		$objetivo->save();
		$objetivo			=	Objetivo::find($objetivo->id);
		$objetivo->fecha	=	gmdate("d/m/Y", $objetivo->fecha);
		$message	=	array(
							'code'		=> '201',
							'data'		=> $objetivo,
							'message'	=> 'Objetivo ' . $action . ' correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
	public function storeDatosEjercicio(Request $request)
    {
		$ejercicio	=	$request->input('ejercicio_id');
		$horas_semanales	=	floatval($request->horas_semanales);
		$ejerciciosPaciente	=	EjerciciosPaciente::create([
											'ejercicio_id'		=>	$ejercicio['id'],
											'horas_semanales'	=>	$horas_semanales,
											'paciente_id'		=>	$request->paciente_id
										]);
		$ejerciciosPaciente->save();
		$ejerciciosPaciente->nombre	=	$ejercicio['nombre'];
		$message	=	array(
							'code'		=> '201',
							'data'		=> $ejerciciosPaciente,
							'message'	=> 'Ejercicio registrado correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
	public function storeDatosGustos(Request $request){
		$action	=	'editado';
		if($request->input('id')){
			$gusto			=	HabitosGusto::find($request->id);
			$gusto->comidas_favoritas		=	$request->comidas_favoritas;
			$gusto->comidas_no_gustan		=	$request->comidas_no_gustan;
			$gusto->lugar_acostumbra_comer	=	$request->lugar_acostumbra_comer;
			$gusto->lugar_caen_mal			=	$request->lugar_caen_mal;
			$gusto->notas					=	$request->notas;
			$gusto->paciente_id				=	$request->paciente_id;
		}else{$action	=	'registrado';
			$gusto	=	HabitosGusto::create([
								'comidas_favoritas'		=>	$request->comidas_favoritas,
								'comidas_no_gustan'		=>	$request->comidas_no_gustan,
								'lugar_acostumbra_comer'=>	$request->lugar_acostumbra_comer,
								'lugar_caen_mal'		=>	$request->lugar_caen_mal,
								'notas'					=>	$request->notas,
								'paciente_id'			=>	$request->paciente_id
							]);
		}
		$gusto->save();
		$message	=	array(
							'code'		=> '201',
							'data'		=> $gusto,
							'message'	=> 'Gusto ' . $action . ' correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
	public function storeDatosOtros(Request $request){
		$action	=	'editado';
		if($request->input('id')){
			$habitosOtro						=	HabitosOtro::find($request->id);
			$habitosOtro->alcohol				=	empty($request->alcohol)? '0':'1';
			$habitosOtro->alcohol_cantidad		=	$request->alcohol_cantidad;
			$habitosOtro->alcohol_frecuencia	=	$request->alcohol_frecuencia;
			$habitosOtro->fumado				=	empty($request->fumado)? '0':'1';
			$habitosOtro->fuma_cantidad			=	$request->fuma_cantidad;
			$habitosOtro->fuma_frecuencia		=	$request->fuma_frecuencia;
			$habitosOtro->ocupacion				=	$request->ocupacion;
			$habitosOtro->ocupacion_frecuencia	=	$request->ocupacion_frecuencia;
			$habitosOtro->ocupacion_horas		=	$request->ocupacion_horas;
			$habitosOtro->notas					=	$request->notas;
			$habitosOtro->sueno					=	$request->sueno;
		}else{$action	=	'registrado';
			$habitosOtro	=	HabitosOtro::create([
								'alcohol'				=>	empty($request->alcohol)? '0':'1',
								'alcohol_cantidad'		=>	$request->alcohol_cantidad,
								'alcohol_frecuencia'	=>	$request->alcohol_frecuencia,
								'fumado'				=>	empty($request->fumado)? '0':'1',
								'fuma_cantidad'			=>	$request->fuma_cantidad,
								'fuma_frecuencia'		=>	$request->fuma_frecuencia,
								'ocupacion'				=>	$request->ocupacion,
								'ocupacion_frecuencia'	=>	$request->ocupacion_frecuencia,
								'ocupacion_horas'		=>	$request->ocupacion_horas,
								'sueno'					=>	$request->sueno,
								'notas'					=>	$request->notas,
								'paciente_id'			=>	$request->paciente_id,
							]);
		}
		$habitosOtro->save();
		$message	=	array(
							'code'		=> '201',
							'data'		=> $habitosOtro,
							'message'	=> 'Habito:Otro ' . $action . ' correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
	public function storeDatosHcfPatologia(Request $request){
		$deletedRows = HcfPatologiasPaciente::where('paciente_id', $request->paciente_id)->delete();
		$array= Array();
		foreach($request->items as $item){
			if(!isset($item['checked']) || !$item['checked'])
				continue ;
			$notas	=	NULL;
			if(isset($item['notas']))
				$notas	=	$item['notas'];
			$hcfPatologiasPaciente	=	new HcfPatologiasPaciente(
					array(
						'notas'				=>	$notas,
						'hcf_patologia_id'	=>	$item['id'],
						'paciente_id'		=>	$request->paciente_id,
					)
				);
			$hcfPatologiasPaciente->save();
		}
		$message	=	array(
							'code'		=> '201',
							'data'		=> $array,
							'message'	=> 'hcf:patologias registrados correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
	public function storeDatosHcpPatologia(Request $request){
		if($request->notas){
			$paciente	=	Paciente::find($request->input('paciente_id'));
			$paciente->notas_patologias	=	$request->notas[0];
			$paciente->save();
		}
		if(!$request->items){
			$message	=	array(
								'code'		=> '200',
								'message'	=> 'hcp:patologias Notas editado correctamente'
							);
			$response	=	Response::json($message, 201);
			return $response;
		}

		$deletedRows = PatologiasPaciente::where('paciente_id', $request->paciente_id)->delete();
		$array= Array();
		foreach($request->items as $item){
			if(!isset($item['checked']) || !$item['checked'])
				continue ;
			$patologiasPaciente	=	new PatologiasPaciente(
					array(
						'hcp_patologia_id'	=>	$item['id'],
						'paciente_id'		=>	$request->paciente_id,
					)
				);
			$patologiasPaciente->save();
		}

		$message	=	array(
							'code'		=> '201',
							'message'	=> 'hcp:patologias registrados correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
	public function hcpBioquimicas(Request $request){
		/*$response	=	Response::json($request, 201);
		return $response;*/
		if(!$request->input('paciente_id')){
			$response	=	Response::json([
				'code'		=>	422,
				'message'	=>	'Datos de Paciente son requeridos, intente de nuevo',
				'data'		=>	$request->all()
			], 200);
			return $response;
		}
		
		$file			=	$request->file('examen');
		$filename_epoc	=	Carbon::now()->timestamp;		
		$destination	=	public_path('/bioquimicas');
		$filename	=	'examen_' . $filename_epoc . '_' . $request->paciente_id . '.' . $file->getClientOriginalExtension();
		$new_filename	=	url('/bioquimicas/') . '/' .  $filename;
		$file->move($destination, $new_filename);	
		$bioquimicaClinica	=	BioquimicaClinica::create([
								'filename'		=>	$new_filename,
								'fecha'			=>	DB::raw('now()'),
								'paciente_id'	=>	$request->paciente_id,
							]);
		$bioquimicaClinica	=	BioquimicaClinica::find($bioquimicaClinica->id);	
		$fecha	=	explode('-', $bioquimicaClinica->fecha);
		$fecha	=	$fecha[2].'/'.$fecha[1].'/'.$fecha[0];
		$bioquimicaClinica->fecha	=	$fecha;
		$bioquimicaClinica->file	=	$filename;
		$response	=	array(
							'data'	=>	$bioquimicaClinica
						);
		$response	=	Response::json($response, 201);
		return $response;
	}
	public function storeDatosHcpAlergia(Request $request){
		if($request->notas){
			$paciente	=	Paciente::find($request->input('paciente_id'));
			$paciente->notas_alergias	=	$request->notas[0];
			$paciente->save();
		}
		if(!$request->items){
			$message	=	array(
								'code'		=> '200',
								'message'	=> 'Notas de Alergia se ha editado correctamente'
							);
			$response	=	Response::json($message, 201);
			return $response;
		}

		$deletedRows = AlergiasPaciente::where('paciente_id', $request->paciente_id)->delete();
		$array= Array();
		foreach($request->items as $item){
			if(!isset($item['checked']) || !$item['checked'])
				continue ;
			$alergiasPaciente	=	new AlergiasPaciente(
					array(
						'alergia_id'	=>	$item['id'],
						'paciente_id'		=>	$request->paciente_id,
					)
				);
			$alergiasPaciente->save();
		}

		$message	=	array(
							'code'		=> '201',
							'data'		=> $array,
							'message'	=> 'Alergias registrados correctamente'
						);
		$response	=	Response::json($message, 201);
		return $response;
    }
	public function updateContrasena(Request $request){
		$message	=	array(
								'code'		=> '204',
								'message'	=> 'Datos enviados no son validos o no estan registrado.'
							);
		$current_password	=	$request->offsetGet('actual');
		$new_password		=	$request->offsetGet('nuevo');
		$paciente_id		=	$request->offsetGet('paciente_id');
		if(empty($current_password) || empty($new_password) || empty($paciente_id))
			return Response::json($message, 200);

		$paciente = DB::table('pacientes')
            ->join('personas', 'personas.id', '=', 'pacientes.persona_id')
            ->where('pacientes.persona_id', '=', $paciente_id)
            ->where('pacientes.contrasena', '=', $current_password)
            ->select('personas.id', 'personas.email', 'personas.nombre', 'pacientes.usuario', 'pacientes.contrasena')
			->get()
			->first();

		if($paciente){
			$to			=	$paciente->email;
			$nombre		=	$paciente->nombre;
			$_paciente	=	Paciente::find($paciente->id);
			$_paciente->contrasena	=	$new_password;
			$_paciente->save();
			$nutricionista	=	Nutricionista::find($_paciente->nutricionista_id);
			$data	=	array(
							'nombre'	=>	$paciente->nombre, 
							'usuario'	=>	$paciente->usuario, 
							'contrasena'=>	$paciente->contrasena,
							'logo'		=>	$nutricionista->imagen
						);
			Mail::send('emails.contrasena_cambiada', $data, function($message) use ($paciente) {
				$bcc	=	explode(',', env('APP_EMAIL_BCC'));
				$message->to($paciente->email, $paciente->nombre);
				$subject	=	$paciente->nombre . utf8_encode(', tu contraseña ha sido cambiada');
				$subject	=	htmlentities($subject);
				$subject	=	str_replace('&ntilde;','=C3=B1',$subject);
				$message->subject( '=?utf-8?Q?=F0=9F=94=91 ' . $subject . '?=');
				$message->from(env('APP_EMAIL_FROM'), env('APP_EMAIL_FROM_NAME'));
				$message->bcc($bcc);
				/*$message->replyTo(env('EMAIL_REPLYTO'));*/
			});
			$message	=	array(
								'code'		=> '201',
								'message'	=> 'Su Contrasena ha sido actualizada correctamente, Se ha enviado un correo electronico con sus datos.'
							);
		}
		$response	=	Response::json($message, 200);
		return $response;
    }

}