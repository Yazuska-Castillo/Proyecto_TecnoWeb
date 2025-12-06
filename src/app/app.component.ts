import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UsuariosService } from './services/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  
  // 💥 Esta línea ES LA SOLUCIÓN:
  constructor(
    public auth: AuthService, 
    public router: Router,
    private usuariosService: UsuariosService   // <<--- AQUI
  ) {}

  cerrarSesion() {
    this.auth.logout();
    localStorage.removeItem('usuarioActual');
    window.location.href = '/login';
  }
}
