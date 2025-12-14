import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css'],
})
export class ConfiguracionComponent implements OnInit {
  seccion: 'perfil' | 'ajustes' = 'perfil';

  usuario: any = null;
  emailActual: string | null = null;

  passwordActual = '';
  nuevaPassword = '';
  confirmarPassword = '';

  temaOscuro = false;

  error = '';
  exito = '';

  constructor(
    private auth: AuthService,
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.emailActual = this.auth.getEmailDesdeToken();

    if (!this.emailActual) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = this.usuariosService.buscarUsuarioPorEmail(this.emailActual);

    if (!this.usuario) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return;
    }

    this.temaOscuro = localStorage.getItem('tema') === 'oscuro';
  }

  cambiarSeccion(valor: 'perfil' | 'ajustes') {
    this.seccion = valor;
    this.error = '';
    this.exito = '';
  }

  cambiarPassword() {
    this.error = '';
    this.exito = '';

    if (
      !this.passwordActual ||
      !this.nuevaPassword ||
      !this.confirmarPassword
    ) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }

    if (this.nuevaPassword.length < 8) {
      this.error = 'La nueva contraseña debe tener al menos 8 caracteres.';
      return;
    }

    if (this.nuevaPassword !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    const hashActual = CryptoService.hashPassword(this.passwordActual);

    if (hashActual !== this.usuario.passwordHash) {
      this.error = 'La contraseña actual es incorrecta.';
      return;
    }

    this.usuario.passwordHash = CryptoService.hashPassword(this.nuevaPassword);
    this.usuariosService.actualizarUsuario(this.usuario);

    this.exito =
      'Contraseña cambiada correctamente. Debes iniciar sesión nuevamente.';

    setTimeout(() => {
      this.auth.logout();
      this.router.navigate(['/login']);
    }, 1500);
  }

  eliminarCuenta() {
    const confirmado = confirm(
      '¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.'
    );

    if (!confirmado || !this.emailActual) return;

    this.usuariosService.eliminarUsuarioPorEmail(this.emailActual);
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleTema() {
    this.temaOscuro = !this.temaOscuro;

    if (this.temaOscuro) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('tema', 'oscuro');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('tema', 'claro');
    }
  }
}
