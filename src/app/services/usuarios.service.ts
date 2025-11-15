import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { USUARIOS_PREDEFINIDOS } from '../../data/usuarios-predefinidos';
@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private key = 'usuarios';

  constructor() {
    // Cargar usuarios predefinidos SOLO si no existen
    if (!localStorage.getItem(this.key)) {
      const data = localStorage.getItem(this.key);
      console.log('Usuarios en local storage:', data);
      localStorage.setItem(this.key, JSON.stringify(USUARIOS_PREDEFINIDOS));
    }
  }

  getUsuarios(): Usuario[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  registrarUsuario(usuario: Usuario): boolean {
    const usuarios = this.getUsuarios();

    // verificar si ya existe
    if (usuarios.some((u) => u.usuario === usuario.usuario)) {
      return false;
    }

    usuarios.push(usuario);
    localStorage.setItem(this.key, JSON.stringify(usuarios));

    return true;
  }

  buscarUsuario(usuario: string, contrasena: string): Usuario | null {
    const usuarios = this.getUsuarios();

    return (
      usuarios.find(
        (u) => u.usuario === usuario && u.contrasena === contrasena
      ) ?? null
    );
  }
}
