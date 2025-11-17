import { Usuario } from 'src/app/models/usuario';

export const USUARIOS_PREDEFINIDOS: Usuario[] = [
  new Usuario('Administrador', 'admin@hotel.com', 'admin123', 'admin'),
  new Usuario('Juan Pérez', 'juan@gmail.com', '1234', 'cliente'),
  new Usuario('Carla Flores', 'carla@gmail.com', '1111', 'cliente'),
];
