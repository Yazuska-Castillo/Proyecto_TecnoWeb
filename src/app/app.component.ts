import { Component } from '@angular/core';
import { GestionPromocionesComponent } from './components/gestion-promociones/gestion-promociones.component';
import { UsuariosService } from './services/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Proyecto_TecnoWeb';
  constructor(private usuariosService: UsuariosService) {}
}
