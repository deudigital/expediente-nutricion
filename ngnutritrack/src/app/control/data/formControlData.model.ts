export class FormControlData {
	aaa:string='class FormControlData';
	dataFilled:boolean=false;
	paciente_id:number=0;
	current_dieta_id:number=0;
	nutricionista_id:number=0;
	canAccessAgenda:boolean=false;
	canAccessFacturacion:boolean=false;

	message_login:string			=	'';
	dieta_desayuno_ejemplo:string			=	'';
	dieta_media_manana_ejemplo:string		=	'';
	dieta_almuerzo_ejemplo:string			=	'';
	dieta_media_tarde_ejemplo:string		=	'';	
	dieta_cena_ejemplo:string				=	'';
	dieta_coicion_nocturna_ejemplo:string	=	'';
	lastEstatura:string='';
	lastCircunferencia_muneca:string='';

	imc: number 				=	0;
	pesoIdeal: number = 0;
	estaturaIdeal: number = 0;
	pesoIdealAjustado: number = 0;	
	diferenciaPeso: number = 0;	
	adecuacion: number = 0;	
	relacionCinturaCadera: number = 0;
	gradoSobrepeso: number = 0;
	pesoMetaMaximo: number = 0;
	pesoMetaMinimo: number = 0;
	porcentajePeso: number = 0;

	helpers						=	new Helpers();
	manejadorDatos				=	new ManejadorDatos();
	paciente:Paciente			=	new Paciente();
	consulta:Consulta			=	new Consulta();
	gustos						=	new HabitosGusto();
	habitosOtro					=	new HabitosOtro();
	valoracionAntropometrica	= 	new ValoracionAntropometrica();
	
	detalleGrasa				= 	new DetalleGrasa();
	detalleMusculo				= 	new DetalleMusculo();	
	
	dietas:any[]				=	[];/*new Dieta();*/
	prescripcion:Prescripcion	=	new Prescripcion();
	rdd:Rdd						=	new Rdd();

	consulta_s_f:Consulta_s_f   =   new Consulta_s_f();
	producto:Producto           =   new Producto();
	reporte:Reporte 			=	new Reporte();
	tipo:Tipo                   =	new Tipo();
	tipo_id:Tipo_ID             = 	new Tipo_ID();
	medida:Medida 				= 	new Medida();
	medio:Medio                 =	new Medio();
	hcpOtros: HcpOtros          =   new HcpOtros();

	bioquimicas:any[]			=	[];
	patologias:any[]			=	[];
	alergias:any[]				=	[];
	hcf_patologias:any[]		=	[];
	objetivos:any[]				=	[];
	ejercicios:any[]			=	[];
	valoracionDietetica:any[]	=	[];
	valoracionDieteticaEjemplo:any[]	=	[];

	patronmenu:any[]			=	[];
	patron_menu_ejemplos:any[]	=	[];
	tiempoComidas:any[]			=	[];

    clear() {
		if(this.manejadorDatos.operacion!='nueva-consulta'){
			this.paciente			=	new Paciente();
			this.paciente.nutricionista_id	=	this.nutricionista_id;
			/*	HCP	*/
			this.patologias			=	[];
			this.alergias			=	[];
			this.bioquimicas		=	[];
			this.hcpOtros			= new HcpOtros();
			/*	HCF	*/
			this.hcf_patologias		=	[];
			/*	OBJETIVOS	*/
			this.objetivos			=	[];
			/*	HABITOS	*/
			this.ejercicios			=	[];
			this.valoracionDietetica=	[];
			this.valoracionDieteticaEjemplo=	[];
			this.gustos				=	new HabitosGusto();
			this.habitosOtro		=	new HabitosOtro();			
		}
		this.consulta					=	new Consulta();			
		this.dietas						=	[];/*new Dieta();*/
		this.prescripcion				=	new Prescripcion();
		this.valoracionAntropometrica	= 	new ValoracionAntropometrica();
		this.detalleGrasa				= 	new DetalleGrasa();
		this.detalleMusculo				= 	new DetalleMusculo();
		this.rdd						=	new Rdd();
		this.patronmenu					=	[];
		this.patron_menu_ejemplos		=	[];
		this.dieta_desayuno_ejemplo			=	'';
		this.dieta_media_manana_ejemplo		=	'';
		this.dieta_almuerzo_ejemplo			=	'';
		this.dieta_media_tarde_ejemplo		=	'';	
		this.dieta_cena_ejemplo				=	'';
		this.dieta_coicion_nocturna_ejemplo	=	'';
		this.dataFilled	=	false;
	}
	setNutricionistaId(nutricionista_id){
		this.nutricionista_id	=	nutricionista_id;
	}
	setTiempoComidaDeNutricionista(tiempoComidas){
		this.tiempoComidas	=	tiempoComidas;
	}
	fill(data){
		console.log('fill(data)');console.log(data);
		this.consulta.set(data);
		var paciente	=	data.paciente;
		this.paciente.set(paciente);
				
		/*	HCP	*/
		this.patologias			=	[];
		this.alergias			=	[];
		this.bioquimicas		=	[];
		/*	HCF	*/
		this.hcf_patologias		=	[];
		/*	OBJETIVOS	*/
		this.objetivos			=	[];
		/*	HABITOS	*/
		this.ejercicios			=	[];
		this.valoracionDietetica=	[];
		this.valoracionDieteticaEjemplo=	[];
		this.gustos				=	new HabitosGusto();
		this.habitosOtro		=	new HabitosOtro();	
		this.hcpOtros				= new HcpOtros();
		this.hcpOtros.paciente_id	=	this.paciente.id;

		if(data.paciente['hcp']){
			var hcp	=	data.paciente['hcp'];
			if(hcp['patologias'])
				this.patologias	=	hcp['patologias'];
			if(hcp['alergias'])
				this.alergias	=	hcp['alergias'];
			if(hcp['bioquimicas'])
				this.bioquimicas	=	hcp['bioquimicas'];
			if(hcp['otros'])
				this.hcpOtros	=	hcp['otros'];
		}
		if(data.paciente['hcf']){
			var hcf	=	data.paciente['hcf'];
			if(hcf['patologias'])
				this.hcf_patologias	=	hcf['patologias'];

		}
		if(data.paciente['objetivos'])
			this.objetivos	=	data.paciente['objetivos'];

		if(data.paciente['habitos']){
			var habitos	=	data.paciente['habitos'];
			if(habitos['ejercicios'])
				this.ejercicios	=	habitos['ejercicios'];

			if(habitos['gustos'])
				this.gustos	=	habitos['gustos'];
			else
				this.gustos.paciente_id	=	this.paciente.id;


			if(habitos['valoracionDietetica'])
				this.valoracionDietetica	=	habitos['valoracionDietetica'];
			
			if(habitos['valoracionDieteticaEjemplo'])
				this.valoracionDieteticaEjemplo	=	habitos['valoracionDieteticaEjemplo'];

			if(habitos['otros'])
				this.habitosOtro	=	habitos['otros'];
			else
				this.habitosOtro.paciente_id	=	this.paciente.id;
		}
		/*	VA	*/
		this.valoracionAntropometrica.consulta_id	=	this.consulta.id;
		if(data.va){
			var va			=	data.va;
			this.valoracionAntropometrica.set(va);
			
			this.detalleGrasa.valoracion_antropometrica_id	=	va.id;
			this.detalleMusculo.valoracion_antropometrica_id=	va.id;
			
			if(va.detalleGrasa)
				this.detalleGrasa	=	va.detalleGrasa;
			if(va.detalleMusculo)
				this.detalleMusculo	=	va.detalleMusculo;			
		}
		this.rdd.consulta_id	=	this.consulta.id;
		if(data.rdd){
/*	RDDS	*/
			var rdd 							=	data.rdd;
			this.rdd.set(rdd);
		}
/*	Dieta	*/
		/*this.prescripcion.consulta_id	=	this.consulta.id;
		this.prescripcion.items			=	[];*/

		if(data.dieta){/*console.log(data.dieta);*/
			this.dietas	=	data.dieta;
			var first_dieta	=	this.dietas[0];
			this.current_dieta_id	=	first_dieta.dieta_id;
			
			/*if(data.dieta.prescripcion){
				var prescripcion		=	data.dieta.prescripcion;
				this.prescripcion.set(prescripcion);
			}*/
			if(first_dieta.prescripcion){
				var prescripcion		=	first_dieta.prescripcion;
				this.prescripcion.set(prescripcion);
			}
/*		Patron Menu	*/
			/*if(data.dieta.patron_menu){
				this.patronmenu			=	data.dieta.patron_menu;
			}*/
			if(first_dieta.patron_menu){
				this.patronmenu			=	first_dieta.patron_menu;
			}
/*		Patron Menu	Ejemplos	*/
			/*if(data.dieta.patron_menu_ejemplos){*/
			if(first_dieta.patron_menu_ejemplos){
				this.patron_menu_ejemplos			=	first_dieta.patron_menu_ejemplos;
				for(var i in this.patron_menu_ejemplos){
					let item	=	this.patron_menu_ejemplos[i];
					switch(item.tiempo_comida_id){
						case 1:
							this.dieta_desayuno_ejemplo			=	item.ejemplo;
							break;
						case 2:
							this.dieta_media_manana_ejemplo		=	item.ejemplo;
							break;
						case 3:
							this.dieta_almuerzo_ejemplo			=	item.ejemplo;
							break;
						case 4:
							this.dieta_media_tarde_ejemplo		=	item.ejemplo;
							break;
						case 5:
							this.dieta_cena_ejemplo				=	item.ejemplo;
							break;
						case 6:
							this.dieta_coicion_nocturna_ejemplo	=	item.ejemplo;
							break;
					}
				}
				
			}
		}
		this.dataFilled	=	true;
	}
	getFormConsulta():Consulta{
		return this.consulta;
	}
	setFormConsulta(consulta:Consulta){
		this.consulta.id				=	consulta.id;
		this.consulta.fecha				=	consulta.fecha;
		this.consulta.notas				=	consulta.notas;
		this.consulta.estado			=	consulta.estado;
		this.consulta.paciente_id		=	consulta.paciente_id;
		this.consulta.paciente_nombre	=	consulta.paciente_nombre;
		localStorage.setItem('consulta_id', String(this.consulta.id));
	}
	getFormPaciente():Paciente{
		return this.paciente;
	}
	getFormPacienteHcpPatologias(){
		return this.patologias;
	}
	setFormPacienteHcpPatologias(patologias){
		var patologiasSelected	=	[];
		var	j=0;
		var obj;
		for(var i in patologias){
			var item	=	patologias[i];
			if(!item.checked)
				continue;

			obj						=	new Object();
			obj.id					=	item.id;
			obj.nombre				=	item.nombre;
			obj.hcp_patologia_id	=	item.id;
			obj.paciente_id			=	this.paciente.id;
			patologiasSelected[j]	=	obj;
			j++;
		}
		this.patologias	=	patologiasSelected;
	}
	getFormPacienteHcpAlergias(){
		return this.alergias;
	}
	setFormPacienteHcpAlergias(alergias){
		var alergiasSelected	=	[];
		var	j=0;
		var obj;
		for(var i in alergias){
			var item	=	alergias[i];
			if(!item.checked)
				continue;

			obj						=	new Object();
			obj.id					=	item.id;
			obj.nombre				=	item.nombre;
			obj.alergia_id	=	item.id;
			obj.paciente_id			=	this.paciente.id;
			alergiasSelected[j]	=	obj;
			j++;
		}
		this.alergias	=	alergiasSelected;
	}
	getFormPacienteBioquimicas(){
		return this.bioquimicas;
	}
	getFormPacienteHcfPatologias(){
		return this.hcf_patologias;
	}
	setFormPacienteHcfPatologias(patologias){
		var patologiasSelected	=	[];
		var	j=0;
		var obj;
		for(var i in patologias){
			var item	=	patologias[i];
			if(!item.checked)
				continue;

			obj						=	new Object();
			obj.id					=	item.id;
			obj.nombre				=	item.nombre;
			obj.notas				=	item.notas;
			obj.hcf_patologia_id	=	item.id;
			obj.paciente_id			=	this.paciente.id;
			patologiasSelected[j]	=	obj;
			j++;
		}
		this.hcf_patologias	=	patologiasSelected;
	}
	getFormPacienteObjetivos(){
		return this.objetivos;
	}
	getFormPacienteActividades(){
		return this.objetivos;
	}
	getFormPacienteHabitosEjercicios(){
		return this.ejercicios;
	}
	getFormPacienteHabitosGustos(){
		return this.gustos;
	}
	getFormPacienteHcpOtros(){
		return this.hcpOtros;
	}
	setFormPacienteHcpOtros(hcpOtros){
		this.hcpOtros	=	hcpOtros;
	}
	getFormPacienteHabitosOtros(){
		return this.habitosOtro;
	}
	getFormValoracionAntropometrica(){
		return this.valoracionAntropometrica;
	}
	getFormDetalleGrasa(){
		return this.detalleGrasa;
	}
	getFormDetalleMusculo(){
		return this.detalleMusculo;
	}
	getTiempoComidasDeNutricionista(){
		return this.tiempoComidas;
	}
	setLastValuesFormValoracionAntropometrica(va){
		this.valoracionAntropometrica.lastEstatura				=	va.estatura;
		if(va.circunferencia_muneca==null)
			va.circunferencia_muneca	=	'';
		this.valoracionAntropometrica.lastCircunferencia_muneca	=	va.circunferencia_muneca;
	}
	setPatronMenu(patron_menu){
		this.patronmenu			=	patron_menu;
	}
	setPatronMenuEjemplos(patron_menu_ejemplos){
		this.patron_menu_ejemplos			=	patron_menu_ejemplos;
	}
	setValoracionDietetica(data){
		this.valoracionDietetica=	data;
	}
	setValoracionDieteticaEjemplo(data){
		this.valoracionDieteticaEjemplo	=	data;
	}
	setFormPaciente(data){
		this.paciente.persona_id		=	data.persona_id;
		this.paciente.notas_patologias	=	data.notas_patologias;
		this.paciente.otras_patologias	=	data.otras_patologias;
		this.paciente.notas_alergias	=	data.notas_alergias;
		this.paciente.notas_medicamentos=	data.notas_medicamentos;
		this.paciente.notas_valoracion_dietetica=	data.notas_valoracion_dietetica;
		this.paciente.notas_otros		=	data.notas_otros;
		this.paciente.nutricionista_id	=	data.nutricionista_id;
		this.paciente.responsable_id	=	data.responsable_id;
		this.paciente.usuario			=	data.usuario;
		this.paciente.contrasena		=	data.contrasena;

		this.paciente.id				=	data.id;
		this.paciente.cedula			=	data.cedula;
		this.paciente.nombre			=	data.nombre;
		this.paciente.genero			=	data.genero;
		this.paciente.fecha_nac			=	data.fecha_nac;
		this.paciente.telefono			=	data.telefono;
		this.paciente.celular			=	data.celular;
		this.paciente.email				=	data.email;
		this.paciente.provincia			=	data.provincia;
		this.paciente.canton			=	data.canton;
		this.paciente.distrito			=	data.distrito;
		this.paciente.detalles_direccion=	data.detalles_direccion;
		this.paciente.ubicacion_id		=	data.ubicacion_id;

		this.paciente.edad				=	data.edad;
		this.paciente.esMayor			=	data.edad>17;
		localStorage.setItem('paciente_id', String(this.paciente.persona_id));
	}
	getFormRdd():Rdd{
		return this.rdd;
	}
	getFormDietas(){
		return this.dietas;
	}
	getFormPrescripcion():Prescripcion{
		return this.prescripcion;
	}
	/*getFormPrescripcion1():Prescripcion{
		console.log(this.dietas);
		this.prescripcion.set(this.dietas[0].prescripcion);
		return this.prescripcion;
	}*/
	getManejadorDatos():ManejadorDatos{
		return this.manejadorDatos;
	}
	getHelpers():Helpers{
		return this.helpers;
	}
	getCurrentDieta(){
		return this.current_dieta_id;
	}
	setCurrentDieta(dieta_id){
		this.current_dieta_id	=	dieta_id;
	}
	setPrescripcionPatronMenu(dieta_id){
		/*console.log('setPrescripcionPatronMenu');
		console.log(this.dietas);*/
		var filter_dieta	=	this.dietas.filter(x => x.dieta_id === dieta_id);
		var first_dieta		=	filter_dieta[0];
		/*console.log('first_dieta');
		console.log(first_dieta);*/
		
		this.prescripcion				=	new Prescripcion();
		this.prescripcion.dieta_id		=	first_dieta.dieta_id;
		
		this.patronmenu					=	[];
		this.patron_menu_ejemplos		=	[];
		
		this.current_dieta_id	=	first_dieta.dieta_id;
		if(first_dieta.prescripcion){
			var prescripcion		=	first_dieta.prescripcion;
			this.prescripcion.set(prescripcion);
		}
		if(first_dieta.patron_menu){
			this.patronmenu			=	first_dieta.patron_menu;
		}
		if(first_dieta.patron_menu_ejemplos){
			this.patron_menu_ejemplos			=	first_dieta.patron_menu_ejemplos;
			for(var i in this.patron_menu_ejemplos){
				let item	=	this.patron_menu_ejemplos[i];
				switch(item.tiempo_comida_id){
					case 1:
						this.dieta_desayuno_ejemplo			=	item.ejemplo;
						break;
					case 2:
						this.dieta_media_manana_ejemplo		=	item.ejemplo;
						break;
					case 3:
						this.dieta_almuerzo_ejemplo			=	item.ejemplo;
						break;
					case 4:
						this.dieta_media_tarde_ejemplo		=	item.ejemplo;
						break;
					case 5:
						this.dieta_cena_ejemplo				=	item.ejemplo;
						break;
					case 6:
						this.dieta_coicion_nocturna_ejemplo	=	item.ejemplo;
						break;
				}
			}
			
		}
	
	}
}
export class Persona{
	id:number=0;
	cedula:string=''
	nombre:string=''
	genero:string=''
	fecha_nac:string=''
	telefono:string=''
	celular:string=''
	email:string=''
	provincia:string=''
	canton:string=''
	distrito:string=''
	detalles_direccion:string='';
	ubicacion_id:number=1;
	
