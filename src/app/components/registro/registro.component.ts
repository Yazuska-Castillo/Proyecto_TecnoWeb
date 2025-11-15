import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importamos Router

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  // 1. Objeto para guardar los datos del formulario de registro
  datosRegistro = {
    nombre: '',
    usuario: '',
    contrasena: '',
    confirmarContrasena: ''
  };

  // 2. Inyectamos el Router
  constructor(private router: Router) { }

  // 3. Función que se llama al enviar el formulario
  registrar() {
    console.log('Datos de registro:', this.datosRegistro);

    // --- Validación básica ---

    // A. Validar que las contraseñas coincidan
    if (this.datosRegistro.contrasena !== this.datosRegistro.confirmarContrasena) {
      alert('Error: Las contraseñas no coinciden.');
      return; // Detiene la función
    }

    // B. (Opcional) Validar que los campos no estén vacíos
    if (!this.datosRegistro.nombre || !this.datosRegistro.usuario || !this.datosRegistro.contrasena) {
      alert('Error: Todos los campos son obligatorios.');
      return; // Detiene la función
    }

    // --- Si todo está bien ---
    console.log('¡Usuario registrado exitosamente!');
    
    // (AQUÍ ES DONDE LLAMARÍAS A TU API O BASE DE DATOS PARA GUARDAR AL USUARIO)
    
    // Mostramos un mensaje de éxito
    alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');

    // Redirigimos al usuario a la página de login
    this.router.navigate(['/login']);
  }
}
