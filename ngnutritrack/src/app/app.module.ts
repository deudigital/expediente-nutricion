import { NgModule }           from '@angular/core';
import { BrowserModule }      from '@angular/platform-browser';
import { HttpModule} from '@angular/http';
import { FormsModule }        from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import { CurrencyMaskModule } from "ng2-currency-mask";

/* App Root */
import { AppComponent }       from './app.component';

/* Routing Module */
import { AppRoutingModule }   from './app-routing.module';

/* Shared Service */
import { FormControlDataService }    from './control/data/formControlData.service';

import { InicioComponent } from './inicio/inicio.component';
import { ControlComponent } from './control/control.component';
import { AgendaComponent } from './agenda/agenda.component';

import { ControlNavComponent } from './control/control-nav/control-nav.component';
import { TopnavComponent } from './topnav/topnav.component';
import { NuevoNavComponent } from './nuevo/nuevo-nav/nuevo-nav.component';
import { ControlNavCenterComponent } from './control/control-nav/control-nav-center.component';
import { DietaNavComponent } from './control/dieta/dieta-nav/dieta-nav.component';
import { HabitoNavComponent } from './nuevo/habito/habito-nav/habito-nav.component';

import { ModalPatronmenuComponent } from './control/dieta/patronmenu/modal-patronmenu/modal-patronmenu.component';

import { NuevoComponent } from './nuevo/nuevo.component';
import { PersonalesComponent } from './nuevo/personales/personales.component';
import { ContactoComponent } from './nuevo/contacto/contacto.component';
import { HcpComponent } from './nuevo/hcp/hcp.component';
import { HcfComponent } from './nuevo/hcf/hcf.component';
import { ObjetivoComponent } from './nuevo/objetivo/objetivo.component';
import { HabitoComponent } from './nuevo/habito/habito.component';

import { ValoracionComponent } from './control/valoracion/valoracion.component';

import { RecomendacionComponent } from './control/recomendacion/recomendacion.component';
import { DietaComponent } from './control/dieta/dieta.component';
import { PrescripcionComponent } from './control/dieta/prescripcion/prescripcion.component';
import { PatronmenuComponent } from './control/dieta/patronmenu/patronmenu.component';
import { NotasComponent } from './control/dieta/notas/notas.component';

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


import { LoginComponent } from './login/login.component';
import { ResetComponent } from './login/reset.component';

import { NavigationComponent } from './navigation/navigation.component';

import { DataTableModule } from 'angular-4-data-table';
import { LineChartComponent } from './charts/linechart.component';

import { GoogleComboChartService } from './services/google-combo-chart.service';
import { GooglePieChartService } from './services/google-pie-chart.service';
import { GoogleLineChartService } from './services/google-line-chart.service';

import { AuthService } from './services/auth.service';
import { EnsureAuthenticated } from './services/ensure-authenticated.service';
import { LoginRedirect } from './services/login-redirect.service';
import { LogoutComponent } from './login/logout.component';

import { FileUploadComponent } from './file-upload/file-upload.component';
import {FileService} from './services/file.service';

@NgModule({
    imports:      [ BrowserModule, 
                    FormsModule,
					 HttpModule,
					DataTableModule,
                    AppRoutingModule,
                    MyDatePickerModule,
					CurrencyMaskModule
                  ],
    providers:    [
                   { provide: FormControlDataService, useClass: FormControlDataService },
                   { provide: GoogleComboChartService, useClass: GoogleComboChartService },
                   { provide: GooglePieChartService, useClass: GooglePieChartService },
                   { provide: GoogleLineChartService, useClass: GoogleLineChartService },
                   { provide: AuthService, useClass: AuthService },
                   { provide: EnsureAuthenticated, useClass: EnsureAuthenticated },
                   { provide: LoginRedirect, useClass: LoginRedirect },
                   { provide: FileService, useClass: FileService },
				   ],
    declarations: [ AppComponent, InicioComponent, ControlComponent, AgendaComponent, ControlNavComponent, ValoracionComponent, RecomendacionComponent, DietaComponent, TopnavComponent, NuevoComponent, PersonalesComponent, ContactoComponent, HcpComponent, HcfComponent, ObjetivoComponent, HabitoComponent, NuevoNavComponent, ControlNavCenterComponent, PatronmenuComponent, PrescripcionComponent, NotasComponent, DietaNavComponent, HcpNavComponent, PatologiaComponent, AlergiaComponent, MedicamentoComponent, BioquimicaComponent, OtrosComponent, ActividadFisicaComponent, ValoracionDieteticaComponent, GustosComponent, OtrosHabitosComponent, HabitoNavComponent, LoginComponent, ResetComponent, ModalPatronmenuComponent, NavigationComponent, LogoutComponent, LineChartComponent, FileUploadComponent ],
    bootstrap:    [ AppComponent ]
})

export class AppModule {}