	edad:number=0;
	edad_dias:number=0;
	edad_meses:number=0;
	esMayor:boolean=true;
	
	setEdad(){
		this.edad	=	0;
		if(!this.fecha_nac)
			return ;
		var birthday = this.fecha_nac.split('/');	
		var year	=	Number(birthday[2]);
		var month	=	Number(birthday[1]);
		var day		=	Number(birthday[0]);
		var fecha	=	new Date(year, month, day).getTime();
		var timeDiff = Math.abs(Date.now() - fecha);
		/*this.edad	=	Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365);*/
		this.edad	=	Math.trunc(Number((timeDiff / (1000 * 3600 * 24)) / 365));
		this.esMayor	=	this.edad>17;	
		
		var edadPaciente:number		=	Number(this.edad);
		var edadPaciente_dias:number=	Math.round(edadPaciente*365);
		var edadPaciente_meses:number=	Math.round(edadPaciente*12);
		if(this.fecha_nac){
			var current_fecha = this.fecha_nac.split('/');
			var year	=	Number(current_fecha[2]);
			var month	=	Number(current_fecha[1]);
			var day		=	Number(current_fecha[0]);			
				var fechaInicio = new Date(year + '-' + month + '-' + day).getTime();
				var fechaFin    = new Date().getTime();
				var diff = fechaFin - fechaInicio;
				edadPaciente_dias	=	Math.round( diff/(1000*60*60*24) );
				var _anhos:any	=	Math.trunc( edadPaciente_dias/365.25 );
				edadPaciente_meses	=	_anhos * 12;
				_anhos	=	Math.trunc( edadPaciente_dias % 365.25 );
				if(_anhos>30)
					edadPaciente_meses	+=	Math.trunc( _anhos / 30 );

		}
		this.edad_dias	=	edadPaciente_dias;
		this.edad_meses	=	edadPaciente_meses;
	}
	getEdad(){
		return this.edad;
	}

}
export class Paciente extends Persona{
	id:number=0;
	persona_id:number=0;
	notas_patologias:string='';
	otras_patologias:string='';
	notas_alergias:string='';
	notas_medicamentos:string='';
	notas_valoracion_dietetica:string='';
	notas_otros:string='';
	nutricionista_id:number=0;
	responsable_id:string='';
	responsable_cedula:string='';
	responsable_nombre:string='';
	responsable_parentezco:string='';
	responsable_telefono:string='';
	responsable_email:string='';
	usuario:string='';
	contrasena:string='';
	nombre:string='';

