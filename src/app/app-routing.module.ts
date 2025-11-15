import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './components/registro/registro.component';

// Componentes
import { LoginComponent } from './components/login/login.component';
import { GestionPromocionesComponent } from './components/gestion-promociones/gestion-promociones.component';
import { GestionHotelesComponent } from './components/Admin/gestion-hoteles/gestion-hoteles.component';
import { CatalogoHabitacionesComponent } from './components/habitaciones/catalogo-habitaciones/catalogo-habitaciones.component';
import { DetalleHabitacionComponent } from './components/habitaciones/detalle-habitacion/detalle-habitacion.component';
import { PanelClienteComponent } from './components/cliente/panel-cliente/panel-cliente.component';
import { HistorialReservasComponent } from './components/cliente/historial-reservas/historial-reservas.component';

const routes: Routes = [
  // 1. Rutas principales
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  // 2. Ruta por defecto (si la URL está vacía, redirige a /login)
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 

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
  { path: 'cliente/datos', component: GestionPromocionesComponent }, // Esta ruta estaba duplicada, la dejé aquí

  // ---------------- ADMIN ----------------
  { path: 'admin', component: GestionHotelesComponent },
  { path: 'gestion-promociones', component: GestionPromocionesComponent },

  // ---------------- ERRORES ----------------
  // 3. La ruta comodín (**) SIEMPRE AL FINAL.
  // Si no coincide nada de lo anterior, redirige a /login.
  { path: '**', redirectTo: 'login' },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}