export class Usuario {
  constructor(
    public nombre: string,
    public usuario: string,
    public contrasena: string,
    public rol: 'admin' | 'cliente' = 'cliente'
  ) {}
}
