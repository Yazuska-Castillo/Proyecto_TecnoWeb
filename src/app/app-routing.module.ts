import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CatalogoHabitacionesComponent } from './components/habitaciones/catalogo-habitaciones/catalogo-habitaciones.component';
import { DetalleHabitacionComponent } from './components/habitaciones/detalle-habitacion/detalle-habitacion.component';
import { PanelClienteComponent } from './components/cliente/panel-cliente/panel-cliente.component';
import { HistorialReservasComponent } from './components/cliente/historial-reservas/historial-reservas.component';

const routes: Routes = [
  { path: '', component: CatalogoHabitacionesComponent },
  { path: 'habitacion/:id', component: DetalleHabitacionComponent },
  {
    path: 'cliente',
    component: PanelClienteComponent,
    children: [
      { path: 'historial', component: HistorialReservasComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
