import { Injectable } from '@angular/core';
import { Login } from '../models/login';
import { Observable, of } from 'rxjs';
import { Buffer } from 'buffer';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';

  // Credenciales del admin (COINCIDEN con usuarios-predefinidos.ts)
  private adminEmail = 'admin@hotel.com';
  private adminPassword = 'admin123';

  constructor() {}

  // Inicio de sesión para admin o clientes registrados
  login(usuario: Login): Observable<boolean> {

    // Validación de administrador
    if (usuario.email === this.adminEmail && usuario.contrasena === this.adminPassword) {

      const token = Buffer.from(
        `${usuario.email}:${usuario.contrasena}:admin`
      ).toString('base64');

      sessionStorage.setItem(this.tokenKey, token);

      // Guardar datos del administrador
      localStorage.setItem(
        'usuarioActual',
        JSON.stringify({
          id: 0,
          nombre: 'Administrador',
          email: this.adminEmail,
          contrasena: this.adminPassword,
          rol: 'admin',
        })
      );

      return of(true);
    }

    // Validación de clientes registrados
    const data = localStorage.getItem('usuarios');
    const usuarios: Usuario[] = data ? JSON.parse(data) : [];

    const encontrado = usuarios.find(
      (u) => u.email === usuario.email && u.contrasena === usuario.contrasena
    );

    if (encontrado) {
      const token = Buffer.from(
        `${encontrado.email}:${encontrado.contrasena}:${encontrado.rol}`
      ).toString('base64');

      sessionStorage.setItem(this.tokenKey, token);

      localStorage.setItem('usuarioActual', JSON.stringify(encontrado));

      return of(true);
    }

    return of(false);
  }

  isLogged(): Observable<boolean> {
    return of(sessionStorage.getItem(this.tokenKey) !== null);
  }

  getRol(): 'admin' | 'cliente' | null {
    const token = sessionStorage.getItem(this.tokenKey);
    if (!token) return null;

    const decoded = Buffer.from(token, 'base64').toString('ascii');
    return decoded.split(':')[2] as 'admin' | 'cliente';
  }

  logout() {
    sessionStorage.removeItem(this.tokenKey);
    localStorage.removeItem('usuarioActual');
  }

  getUsuarioActual() {
    const data = localStorage.getItem('usuarioActual');
    return data ? JSON.parse(data) : null;
  }

  estaLogueado(): boolean {
    return sessionStorage.getItem(this.tokenKey) !== null;
  }

  esAdmin(): boolean {
    const u = this.getUsuarioActual();
    return u && u.rol === 'admin';
  }

  esCliente(): boolean {
    const u = this.getUsuarioActual();
    return u && u.rol === 'cliente';
  }
}