	set(data:Paciente){
		this.persona_id			=	data.persona_id;
		this.notas_patologias	=	data.notas_patologias;
		this.otras_patologias	=	data.otras_patologias;
		this.notas_alergias		=	data.notas_alergias;
		this.notas_medicamentos	=	data.notas_medicamentos;
		this.notas_valoracion_dietetica	=	data.notas_valoracion_dietetica;
		this.notas_otros		=	data.notas_otros;
		this.nutricionista_id	=	data.nutricionista_id;
		this.responsable_id		=	data.responsable_id;
		this.responsable_cedula	=	data.responsable_cedula;
		this.responsable_nombre	=	data.responsable_nombre;
		this.responsable_parentezco		=	data.responsable_parentezco;
		this.responsable_telefono		=	data.responsable_telefono;
		this.responsable_email		=	data.responsable_email;
		this.usuario			=	data.usuario;
		this.contrasena			=	data.contrasena;

		this.id					=	data.id;
		this.cedula				=	data.cedula;
		this.nombre				=	data.nombre;
		this.genero				=	data.genero;
		this.fecha_nac			=	data.fecha_nac;
		this.telefono			=	data.telefono;
		this.celular			=	data.celular;
		this.email				=	data.email;
		this.provincia			=	data.provincia;
		this.canton				=	data.canton;
		this.distrito			=	data.distrito;
		this.detalles_direccion	=	data.detalles_direccion;
		this.ubicacion_id		=	data.ubicacion_id;

		if(data.edad){
			this.edad			=	data.edad;
			this.edad_meses		=	data.edad_meses;
			this.edad_dias		=	data.edad_dias;
			this.esMayor		=	data.esMayor;
		}else
			this.setEdad();
	}
}
export class ValoracionAntropometrica {	
    id: number = 0;
    estatura:string='';
    circunferencia_muneca:string='';
    peso:string='';
    grasa:string='';
    musculo:string='';
    agua:string='';
    grasa_viceral:string='';
    hueso:string='';
    edad_metabolica:string='';
    circunferencia_cintura:string='';
	circunferencia_cadera:string='';
	consulta_id: number = 0;
	pesoIdeal:string='';
	pesoIdealAjustado:string='';
	historial:any[]=[];
	
