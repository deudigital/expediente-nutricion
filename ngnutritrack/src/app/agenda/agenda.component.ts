import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {IMyDpOptions, IMyDayLabels, IMyMonthLabels, IMyDateModel} from 'mydatepicker';

import { ManejadorDatos, Agenda, Paciente } from '../control/data/formControlData.model';
import { FormControlDataService }     from '../control/data/formControlData.service';
//import {Observable} from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: []
})
export class AgendaComponent implements OnInit {
	fcd:any;
	mng:any;
	helpers:any;
	json:any;
	tagBody:any;
	
	cargandoServicios:boolean;
	sinServicio:boolean;
	mostrarServicios:boolean;

	citas:any;
	cita:any;	
	servicios:any;
	servicio:any;
	
	editar_cita:any;
	editar_cita_message:string='';

	show_editar_cita_message:boolean=false;
	hideModalDatos:boolean=true;
	currentModal:string;
	cita_reserva:string;
	cita_reserva_fecha:string;
	cita_reserva_hora:string;
	servicio_nombre:string='';
	
	public fecha_event: any = { date: {year: 2000, month: 10, day:15 } };;
	
	pacientes: any[];
	filter_pacientes:{ [id: string]: any; };
	seleccionado:boolean=false;
	q:string;
	action:string;
	title_prompt:string;
	btn_save_presionado:boolean=false;
	btn_prompt_yes_presionado:boolean=false;
	display_successfully_icon_animated:boolean=false;

	hidePrompt:boolean=true;
	showFilter:boolean=false;
	canFilter:boolean=false;
	selectedPaciente: Paciente;
	current_cita_time:string='';
	time_selected:string='';
	editar_cita_nuevo:boolean=false;
	procesandoAgenda:boolean=false;
	doit:any;
	_form:any;
	
