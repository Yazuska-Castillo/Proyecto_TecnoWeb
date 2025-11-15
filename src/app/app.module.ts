import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CatalogoHabitacionesComponent } from './components/habitaciones/catalogo-habitaciones/catalogo-habitaciones.component';
import { DetalleHabitacionComponent } from './components/habitaciones/detalle-habitacion/detalle-habitacion.component';
import { PanelClienteComponent } from './components/cliente/panel-cliente/panel-cliente.component';
import { HistorialReservasComponent } from './components/cliente/historial-reservas/historial-reservas.component';
import { GestionHotelesComponent } from './components/Admin/gestion-hoteles/gestion-hoteles.component';
import { GestionPromocionesComponent } from './components/gestion-promociones/gestion-promociones.component';
import { LoginComponent } from './components/login/login.component';
import { GestionHabitacionesComponent } from './components/Admin/gestion-habitaciones/gestion-habitaciones.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistroComponent } from './components/registro/registro.component';

@NgModule({
  declarations: [
    AppComponent,
    CatalogoHabitacionesComponent,
    DetalleHabitacionComponent,
    PanelClienteComponent,
    HistorialReservasComponent,
    GestionHotelesComponent,
    GestionPromocionesComponent,
    LoginComponent,
    GestionHabitacionesComponent,
    RegistroComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, NgbModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}