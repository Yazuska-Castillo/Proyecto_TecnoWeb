import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // 1. Creamos un objeto para guardar los datos del formulario
  datosLogin = {
    usuario: '',
    contrasena: ''
  };

  // 2. Inyectamos el Router para poder navegar después del login
  constructor(private router: Router) { }

  // 3. Esta es la función que se llama desde el formulario
  login() {
    console.log('Datos enviados:', this.datosLogin);

    // --- AQUÍ VA TU LÓGICA DE VALIDACIÓN ---
    // Por ahora, solo validaremos que no estén vacíos

    if (this.datosLogin.usuario === 'admin' && this.datosLogin.contrasena === '1234') {
      // Si el login es correcto
      console.log('¡Login exitoso!');
      
      // Navegamos a la página de gestión de hoteles
      this.router.navigate(['/gestion-hoteles']);

    } else {
      // Si el login falla
      console.log('Usuario o contraseña incorrectos.');
      alert('Error: Usuario o contraseña incorrectos.');
    }
  }

}