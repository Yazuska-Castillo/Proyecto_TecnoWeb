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

  // Login admin o usuario registrado
  login(usuario: Login): Observable<boolean> {
    // Admin
    if (
      usuario.user === this.adminCreds.user &&
      usuario.password === this.adminCreds.password
    ) {
      const token = Buffer.from(
        `${usuario.user}:${usuario.password}:admin`
      ).toString('base64');

      sessionStorage.setItem(this.tokenKey, token);
      return of(true);
    }

    // Usuarios registrados
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
      return of(true);
    }

    return of(false);
  }

  // Verifica si hay sesión
  isLogged(): Observable<boolean> {
    return of(sessionStorage.getItem(this.tokenKey) !== null);
  }

  // Rol desde token
  getRol(): 'admin' | 'cliente' | null {
    const token = sessionStorage.getItem(this.tokenKey);
    if (!token) return null;

    const decoded = Buffer.from(token, 'base64').toString('ascii');
    return decoded.split(':')[2] as 'admin' | 'cliente';
  }

  // Cerrar sesión
  logout() {
    sessionStorage.removeItem(this.tokenKey);
  }
}
