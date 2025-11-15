import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  datosLogin = {
    usuario: '',
    contrasena: ''
  };
  
  // Variable para la casilla
  esAdmin: boolean = false; 

  constructor(private router: Router) {}
  
  login() {
    
    console.log('Botón "Ingresar" presionado.');
    console.log('Valor final de esAdmin:', this.esAdmin);

    if (this.esAdmin) {
      // Si es TRUE
      console.log('Redirigiendo a /admin');
      this.router.navigate(['/admin']);
    } else {
      // Si es FALSE
      console.log('Redirigiendo a /catalogo (cliente)');
      this.router.navigate(['/catalogo']);
    }
  }
}
