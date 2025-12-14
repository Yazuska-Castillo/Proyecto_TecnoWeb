import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UsuariosService } from './services/usuarios.service';
import { Dropdown } from 'bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(public auth: AuthService, public router: Router) {}

  cerrarSesion() {
    this.auth.logout();
    window.location.href = '/login';
  }
}
