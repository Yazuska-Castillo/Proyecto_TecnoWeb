import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { LoginComponent } from './components/login/login.component';
import { GestionPromocionesComponent } from './components/gestion-promociones/gestion-promociones.component';
import { GestionHotelesComponent } from './components/Admin/gestion-hoteles/gestion-hoteles.component';
import { CatalogoHabitacionesComponent } from './components/habitaciones/catalogo-habitaciones/catalogo-habitaciones.component';
import { DetalleHabitacionComponent } from './components/habitaciones/detalle-habitacion/detalle-habitacion.component';
import { PanelClienteComponent } from './components/cliente/panel-cliente/panel-cliente.component';
import { HistorialReservasComponent } from './components/cliente/historial-reservas/historial-reservas.component';
import { GestionHabitacionesComponent } from './components/Admin/gestion-habitaciones/gestion-habitaciones.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' }, //Ahora login es el principal, falta la autenticación

  // ---------------- CLIENTE ----------------
  { path: 'catalogo', component: CatalogoHabitacionesComponent },
  { path: 'habitacion/:id', component: DetalleHabitacionComponent },

  {
    path: 'cliente',
    component: PanelClienteComponent,
    children: [
      { path: 'historial', component: HistorialReservasComponent },
      { path: '', redirectTo: 'historial', pathMatch: 'full' },
    ],
  },
  { path: 'cliente/datos', component: GestionPromocionesComponent },

  // ---------------- ADMIN ----------------
  { path: 'admin', component: GestionHotelesComponent },
  { path: 'gestion-promociones', component: GestionPromocionesComponent },
  { path: 'admin/habitaciones', component: GestionHabitacionesComponent },

  // ---------------- ERRORES ----------------
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