	lastEstatura:string='';
	lastCircunferencia_muneca:string='';
	
	metodo_valoracion:string='oms';
	percentil_analisis:string='50';
	graficando:boolean=false;
	
	set(data:ValoracionAntropometrica){
		this.id						=	data.id;
		this.estatura				=	data.estatura;
		this.circunferencia_muneca	=	data.circunferencia_muneca;
		this.peso					=	data.peso;
		this.grasa					=	data.grasa;
		this.musculo				=	data.musculo;
		this.agua					=	data.agua;
		this.grasa_viceral			=	data.grasa_viceral;
		this.hueso					=	data.hueso;
		this.edad_metabolica		=	data.edad_metabolica;
		this.circunferencia_cintura	=	data.circunferencia_cintura;
		this.circunferencia_cadera	= 	data.circunferencia_cadera;
		this.consulta_id			= 	data.consulta_id;
		if(this.id){
			this.metodo_valoracion		= 	data.metodo_valoracion;
			if(data.percentil_analisis)
				this.percentil_analisis	=	String(data.percentil_analisis);
		}
		if(data.historial){
			this.historial	=	data.historial;
		}
	}
	setPesos(peso, estatura, genero){
		var pesoIdeal	=	this.getPesoIdeal(estatura, genero);
		this.getPesoIdealAjustado(peso, pesoIdeal);
	}
	getPesoIdeal(estatura, genero){
		var esMasculino	=	genero=='M';
/*
=SI(SEXO="M";(ESTATURA*100-152)*2,72/2,5+47,7;(ESTATURA*100-152)*2,27/2,5+45,5)
*/
		var factor_1	=	45.5;
		var factor_2	=	2.27;
		if(genero=='M'){
			factor_1	=	47.7;
			factor_2	=	2.72;
		}
		var _pesoIdeal	=	(estatura*100-152)*factor_2/2.5+factor_1;
		this.pesoIdeal	=	this.restarSumarAlPesoIdeal( _pesoIdeal, esMasculino );		
		return this.pesoIdeal;
	}
	getPesoIdealAjustado(peso, pesoIdeal){
/*
=(PESO-PESO_IDEAL)/(4)+(PESO_IDEAL)
*/
		var _value	=	Number(peso) - pesoIdeal;
		_value	=	_value/4;
		_value	=	 _value + Number(pesoIdeal)
		this.pesoIdealAjustado	=	String(_value);
		return this.pesoIdealAjustado;
	}
	restarSumarAlPesoIdeal(pesoIdeal, esMasculino){
		var valor	=	'';
		var valor_porcentaje_10	=	pesoIdeal*0.10;/*	10%	*/
		var estructura_osea	=	this.calcularEstructuraOsea();
		if( esMasculino ){
			if(estructura_osea>10.4){
				valor	=	'PEQUEÑA';
				pesoIdeal	-=	valor_porcentaje_10;
			}else{
				if(estructura_osea>9.6)
					valor	=	'MEDIANA';
				else{
					valor	=	'GRANDE';
					pesoIdeal	+=	valor_porcentaje_10;
				}
			}
		}else{
			if(estructura_osea>11){
				valor	=	'PEQUEÑA';
				pesoIdeal	-=	valor_porcentaje_10;
			}else{
				if(estructura_osea>10.1)
					valor	=	'MEDIANA';
				else{
					valor	=	'GRANDE';
					pesoIdeal	+=	valor_porcentaje_10;
				}
			}			
		}
		return pesoIdeal;
	}
	
	calcularEstructuraOsea(){
		if(!this.circunferencia_muneca)
			return 0;
/*
=ESTATURA*100/MUÑECA
*/
		var valor	=	0;
		
		valor	=	Math.round( Number(this.estatura) *100/Number(this.circunferencia_muneca) );
		
		return valor;
	}
}
export class Rdd{
	id:number;
	metodo_calculo_gc:string='benedict';
	peso_calculo:string='actual';
	factor_actividad_sedentaria:number=1.4;
	promedio_gc_diario:number=0;
	variacion_calorica:number=0;
	consulta_id:number;

	tmb:number=0;
	gcr:number=0;
	icr:number=0;
	va:ValoracionAntropometrica;
	paciente:Paciente;

