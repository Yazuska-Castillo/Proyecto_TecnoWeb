import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionHotelesComponent } from './components/Admin/gestion-hoteles/gestion-hoteles.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'gestion-hoteles', component: GestionHotelesComponent },
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
