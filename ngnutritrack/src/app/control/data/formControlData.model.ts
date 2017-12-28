export class FormControlData {
	manejadorDatos				=	new ManejadorDatos();
	consulta:Consulta			=	new Consulta();	
	paciente:Paciente			=	new Paciente();	
	producto:Producto           =   new Producto();
	reporte:Reporte 			=	new Reporte();
	prescripcion:Prescripcion	=	new Prescripcion();
	valoracionAntropometrica	= 	new ValoracionAntropometrica();
	rdd:Rdd		=	new Rdd();	
	gustos		=	new HabitosGusto();
	habitosOtro	=	new HabitosOtro();
	
	patronmenu:any[]=[];
	bioquimicas:any[]=[];
	patologias:any[]=[];
	alergias:any[]=[];
	hcf_patologias:any[]=[];
	objetivos:any[]= [];
	ejercicios:any[]=[];
	valoracionDietetica:any[]=[];

/*	Paciente	*/
	paciente_id:number=0;
	nutricionista_id:number=1;//Math.floor((Math.random()*5)+1);
	
	dieta_desayuno_ejemplo:string='';
	dieta_media_manana_ejemplo:string='';
	dieta_almuerzo_ejemplo:string='';
	dieta_media_tarde_ejemplo:string='';	
	dieta_cena_ejemplo:string='';
	dieta_coicion_nocturna_ejemplo:string='';

/*	ValoracionAntropometrica	*/
    estatura: number = 0;
    circunferencia_muneca : number = 0;
    peso: number = 0;
    grasa: number = 0;
    musculo: number = 0;
    agua: number = 0;
    grasa_viceral: number = 0;
    hueso: number = 0;
    edad_metabolica: number = 0;
    circunferencia_cintura: number = 0;
    circunferencia_cadera: number = 0;

/*	Analisis	*/	
	imc: number = 0;
    pesoIdeal : number =0;
    pesoIdealAjustado: number = 0;
    diferenciaPeso: number = 0;
    adecuacion: number = 0;
    relacionCinturaCadera: number = 0;
    porcentajePeso: number = 0;
    gradoSobrepeso: number = 0;
    pesoMetaMaximo: number = 0;
    pesoMetaMinimo: number = 0;

    clear() {
        this.estatura = 0;
        this.circunferencia_muneca = 0;
        this.peso = 0;
        this.grasa = 0;
        this.musculo = 0;
        this.agua = 0;
        this.grasa_viceral = 0;
        this.hueso = 0;
        this.edad_metabolica = 0;
        this.circunferencia_cintura = 0;
        this.circunferencia_cadera = 0;
		
		/*this.manejadorDatos		=	new ManejadorDatos();*/
		if(this.manejadorDatos.operacion!='nueva-consulta'){
			this.paciente			=	new Paciente();
			this.paciente.nutricionista_id	=	this.nutricionista_id;
		}
		
		this.consulta			=	new Consulta();			
		this.prescripcion	=	new Prescripcion();
		this.valoracionAntropometrica	= 	new ValoracionAntropometrica();
		/**/
		this.rdd						=	new Rdd();
		this.patronmenu					=	[];
		this.valoracionDietetica		=	[];
	}
	
	fill(data){console.log('filling');console.log(data);
		this.consulta.set(data);
		//var paciente	=	data.paciente[0];
		var paciente	=	data.paciente;
		this.paciente.set(paciente);
		
		if(data.paciente['hcp']){
			var hcp	=	data.paciente['hcp'];
			if(hcp['patologias'])
				this.patologias	=	hcp['patologias'];
			if(hcp['alergias'])
				this.alergias	=	hcp['alergias'];
			if(hcp['bioquimicas'])
				this.bioquimicas	=	hcp['bioquimicas'];
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
			
			if(habitos['otros'])
				this.habitosOtro	=	habitos['otros'];
			else
				this.habitosOtro.paciente_id	=	this.paciente.id;
			
		}

		/**/
		
		/*	VA	*/
		this.valoracionAntropometrica.consulta_id	=	this.consulta.id;
		if(data.va){
			/*var va			=	data.va[0];*/
			var va			=	data.va;
			this.valoracionAntropometrica.set(va);
		}
		this.rdd.consulta_id	=	this.consulta.id;
		if(data.rdd){
/*	RDDS	*/
			/*var rdd 							=	data.rdd[0];*/
			var rdd 							=	data.rdd;
			this.rdd.set(rdd);
		}
/*	Dieta	*/
		this.prescripcion.consulta_id	=	this.consulta.id;
		if(data.dieta){
			if(data.dieta.prescripcion){
/*		Prescripcion */
				/*var prescripcion		=	data.dieta.prescripcion[0];*/
				var prescripcion		=	data.dieta.prescripcion;
				this.prescripcion.set(prescripcion);
			}else
				this.prescripcion.items	=	[];
			
/*		Patron Menu	*/
			if(data.dieta.patron_menu)
				this.patronmenu			=	data.dieta.patron_menu;
		}
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
	}
	getFormReportes():Reporte{
		return this.reporte;
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
			obj.hcp_patologia_id	=	item.id;//item.hcf_patologia_id;
			obj.paciente_id			=	this.paciente.id;//item.paciente_id;
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
			obj.hcf_patologia_id	=	item.id;//item.hcf_patologia_id;
			obj.paciente_id			=	this.paciente.id;//item.paciente_id;
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
	getFormPacienteHabitosOtros(){
		return this.habitosOtro;
	}
	getFormValoracionAntropometrica(){
		return this.valoracionAntropometrica;
	}
	/*getFormHcpPatologias(){
		return this.hcpPatologias;
	}*/
	setPatronMenu(patron_menu){
		this.patronmenu			=	patron_menu;
	}
	setValoracionDietetica(valoracionDietetica){
		this.valoracionDietetica			=	valoracionDietetica;
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
		
		this.paciente.edad				=	data.edad;
		this.paciente.esMayor			=	data.edad>17;

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
	
	edad:number=0;
	esMayor:boolean=true;
/*	
	public esMenor():boolean{
		if (this.fecha_nac) {		
			var current_fecha = this.fecha_nac.split('/');	
			console.log(current_fecha);
			var year	=	Number(current_fecha[2]);
			var month	=	Number(current_fecha[1]);
			var day		=	Number(current_fecha[0]);
			var fecha	=	new Date(year, month, day).getTime();
			var today	=	new Date().getTime();
			console.log(fecha + ' - ' + today )			
			var timeDiff = Math.abs(Date.now() - fecha);
			console.log(timeDiff);
			var edad	=	Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365);
			console.log(edad);
			return this.edad<18;			
		}
		return false;
	}*/
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
		
		this.edad				=	data.edad;
		this.esMayor			=	data.esMayor;
		
		
		/*
		if(data.paciente['hcp']){			
			if(data.paciente['hcp']['patologias']){
				this.paciente.setPatologias(data.paciente['hcp']['patologias']);
			}

			if(data.paciente['hcp']['alergias'])
				this.alergias	=	data.paciente['hcp']['alergias'];
			
			if(data.paciente['hcp']['bioquimicas'])
				this.bioquimicas	=	data.paciente['hcp']['bioquimicas'];
		}*/
		
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
	
	detalleGrasa:DetalleGrasa	= 	new DetalleGrasa();
	detalleMusculo:DetalleMusculo	= 	new DetalleMusculo();
	
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
		this.tmb				=	rdd.tmb;
		this.gcr				=	rdd.gcr;
		this.icr				=	rdd.icr;
	}
}
export class Analisis {
    imc: number = 0;
    pesoIdeal : number =0;
    pesoIdealAjustado: number = 0;
    diferenciaPeso: number = 0;
    adecuacion: number = 0;
    relacionCinturaCadera: number = 0;
    porcentajePeso: number = 0;
    gradoSobrepeso: number = 0;
    pesoMetaMaximo: number = 0;
    pesoMetaMinimo: number = 0;
}

export class Consulta {
	id:number;
	fecha:number;
	notas:string;
	estado:boolean;
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
	items:PrescripcionItem[]=[];

	constructor(){
		this.prepareItems();
	}
	set(prescripcion:Prescripcion){
		this.id				=	prescripcion.id;
		this.carbohidratos	=	prescripcion.carbohidratos;
		this.proteinas		=	prescripcion.proteinas;
		this.grasas			=	prescripcion.grasas;
		this.consulta_id	=	prescripcion.consulta_id;
		console.log('prescripcion.items.length: ' + prescripcion.items.length);
		if(prescripcion.items.length>0){
			this.items	=	prescripcion.items;
		}else{
			/*this.items	=[				//							id, nombre, slug, ngmodel, cantidad, carbohidratos, proteinas, grasas, kcal
							new PrescripcionItem(1, 'Leche Descremada', 'leche-descremada', 'leche_descremada', 0, 0, 0, 0, 0),
							new PrescripcionItem(2, 'Leche 2%', 'leche-2', 'leche_2', 0, 0, 0, 0, 0),
							new PrescripcionItem(3, 'Leche entera', 'leche-entera', 'leche_entera', 0, 0, 0, 0, 0),
							new PrescripcionItem(4, 'Vegetales', 'vegetales', 'vegetales', 0, 0, 0, 0, 0),
							new PrescripcionItem(5, 'Frutas', 'frutas', 'frutas', 0, 0, 0, 0, 0),
							new PrescripcionItem(6, 'Harinas', 'harinas', 'harinas', 0, 0, 0, 0, 0),
							new PrescripcionItem(7, 'Carne Magra', 'carne-magra', 'carne_magra', 0, 0, 0, 0, 0),
							new PrescripcionItem(8, 'Carne Intermedia', 'carne-intermedia', 'carne_intermedia', 0, 0, 0, 0, 0),
							new PrescripcionItem(9, 'Carne Grasa', 'carne-grasa', 'carne_grasa', 0, 0, 0, 0, 0),
							new PrescripcionItem(10, 'Azúcares', 'azucares', 'azucares', 0, 0, 0, 0, 0),
							new PrescripcionItem(11, 'Grasas', 'grasas', 'grasas', 0, 0, 0, 0, 0),
							new PrescripcionItem(12, 'Vasos de Agua', 'vaso-agua', 'vaso_agua', 0, 0, 0, 0, 0)
						];*/
			this.prepareItems();
		}
		
	}
	prepareItems(){
		this.items	=[				//							id, nombre, slug, ngmodel, cantidad, carbohidratos, proteinas, grasas, kcal
							new PrescripcionItem(1, 'Leche Descremada', 'leche-descremada', 'leche_descremada', 0, 0, 0, 0, 0),
							new PrescripcionItem(2, 'Leche 2%', 'leche-2', 'leche_2', 0, 0, 0, 0, 0),
							new PrescripcionItem(3, 'Leche entera', 'leche-entera', 'leche_entera', 0, 0, 0, 0, 0),
							new PrescripcionItem(4, 'Vegetales', 'vegetales', 'vegetales', 0, 0, 0, 0, 0),
							new PrescripcionItem(5, 'Frutas', 'frutas', 'frutas', 0, 0, 0, 0, 0),
							new PrescripcionItem(6, 'Harinas', 'harinas', 'harinas', 0, 0, 0, 0, 0),
							new PrescripcionItem(7, 'Carne Magra', 'carne-magra', 'carne_magra', 0, 0, 0, 0, 0),
							new PrescripcionItem(8, 'Carne Intermedia', 'carne-intermedia', 'carne_intermedia', 0, 0, 0, 0, 0),
							new PrescripcionItem(9, 'Carne Grasa', 'carne-grasa', 'carne_grasa', 0, 0, 0, 0, 0),
							new PrescripcionItem(10, 'Azúcares', 'azucares', 'azucares', 0, 0, 0, 0, 0),
							new PrescripcionItem(11, 'Grasas', 'grasas', 'grasas', 0, 0, 0, 0, 0),
							new PrescripcionItem(12, 'Vasos de Agua', 'vaso-agua', 'vaso_agua', 0, 0, 0, 0, 0)
						];
	}
}
export class ManejadorDatos{
	operacion:string='nuevo-paciente';
	consulta_id:number=0;
	paciente_id:number=0;
	lastStatusMenuPaciente:boolean=false;
	extraInfoAlimentos:any[];
	
	hcpPatologias:any;
	hcfPatologias:any;
	alergias:any;
	ejercicios:any;
	tiempo_comidas:any;
	
		
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
	fillDataForm(data){
		this.hcpPatologias	=	data.hcp_patologias;
		this.hcfPatologias	=	data.hcf_patologias;
		this.alergias		=	data.alergias;
		this.ejercicios		=	data.ejercicios;
		this.tiempo_comidas	=	data.tiempo_comidas;
	}
}
export class Ejercicio{
	id:number;
	nombre:string;
	mets:string;
}
export class PrescripcionItem{
	
	constructor(public id:number, public nombre:string, public slug:string, public ngmodel:string, public porciones:number, public carbohidratos:number, public proteinas:number, public grasas:number, public kcal:number=0) {
  }
/*	id:number;
	nombre:string;
	/*slug:string;
	ngmodel:string;
	cantidad:number=0;
	carbohidratos:number=0;
	proteinas:number=0;
	grasas:number=0;
	kcal:number=0;*/
}
export class PatronMenu{
/*, public consulta_id:number*/	
	constructor(public tiempo_comida_id:number, public grupo_alimento_nutricionista_id:number, public porciones:number, public ejemplo:string ){}
}
export class PatronMenuEjemplo{
//	constructor(public tiempo_comida_id:number, public grupo_alimento_nutricionista_id:number, public ejemplo:string ){}
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

export class Producto{
	public descripcion:string;
	public id:number;
	public nutricionista_id:number;
	public precio:number;
	public unidad_medida:string;
}