	set(rdd:Rdd){
		this.id							=	rdd.id;
		this.metodo_calculo_gc			=	rdd.metodo_calculo_gc;
		this.peso_calculo				=	rdd.peso_calculo;
		this.factor_actividad_sedentaria=	rdd.factor_actividad_sedentaria;
		this.promedio_gc_diario			=	rdd.promedio_gc_diario;
		this.variacion_calorica			=	rdd.variacion_calorica;
		this.consulta_id				=	rdd.consulta_id;
		this.tmb						=	rdd.tmb;
		this.gcr						=	rdd.gcr;
		this.icr						=	rdd.icr;
	}
	setVA(va:ValoracionAntropometrica){
		this.va	=	va;
	}
	setPaciente(paciente:Paciente){
		this.paciente	=	paciente;
	}
	getTmbBenedict(){
		var current_peso:any	=	0;
		switch(this.peso_calculo){
			case 'actual':
				current_peso	=	this.va.peso;
				break;
			case 'ideal':
				current_peso	=	this.va.pesoIdeal;
				break;
			case 'ideal-ajustado':
				current_peso	=	this.va.pesoIdealAjustado;
				break;
		}
/*
	Tasa Metabolica Basal Harris Benedict
	=REDONDEAR(
		SI(	SEXO="M";
			(66,5+(13,75*PESO)+(5,003*ESTATURA*100)-(6,755*EDAD));
				SI(SEXO="F";
					(655,1+(9,563*PESO)+(1,85*ESTATURA*100)-(4,676*EDAD));)
		
		)
	;0)
*/
		var result	=	0;
		var _estatura:any	=	Number(this.va.estatura)*100;
		if(this.paciente.genero=='M')
			result	=	66.5+(13.75*current_peso)+(5.003*_estatura)-(6.755*this.paciente.edad);
		else{
			var _peso		=	9.563*current_peso;
			if(isNaN(_peso))
				_peso	=	0;
			var _edad		=	4.676*this.paciente.edad;
			_estatura	=	1.85*_estatura;
			result	=	655.1 + _peso + ( _estatura - _edad );
		}
		return result;
			
	}
	getTmbMifflin(){
		var current_peso:any	=	0;
		switch(this.peso_calculo){
			case 'actual':
				current_peso	=	this.va.peso;
				break;
			case 'ideal':
				current_peso	=	this.va.pesoIdeal;
				break;
			case 'ideal-ajustado':
				current_peso	=	this.va.pesoIdealAjustado;
				break;
		}
/*		Tasa Metabolica Basal Mifflin - St Jeor
		=REDONDEAR(
			(10*PESO)+(6,25*(ESTATURA*100))-(5*EDAD)+VARIABLE_MSJ
		;0)
		Variable MSJ:
		=SI(SEXO="F";
			-161;
				SI(SEXO="M";
				5;0))
*/
		var variable_msj	=	0;
		if(this.paciente.genero=='M')
			variable_msj	=	5;
		else
			variable_msj	=	-161;

		var result	=	(10*current_peso)+(6.25*Number(this.va.estatura)*100)-(5*Number(this.paciente.edad))+variable_msj;
		return result;
	}
	getTmbPromedio(){
/*		TMB Promedio
		=REDONDEAR(
			PROMEDIO(HARRIS;MIFFLIN)
		;0)
*/
		var result	=	(this.getTmbBenedict()+this.getTmbMifflin())/2;
		return result;
	}
	getTmbRda(){
		var value	=	0;
		if(this.paciente.edad<=1){
/*
 *Infantes	0 - 0.5	108
 *			0.5 - 1	98
*/
			value	=	108;
			if(this.paciente.edad_meses >=6)
				value	=	98;
		}else{
/*
 *Niños		1 - 3	102
 *			4 - 6	90
 *			7 - 10	70
 */
			if(this.paciente.edad>1){
				value	=	102;
				if(this.paciente.edad>=4){
					value	=	90;
					if(this.paciente.edad>=7 && this.paciente.edad<=10 )
						value	=	70;
/* 
 *Hombres	11 - 14	55
 *			15 -18	45
 * Mujeres	11 - 14	47
 *			15 -18	40
 */
					if(this.paciente.edad>=11 && this.paciente.edad<=14 ){
						value	=	55;
						if(this.paciente.genero=='F')
							value	=	47;
					}
					if(this.paciente.edad>=15 && this.paciente.edad<=18 ){
						value	=	45;
						if(this.paciente.genero=='F')
							value	=	40;
					}
					
				}
			}
		}
		return value;
	}
	getTmbSchofield(){
		var value	=	0;
		var current_peso:any	=	this.va.peso;
/*
		Edad	Formula
Hombres	3-10	(19.6 x Peso) + (130.3 x Estatura) + 414.9
		10-18	(16.25 x Peso) + (137.2 x Estatura) + 515.5

Mujeres	3-10	(8.365 x Peso) + (130.3 x Estatura) + 414.11
		10-18	(19.6 x Peso) + (130.3 x Estatura) + 414.12
*/
		if( this.paciente.edad<3 || this.paciente.edad>18 )
			return value;
			
		if(this.paciente.edad<11){
			if(this.paciente.genero=='M')
				value	=	(19.6*current_peso) + (130.3*Number(this.va.estatura)) + 414.9;
			else
				value	=	(8.365*current_peso) + (130.3*Number(this.va.estatura)) + 414.11;
		}else{
			if(this.paciente.genero=='M')
				value	=	(16.25*current_peso) + (137.2*Number(this.va.estatura)) + 515.5;
			else
				value	=	(19.6*current_peso) + (130.3 *Number(this.va.estatura)) + 414.12;		
		}		
		return value;
	}
	getTasaBasal(){
		var result:any	=	0;
		switch(this.metodo_calculo_gc){
			case 'benedict-child':
			case 'benedict':
				result	=	this.getTmbBenedict();
				break;
			case 'mifflin':
				result	=	this.getTmbMifflin();
				break;
			case 'promedio':
				result	=	this.getTmbPromedio();
				break;
			case 'rda':
				result	=	this.getTmbRda();
				break;
			case 'schofield':
				result	=	this.getTmbSchofield();
				break;
			default:
				result	=	0;
		}
	   return result;
   }
	
	getGastoCaloricoReal(){
		var result:any	=	0;
		switch(this.metodo_calculo_gc){
			case 'benedict-child':
			case 'benedict':
				result	=	this.getTmbBenedict()*this.factor_actividad_sedentaria+this.promedio_gc_diario;
				break;
			case 'mifflin':
				result	=	this.getTmbMifflin()*this.factor_actividad_sedentaria+this.promedio_gc_diario;
				break;
			case 'promedio':
				result	=	this.getTmbPromedio()*this.factor_actividad_sedentaria+this.promedio_gc_diario;
				break;
			case 'rda':
				result	=	(this.getTasaBasal()*Number(this.va.peso))+this.promedio_gc_diario;
				break;
			case 'schofield':
				result	=	this.getTasaBasal()+this.promedio_gc_diario;
				break;
			default:
				result	=	0;
		}
		return result;
	}
	getIngestaCaloricaRecomendada(){
/*	Ingesta calórica Recomendada
	=GASTO_CALORICO_REAL+VARIACION_CALORICA
*/
		var result	=	this.getGastoCaloricoReal()+this.variacion_calorica;
		return result;
	}
	doAnalisis(){
		
	   this.getTasaBasal();
	   this.gcr	=	this.getGastoCaloricoReal();
	   this.icr	=	this.getIngestaCaloricaRecomendada();

   }
	
}
export class Analisis {
    imc: number 				=	0;
    pesoIdeal : number 			=	0;
    estaturaIdeal : number 			=	0;
    pesoIdealAjustado: number	=	0;
    diferenciaPeso: number 		=	0;
    adecuacion: number 			=	0;
    relacionCinturaCadera: number = 0;
    porcentajePeso: number	=	0;
    gradoSobrepeso: number 	=	0;
    pesoMetaMaximo: number 	=	0;
    pesoMetaMinimo: number 	=	0;
}
export class Consulta {
	id:number;
	fecha:number;
	notas:string;
	estado:boolean;
	finalizar:boolean=false;
	paciente_id:number;
	paciente_nombre:string;

