import { Injectable } from '@angular/core';
import { Login } from '../models/login';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario';
import { CryptoService } from './crypto.service';
import { UsuariosService } from './usuarios.service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'token';
  private SECRET_KEY = 'MiClaveSecreta';

  private adminEmail = 'admin@hotel.com';
  private adminPasswordHash = CryptoService.hashPassword('admin123');

  constructor(private usuariosService: UsuariosService) {}

  private crearToken(email: string, rol: string): string {
    const payload = JSON.stringify({
      email,
      rol,
      ts: Date.now(),
    });
    return CryptoJS.AES.encrypt(payload, this.SECRET_KEY).toString();
  }

  private leerToken(): any | null {
    const token = sessionStorage.getItem(this.tokenKey);
    if (!token) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(token, this.SECRET_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
      return null;
    }
  }

  login(login: Login): Observable<boolean> {
    const hash = CryptoService.hashPassword(login.contrasena);

    // ADMIN
    if (login.email === this.adminEmail && hash === this.adminPasswordHash) {
      const token = this.crearToken(login.email, 'admin');
      sessionStorage.setItem(this.tokenKey, token);
      return of(true);
    }

    // CLIENTE
    const usuarios = this.usuariosService.getUsuarios();
    const encontrado = usuarios.find(
      (u) => u.email === login.email && u.passwordHash === hash
    );

    if (!encontrado) return of(false);

    const token = this.crearToken(encontrado.email, encontrado.rol);
    sessionStorage.setItem(this.tokenKey, token);
    return of(true);
  }

  getEmailDesdeToken(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(token, 'MiClaveSecreta');
      const payload = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return payload.email ?? null;
    } catch {
      return null;
    }
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  estaLogueado(): boolean {
    return !!this.leerToken();
  }

  isLogged(): Observable<boolean> {
    return of(this.estaLogueado());
  }

  getRol(): 'admin' | 'cliente' | null {
    const data = this.leerToken();
    return data?.rol ?? null;
  }

  esAdmin(): boolean {
    return this.getRol() === 'admin';
  }

  esCliente(): boolean {
    return this.getRol() === 'cliente';
  }
}
