import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RipsFormComponent } from './rips-form/rips-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConsultasComponent } from './consultas/consultas.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RipsJsonComponent } from './rips-json/rips-json.component';
import { HttpClientModule } from '@angular/common/http';
import { CiudadesService } from './ciudades.service';
import { DataGeneralService } from './data-general.service';
import { ProcedimientosComponent } from './procedimientos/procedimientos.component';


@NgModule({
  declarations: [
    AppComponent,
    RipsFormComponent,
    ConsultasComponent,
    RipsJsonComponent,
    ProcedimientosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [CiudadesService, DataGeneralService],
  bootstrap: [AppComponent]
})
export class AppModule { }
