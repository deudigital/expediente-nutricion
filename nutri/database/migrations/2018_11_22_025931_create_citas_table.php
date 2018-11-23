<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCitasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('recepcions', function (Blueprint $table) {
            $table->increments('id');
			$table->dateTime('fecha');
			$table->string('clave', 50);
			$table->integer('tipo_documento_id')->unsigned();
			$table->integer('numeracion_consecutiva');
			$table->dateTime('fecha_emision');
			$table->string('moneda', 10);
			$table->string('monto', 15);
			$table->string('emisor', 100);
			$table->string('emisor_email', 100);
			$table->string('emisor_cedula', 50);
			$table->text('xml_url');
			$table->text('json');
			$table->string('respuesta_status', 50);
			$table->string('respuesta_code', 50);
			$table->text('respuesta_data');
			$table->text('respuesta_clave');
			$table->text('respuesta_completa');  
			$table->integer('nutricionista_id')->unsigned();
        });		
        Schema::table('recepcions', function ($table) {            
            $table->foreign('tipo_documento_id')->references('id')->on('documentos');
            $table->foreign('nutricionista_id')->references('persona_id')->on('nutricionistas');
        });
		
        Schema::create('agenda_servicios', function (Blueprint $table) {
            $table->increments('id');
			$table->string('nombre');
			$table->tinyInteger('duracion');
			$table->integer('nutricionista_id')->unsigned();
        });
        Schema::table('agenda_servicios', function ($table) {            
            $table->foreign('nutricionista_id')->references('persona_id')->on('nutricionistas');
        });
		Schema::create('agendas', function (Blueprint $table) {
            $table->increments('id');		
			$table->date('date');
			$table->string('notas', 1000);
			$table->string('telefono', 15)->nullable();
			$table->string('email', 60)->nullable();
			$table->integer('militartime');
			$table->smallInteger('status');
			$table->string('token', 100);
			$table->boolean('confirmado_por_correo')->default(0);
			$table->integer('agenda_servicio_id')->unsigned();
			$table->integer('nutricionista_id')->unsigned();
			$table->integer('persona_id')->unsigned();
        });
        Schema::table('agendas', function ($table) {            
            $table->foreign('agenda_servicio_id')->references('id')->on('agenda_servicios');
            $table->foreign('persona_id')->references('id')->on('personas');
            $table->foreign('nutricionista_id')->references('persona_id')->on('nutricionistas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('citas');
    }
}
