import { NgModule }           from '@angular/core';
import { BrowserModule }      from '@angular/platform-browser';
import { HttpModule} from '@angular/http';
import { FormsModule }        from '@angular/forms';

/* App Root */
import { AppComponent }       from './app.component';
import { NavbarComponent }    from './navbar/navbar.component';

/* Feature Components */
import { PersonalComponent }  from './personal/personal.component';
import { WorkComponent }      from './work/work.component';
import { AddressComponent }   from './address/address.component';
import { ResultComponent }    from './result/result.component';

/* Routing Module */
import { AppRoutingModule }   from './app-routing.module';

/* Shared Service */
import { FormControlDataService }    from './control/data/formControlData.service';
import { FormDataService }    from './data/formData.service';
import { WorkflowService }    from './workflow/workflow.service';
import { InicioComponent } from './inicio/inicio.component';
import { ControlComponent } from './control/control.component';
import { AgendaComponent } from './agenda/agenda.component';
import { SidebarComponent } from './control/sidebar/sidebar.component';
import { ControlNavComponent } from './control/control-nav/control-nav.component';
import { ValoracionComponent } from './control/valoracion/valoracion.component';
import { GrasaComponent }      from './control/grasa/grasa.component';
import { RecomendacionComponent } from './control/recomendacion/recomendacion.component';
import { DietaComponent } from './control/dieta/dieta.component';
import { TopnavComponent } from './topnav/topnav.component';
import { NuevoComponent } from './nuevo/nuevo.component';
import { PersonalesComponent } from './nuevo/personales/personales.component';
import { ContactoComponent } from './nuevo/contacto/contacto.component';
import { HcpComponent } from './nuevo/hcp/hcp.component';
import { HcfComponent } from './nuevo/hcf/hcf.component';
import { ObjetivoComponent } from './nuevo/objetivo/objetivo.component';
import { HabitoComponent } from './nuevo/habito/habito.component';
import { NuevoNavComponent } from './nuevo/nuevo-nav/nuevo-nav.component';
import { ControlNavCenterComponent } from './control/control-nav/control-nav-center.component';
import { PrescripcionComponent } from './control/dieta/prescripcion/prescripcion.component';
import { PatronmenuComponent } from './control/dieta/patronmenu/patronmenu.component';
import { NotasComponent } from './control/dieta/notas/notas.component';
import { DietaNavComponent } from './control/dieta/dieta-nav/dieta-nav.component';
import { HcpNavComponent } from './nuevo/hcp/hcp-nav/hcp-nav.component';
import { PatologiaComponent } from './nuevo/hcp/patologia/patologia.component';
import { AlergiaComponent } from './nuevo/hcp/alergia/alergia.component';
import { MedicamentoComponent } from './nuevo/hcp/medicamento/medicamento.component';
import { BioquimicaComponent } from './nuevo/hcp/bioquimica/bioquimica.component';
import { OtrosComponent } from './nuevo/hcp/otros/otros.component';
import { ActividadFisicaComponent } from './nuevo/habito/actividad-fisica/actividad-fisica.component';
import { ValoracionDieteticaComponent } from './nuevo/habito/valoracion-dietetica/valoracion-dietetica.component';
import { GustosComponent } from './nuevo/habito/gustos/gustos.component';
import { OtrosHabitosComponent } from './nuevo/habito/otros-habitos/otros-habitos.component';
import { HabitoNavComponent } from './nuevo/habito/habito-nav/habito-nav.component';
import { LoginComponent } from './login/login.component';
import { ResetComponent } from './login/reset.component';
import { ModalComponent } from './modal/modal.component';
import { ModalPatronmenuComponent } from './control/dieta/patronmenu/modal-patronmenu/modal-patronmenu.component';
import { NavModalComponent } from './control/nav-modal/nav-modal.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SelectEjercicioComponent } from './nuevo/habito/select-ejercicio/select-ejercicio.component';

@NgModule({
    imports:      [ BrowserModule, 
                    FormsModule,
					 HttpModule,
                    AppRoutingModule
                  ],
    providers:    [
                   { provide: FormControlDataService, useClass: FormControlDataService },
				   { provide: FormDataService, useClass: FormDataService },
                   { provide: WorkflowService, useClass: WorkflowService },],
    declarations: [ AppComponent, NavbarComponent, PersonalComponent, WorkComponent, AddressComponent, ResultComponent, InicioComponent, ControlComponent, AgendaComponent, SidebarComponent, ControlNavComponent, ValoracionComponent, GrasaComponent, RecomendacionComponent, DietaComponent, TopnavComponent, NuevoComponent, PersonalesComponent, ContactoComponent, HcpComponent, HcfComponent, ObjetivoComponent, HabitoComponent, NuevoNavComponent, ControlNavCenterComponent, PrescripcionComponent, PatronmenuComponent, NotasComponent, DietaNavComponent, HcpNavComponent, PatologiaComponent, AlergiaComponent, MedicamentoComponent, BioquimicaComponent, OtrosComponent, ActividadFisicaComponent, ValoracionDieteticaComponent, GustosComponent, OtrosHabitosComponent, HabitoNavComponent, LoginComponent, ResetComponent, ModalComponent, ModalPatronmenuComponent, NavModalComponent, NavigationComponent, SelectEjercicioComponent ],
    bootstrap:    [ AppComponent ]
})

export class AppModule {}