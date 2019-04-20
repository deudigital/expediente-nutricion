import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
import { LogoutComponent } from './login/logout.component';
import { ResetComponent } from './login/reset.component';


import { AgendaComponent }      from './agenda/agenda.component';
import { AgendaServiciosComponent }      from './agenda/agenda-servicios/agenda-servicios.component';
import { RecepcionComponent }      from './recepcion/recepcion.component';
import { ReporteFacturaComponent } from './reporte-factura/reporte-factura.component';
import { ReporteRecepcionComponent } from './reporte-recepcion/reporte-recepcion.component';
import { ServiciosProductosComponent } from './servicios-productos/servicios-productos.component';
import { ConsultasSinFacturarComponent } from './reporte-factura/consultas-sin-facturar/consultas-sin-facturar.component';
import { ConfigFacturaComponent } from './facturacion/config-factura/config-factura.component';

import { AuthService } from './services/auth.service';
import { EnsureAuthenticated } from './services/ensure-authenticated.service';
import { LoginRedirect } from './services/login-redirect.service';

export const appRoutes: Routes = [
    { path: 'login',  component: LoginComponent, canActivate: [LoginRedirect] },
    { path: 'logout',  component: LogoutComponent, canActivate: [EnsureAuthenticated] },
    { path: 'reset',  component: ResetComponent, canActivate: [EnsureAuthenticated] },
    { path: 'inicio',  component: InicioComponent, canActivate: [EnsureAuthenticated] },
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
    { path: 'agenda-servicios',  component: AgendaServiciosComponent, canActivate: [EnsureAuthenticated] },
    { path: 'recepcion',  component: RecepcionComponent, canActivate: [EnsureAuthenticated] },
	{ path: 'reportes-recepcion', component: ReporteRecepcionComponent, canActivate: [EnsureAuthenticated] },
	{ path: 'reportes', component: ReporteFacturaComponent, canActivate: [EnsureAuthenticated] },
    { path: 'servicios-productos', component: ServiciosProductosComponent, canActivate: [EnsureAuthenticated] },
    { path: 'sinfacturar', component: ConsultasSinFacturarComponent, canActivate: [EnsureAuthenticated] },
    { path: 'config-factura', component: ConfigFacturaComponent, canActivate: [EnsureAuthenticated] },
	{ path: '',   redirectTo: '/login', pathMatch: 'full' },
    { path: '**', component: InicioComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes )],
  exports: [RouterModule]
})

export class AppRoutingModule {}
