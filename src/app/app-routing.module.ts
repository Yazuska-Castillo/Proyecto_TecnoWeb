import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { RegistroComponent } from './components/cliente/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { GestionPromocionesComponent } from './components/Admin/gestion-promociones/gestion-promociones.component';
import { GestionHotelesComponent } from './components/Admin/gestion-hoteles/gestion-hoteles.component';
import { PanelClienteComponent } from './components/cliente/panel-cliente/panel-cliente.component';
import { HistorialReservasComponent } from './components/cliente/historial-reservas/historial-reservas.component';
import { GestionHabitacionesComponent } from './components/Admin/gestion-habitaciones/gestion-habitaciones.component';
import { CatalogoHotelesComponent } from './components/cliente/catalogo-hoteles/catalogo-hoteles.component';
import { HabitacionesHotelComponent } from './components/cliente/habitaciones-hotel/habitaciones-hotel.component';
import { ReservaClienteComponent } from './components/cliente/reserva-cliente/reserva-cliente.component';
import { PantallaPrincipalComponent } from './components/pantalla-principal/pantalla-principal.component';
import { MapaHotelComponent } from './components/cliente/mapa-hotel/mapa-hotel.component';


import { protectGuard } from './guards/guard.guard';
import { adminGuard } from './guards/admin.guard';
import { redireccionarComponent } from './components/redireccionar/redireccionar.component';

const routes: Routes = [
  { path: '', component: PantallaPrincipalComponent },


  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },


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
    path: 'cliente/hoteles',
    component: CatalogoHotelesComponent,
  },

  {
    path: 'cliente/habitaciones',
    component: HabitacionesHotelComponent,
  },

  {
    path: 'cliente/reserva',
    component: ReservaClienteComponent,
    canActivate: [protectGuard],
  },


  {
    path: 'cliente/hoteles-mapa',
    component: MapaHotelComponent,
  },


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


  { path: '**', component: redireccionarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}