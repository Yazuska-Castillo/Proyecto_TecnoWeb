import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { GestionPromocionesComponent } from './components/gestion-promociones/gestion-promociones.component';
import { GestionHotelesComponent } from './components/Admin/gestion-hoteles/gestion-hoteles.component';
import { CatalogoHabitacionesComponent } from './components/habitaciones/catalogo-habitaciones/catalogo-habitaciones.component';
import { DetalleHabitacionComponent } from './components/habitaciones/detalle-habitacion/detalle-habitacion.component';
import { PanelClienteComponent } from './components/cliente/panel-cliente/panel-cliente.component';
import { HistorialReservasComponent } from './components/cliente/historial-reservas/historial-reservas.component';
import { GestionHabitacionesComponent } from './components/Admin/gestion-habitaciones/gestion-habitaciones.component';
import { CatalogoHotelesComponent } from './components/cliente/catalogo-hoteles/catalogo-hoteles.component';
import { HabitacionesHotelComponent } from './components/cliente/habitaciones-hotel/habitaciones-hotel.component';
import { ReservaClienteComponent } from './components/cliente/reserva-cliente/reserva-cliente.component';
// Guards
import { protectGuard } from './guards/guard.guard';
import { adminGuard } from './guards/admin.guard';
import { redireccionarComponent } from './components/redireccionar/redireccionar.component';

const routes: Routes = [
  // Publicas
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ---------------- CLIENTE ----------------
  /*{
    path: 'catalogo',
    component: CatalogoHabitacionesComponent,
    canActivate: [protectGuard],
  },

  {
    path: 'habitacion/:id',
    component: DetalleHabitacionComponent,
    canActivate: [protectGuard],
  },*/

  {
    path: 'cliente',
    component: PanelClienteComponent,
    canActivate: [protectGuard],
    children: [
      { path: 'historial', component: HistorialReservasComponent },
      { path: '', redirectTo: 'historial', pathMatch: 'full' },
    ],
  },

  {
    path: 'cliente/datos',
    component: GestionPromocionesComponent,
    canActivate: [protectGuard],
  },

  {
  path: 'cliente/hoteles',
  component: CatalogoHotelesComponent,
  canActivate: [protectGuard],
},
{
  path: 'cliente/habitaciones',
  component: HabitacionesHotelComponent,
  canActivate: [protectGuard],
},
{
  path: 'cliente/reserva',
  component: ReservaClienteComponent,
  canActivate: [protectGuard],
},


  // ---------------- ADMIN ----------------
  {
    path: 'admin',
    component: GestionHotelesComponent,
    canActivate: [protectGuard, adminGuard],
  },

  {
    path: 'gestion-promociones',
    component: GestionPromocionesComponent,
    canActivate: [protectGuard, adminGuard],
  },
  { 
    path: 'admin/habitaciones',
    component: GestionHabitacionesComponent,
    canActivate: [protectGuard, adminGuard],
  },
  // Ruta no encontrada
  { path: '**', component: redireccionarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
