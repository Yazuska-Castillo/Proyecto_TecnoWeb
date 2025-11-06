import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  //investigar

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CatalogoHabitacionesComponent } from './components/habitaciones/catalogo-habitaciones/catalogo-habitaciones.component';
import { DetalleHabitacionComponent } from './components/habitaciones/detalle-habitacion/detalle-habitacion.component';
import { PanelClienteComponent } from './components/cliente/panel-cliente/panel-cliente.component';
import { HistorialReservasComponent } from './components/cliente/historial-reservas/historial-reservas.component';

@NgModule({
  declarations: [
    AppComponent,
    CatalogoHabitacionesComponent,
    DetalleHabitacionComponent,
    PanelClienteComponent,
    HistorialReservasComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule  //investigar
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