	set(data:Consulta){
		this.id				=	data.id;
		this.fecha			=	data.fecha;
		this.notas			=	data.notas;
		this.paciente_id	=	data.paciente_id;
	}
}
export class Nutricionista {
	persona_id:number;
	usuario:string;
	contrasena:string;
	activo:boolean;
	id:number;
	cedula:string;
	nombre:string;
	genero:string;
	fecha_nac:string;
	telefono:string;
	celular:string;
	email:string;
	provincia:string;
	canton:string;
	distrito:string;
	detalles_direccion:string;
}
export class Prescripcion{
	id:number;
	carbohidratos:number=0;
	proteinas:number=0;
	grasas:number=0;
	/*consulta_id:number;*/
	dieta_id:number;
	itemsByDefault:PrescripcionItem[]=[];
	items:any[]=[];
	otros:any[]=[];

	constructor(){
		this.prepareItems();
		this.items	=	[];
		this.otros	=	[];
	}
	set(prescripcion:Prescripcion){
		this.id				=	prescripcion.id;
		this.carbohidratos	=	prescripcion.carbohidratos;
		this.proteinas		=	prescripcion.proteinas;
		this.grasas			=	prescripcion.grasas;
		/*this.consulta_id	=	prescripcion.consulta_id;*/
		this.dieta_id	=	prescripcion.dieta_id;
		
		if(prescripcion.items){
			this.items	=	prescripcion.items;
		}else
			this.prepareItems();

		if(prescripcion.otros)
			this.otros	=	prescripcion.otros;
	}
	prepareItems(){
		this.itemsByDefault	=[/*id, nombre, slug, ngmodel, cantidad, carbohidratos, proteinas, grasas, kcal*/
			new PrescripcionItem(1, 'Leche Descremada', 'leche-descremada'),
			new PrescripcionItem(2, 'Leche 2%', 'leche-2'),
			new PrescripcionItem(3, 'Leche entera', 'leche-entera'),
			new PrescripcionItem(4, 'Vegetales', 'vegetales'),
			new PrescripcionItem(5, 'Frutas', 'frutas'),
			new PrescripcionItem(6, 'Harinas', 'harinas'),
			new PrescripcionItem(7, 'Carne Magra', 'carne-magra'),
			new PrescripcionItem(8, 'Carne Intermedia', 'carne-intermedia'),
			new PrescripcionItem(9, 'Carne Grasa', 'carne-grasa'),
			new PrescripcionItem(10, 'Azúcares', 'azucares'),
			new PrescripcionItem(11, 'Grasas', 'grasas'),
			new PrescripcionItem(12, 'Vasos con Agua', 'vaso-agua')
		];
	}
}
export class ManejadorDatos{
	aarchivo:string='class ManejadorDatos';
	operacion:string='nuevo-paciente';
	consulta_id:number=0;
	dieta_id:number=0;
	nutricionista_id:number=0;
	paciente_id:number=0;
	lastStatusMenuPaciente:boolean=false;
	enableLink:boolean=false;
	extraInfoAlimentos:any[];	
	dataStored:boolean=false;	
	hcpPatologias:any;
	hcfPatologias:any;
	alergias:any;
	ejercicios:any;
	tiempo_comidas:any;
	ubicaciones:any[]=[];
	provincias:any[]=[];
	cantones:any[]=[];
	distritos:any[]=[];
	
	currentStepConsulta:string='';
		
	setEnableLink(enable){
		this.enableLink	=	enable;
	}		
	getEnableLink():boolean{
		return this.enableLink;
	}	
	setOperacion(operacion:string){
		this.operacion	=	operacion;
	}
	setMenuPacienteStatus(status){
		this.lastStatusMenuPaciente	=	status;
	}
	getMenuPacienteLastStatus():boolean{
		return this.lastStatusMenuPaciente;
	}
	getExtraInfoAlimentos(){
		return this.extraInfoAlimentos;
	}
	getHcpPatologias(){
		return this.hcpPatologias;
	}
	getHcpAlergias(){
		return this.alergias;
	}
	getHcfPatologias(){
		return this.hcfPatologias;
	}
	getEjercicios(){
		return this.ejercicios;
	}
	getUbicaciones(){
		return this.ubicaciones;
	}
	getProvincias(){
		return this.provincias;
	}
	getCantones(){
		return this.cantones;
	}
	getDistritos(){
		return this.distritos;
	}
	setExtraInfoAlimentos(){
		this.extraInfoAlimentos['0']	=	'';
		this.extraInfoAlimentos['1']	=	{'slug':'leche-descremada', 'ngmodel':'leche_descremada'};
		this.extraInfoAlimentos['2']	=	{'slug':'leche-2', 'ngmodel':'leche_2'};
		this.extraInfoAlimentos['3']	=	{'slug':'leche-entera', 'ngmodel':'leche_entera'};
		this.extraInfoAlimentos['4']	=	{'slug':'vegetales', 'ngmodel':'vegetales'};
		this.extraInfoAlimentos['5']	=	{'slug':'frutas', 'ngmodel':'frutas'};
		this.extraInfoAlimentos['6']	=	{'slug':'harinas', 'ngmodel':'harinas'};
		this.extraInfoAlimentos['7']	=	{'slug':'carne-magra', 'ngmodel':'carne_magra'};
		this.extraInfoAlimentos['8']	=	{'slug':'harinas', 'ngmodel':'harinas'};
		this.extraInfoAlimentos['9']	=	{'slug':'carne-grasa', 'ngmodel':'carne_grasa'};
		this.extraInfoAlimentos['10']	=	{'slug':'azucares', 'ngmodel':'azucares'};
		this.extraInfoAlimentos['11']	=	{'slug':'grasas', 'ngmodel':'grasas'};
		this.extraInfoAlimentos['12']	=	{'slug':'vaso-agua', 'ngmodel':'vaso_agua'};
	}

	fillDataForm(data, local=false){
		this.hcpPatologias	=	data.hcp_patologias;
		this.hcfPatologias	=	data.hcf_patologias;
		this.alergias		=	data.alergias;
		this.ejercicios		=	data.ejercicios;
		this.tiempo_comidas	=	data.tiempo_comidas;
		this.ubicaciones	=	data.ubicaciones;

		this.createInfoUbicacion();
		if(!local)
			this.storeLocal();
	}

