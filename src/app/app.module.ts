import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PanelClienteComponent } from './components/cliente/panel-cliente/panel-cliente.component';
import { HistorialReservasComponent } from './components/cliente/historial-reservas/historial-reservas.component';
import { GestionHotelesComponent } from './components/Admin/gestion-hoteles/gestion-hoteles.component';
import { GestionPromocionesComponent } from './components/Admin/gestion-promociones/gestion-promociones.component';
import { LoginComponent } from './components/login/login.component';
import { GestionHabitacionesComponent } from './components/Admin/gestion-habitaciones/gestion-habitaciones.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistroComponent } from './components/cliente/registro/registro.component';
import { redireccionarComponent } from './components/redireccionar/redireccionar.component';
import { CatalogoHotelesComponent } from './components/cliente/catalogo-hoteles/catalogo-hoteles.component';
import { HabitacionesHotelComponent } from './components/cliente/habitaciones-hotel/habitaciones-hotel.component';
import { ReservaClienteComponent } from './components/cliente/reserva-cliente/reserva-cliente.component';
import { PantallaPrincipalComponent } from './components/pantalla-principal/pantalla-principal.component';
import { MapaHotelComponent } from './components/cliente/mapa-hotel/mapa-hotel.component';

@NgModule({
  declarations: [
    AppComponent,
    PanelClienteComponent,
    HistorialReservasComponent,
    GestionHotelesComponent,
    GestionPromocionesComponent,
    LoginComponent,
    RegistroComponent,
    redireccionarComponent,
    GestionHabitacionesComponent,
    CatalogoHotelesComponent,
    HabitacionesHotelComponent,
    ReservaClienteComponent,
    PantallaPrincipalComponent,
    MapaHotelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PanelClienteComponent } from './components/cliente/panel-cliente/panel-cliente.component';
import { HistorialReservasComponent } from './components/cliente/historial-reservas/historial-reservas.component';
import { GestionHotelesComponent } from './components/Admin/gestion-hoteles/gestion-hoteles.component';
import { GestionPromocionesComponent } from './components/Admin/gestion-promociones/gestion-promociones.component';
import { LoginComponent } from './components/login/login.component';
import { GestionHabitacionesComponent } from './components/Admin/gestion-habitaciones/gestion-habitaciones.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistroComponent } from './components/cliente/registro/registro.component';
import { redireccionarComponent } from './components/redireccionar/redireccionar.component';
import { CatalogoHotelesComponent } from './components/cliente/catalogo-hoteles/catalogo-hoteles.component';
import { HabitacionesHotelComponent } from './components/cliente/habitaciones-hotel/habitaciones-hotel.component';
import { ReservaClienteComponent } from './components/cliente/reserva-cliente/reserva-cliente.component';
import { PantallaPrincipalComponent } from './components/pantalla-principal/pantalla-principal.component';

@NgModule({
  declarations: [
    AppComponent,
    PanelClienteComponent,
    HistorialReservasComponent,
    GestionHotelesComponent,
    GestionPromocionesComponent,
    LoginComponent,
    RegistroComponent,
    redireccionarComponent,
    GestionHabitacionesComponent,
    CatalogoHotelesComponent,
    HabitacionesHotelComponent,
    ReservaClienteComponent,
    PantallaPrincipalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