	public _dayLabels: IMyDayLabels = {su: 'Dom', mo: 'Lun', tu: 'Mar', we: 'Mie', th: 'Jue', fr: 'Vie', sa: 'Sab'};
	public _monthLabels: IMyMonthLabels = { 1: 'Ene', 2: 'Feb', 3: 'Mar', 4: 'Abr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Ago', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dic' };
	public _months:any	=  { 1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril', 5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto', 9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre' };
	public myDatePickerOptions: IMyDpOptions = {
		dateFormat: 'dd/mm/yyyy',
		editableDateField: false,
		showClearDateBtn: false,
		inline: true,
		dayLabels: this._dayLabels,
		monthLabels: this._monthLabels,
		sunHighlight: false,
		disableWeekends: false,
		selectorHeight: 'auto',
        selectorWidth: '100%',
		todayBtnTxt: 'Hoy'
	};
	
	private fieldArray: Array<any> = [];

	constructor(private auth: AuthService, private router: Router, private formControlDataService: FormControlDataService) {
		this.fcd		=	formControlDataService.getFormControlData();
		this.helpers	=	this.fcd.getHelpers();
		this.mng		=	this.fcd.getManejadorDatos();
		
		
    }
	ngOnInit() {
		this.tagBody = document.getElementsByTagName('body')[0];
		this.tagBody.classList.add('hide-main-title');
		this.initVars();
		this.auth.verifyUser(localStorage.getItem('nutricionista_id'))
			.then((response) => {
				var response	=	response.json();
				/*console.log(response);*/
				if(!response.valid){
					localStorage.clear();
					this.formControlDataService.getFormControlData().message_login	=	response.message;
					this.router.navigateByUrl('/login');
					return false;
				}
				var data:any	=	{'nutricionista_id':this.fcd.nutricionista_id}
				this.cargandoServicios	=	true;
				this.formControlDataService.select('agenda-servicio', data)
				.subscribe(
					 response  => {
									this.servicios	=	response;
									this.cargandoServicios	=	false;
									if(this.servicios.length>0)
										this.mostrarServicios	=	true;
									else
										this.sinServicio	=	true;
										
									
								},
					error =>  console.log(<any>error)
				);
				this.formControlDataService.select('agenda-personas', data)
				.subscribe(
					 response  => {
								this.pacientes	=	response;
								this.canFilter	=	this.pacientes.length > 0;
							},
					error =>  console.log(<any>error)
				);
				
			})
			.catch((err) => {
				console.log(JSON.parse(err._body));

			});		
	}
	ngOnDestroy() {
		this.tagBody.classList.remove('hide-main-title');
	}
	initVars(){		
		this.editar_cita	=	new Agenda();
		this.showFilter		=	false;
		this.canFilter		=	false;
		this.hideModalDatos	=	true;
		this.hidePrompt		=	true;
		this.sinServicio	=	false;
		this.mostrarServicios	=	false;
		this.cargandoServicios	=	false;
		this.procesandoAgenda	=	false;
		
		let d: Date = new Date();
		this.fecha_event =	{ date: {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()}, epoc: d.getTime() / 1000 };
		this.printDateSelected();
	}
	editarCita(cita){
		console.log('editarCita');
		console.log(cita);
		/*if( !cita.editable || this.currentModal=='datos' ){*/
		if( !cita.editable ){
			return ;
		}		
		this.cita	=	cita;
		this.cita_reserva_hora	=	cita.time_formatted;
		this.servicio_nombre	=	this.servicio.nombre;
		if(cita.id>0){
			this.editar_cita_nuevo		=	true;
			this.selectedPaciente		=	new Paciente();
			this.selectedPaciente.id 	=	cita.persona_id;
			this.q						=	cita.persona_nombre;
			this.editar_cita.telefono	=	cita.telefono;
			this.editar_cita.email		=	cita.email;
			this.editar_cita.notas		=	cita.notas;
		}else{
			this.q	=	'';
			/*this.selectedPaciente	=	null;*/
			this.editar_cita		=	new Agenda();
			this.editar_cita_nuevo	=	false;
		}
		
		
		this.hidePrompt		=	true;
		this.hideModalDatos	=	false;
		this.tagBody.classList.add('open-modal');
		this.tagBody.classList.add('datos');

		this.currentModal	=	'datos';
		window.scrollTo(0, 0);
	}
	saveCita(form){
		this._form	=	form;
		this.btn_save_presionado	=	true;
		var index	=	this.fieldArray.indexOf(this.cita);
		var nueva_cita	=	new Agenda();

		if(this.cita.id>0)
			nueva_cita.id	=	this.cita.id;

		nueva_cita.date					=	this.fecha_event.epoc;
		nueva_cita.militartime			=	this.cita.militartime;
		nueva_cita.agenda_servicio_id	=	this.servicio.id;
		nueva_cita.nutricionista_id		=	this.fcd.nutricionista_id;
		nueva_cita.notas				=	this.editar_cita.notas;
		nueva_cita.email				=	this.editar_cita.email;
		nueva_cita.telefono				=	this.editar_cita.telefono;
		if(this.selectedPaciente)
			nueva_cita.persona_id			=	this.selectedPaciente.id;

		nueva_cita.persona_nombre		=	this.q;
		
		/*console.log(nueva_cita);*/
		this.formControlDataService.store('agenda', nueva_cita)
		.subscribe(
			 response  => {
						/*console.log('saveCita::response');*/
						this.setAgenda(response);
						
						},
			error =>  {
					console.log('saveCita::error');
					console.log(<any>error),
					this.btn_save_presionado=false;
					},					
			() =>{
				/*console.log('saveCita::Complete');*/
				this.btn_save_presionado=false;
				}

		);
	}
	setAgenda(response){		
		if(response.code==201){
			/*this.cita	=	{id: _id,title:, value:_horaMilitar, time:_time, class:_class};*/
			this.cita.id	=	response.data.id;
			/*this.cita.text	=	this.cita.persona_nombre + ' - ' + this.servicio.nombre + ' - ' + this.cita.time_formatted + ' (' + this.servicio.duracion + ' minutos)';*/
			/*this.cita.text	=	this.q + ' - ' + this.servicio.nombre +  ' (' + this.servicio.duracion + ' minutos)';*/
			this.cita.text	=	this.servicio.nombre +  ' (' + this.servicio.duracion + ' minutos)';
			
			let _class	=	'';
			switch(response.data.status){
				case '1':
				case 1:
					_class	=	'programed';
					this.cita.text	=	this.q + ' - ' + this.cita.text;
					break;
				case '2':
				case 2:
					_class	=	'confirmed';
					this.cita.text	=	this.cita.persona_nombre + ' - ' + this.cita.text;
					break;
				default:
					_class	=	'cancelled';
					this.cita.text	=	this.cita.persona_nombre + ' - ' + this.cita.text;
			}
			this.cita.status	=	response.data.status;
			this.cita.telefono	=	response.data.telefono;
			this.cita.email		=	response.data.email;
			this.cita.notas		=	response.data.notas;
			this.cita.editable	=	this.cita.status < 2;
			this.cita.class		=	_class;
			this.hideModal('datos');
			this.selectedPaciente = null;
			this.q	=	'';

			this.editar_cita	=	new Agenda();
			this._resetFormModal();
			this.display_successfully_icon_animated	=	true;
			setTimeout(() => {
 							this.display_successfully_icon_animated	=	false;
						}, 5000);
		}
		if(response.code==208){
			
			this.editar_cita_message		=	response.message;
			this.show_editar_cita_message	=	true;
			setTimeout(() => {
								this.editar_cita_message		=	'';
								this.show_editar_cita_message	=	false;
							}, 5000);
		}
	}
	getCitasAgendadas(date_epoc){
		let data	=	{nutricionista_id:this.fcd.nutricionista_id, fecha:date_epoc}
		this.formControlDataService.select('agenda', data)
		.subscribe(
			 response  => {
						this.citas	=	response;
						this.procesandoAgenda	=	true;
						setTimeout(() => {
							this.mostrarCitasAgendadas();					
						}, 100);
						},
			error =>  console.log(<any>error)
		);
		
	}
	mostrarCitasAgendadas(){
		console.clear();
		this.fieldArray = [];
		let hour_from	=	4;
		let hour_to		=	22;
		let _minutos	=	0;
		let _horaEnMinutos	=	60;
		let citaReservada	=	null;
		let _horaMilitarCitaReservada:number	=	1000000;
		if(this.citas.length>0){
			citaReservada	=	this.citas.shift();
			_horaMilitarCitaReservada	=	Number(citaReservada.militartime );
		}
		let _id:number	=	0;
		let _horaMilitar:number	=	0;
		let _class	=	'';
		let _servicio	=	'';
		let _time	=	'';
		let _time_label	=	'';
		
		var j=0;
		var h=hour_from;
		let cita:any;
		
		let cita_prepared	=	null;
		while(h<hour_to){
			while(_minutos<_horaEnMinutos){
				cita	=	new Agenda( this.fcd.nutricionista_id );
				cita.militartime	=	Number( (h*100)+_minutos);
				cita.time_formatted	=	this.helpers.formatTime(cita.militartime);
				if( cita.militartime >= _horaMilitarCitaReservada){
					if(cita.militartime>_horaMilitarCitaReservada){
						cita_prepared.text		=	'Tiempo insuficiente para el servicio seleccionado';
						cita_prepared.class		=	'unavailable';
						cita_prepared.editable	=	false;
					}
					cita							=	citaReservada;
					cita.time_formatted				=	this.helpers.formatTime(cita.militartime);
					cita.class						=	this.helpers.getStatusCitaClass(citaReservada.status);
					cita.text						=	citaReservada.persona_nombre + ' - ' + citaReservada.agenda_servicio_nombre + ' (' + citaReservada.agenda_servicio_duracion + ' minutos)';
					let _t		=	this.helpers.getHourMinutes(cita.militartime);
					let aux		=	_t.minutes + citaReservada.agenda_servicio_duracion;
					if(aux>=_horaEnMinutos){
						let res	=	Math.trunc(Number(aux/_horaEnMinutos));
						h	=	_t.hour + res;
						_minutos	=	aux%_horaEnMinutos;
					}else{
						h	=	_t.hour;
						/*_minutos	=	citaReservada.agenda_servicio_duracion;*/
						_minutos	=	aux;
					}
					if(this.citas.length>0){
						citaReservada				=	this.citas.shift();
						_horaMilitarCitaReservada	=	Number(citaReservada.militartime );
						
					}else{
						citaReservada				=	null;
						_horaMilitarCitaReservada	=	1000000;						
					}
				}else{
					_minutos	+=	this.servicio.duracion;
				}
				if(cita_prepared!=null){
					/*console.log(cita_prepared.militartime)*/
					cita_prepared.editable	=	cita_prepared.status < 2;
					this.fieldArray.push( cita_prepared );
				}
				cita_prepared	=	cita;
			}
			
			if(_minutos>=_horaEnMinutos){
				let res	=	Math.trunc(Number(_minutos/_horaEnMinutos));
					h	=	h	+	res;
			}else
				h++;
			_minutos	=	_minutos%_horaEnMinutos;
		}
		if(cita_prepared!=null ){
			hour_to	=	Number( (hour_to*100));/*	2200	*/
			let _time	=	cita_prepared.militartime;/*	2145	*/
			if( this.servicio.duracion>=_horaEnMinutos){
				let div	=	Math.trunc(Number( this.servicio.duracion/_horaEnMinutos ));
				_time	=	cita_prepared.militartime + (div*100);
				let res	=	Math.trunc(Number( this.servicio.duracion%_horaEnMinutos ));
				_time	+=	res;
			}else{
				let _dif	=	(hour_to-40) - cita_prepared.militartime;			
				if( _dif <this.servicio.duracion)
					_time	=	hour_to + 1;
			}
			if( (_time > hour_to) ){
				cita_prepared.text		=	'Tiempo insuficiente para el servicio seleccionado';
				cita_prepared.class		=	'unavailable';
				cita_prepared.editable	=	false;
			}
			cita_prepared.editable	=	cita_prepared.status < 2;
			this.fieldArray.push( cita_prepared );
		}
		
		this.procesandoAgenda	=	false;
	}
	servicioChanged(event){
		/*console.log('servicioChanged');		
		console.log(event);*/
		clearTimeout(this.doit);
		this.doit	=	setTimeout(() => {
							console.log(this.fecha_event);
							if(!this.fecha_event.epoc)
								return ;
							this.getCitasAgendadas( this.fecha_event.epoc );
						}, 500);		
	}	
	onDateChanged(event: IMyDateModel) {
		setTimeout(() => {
						/*console.log('onDateChanged');*/
						this.printDateSelected();
					}, 100);

		setTimeout(() => {						
						this.getCitasAgendadas(event.epoc);
					}, 500);
    }
	showModal(modal){
		this.hideModalDatos		=	true;
		switch(modal){
			case 'datos':
				this.hideModalDatos	=	false;
				break;
		}
		this.tagBody.classList.add('open-modal');
		this.currentModal	=	modal;
		window.scrollTo(0, 0);
	}
	hideModal(modal=''){
		if(modal.length==0)
			modal	=	this.currentModal;

		switch(modal){
			case 'datos':
				this.hideModalDatos		=	true;				
				this.current_cita_time	=	'';				
				this._resetFormModal();
				break;
		}
		this.currentModal	=	'';
		this.showFilter	=	false;
		this.tagBody.classList.remove('datos');		
		this.tagBody.classList.remove('open-modal');
	}
	_resetFormModal(){	
		/*if( typeof this._form !== 'undefined' ){
			this._form.reset();
			return ;
		}*/
		let inputs	=	document.getElementsByClassName('form-control-modal');
		for(var i in inputs){
			if(inputs[i].classList){
				inputs[i].classList.remove('ng-invalid');
				inputs[i].classList.remove('ng-touched');
			}
		}
	}
	onFilter(){
		if(!this.canFilter)
			return ;
		/*this.q	=	this.q.trim();*/
		if(this.q.length==0){
			this.editar_cita.email		=	'';
			this.editar_cita.telefono	=	'';
			this.showFilter				=	false;
			this.selectedPaciente 		=	null;
			return ;
		}			
		var search	=	this.q.toLowerCase();
		this.filter_pacientes	=	this.pacientes.filter(function(item) {
										var nombre = item.nombre.toString().toLowerCase();
										return nombre.indexOf(search)>-1;
									})
		this.showFilter	=	this.filter_pacientes.length>0;
		if(!this.showFilter)
			this.selectedPaciente 		=	null;
			
	}
	onSelect(paciente: Paciente) {
		this.selectedPaciente = paciente;
		this.q	=	paciente.nombre;
		this.editar_cita.email		=	paciente.email;
		this.editar_cita.telefono	=	paciente.telefono;
		this.showFilter	=	false;
	}
	confirmarCita(cita){
		this.time_selected	=	'';
		this.cita	=	cita;
		this.action	=	'confirmar';
		this.title_prompt	=	'¿Desea confirmar la cita de ' + this.cita.persona_nombre + '?';
		this.hidePrompt	=	false;
		this.tagBody.classList.add('open-modal');
	}
	cancelarCita(cita){
		this.time_selected	=	'';
		this.cita	=	cita;
		this.action	=	'cancelar';
		this.title_prompt	=	'¿Desea cancelar la la cita de ' + this.cita.persona_nombre + '?';
		this.hidePrompt	=	false;
		this.tagBody.classList.add('open-modal');
	}
	promptYes(){
		switch(this.action){
			case 'confirmar':
				this.btn_prompt_yes_presionado=true;
				this.formControlDataService.store('confirmar_cita', this.cita)
				.subscribe(
					 response  => {
								/*console.log('response');*/
								this.setAgenda(response);
								
								},
					error =>  {
							console.log('error');
							console.log(<any>error),
							this.btn_prompt_yes_presionado=false;
							},					
					() =>{
							/*console.log('Complete');*/
							this.hidePrompt	=	true;
							this.promptCancelar();
							this.btn_prompt_yes_presionado=false;
						}

				);
				break;
			case 'cancelar':
				var index	=	this.fieldArray.indexOf(this.cita);
				this.btn_prompt_yes_presionado=true;
				this.formControlDataService.store('cancelar_cita', this.cita).subscribe(
					 response  => {
								this.fieldArray.splice(index,1);
								},
					error =>  {
							console.log('error');
							console.log(<any>error),                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         							
							this.btn_prompt_yes_presionado=false;
							},					
					() =>{
							console.log('Complete');
							this.hidePrompt	=	true;
							this.promptCancelar();
							this.btn_prompt_yes_presionado=false;
							this.getCitasAgendadas( this.fecha_event.epoc );
						}
				);
				break;
		}		
	}
	promptCancelar(){
		this.tagBody.classList.remove('open-modal');
	}
	printDateSelected(){
		/*console.log('printDateSelected');
		console.log(this.fecha_event.date);*/
		let date	=	this.fecha_event.date;
		this.cita_reserva_fecha	=	this._months[date.month] + ' ' + date.day + ', ' + date.year;
	}
	
}
