<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Persona;
use App\Nutricionista;
use DB;
use User;
use Mail;
class ExternalController extends Controller
{
	/**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
		$action	=	'editado';
		if($request->input('id') && $request->id!=0){
			$persona						=	Persona::find($request->id);
			$persona->tipo_idenfificacion_id=	$request->tipo_idenfificacion_id;
			$persona->cedula				=	$request->cedula;
			$persona->nombre				=	$request->nombre;
			$persona->genero				=	$request->genero;
			$persona->ubicacion_id			=	$request->ubicacion_id;
			$persona->detalles_direccion	=	$request->detalles_direccion;
			$persona->save();

			$nutricionista									=	Nutricionista::find($request->id);
			$nutricionista->nombre_comercial				=	$request->nombre_comercial;
			$nutricionista->usuario							=	$request->usuario;
			$nutricionista->contrasena						=	$request->contrasena;
			$nutricionista->carne_cpn						=	$request->carne_cpn;
			$nutricionista->descuento_25_consultas			=	$request->descuento_25_consultas;
			$nutricionista->atv_ingreso_id					=	$request->atv_ingreso_id;
			$nutricionista->atv_ingreso_contrasena			=	$request->atv_ingreso_contrasena;
			$nutricionista->atv_llave_criptografica			=	$request->atv_llave_criptografica;
			$nutricionista->atv_clave_llave_criptografica	=	$request->atv_clave_llave_criptografica;
			$nutricionista->activo							=	$request->activo;
			$nutricionista->save();
		}else{$action	=	'registrado';
			$aPersona	=	array(
								'tipo_idenfificacion_id'=>	$request->input('tipo_idenfificacion_id'),
								'cedula'				=>	$request->input('cedula'),
								'nombre'				=>	$request->input('nombre'),
								'genero'				=>	$request->input('genero'),
								'ubicacion_id'			=>	$request->input('ubicacion_id'),
								'detalles_direccion'	=>	$request->input('detalles_direccion'),
							);

			$persona	=	Persona::create($aPersona);
			if($persona->id){
				$nutricionista	=	Nutricionista::create([
								'persona_id'					=>	$persona->id,
								'nombre_comercial'				=>	$request->input('nombre_comercial'),
								'usuario'						=>	$request->input('usuario'),
								'contrasena'					=>	$request->input('contrasena'),
								'carne_cpn'						=>	$request->input('carne_cpn'),
								'descuento_25_consultas'		=>	$request->input('descuento_25_consultas'),
								'atv_ingreso_id'				=>	$request->input('atv_ingreso_id'),
								'atv_ingreso_contrasena'		=>	$request->input('atv_ingreso_contrasena'),
								'atv_llave_criptografica'		=>	$request->input('atv_llave_criptografica'),
								'atv_clave_llave_criptografica'	=>	$request->input('atv_clave_llave_criptografica'),
								'pe'							=>	$request->input('pe'),
								'activo'						=>	$request->input('activo'),
							]);
				$nutricionista->save();
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
}