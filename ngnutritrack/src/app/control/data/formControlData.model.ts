export class FormControlData {
	manejadorDatos				=	new ManejadorDatos();
	consulta:Consulta			=	new Consulta();	
	paciente:Paciente			=	new Paciente();	
	prescripcion:Prescripcion	=	new Prescripcion();
	valoracionAntropometrica:ValoracionAntropometrica	= 	new ValoracionAntropometrica();
	rdd:Rdd						=	new Rdd();
	patronmenu:any[];
	bioquimicas:any[];
	
	
	

/*	Paciente	*/
	paciente_id:number=0;
	nutricionista_id:number=1;//Math.floor((Math.random()*5)+1);
	
	dieta_desayuno:string='';
	dieta_media_manana:string='';
	dieta_desayuno_ejemplo:string='';
	dieta_media_manana_ejemplo:string='';
	dieta_media_tarde:string='';
	dieta_almuerzo:string='';
	dieta_almuerzo_ejemplo:string='';
	dieta_media_tarde_ejemplo:string='';
	dieta_cena:string='';
	dieta_coicion_nocturna:string='';
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
		if(this.manejadorDatos.operacion!='nueva-consulta')
			this.paciente			=	new Paciente();	
		
		this.consulta			=	new Consulta();			
		this.prescripcion	=	new Prescripcion();
		this.valoracionAntropometrica	= 	new ValoracionAntropometrica();
		this.rdd						=	new Rdd();
		this.patronmenu					=	[];
	}
	
	fill(data){
		this.consulta.set(data);
		var paciente	=	data.paciente[0];
		this.paciente.set(paciente);
		console.log(data.paciente['hcp']['bioquimicas']);
		if(data.paciente['hcp']){
			if(data.paciente['hcp']['bioquimicas'])
				this.bioquimicas	=	data.paciente['hcp']['bioquimicas']
		}
			
		
		
		/*	VA	*/
		if(data.va){
			var va			=	data.va[0];
			this.valoracionAntropometrica.set(va);
		}
		if(data.rdd){
/*	RDDS	*/
			var rdd 							=	data.rdd[0];
			this.rdd.set(rdd);
		}
/*	Dieta	*/
		if(data.dieta){
			if(data.dieta.prescripcion){
/*		Prescripcion */
				var prescripcion		=	data.dieta.prescripcion[0];
				this.prescripcion.set(prescripcion);
			}
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
	getFormPaciente():Paciente{
		return this.paciente;
	}
	getFormPacienteBioquimicas(){
		return this.bioquimicas;
	}
	getFormValoracionAntropometrica(){
		return this.valoracionAntropometrica;
	}
	/*getFormHcpPatologias(){
		return this.hcpPatologias;
	}*/
	setFormPaciente(data){
		this.paciente.persona_id		=	data.persona_id;
		this.paciente.notas_patologias	=	data.notas_patologias;
		this.paciente.otras_patologias	=	data.otras_patologias;
		this.paciente.notas_alergias	=	data.notas_alergias;
		this.paciente.notas_medicamentos=	data.notas_medicamentos;
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
}
export class Paciente extends Persona{
	id:number=0;
	persona_id:number=0;
	notas_patologias:string='';
	otras_patologias:string='';
	notas_alergias:string='';
	notas_medicamentos:string='';
	notas_otros:string='';
	nutricionista_id:number=0;
	responsable_id:string='';
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
		this.notas_otros		=	data.notas_otros;
		this.nutricionista_id	=	data.nutricionista_id;
		this.responsable_id		=	data.responsable_id;
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
	}
}

export class ValoracionAntropometrica {
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
	
	set(data:ValoracionAntropometrica){
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

	}
}
export class Rdd{
	id:number;
	metodo_calculo_gc:string;
	peso_calculo:number;
	factor_actividad_sedentaria:number;
	promedio_gc_diario:number;
	variacion_calorica:number;
	consulta_id:number;

	set(rdd:Rdd){
		this.id							=	rdd.id;
		this.metodo_calculo_gc			=	rdd.metodo_calculo_gc;
		this.peso_calculo				=	rdd.peso_calculo;		
		this.factor_actividad_sedentaria=	rdd.factor_actividad_sedentaria;
		this.promedio_gc_diario			=	rdd.promedio_gc_diario;
		this.variacion_calorica			=	rdd.variacion_calorica;
		this.consulta_id				=	rdd.consulta_id;
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
	carbohidratos:number;
	proteinas:number;
	grasas:number;
	consulta_id:number;

	set(prescripcion:Prescripcion){
		this.id				=	prescripcion.id;
		this.carbohidratos	=	prescripcion.carbohidratos;
		this.proteinas		=	prescripcion.proteinas;
		this.grasas			=	prescripcion.grasas;
		this.consulta_id	=	prescripcion.consulta_id;
	}
}
export class ManejadorDatos{
	operacion:string='nuevo-paciente';
	consulta_id:number=0;
	paciente_id:number=0;
	lastStatusMenuPaciente:boolean=false;
	
	setOperacion(operacion:string){
		this.operacion	=	operacion;		
	}
	setMenuPacienteStatus(status){
		this.lastStatusMenuPaciente	=	status;
	}
	getMenuPacienteLastStatus():boolean{
		return this.lastStatusMenuPaciente;
	}
}
export class Ejercicio{
	id:number;
	nombre:string;
	mets:string;
}