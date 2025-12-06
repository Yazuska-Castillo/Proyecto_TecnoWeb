import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { USUARIOS_PREDEFINIDOS } from '../../data/usuarios-predefinidos';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private key = 'usuarios';

  constructor() {
    const data = localStorage.getItem(this.key);

    // Si NO existen usuarios en localStorage, los cargamos
    if (!data) {
      console.log('Cargando usuarios predefinidos...');
      localStorage.setItem(this.key, JSON.stringify(USUARIOS_PREDEFINIDOS));
    }
  }

  getUsuarios(): Usuario[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  registrarUsuario(usuario: Usuario): boolean {
    const usuarios = this.getUsuarios();

    // verificar si ya existe un email igual
    if (usuarios.some((u) => u.email === usuario.email)) {
      return false;
    }

    usuarios.push(usuario);
    localStorage.setItem(this.key, JSON.stringify(usuarios));

    return true;
  }

  buscarUsuario(email: string, contrasena: string): Usuario | null {
    const usuarios = this.getUsuarios();
    return (
      usuarios.find(
        (u) => u.email === email && u.contrasena === contrasena
      ) ?? null
    );
  }
}
