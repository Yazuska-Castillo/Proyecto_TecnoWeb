import { Injectable } from '@angular/core';
import { Login } from '../models/login';
import { Observable, of } from 'rxjs';
import { Buffer } from 'buffer';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private adminCreds = new Login('admin', 'admin');
  private tokenKey = 'token';

  constructor() {}

  // Inicio de sesión para admin o cliente registrado
  login(usuario: Login): Observable<boolean> {
    // Validación de administrador
    if (
      usuario.user === this.adminCreds.user &&
      usuario.password === this.adminCreds.password
    ) {
      const token = Buffer.from(
        `${usuario.user}:${usuario.password}:admin`
      ).toString('base64');

      sessionStorage.setItem(this.tokenKey, token);

      // Guardar datos del administrador
      localStorage.setItem(
        'usuarioActual',
        JSON.stringify({
          nombre: 'Administrador',
          email: 'admin@hotel.com',
          rol: 'admin',
        })
      );

      return of(true);
    }

    // Validación de clientes registrados
    const data = localStorage.getItem('usuarios');
    const usuarios: Usuario[] = data ? JSON.parse(data) : [];

    const encontrado = usuarios.find(
      (u) => u.usuario === usuario.user && u.contrasena === usuario.password
    );

    if (encontrado) {
      const token = Buffer.from(
        `${encontrado.usuario}:${encontrado.contrasena}:${encontrado.rol}`
      ).toString('base64');

      sessionStorage.setItem(this.tokenKey, token);

      // Guardar usuario actual
      localStorage.setItem('usuarioActual', JSON.stringify(encontrado));

      return of(true);
    }

    return of(false);
  }

  // Indica si hay un usuario logueado
  isLogged(): Observable<boolean> {
    return of(sessionStorage.getItem(this.tokenKey) !== null);
  }

  // Obtiene el rol desde el token
  getRol(): 'admin' | 'cliente' | null {
    const token = sessionStorage.getItem(this.tokenKey);
    if (!token) return null;

    const decoded = Buffer.from(token, 'base64').toString('ascii');
    return decoded.split(':')[2] as 'admin' | 'cliente';
  }

  // Cierra la sesión
  logout() {
    sessionStorage.removeItem(this.tokenKey);
  }

  // Obtiene el usuario actual almacenado
  getUsuarioActual() {
    const data = localStorage.getItem('usuarioActual');
    return data ? JSON.parse(data) : null;
  }

  // Verifica si hay sesión activa
  estaLogueado(): boolean {
    return sessionStorage.getItem(this.tokenKey) !== null;
  }

  // Verifica si el usuario actual es administrador
  esAdmin(): boolean {
    const u = this.getUsuarioActual();
    return u && u.rol === 'admin';
  }

  // Verifica si el usuario actual es cliente
  esCliente(): boolean {
    const u = this.getUsuarioActual();
    return u && u.rol === 'cliente';
  }
}
