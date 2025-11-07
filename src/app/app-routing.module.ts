import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionPromocionesComponent } from './components/gestion-promociones/gestion-promociones.component';

const routes: Routes = [
  { path: '', redirectTo: 'gestion-promociones', pathMatch: 'full' },
  { path: 'gestion-promociones', component: GestionPromocionesComponent },
  { path: '**', redirectTo: 'gestion-promociones' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
