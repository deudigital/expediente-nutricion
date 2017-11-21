<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDatabase extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('hcp_patologias', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
        });
        Schema::create('alergias', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
        });
        Schema::create('hcf_patologias', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
        });
        Schema::create('ejercicios', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
            $table->decimal('mets',5,2);
        });
        Schema::create('servicios', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
        });
        Schema::create('indice_glicemicos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
        });
        Schema::create('categoria_alimentos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
        });
        Schema::create('grupo_alimentos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
        });
        Schema::create('grupo_alimento_nutricionistas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
        });
        Schema::create('tiempo_comidas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre');
        });
        Schema::create('cat_valor_dieteticas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('descripcion');
        });
		Schema::create('personas', function (Blueprint $table) {
            $table->increments('id');
            $table->string('cedula', 15)->nullable();
            $table->string('nombre', 60);
            $table->char('genero', 1);
            $table->date('fecha_nac')->nullable();
            $table->string('telefono', 15)->nullable();
            $table->string('celular', 15)->nullable();
            $table->string('email', 60)->nullable();
            $table->string('provincia', 25)->nullable();
            $table->string('canton', 40)->nullable();
            $table->string('distrito', 40)->nullable();
            $table->string('detalles_direccion', 150)->nullable();
        });
// Foreign keys
		Schema::create('alimentos', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nombre', 100);
            $table->string('medida_porcion', 50)->nullable();
			$table->boolean('gluten')->default(0);
			$table->boolean('fibra')->default(0);
			$table->boolean('sodio')->default(0);
			$table->boolean('antioxidantes')->default(0);
			$table->integer('indice_glicemico_id')->nullable()->unsigned();
			$table->integer('categoria_alimento_id')->unsigned();
        });	
        Schema::table('alimentos', function ($table) {
            $table->foreign('indice_glicemico_id')->references('id')->on('indice_glicemicos');
            $table->foreign('categoria_alimento_id')->references('id')->on('categoria_alimentos');
        });
		Schema::create('alimento_grupos', function (Blueprint $table) {
			$table->integer('alimento_id')->unsigned();
			$table->integer('grupo_alimento_id')->unsigned();
			$table->decimal('porcion', 5,2);
        });
        Schema::table('alimento_grupos', function ($table) {
            $table->foreign('alimento_id')->references('id')->on('alimentos');
            $table->foreign('grupo_alimento_id')->references('id')->on('grupo_alimentos');
        });
        Schema::create('nutricionistas', function (Blueprint $table) {
			$table->integer('persona_id')->unsigned();
            $table->string('usuario', 50);
            $table->string('contrasena', 50);
            $table->boolean('activo')->default(1);
        });
        Schema::table('nutricionistas', function ($table) {            
            $table->foreign('persona_id')->references('id')->on('personas');
        });
        Schema::create('pacientes', function (Blueprint $table) {
			$table->integer('persona_id')->unsigned();
            $table->string('notas_patologias', 1000);
            $table->string('otras_patologias', 1000);
            $table->string('notas_alergias', 1000);
            $table->string('notas_medicamentos', 1000);
            $table->string('notas_otros', 1000);
            $table->integer('nutricionista_id')->unsigned();
			$table->integer('responsable_id')->nullable()->unsigned();
            $table->string('usuario', 50);
            $table->string('contrasena', 50);
        });	
        Schema::table('pacientes', function ($table) {            
            $table->foreign('persona_id')->references('id')->on('personas');
            $table->foreign('nutricionista_id')->references('persona_id')->on('nutricionistas');
            $table->foreign('responsable_id')->references('id')->on('personas');
        });
        Schema::create('objetivos', function (Blueprint $table) {
            $table->increments('id');
            /*$table->string('fecha');*/
			$table->bigInteger('fecha');
			$table->string('descripcion', 1000);
			$table->integer('paciente_id')->unsigned();
        });		
        Schema::table('objetivos', function ($table) {
            $table->foreign('paciente_id')->references('persona_id')->on('pacientes');
        });
        Schema::create('hcp_otros', function (Blueprint $table) {
            $table->increments('id');		
            $table->enum('ciclos_menstruales', array('regular', 'irregular'));
			$table->string('notas', 1000)->nullable();
			$table->integer('paciente_id')->unsigned();
        });		
        Schema::table('hcp_otros', function ($table) {
            $table->foreign('paciente_id')->references('persona_id')->on('pacientes');
        });
        Schema::create('bioquimica_clinicas', function (Blueprint $table) {
            $table->increments('id');
			$table->string('filename');
            /*$table->date('fecha');*/
			$table->bigInteger('fecha');
			$table->integer('paciente_id')->unsigned();
        });		
        Schema::table('bioquimica_clinicas', function ($table) {
            $table->foreign('paciente_id')->references('persona_id')->on('pacientes');
        });
        Schema::create('registro_consumos', function (Blueprint $table) {
            $table->increments('id');
			/*$table->date('fecha');*/
			$table->bigInteger('fecha');
            $table->decimal('harinas', 5,2)->nullable();
            $table->decimal('carnes', 5,2)->nullable();
            $table->decimal('vegetales', 5,2)->nullable();
            $table->decimal('frutas', 5,2)->nullable();
            $table->decimal('lacteos', 5,2)->nullable();
            $table->decimal('grasas', 5,2)->nullable();
            $table->decimal('azucares', 5,2)->nullable();
            $table->decimal('agua', 5,2)->nullable();
            $table->string('ejercicio', 100)->nullable();
			$table->integer('paciente_id')->unsigned();
        });
        Schema::table('registro_consumos', function ($table) {
            $table->foreign('paciente_id')->references('persona_id')->on('pacientes');
        });
        Schema::create('nutricionista_x_servicios', function (Blueprint $table) {	
            $table->integer('nutricionista_id')->unsigned();
            $table->integer('servicio_id')->unsigned();
        });
        Schema::table('nutricionista_x_servicios', function ($table) {            
            $table->foreign('servicio_id')->references('id')->on('servicios');
            $table->foreign('nutricionista_id')->references('persona_id')->on('nutricionistas');
        });
        Schema::create('patologias_pacientes', function (Blueprint $table) {
			$table->integer('paciente_id')->unsigned();
            $table->integer('hcp_patologia_id')->unsigned();
        });		
        Schema::table('patologias_pacientes', function ($table) {
            $table->foreign('paciente_id')->references('persona_id')->on('pacientes');
            $table->foreign('hcp_patologia_id')->references('id')->on('hcp_patologias');
        });
        Schema::create('alergias_pacientes', function (Blueprint $table) {
			$table->integer('paciente_id')->unsigned();
            $table->integer('alergia_id')->unsigned();
        });		
        Schema::table('alergias_pacientes', function ($table) {
            $table->foreign('paciente_id')->references('persona_id')->on('pacientes');
            $table->foreign('alergia_id')->references('id')->on('alergias');
        });	
        Schema::create('hcf_patologias_pacientes', function (Blueprint $table) {
			$table->integer('paciente_id')->unsigned();
            $table->integer('hcf_patologia_id')->unsigned();
			$table->string('notas', 1000);
        });		
        Schema::table('hcf_patologias_pacientes', function ($table) {
            $table->foreign('paciente_id')->references('persona_id')->on('pacientes');
            $table->foreign('hcf_patologia_id')->references('id')->on('hcf_patologias');
        });
        Schema::create('ejercicios_pacientes', function (Blueprint $table) {
			$table->integer('paciente_id')->unsigned();
			$table->integer('ejercicio_id')->unsigned();
            $table->decimal('horas_semanales',5,2)->nullable();
        });		
        Schema::table('ejercicios_pacientes', function ($table) {
            $table->foreign('paciente_id')->references('persona_id')->on('pacientes');
            $table->foreign('ejercicio_id')->references('id')->on('ejercicios');
        });
        Schema::create('valoracion_dietetica_pacientes', function (Blueprint $table) {
            $table->increments('id');	
			$table->integer('cat_valor_dietetica_id')->unsigned();
			$table->integer('paciente_id')->unsigned();
            $table->string('descripcion');
        });		
        Schema::table('valoracion_dietetica_pacientes', function ($table) {
            $table->foreign('cat_valor_dietetica_id')->references('id')->on('cat_valor_dieteticas');
            $table->foreign('paciente_id')->references('persona_id')->on('pacientes');
        });
		Schema::create('habitos_otros', function (Blueprint $table) {
            $table->increments('id');
			$table->string('ocupacion');
			$table->string('ocupacion_horas');
			$table->string('ocupacion_frecuencia');
			$table->string('sueno');
			$table->string('fumado');
			$table->string('fuma_cantidad');
			$table->string('fuma_frecuencia');
			$table->string('alcohol');
			$table->string('alcohol_cantidad');
			$table->string('alcohol_frecuencia');
			$table->string('notas', 1000);
			$table->integer('paciente_id')->unsigned();
        });		
        Schema::table('habitos_otros', function ($table) {
            $table->foreign('paciente_id')->references('persona_id')->on('pacientes');
        });
        Schema::create('habitos_gustos', function (Blueprint $table) {
            $table->increments('id');
			$table->string('comidas_favoritas');
			$table->string('comidas_no_gustan');
			$table->string('lugar_acostumbra_comer');
			$table->string('lugar_caen_mal');
			$table->string('notas', 1000);
			$table->integer('paciente_id')->unsigned();
        });		
        Schema::table('habitos_gustos', function ($table) {
            $table->foreign('paciente_id')->references('persona_id')->on('pacientes');
        });
		/*	CONSULTAS	*/
        Schema::create('consultas', function (Blueprint $table) {
			$table->increments('id');
            /*$table->date('fecha');*/
			$table->bigInteger('fecha');
			$table->string('notas', 1000);
			$table->boolean('estado')->default('0');/*0->encurso, 1->finalizado*/
			$table->integer('paciente_id')->unsigned();
        });
        Schema::table('consultas', function ($table) {
            $table->foreign('paciente_id')->references('persona_id')->on('pacientes');
        });
        Schema::create('valor_antropometricas', function (Blueprint $table) {
            $table->increments('id');
			$table->decimal('estatura', 5,2);
			$table->decimal('circunferencia_muneca', 5,2);
			$table->decimal('peso', 5,2);
			$table->decimal('grasa', 5,2)->nullable();
			$table->decimal('musculo', 5,2)->nullable();
			$table->decimal('agua', 5,2)->nullable();
			$table->decimal('grasa_viceral', 5,2)->nullable();
			$table->decimal('hueso', 5,2)->nullable();
			$table->tinyInteger('edad_metabolica')->nullable();
			$table->decimal('circunferencia_cintura', 5,2)->nullable();
			$table->decimal('circunferencia_cadera', 5,2)->nullable();
			$table->integer('consulta_id')->unsigned();
        });
        Schema::table('valor_antropometricas', function ($table) {
            $table->foreign('consulta_id')->references('id')->on('consultas');
        });	
        Schema::create('detalle_grasas', function (Blueprint $table) {
            $table->increments('id');
			$table->decimal('segmentado_abdominal', 5,2)->nullable();
			$table->decimal('segmentado_brazo_izquierdo', 5,2)->nullable();
			$table->decimal('segmentado_brazo_derecho', 5,2)->nullable();
			$table->decimal('segmentado_pierna_izquierda', 5,2)->nullable();
			$table->decimal('segmentado_pierna_derecha', 5,2)->nullable();
			$table->decimal('pliegue_subescapular', 5,2)->nullable();
			$table->decimal('pliegue_supraliaco', 5,2)->nullable();
			$table->decimal('pliegue_bicipital', 5,2)->nullable();
			$table->decimal('pliegue_tricipital', 5,2)->nullable();
			$table->decimal('pliegue_abdominal', 5,2)->nullable();
			$table->decimal('pliegue_cuadricipital', 5,2)->nullable();
			$table->decimal('pliegue_peroneal', 5,2)->nullable();
			$table->integer('valor_antropometrica_id')->unsigned();
        });
        Schema::table('detalle_grasas', function ($table) {
            $table->foreign('valor_antropometrica_id')->references('id')->on('valor_antropometricas');
        });
        Schema::create('rdds', function (Blueprint $table) {
            $table->increments('id');
            $table->string('metodo_calculo_gc', 20)->nullable();
			$table->string('peso_calculo', 20)->nullable();
			$table->decimal('factor_actividad_sedentaria', 5,2)->nullable();
			$table->integer('promedio_gc_diario')->nullable();
			$table->integer('variacion_calorica')->nullable();
			$table->integer('consulta_id')->unsigned();
        });		
        Schema::table('rdds', function ($table) {
            $table->foreign('consulta_id')->references('id')->on('consultas');
        });
        Schema::create('patron_menus', function (Blueprint $table) {
			$table->integer('grupo_alimento_nutricionista_id')->unsigned();
			$table->integer('tiempo_comida_id')->unsigned();
			$table->integer('consulta_id')->unsigned();
            $table->tinyInteger('porciones')->nullable();
            $table->string('ejemplo', 1000)->nullable();
        });		
        Schema::table('patron_menus', function ($table) {
            $table->foreign('grupo_alimento_nutricionista_id')->references('id')->on('grupo_alimento_nutricionistas');
            $table->foreign('tiempo_comida_id')->references('id')->on('tiempo_comidas');
            $table->foreign('consulta_id')->references('id')->on('consultas');
        });
        Schema::create('prescripcions', function (Blueprint $table) {
            $table->increments('id');			
            $table->decimal('carbohidratos', 5,2);
			$table->decimal('proteinas', 5,2);
			$table->decimal('grasas', 5,2);
			$table->integer('consulta_id')->unsigned();
        });		
        Schema::table('prescripcions', function ($table) {
            $table->foreign('consulta_id')->references('id')->on('consultas');
        });
        Schema::create('otros_alimentos', function (Blueprint $table) {
             $table->increments('id');		
            $table->string('nombre');
            $table->tinyInteger('porciones');
            $table->decimal('carbohidratos', 5,2)->nullable();
			$table->decimal('proteinas', 5,2)->nullable();
			$table->decimal('grasas', 5,2)->nullable();
			$table->decimal('calorias', 5,2)->nullable();
			$table->integer('prescripcion_id')->unsigned();
        });		
        Schema::table('otros_alimentos', function ($table) {
            $table->foreign('prescripcion_id')->references('id')->on('prescripcions');
        });
        Schema::create('detalle_prescripcion', function (Blueprint $table) {
			$table->integer('prescripcion_id')->unsigned();
			$table->integer('grupo_alimento_nutricionista_id')->unsigned();
            $table->tinyInteger('porciones');
        });		
        Schema::table('detalle_prescripcion', function ($table) {
            $table->foreign('prescripcion_id')->references('id')->on('prescripcions');
            $table->foreign('grupo_alimento_nutricionista_id')->references('id')->on('grupo_alimento_nutricionistas');
        });
        Schema::create('detalle_porc_valor_diet', function (Blueprint $table) {
			$table->integer('valoracion_dietetica_paciente_id')->unsigned();
			$table->integer('grupo_alimento_nutricionista_id')->unsigned();
            $table->tinyInteger('porciones');
        });		
        Schema::table('detalle_porc_valor_diet', function ($table) {
            $table->foreign('valoracion_dietetica_paciente_id')->references('id')->on('valoracion_dietetica_pacientes');
            $table->foreign('grupo_alimento_nutricionista_id')->references('id')->on('grupo_alimento_nutricionistas');
        });        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
