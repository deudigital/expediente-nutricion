import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonalComponent }    from './personal/personal.component';
import { WorkComponent }        from './work/work.component';
import { AddressComponent }     from './address/address.component';
import { ResultComponent }      from './result/result.component';
import { InicioComponent }      from './inicio/inicio.component';

import { NuevoComponent }      from './nuevo/nuevo.component';
import { PersonalesComponent }      from './nuevo/personales/personales.component';
import { ContactoComponent }      from './nuevo/contacto/contacto.component';
import { HcpComponent }      from './nuevo/hcp/hcp.component';
import { HcfComponent }      from './nuevo/hcf/hcf.component';
import { ObjetivoComponent }      from './nuevo/objetivo/objetivo.component';
import { HabitoComponent }      from './nuevo/habito/habito.component';

import { ControlComponent }      from './control/control.component';
import { ValoracionComponent }      from './control/valoracion/valoracion.component';

import { RecomendacionComponent }      from './control/recomendacion/recomendacion.component';
import { DietaComponent }      from './control/dieta/dieta.component';
import { NotasComponent } from './control/dieta/notas/notas.component';
import { PatronmenuComponent } from './control/dieta/patronmenu/patronmenu.component';


import { PatologiaComponent } from './nuevo/hcp/patologia/patologia.component';
import { AlergiaComponent } from './nuevo/hcp/alergia/alergia.component';
import { MedicamentoComponent } from './nuevo/hcp/medicamento/medicamento.component';
import { BioquimicaComponent } from './nuevo/hcp/bioquimica/bioquimica.component';
import { OtrosComponent } from './nuevo/hcp/otros/otros.component';
import { ActividadFisicaComponent } from './nuevo/habito/actividad-fisica/actividad-fisica.component';
import { ValoracionDieteticaComponent } from './nuevo/habito/valoracion-dietetica/valoracion-dietetica.component';
import { GustosComponent } from './nuevo/habito/gustos/gustos.component';
import { OtrosHabitosComponent } from './nuevo/habito/otros-habitos/otros-habitos.component';

import { LoginComponent } from './login/login.component';
import { ResetComponent } from './login/reset.component';
import { LogoutComponent } from './login/logout.component';


import { AgendaComponent }      from './agenda/agenda.component';

import { DashboardComponent }   from './Dashboard/dashboard.component';


import { AuthService } from './Services/auth.service';
import { EnsureAuthenticated } from './Services/ensure-authenticated.service';
import { LoginRedirect } from './Services/login-redirect.service';
/*
import { WorkflowGuard }        from './workflow/workflow-guard.service';
import { WorkflowService }      from './workflow/workflow.service';
*/

export const appRoutes: Routes = [
    
    { path: 'login',  component: LoginComponent, canActivate: [LoginRedirect] },
    { path: 'logout',  component: LogoutComponent, canActivate: [EnsureAuthenticated] },
    { path: 'reset',  component: ResetComponent, canActivate: [EnsureAuthenticated] },
    { path: 'inicio',  component: InicioComponent},//, canActivate: [WorkflowGuard] },
	{ path: 'dashboard',  component: DashboardComponent, canActivate: [EnsureAuthenticated] },
	{ path: 'nuevo',  component: NuevoComponent, canActivate: [EnsureAuthenticated] },
		{ path: 'personales',  component: PersonalesComponent, canActivate: [EnsureAuthenticated] },
		{ path: 'contacto',  component: ContactoComponent, canActivate: [EnsureAuthenticated] },
		{ path: 'hcp',  component: HcpComponent, canActivate: [EnsureAuthenticated] },
			{ path: 'alergias',  component: AlergiaComponent, canActivate: [EnsureAuthenticated] },
			{ path: 'medicamentos',  component: MedicamentoComponent, canActivate: [EnsureAuthenticated] },
			{ path: 'bioquimica',  component: BioquimicaComponent, canActivate: [EnsureAuthenticated] },
			{ path: 'hcp-otros',  component: OtrosComponent, canActivate: [EnsureAuthenticated] },
		{ path: 'hcf',  component: HcfComponent, canActivate: [EnsureAuthenticated] },
		{ path: 'objetivo',  component: ObjetivoComponent, canActivate: [EnsureAuthenticated] },
		{ path: 'habito',  component: HabitoComponent, canActivate: [EnsureAuthenticated] },
			{ path: 'actividad',  component: ActividadFisicaComponent, canActivate: [EnsureAuthenticated] },
			{ path: 'valoracion-dietetica',  component: ValoracionDieteticaComponent, canActivate: [EnsureAuthenticated] },
			{ path: 'gustos',  component: GustosComponent, canActivate: [EnsureAuthenticated] },
			{ path: 'otros',  component: OtrosHabitosComponent, canActivate: [EnsureAuthenticated] },
	
    { path: 'control',  component: ControlComponent, canActivate: [EnsureAuthenticated] },
		{ path: 'valoracion',  component: ValoracionComponent, canActivate: [EnsureAuthenticated] },
		{ path: 'recomendacion',  component: RecomendacionComponent, canActivate: [EnsureAuthenticated] },
		{ path: 'dieta',  component: DietaComponent, canActivate: [EnsureAuthenticated] },	
			{ path: 'prescripcion',  component: DietaComponent, canActivate: [EnsureAuthenticated] },	
			{ path: 'patron-menu',  component: PatronmenuComponent, canActivate: [EnsureAuthenticated] },	
			{ path: 'notas',  component: NotasComponent, canActivate: [EnsureAuthenticated] },	
	
    { path: 'agenda',  component: AgendaComponent, canActivate: [EnsureAuthenticated] },
	//{ path: '',   redirectTo: '/inicio', pathMatch: 'full' },
	{ path: '',   redirectTo: '/login', pathMatch: 'full' },

/*	
	// 1st Route
    { path: 'personal',  component: PersonalComponent, canActivate: [EnsureAuthenticated] },
    // 2nd Route
    { path: 'work',  component: WorkComponent, canActivate: [WorkflowGuard] },
    // 3rd Route
    { path: 'address',  component: AddressComponent, canActivate: [WorkflowGuard] },
    // 4th Route
    { path: 'result',  component: ResultComponent, canActivate: [WorkflowGuard] },
    // 5th Route
    { path: '',   redirectTo: '/personal', pathMatch: 'full' },
*/
    // 6th Route
    { path: '**',  component: InicioComponent},
];
/*, { useHash: true}*/
@NgModule({
  imports: [RouterModule.forRoot(appRoutes )],
  exports: [RouterModule],
  //providers: [WorkflowGuard]
  providers: [
    AuthService,
    EnsureAuthenticated,
    LoginRedirect
  ]
})

export class AppRoutingModule {}