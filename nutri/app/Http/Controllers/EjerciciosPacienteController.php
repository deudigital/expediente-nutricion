<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\EjerciciosPaciente;

class EjerciciosPacienteController extends Controller
{
    public function destroy(Request $request)
    {
		$deletedRows	=	EjerciciosPaciente::where([
														['paciente_id', '=',$request->paciente_id],
														['ejercicio_id', '=',$request->ejercicio_id],
													])
												->delete();
		$message	=	array(
							'code'		=> '201',
							'message'	=> 'Se ha eliminado correctamente'
						);
        $response	=	Response::json($message, 201);
		return $response;
    }
}
