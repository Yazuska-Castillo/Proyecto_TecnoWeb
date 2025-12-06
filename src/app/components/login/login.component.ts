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

  datosLogin = {
    email: '',
    contrasena: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    const loginUser = new Login(
      this.datosLogin.email,
      this.datosLogin.contrasena
    );

    this.authService.login(loginUser).subscribe((ok) => {
      if (!ok) {
        alert('Credenciales incorrectas.');
        return;
      }

      const rol = this.authService.getRol();

      if (rol === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/cliente/hoteles']);  // ✅ AQUÍ EL CAMBIO
      }
    });
  }
}
