import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from '../../models/login';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // Datos formulario
  datosLogin = {
    usuario: '',
    contrasena: '',
  };

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    const loginUser = new Login(
      this.datosLogin.usuario,
      this.datosLogin.contrasena
    );

    // Intentar login
    this.authService.login(loginUser).subscribe((ok) => {
      if (!ok) {
        alert('Credenciales incorrectas.');
        return;
      }

      // Obtener rol
      const rol = this.authService.getRol();

      // Redirigir según rol
      if (rol === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/catalogo']);
      }
    });
  }
}