	storeLocal(){
		var data	=	{};
		data['hcp_patologias']	=	this.hcpPatologias;
		data['hcf_patologias']	=	this.hcfPatologias;
		data['alergias']		=	this.alergias;
		data['ejercicios']		=	this.ejercicios;
		data['tiempo_comidas']	=	this.tiempo_comidas;
		data['ubicaciones']		=	this.ubicaciones;
		data['provincias']		=	this.provincias;
		data['cantones']		=	this.cantones;
		data['distritos']		=	this.distritos;
		localStorage.setItem('data', JSON.stringify(data));
		this.dataStored	=	true;
	}
	createInfoUbicacion(){
		var ubicacion;
		var obj;
		var prov;
		var cant;
		var dist;
		if(!this.ubicaciones){
			return ;
		}
		for(var i in this.ubicaciones){
			ubicacion	=	this.ubicaciones[i];
			var item = this.provincias.find(item => item.codigo_provincia === ubicacion.codigo_provincia);
			if(!item){
				prov	=	new Object();
				prov.codigo_provincia		=	ubicacion.codigo_provincia;
				prov.nombre_provincia		=	ubicacion.nombre_provincia;
				this.provincias.push(prov);
			}
			var item = this.cantones.find(item => item.codigo_canton === ubicacion.codigo_canton  && item.codigo_provincia === ubicacion.codigo_provincia);
			if(!item){
				cant	=	new Object();
				cant.codigo_canton		=	ubicacion.codigo_canton;
				cant.nombre_canton		=	ubicacion.nombre_canton;
				cant.codigo_provincia	=	ubicacion.codigo_provincia;
				this.cantones.push(cant);
			}
			var item = this.distritos.find(item => item.codigo_provincia === ubicacion.codigo_provincia && item.codigo_canton === ubicacion.codigo_canton && item.codigo_distrito === ubicacion.codigo_distrito);
			if(!item){
				dist	=	new Object();
				dist.codigo_provincia	=	ubicacion.codigo_provincia;
				dist.codigo_canton		=	ubicacion.codigo_canton;
				dist.codigo_distrito	=	ubicacion.codigo_distrito;
				dist.nombre_distrito	=	ubicacion.nombre_distrito;
				this.distritos.push(dist);
			}
		}
	}
	setCurrentStepConsulta(step){
		this.currentStepConsulta	=	step;
	}
	getCurrentStepConsulta(){
		return this.currentStepConsulta;
	}
	
}
export class Helpers{
/*
Modo de Uso
<input (keypress)="helpers.onKeyPress($event)"> 
*/
	validateKey(evt, charCode){		
		if (charCode == 8 || (charCode > 34 && charCode < 41 ))
			return true;

		if(charCode < 45 || charCode > 57 )
			return false;

		return true;
	}
	onKeyPress(e: any):boolean {
		let input;
		if (e.metaKey || e.ctrlKey)
			return true;

		if (e.which === 32)
			return false;

		if (e.which === 0)
			return true;

		if (e.which < 33)
			return true;

		input = String.fromCharCode(e.which);		
		return !!/[\d\s]/.test(input);
	}
	soloEnteros(e: any):boolean {
		let input;
		if (e.metaKey || e.ctrlKey)
			return true;

		if (e.which === 32)
			return false;

		if (e.which === 0)
			return true;

		if (e.which < 33)
			return true;

		input = String.fromCharCode(e.which);		
		return !!/[\d\s]/.test(input);
	}
/*
Modo de Uso
<input (keypress)="helpers.soloNumeros($event)"> 
*/
	soloNumeros(evt) {
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode == 46) {
			var txt 	=	evt.target.value;
			if (txt.indexOf('.') === -1) {
				return true;
			} else {
				return false;
			}
		} else {
			if (charCode > 31
				 && (charCode < 48 || charCode > 57))
				return false;
		}
		return true;
	}
	soloNumerosRange(evt, min=0, max=999.99) {
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode == 8 || (charCode>36 && charCode<41)) 
			return true;
		if (charCode == 46) {
			var txt 	=	evt.target.value;
			if (txt.indexOf('.') === -1) {
				return true;
			} else {
				return false;
			}
		} else {
			if (charCode > 31
				 && (charCode < 48 || charCode > 57))
				return false;
		}
		var numero	=	evt.target.value;
		numero	=	numero.substring(0, numero.length-1); 
		var _value 	=	Number(evt.target.value);

		if(_value > max){
			evt.target.value	=	numero;
			return false;
		}
		return true;
	}
	soloNumerosNegativePositiveDecimal(event: KeyboardEvent, text: string):boolean {
		var charCode = (event.which) ? event.which : event.keyCode;
		let input;
		if(charCode==45 || charCode==46){
			var txt 	=	(<HTMLInputElement>event.target).value;
			let index	=	txt.indexOf('.');
			let indexx	=	text.indexOf('.');
			return index==-1;
		}
		if (event.which === 32)
			return false;

		if (event.which === 0)
			return true;

		if (event.which < 33)
			return true;

		input = String.fromCharCode(event.which);
		var keyCode = [8,9,37,39,45,46,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110];
		var charCode = (event.which) ? event.which : event.keyCode;		
		var index = keyCode.indexOf( charCode );
		if(index<0)
			return false;
		
		var re = /^-?\d*\.?\d{0,6}$/;
		return (input.match(re) !== null);	
		
	}	
	
	onlyIntNegPos(evt){
		if (evt.key=='Delete')
			return true;
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		
		if (charCode == 8 || (charCode > 34 && charCode < 41 ))
			return true;

		if(charCode < 45 || charCode > 57 )
			return false;

		if(charCode == 46 )
			return false;

		var value 	=	String(evt.target.value);
		
		var index	=	-100;
		
		if(charCode==45){
			index	=	value.indexOf( '-' );
			if(index>-1)
				return false;

			evt.target.value	=	'-' + evt.target.value;
			value	=	evt.target.value;
		}
		var re = /^-?\d{0,3}$/;
		return (value.match(re) !== null);
	}
	in_array(data, ele){
		return data.indexOf(ele)>-1;
	}
	clone(obj){
		return (JSON.parse(JSON.stringify(obj)));
	}
	equals(obj1, obj2){
		return (JSON.stringify(obj1)==JSON.stringify(obj2));
	}
	scrollToForm(isConsulta=false){
		setTimeout(() => {
				var _width	=	document.getElementsByTagName('body')[0].offsetWidth;
				if(_width>767){
					window.scrollTo(0, top);
					return ;
				}				
				var top	=	180;/*	Nuevo	*/
				if(isConsulta)
					top	=	200;/*	Consulta	*/
				window.scrollTo(0, top);
			}, 100);
	}
	formatTime(value, militaryTime=false){
		let _num	=	String(value).padStart(4, '0');
		let time_formatted	=	_num.substring(0,2) + ':' + _num.substring(2,4);
		if(!militaryTime){
			let _hour	=	_num.substring(0,2);
			let _ampm	=	'am';
			if(Number(_hour)>11)
				_ampm	=	'pm';
			
			let h	=	Number(_hour) % 12;
			if(h==0)
				h	=	12;

			time_formatted	=	h + ':' + _num.substring(2,4) + _ampm;
			return time_formatted;
		}
		return time_formatted;
	}
	getHourMinutes(value){
		let _num	=	String(value).padStart(4, '0');
		let time_formatted	=	{hour: parseInt(_num.substring(0,2)), minutes: parseInt(_num.substring(2,4))};
		
		return time_formatted;
	}
	getStatusCitaClass(status){
		let _class	=	'availablessss';
		switch(status){
			case 0:
				_class	=	'cancelled';
				break;
			case 1:
				_class	=	'programed';
				break;
			case 2:
				_class	=	'confirmed';
				break;
			default:
				_class	=	'available';							
		}
		return _class;
	}
	__getCocienteResiduo(numero,divisor){
		let _div	=	Math.trunc(Number( numero/divisor ));
		let _res	=	Math.trunc(Number( numero%divisor ));
		let result	=	{d: _div, r:_res, n:numero,c:divisor};
		return result;
	}
	__getMinutesHM(minutos){
		let _d	=	this.__getCocienteResiduo(minutos, 60);

		let _mhm	=	(_d.d*100) + _d.r
		if(_d.r>0)
			_mhm	+=	40;

		return _mhm;
	}
}
export class Ejercicio{
	id:number;
	nombre:string;
	mets:string;
}
export class PrescripcionItem{
	constructor(public id:number, public nombre:string, public slug:string, public porciones:number=0, public carbohidratos:number=0, public proteinas:number=0, public grasas:number=0, public kcal:number=0) {
  }
}
export class PatronMenu{
	constructor(public tiempo_comida_id:number, public grupo_alimento_nutricionista_id:number, public porciones:number, public ejemplo:string ){}
}
export class PatronMenuEjemplo{
	dieta_desayuno_ejemplo:string='';
	dieta_media_manana_ejemplo:string='';
	dieta_almuerzo_ejemplo:string='';
	dieta_media_tarde_ejemplo:string='';
	dieta_cena_ejemplo:string='';
	dieta_coicion_nocturna_ejemplo:string='';

