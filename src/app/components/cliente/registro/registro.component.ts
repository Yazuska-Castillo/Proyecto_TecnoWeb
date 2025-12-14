import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../../models/usuario';
import { UsuariosService } from '../../../services/usuarios.service';
import { CryptoService } from '../../../services/crypto.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  // Datos del formulario
  datosRegistro = {
    nombre: '',
    email: '',
    contrasena: '',
    confirmarContrasena: '',
  };

  // Errores por campo
  errores = {
    nombre: '',
    email: '',
    contrasena: '',
    confirmarContrasena: '',
  };

  // Validaciones de formato
  private regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/;
  private regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  constructor(
    private router: Router,
    private usuariosService: UsuariosService
  ) {}

  // Funciones para validaciones de cada campo (al perder foco)
  validarNombre() {
    if (!this.datosRegistro.nombre) {
      this.errores.nombre = 'El nombre es obligatorio.';
    } else if (!this.regexNombre.test(this.datosRegistro.nombre)) {
      this.errores.nombre = 'Debe tener entre 3 y 50 caracteres y solo letras.';
    } else {
      this.errores.nombre = '';
    }
  }

  validarEmail() {
    if (!this.datosRegistro.email) {
      this.errores.email = 'El correo es obligatorio.';
    } else if (!this.regexEmail.test(this.datosRegistro.email)) {
      this.errores.email = 'El correo no tiene un formato válido.';
    } else {
      this.errores.email = '';
    }
  }

  validarContrasena() {
    if (!this.datosRegistro.contrasena) {
      this.errores.contrasena = 'La contraseña es obligatoria.';
    } else if (!this.regexPassword.test(this.datosRegistro.contrasena)) {
      this.errores.contrasena =
        'Mínimo 8 caracteres, una mayúscula y un número.';
    } else {
      this.errores.contrasena = '';
    }
  }

  validarConfirmarContrasena() {
    if (!this.datosRegistro.confirmarContrasena) {
      this.errores.confirmarContrasena = 'Debe confirmar la contraseña.';
    } else if (
      this.datosRegistro.confirmarContrasena !== this.datosRegistro.contrasena
    ) {
      this.errores.confirmarContrasena = 'Las contraseñas no coinciden.';
    } else {
      this.errores.confirmarContrasena = '';
    }
  }

  registrar() {
    const { nombre, email, contrasena, confirmarContrasena } =
      this.datosRegistro;

    // Limpiar errores
    this.errores = {
      nombre: '',
      email: '',
      contrasena: '',
      confirmarContrasena: '',
    };

    let hayError = false;

    // Validar campos vacíos
    if (!nombre) {
      this.errores.nombre = 'El nombre es obligatorio.';
      hayError = true;
    }

    if (!email) {
      this.errores.email = 'El correo es obligatorio.';
      hayError = true;
    }

    if (!contrasena) {
      this.errores.contrasena = 'La contraseña es obligatoria.';
      hayError = true;
    }

    if (!confirmarContrasena) {
      this.errores.confirmarContrasena = 'Debe confirmar la contraseña.';
      hayError = true;
    }

    // Validar nombre
    if (nombre && !this.regexNombre.test(nombre)) {
      this.errores.nombre = 'Debe tener entre 3 y 50 caracteres y solo letras.';
      hayError = true;
    }

    // Validar correo
    if (email && !this.regexEmail.test(email)) {
      this.errores.email = 'El correo no tiene un formato válido.';
      hayError = true;
    }

    // Validar contraseña
    if (contrasena && !this.regexPassword.test(contrasena)) {
      this.errores.contrasena =
        'Mínimo 8 caracteres, una mayúscula y un número.';
      hayError = true;
    }

    // Confirmar contraseña
    if (
      contrasena &&
      confirmarContrasena &&
      contrasena !== confirmarContrasena
    ) {
      this.errores.confirmarContrasena = 'Las contraseñas no coinciden.';
      hayError = true;
    }

    if (hayError) return;

    // Crear usuario con HASH
    const nuevo = new Usuario(
      Date.now(),
      nombre,
      email,
      CryptoService.hashPassword(contrasena),
      'cliente'
    );

    // Registrar usuario
    const ok = this.usuariosService.registrarUsuario(nuevo);

    if (!ok) {
      this.errores.email = 'Este correo ya está registrado.';
      return;
    }

    this.router.navigate(['/login']);
  }
}
