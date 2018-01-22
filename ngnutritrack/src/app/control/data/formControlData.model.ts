export class FormControlData {
	aaa:string='class FormControlData';
	dataFilled:boolean=false;
	paciente_id:number=0;
	nutricionista_id:number=0;	
	dieta_desayuno_ejemplo:string			=	'';
	dieta_media_manana_ejemplo:string		=	'';
	dieta_almuerzo_ejemplo:string			=	'';
	dieta_media_tarde_ejemplo:string		=	'';	
	dieta_cena_ejemplo:string				=	'';
	dieta_coicion_nocturna_ejemplo:string	=	'';
	lastEstatura:number=0;
	lastCircunferencia_muneca:number=0;

	imc: number 				=	0;
	pesoIdeal: number = 0;
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
		this.prescripcion				=	new Prescripcion();
		this.valoracionAntropometrica	= 	new ValoracionAntropometrica();
		this.rdd						=	new Rdd();
		this.patronmenu					=	[];
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
	fill(data){
		console.log('fcd::fill(data)...');console.log(data);
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
		}
		this.rdd.consulta_id	=	this.consulta.id;
		if(data.rdd){
/*	RDDS	*/
			var rdd 							=	data.rdd;
			this.rdd.set(rdd);
		}
/*	Dieta	*/
		this.prescripcion.consulta_id	=	this.consulta.id;
		this.prescripcion.items			=	[];
		//this.prescripcion.otros			=	[];

		if(data.dieta){
			if(data.dieta.prescripcion){
/*		Prescripcion */
				var prescripcion		=	data.dieta.prescripcion;
				this.prescripcion.set(prescripcion);
			}			
/*		Patron Menu	*/
			if(data.dieta.patron_menu)
				this.patronmenu			=	data.dieta.patron_menu;
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
			obj.alergia_id	=	item.id;//item.hcf_patologia_id;
			obj.paciente_id			=	this.paciente.id;//item.paciente_id;
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

	setLastValuesFormValoracionAntropometrica(va){
/*		this.valoracionAntropometrica.estatura				=	va.estatura;
		this.valoracionAntropometrica.circunferencia_muneca	=	va.circunferencia_muneca;
	*/
		this.valoracionAntropometrica.lastEstatura				=	va.estatura;
		this.valoracionAntropometrica.lastCircunferencia_muneca	=	va.circunferencia_muneca;
	}
	setPatronMenu(patron_menu){
		this.patronmenu			=	patron_menu;
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
	getFormPrescripcion():Prescripcion{
		return this.prescripcion;
	}
	getManejadorDatos():ManejadorDatos{
		return this.manejadorDatos;
	}
	getHelpers():Helpers{
		return this.helpers;
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
		this.edad	=	Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365);		
		this.esMayor	=	this.edad>17;	
		
/*
		this.fecha_nac	=	this.fecha_nac.date.day + '/' + this.fecha_nac.date.month + '/' + this.fecha_nac.date.year;;
		var fecha	=	new Date(this.fecha_nac.date.year, this.fecha_nac.date.month, this.fecha_nac.date.day).getTime();
		var timeDiff = Math.abs(Date.now() - fecha);
		var edad	=	Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365);		
		this.paciente.esMayor	=	edad>17;	
*/
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
	/*	helpers	*/
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

		this.edad				=	data.edad;
		this.esMayor			=	data.esMayor;
		this.setEdad();
	}
}
export class ValoracionAntropometrica {
    id: number = 0;
    estatura: number = 0;
    circunferencia_muneca: number = 0;
    peso: number = 0;
    grasa: number = 0;
    musculo: number = 0;
    agua: number = 0;
    grasa_viceral: number = 0;
    hueso: number = 0;
    edad_metabolica: number = 0;
    circunferencia_cintura: number = 0;
	circunferencia_cadera: number = 0;
	consulta_id: number = 0;
	pesoIdeal: number = 0;
	pesoIdealAjustado: number = 0;	
	detalleGrasa:DetalleGrasa	= 	new DetalleGrasa();
	detalleMusculo:DetalleMusculo	= 	new DetalleMusculo();
	
	lastEstatura:number=0;
	lastCircunferencia_muneca:number=0;
	
	set(data:ValoracionAntropometrica){
		this.id						=	data.id;
		this.estatura				=	data.estatura;
		this.circunferencia_muneca	=	data.circunferencia_muneca;
		this.estatura				=	data.estatura;
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

		this.detalleGrasa.valoracion_antropometrica_id	=	data.id;
		this.detalleMusculo.valoracion_antropometrica_id	=	data.id;
		if(data.detalleGrasa)
			this.detalleGrasa	=	data.detalleGrasa;
		if(data.detalleMusculo)
			this.detalleMusculo	=	data.detalleMusculo;

	}
	getDetalleMusculo(){
		return this.detalleMusculo;
	}
	getDetalleGrasa(){
		return this.detalleGrasa;
	}
	setPesos(peso, estatura, genero){
		var pesoIdeal	=	this.getPesoIdeal(estatura, genero);
		this.getPesoIdealAjustado(peso, pesoIdeal);
	}
	getPesoIdeal(estatura, genero){

/*
=SI(SEXO="M";(ESTATURA*100-152)*2,72/2,5+47,7;(ESTATURA*100-152)*2,27/2,5+45,5)
*/
		var factor_1	=	45.5;
		var factor_2	=	2.27;
		if(genero=='M'){
			factor_1	=	47.7;
			factor_2	=	2.72;
		}
		this.pesoIdeal	=	(estatura*100-152)*factor_2/2.5+factor_1;
		return this.pesoIdeal;
	}
	getPesoIdealAjustado(peso, pesoIdeal){
/*
=(PESO-PESO_IDEAL)/(4)+(PESO_IDEAL)
*/
		this.pesoIdealAjustado	=(peso-pesoIdeal)/(4)+(pesoIdeal);
		return this.pesoIdealAjustado;
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
}
export class Analisis {
    imc: number 				=	0;
    pesoIdeal : number 			=	0;
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
	consulta_id:number;
	itemsByDefault:PrescripcionItem[]=[];
	items:any[]=[];
	otros:any[]=[];

	constructor(){
		this.prepareItems();
		this.items	=	[];
		this.otros	=	[];
	}
	set(prescripcion:Prescripcion){//console.log('set:prescripcion');console.log(prescripcion);
		this.id				=	prescripcion.id;
		this.carbohidratos	=	prescripcion.carbohidratos;
		this.proteinas		=	prescripcion.proteinas;
		this.grasas			=	prescripcion.grasas;
		this.consulta_id	=	prescripcion.consulta_id;
		
		if(prescripcion.items){
			this.items	=	prescripcion.items;
		}else
			this.prepareItems();

		if(prescripcion.otros)
			this.otros	=	prescripcion.otros;
/*		if(!prescripcion.items){
			this.prepareItems();
			return ;
		}
		if(prescripcion.items.length>0){
			this.items	=	prescripcion.items;
		}else{
			this.prepareItems();
		}

		if(prescripcion.otros.length>0)
			this.otros	=	prescripcion.otros;
*/
	}
	prepareItems(){
		this.itemsByDefault	=[//id, nombre, slug, ngmodel, cantidad, carbohidratos, proteinas, grasas, kcal
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

	fillDataForm(data, local=false){//console.log('Datos para formularios');console.log(data);
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

	storeLocal(){//console.log('storeLocal');

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
			//console.log('NOT this.ubicaciones');
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
				dist.codigo_canton		=	ubicacion.codigo_canton;
				dist.codigo_provincia	=	ubicacion.codigo_provincia;
				dist.codigo_distrito	=	ubicacion.codigo_distrito;
				dist.nombre_distrito	=	ubicacion.nombre_distrito;
				this.distritos.push(dist);
			}
		}
		//console.log('ubicaciones procesadas...');
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
		//console.log(e.which + ' -> ' + input);		
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
		//console.log(e.which + ' -> ' + input);		
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
	in_array(data, ele){
		return data.indexOf(ele)>-1;
	}
	clone(obj){//console.log(obj);
		return (JSON.parse(JSON.stringify(obj)));
	}
	equals(obj1, obj2){//console.log(obj1);console.log(obj2);
		return (JSON.stringify(obj1)==JSON.stringify(obj2));
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
	abdominal:number=0;
	piernaIzquierda:number=0;
	piernaDerecha:number=0;
	brazoIzquierdo:number=0;
	brazoDerecho:number=0;

	tricipital:number=0;
	bicipital:number=0;
	subescapular:number=0;
	suprailiaco:number=0;

	valorGrasaSegmentado:number=0;
	valorGrasaPliegues:number=0;
 	valoracion_antropometrica_id:number=0;
}
export class DetalleMusculo{
	id:number=0;
	tronco:number=0;
	pierna_izquierda:number=0;
	pierna_derecha:number=0;
	brazo_izquierdo:number=0;
	brazo_derecho:number=0;
 	valoracion_antropometrica_id:number=0;
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
	/*constructor(public id:number, public fecha:string, public descripcion:string,public paciente_id:number){}*/
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
	//constructor( public nombre:string, public prescripcion_id:number, public porciones:number=0, public carbohidratos:number=0, public proteinas:number=0, public grasas:number=0, public calorias:number=0){}
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
