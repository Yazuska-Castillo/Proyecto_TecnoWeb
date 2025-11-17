import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  // Datos del formulario
  datosRegistro = {
    nombre: '',
    usuario: '',
    contrasena: '',
    confirmarContrasena: '',
  };

  constructor(
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  registrar() {
    // Validar contraseñas
    if (
      this.datosRegistro.contrasena !== this.datosRegistro.confirmarContrasena
    ) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Validar campos vacíos
    if (
      !this.datosRegistro.nombre ||
      !this.datosRegistro.usuario ||
      !this.datosRegistro.contrasena
    ) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    // Crear usuario
    const nuevo = new Usuario(
      this.datosRegistro.nombre,
      this.datosRegistro.usuario,
      this.datosRegistro.contrasena
    );

    // Guardar usuario
    const ok = this.usuariosService.registrarUsuario(nuevo);

    if (!ok) {
      alert('Este usuario ya existe.');
      return;
    }

    alert('Cuenta creada. Ahora inicia sesión.');
    this.router.navigate(['/login']);
  }
}
