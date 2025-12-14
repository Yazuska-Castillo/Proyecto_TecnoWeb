import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { USUARIOS_PREDEFINIDOS } from '../../data/usuarios-predefinidos';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private key = 'usuarios';

  constructor() {
    const data = localStorage.getItem(this.key);

    if (!data) {
      const usuariosProtegidos = USUARIOS_PREDEFINIDOS.map((u) => ({
        id: u.id,
        nombre: u.nombre,
        email: CryptoService.encrypt(u.email),
        emailHash: CryptoService.hashPassword(u.email),
        rol: CryptoService.encrypt(u.rol),
        passwordHash: CryptoService.hashPassword('1234'),
      }));

      localStorage.setItem(this.key, JSON.stringify(usuariosProtegidos));
    }
  }

  getUsuarios(): Usuario[] {
    const data = localStorage.getItem(this.key);
    if (!data) return [];

    const usuarios = JSON.parse(data);

    return usuarios.map((u: any) => ({
      ...u,
      email: CryptoService.decrypt(u.email),
      rol: CryptoService.decrypt(u.rol),
    }));
  }

  registrarUsuario(usuario: Usuario): boolean {
    const data = localStorage.getItem(this.key);
    const usuarios = data ? JSON.parse(data) : [];

    const emailHash = CryptoService.hashPassword(usuario.email);

    if (usuarios.some((u: any) => u.emailHash === emailHash)) {
      return false;
    }

    usuarios.push({
      ...usuario,
      email: CryptoService.encrypt(usuario.email),
      emailHash: emailHash,
      rol: CryptoService.encrypt(usuario.rol),
    });

    localStorage.setItem(this.key, JSON.stringify(usuarios));
    return true;
  }

  buscarUsuarioPorEmail(email: string): Usuario | null {
    const usuarios = this.getUsuarios();
    return usuarios.find((u) => u.email === email) ?? null;
  }
  actualizarUsuario(usuarioActualizado: Usuario): void {
    const data = localStorage.getItem(this.key);
    if (!data) return;

    const usuarios = JSON.parse(data);

    const index = usuarios.findIndex(
      (u: any) => CryptoService.decrypt(u.email) === usuarioActualizado.email
    );

    if (index !== -1) {
      usuarios[index] = {
        ...usuarios[index],
        nombre: usuarioActualizado.nombre,
        passwordHash: usuarioActualizado.passwordHash,
      };

      localStorage.setItem(this.key, JSON.stringify(usuarios));
    }
  }

  eliminarUsuarioPorEmail(email: string): void {
    const usuarios = this.getUsuarios().filter((u) => u.email !== email);
    localStorage.setItem(this.key, JSON.stringify(usuarios));
  }
}
