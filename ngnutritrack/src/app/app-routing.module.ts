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


import { AgendaComponent }      from './agenda/agenda.component';
import { ReporteFacturaComponent } from './reporte-factura/reporte-factura.component';
import { ServiciosProductosComponent } from './servicios-productos/servicios-productos.component';
import { ConsultasSinFacturarComponent } from './reporte-factura/consultas-sin-facturar/consultas-sin-facturar.component';
import { ConfigFacturaComponent } from './config-factura/config-factura.component';
/*
import { WorkflowGuard }        from './workflow/workflow-guard.service';
import { WorkflowService }      from './workflow/workflow.service';
*/

export const appRoutes: Routes = [
    
    { path: 'login',  component: LoginComponent },
    { path: 'reset',  component: ResetComponent },
    { path: 'inicio',  component: InicioComponent},//, canActivate: [WorkflowGuard] },

	{ path: 'nuevo',  component: NuevoComponent},	
		{ path: 'personales',  component: PersonalesComponent},
		{ path: 'contacto',  component: ContactoComponent},
		{ path: 'hcp',  component: HcpComponent},
			{ path: 'alergias',  component: AlergiaComponent},
			{ path: 'medicamentos',  component: MedicamentoComponent},
			{ path: 'bioquimica',  component: BioquimicaComponent},
			{ path: 'hcp-otros',  component: OtrosComponent},
		{ path: 'hcf',  component: HcfComponent},
		{ path: 'objetivo',  component: ObjetivoComponent},
		{ path: 'habito',  component: HabitoComponent},
			{ path: 'actividad',  component: ActividadFisicaComponent},
			{ path: 'valoracion-dietetica',  component: ValoracionDieteticaComponent},
			{ path: 'gustos',  component: GustosComponent},
			{ path: 'otros',  component: OtrosHabitosComponent},
	
    { path: 'control',  component: ControlComponent },
		{ path: 'valoracion',  component: ValoracionComponent },
		{ path: 'recomendacion',  component: RecomendacionComponent },
		{ path: 'dieta',  component: DietaComponent },	
			{ path: 'prescripcion',  component: DietaComponent },	
			{ path: 'patron-menu',  component: PatronmenuComponent },	
			{ path: 'notas',  component: NotasComponent },	
	
    { path: 'agenda',  component: AgendaComponent },
    { path: 'reportes', component: ReporteFacturaComponent },
    { path: 'servicios-productos', component: ServiciosProductosComponent },
    { path: 'sinfacturar', component: ConsultasSinFacturarComponent },
    { path: 'config-factura', component: ConfigFacturaComponent },
    //{ path: 'servicios-productos', component: servicios-productos },
	{ path: '',   redirectTo: '/inicio', pathMatch: 'full' },

/*	
	// 1st Route
    { path: 'personal',  component: PersonalComponent },
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
    { path: '**', component: InicioComponent }
];
/*, { useHash: true}*/
@NgModule({
  imports: [RouterModule.forRoot(appRoutes )],
  exports: [RouterModule],
  //providers: [WorkflowGuard]
})

export class AppRoutingModule {}