	arrayMenuDesayuno:{ [id: string]: any; };
	arrayMenuMediaManana:{ [id: string]: any; };
	arrayMenuAlmuerzo:{ [id: string]: any; };
	arrayMenuMediaTarde:{ [id: string]: any; };
	arrayMenuCena:{ [id: string]: any; };
	arrayMenuCoicionNocturna:{ [id: string]: any; };
	arrayMenuCurrent:{ [id: string]: any; };

}
export class DetalleGrasa{
	id:number=0;
	valorGrasaSegmentado:number=0;
	valorGrasaPliegues:number=0;
 	valoracion_antropometrica_id:number=0;

	segmentado_abdominal:string='';
	segmentado_pierna_izquierda:string='';
	segmentado_pierna_derecha:string='';
	segmentado_brazo_izquierdo:string='';
	segmentado_brazo_derecho:string='';

	pliegue_tricipital:string='';
	pliegue_bicipital:string='';
	pliegue_subescapular:string='';
	pliegue_supraliaco:string='';

}
export class DetalleMusculo{
	id:number=0;
 	valoracion_antropometrica_id:number=0;
	tronco:String='';
	pierna_izquierda:String='';
	pierna_derecha:String='';
	brazo_izquierdo:String='';
	brazo_derecho:String='';
}
export class Patologia{
	constructor(public id:number, public nombre:string, public checked:boolean){}
}
export class Alergia{
	constructor(public id:number, public nombre:string, public checked:boolean){}
}
export class HcfPatologia{
	constructor(public id:number, public nombre:string, public checked:boolean, public notas:string, public html:string){}
}
export class Objetivo{
	public id:number;
	public fecha:string;
	public descripcion:string;
	public paciente_id:number;
}
export class Dieta{
	public id:number;
	public nombre:string;
	public variacion_calorica:Number;
	public consulta_id:number;
}
export class HcpOtros{
		public id:number;
		public ciclos_menstruales:string='';
		public notas:string='';
		public paciente_id:number;

}
export class HabitosGusto{
	public id:number;
	public comidas_favoritas:string;
	public comidas_no_gustan:string;
	public lugar_acostumbra_comer:string;
	public lugar_caen_mal:string;
	public notas:string;
	public paciente_id:number;
}
export class HabitosOtro{
	public id:number;
	public ocupacion:string;
	public ocupacion_horas:number;
	public ocupacion_frecuencia:string;
	public sueno:string;
	public fumado:boolean;
	public fuma_cantidad:number;
	public fuma_frecuencia:string;
	public alcohol:boolean;
	public alcohol_cantidad:number;
	public alcohol_frecuencia:string;
	public notas:string;
	public paciente_id:number;
}
export class HabitosEjercicio{
	public paciente_id:number;
	public ejercicio_id:number;
	public horas_semanales:number;
	public nombre:string;
	public mets:number;
}
export class Provincia{
	constructor(public codigo_provincia, public nombre_provincia){}
}
export class Canton{
	constructor(public codigo_canton, public nombre_canton, public codigo_provincia){}
}
export class Distrito{
	constructor(public codigo_distrito, public nombre_distrito, public codigo_canton, public codigo_provincia){}
}
export class DetalleValoracionDieteticaTexto{
	public textoDesayuno:string='';
	public textoMediaManana:string='';
	public textoAlmuerzo:string='';
	public textoMediaTarde:string='';
	public textoCena:string='';
	public textoCoicionNocturna:string='';

	public textoAgua:string='';
	public textoGaseosa:string='';
	public textoJugosEmpacados:string='';
	public textoComidasRapidas:string='';
	public textoAlimentosEmpacados:string='';
	public textoEmbutidos:string='';
}
export class OtroAlimento{
	constructor( public nombre:string, public prescripcion_id:number){}
}
export class Reporte{
	id:number=0;
	documento:number=0;
	receptor:string='';
	tipo:string='';
	fecha:string='';
	moneda:string='';
	monto:string='';
}
export class Producto{
	public descripcion:string;
	public id:number;
	public nutricionista_id:number;
	public precio:number;
	public unidad_medida:number;
}

export class Consulta_s_f{
	public id: number;
	public paciente: string;
	public fecha: string;
}

export class Tipo{
	public id: number;
	public name: string;
}

export class Medida{
	public id: number;
	public name: string;
}

export class Tipo_ID{
	public id: number;
	public name: string;
}

export class Medio{
	public id: number;
	public name: string;
}
export class Graphic{
	public genero:string='';
	public metodo:string='';
	public label_x:string='';
	public label_y:string='';
	public edad:number=0;
	public peso:number=0;
	public altura:number=0;
}

export class AgendaServicio{
	public id:number;
	public nombre:string;
	public duracion:number;
	public nutricionista_id:number;
}
export class Agenda{
	public id:number;
	public date:string;
	public militartime:number;
	public notas:string;
	public status:number;
	public email:string;
	public telefono:string;
	public agenda_servicio_id:number;
	public agenda_servicio_nombre:string;
	public agenda_servicio_duracion:number;
	public persona_id:number;
	public persona_nombre:string;
	public nutricionista_id:number;
	public class:string;
	public time_formatted:string;
	public text:string;
	public editable:boolean;
	public editing:boolean;

	constructor(nutricionista_id:number=0){
		this.id=0;
		this.date='';
		this.militartime=0;
		this.notas='';
		this.status=-1;
		this.email='';
		this.telefono='';
		this.agenda_servicio_id=0;
		this.agenda_servicio_nombre='';
		this.agenda_servicio_duracion=0;
		this.persona_id=0;
		this.persona_nombre='';
		this.nutricionista_id=nutricionista_id;
		this.class='available';
		this.time_formatted='';
		this.text='Disponible';
		this.editable=true;
		this.editing=false;
	}
}