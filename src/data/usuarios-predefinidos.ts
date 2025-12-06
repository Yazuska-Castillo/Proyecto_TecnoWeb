import { Usuario } from 'src/app/models/usuario';

export const USUARIOS_PREDEFINIDOS: Usuario[] = [
  new Usuario(1,'Administrador', 'admin@hotel.com', 'admin123', 'admin'),
  new Usuario(2,'Juan Pérez', 'juan@gmail.com', '1234', 'cliente'),
  new Usuario(3,'Carla Flores', 'carla@gmail.com', '1111', 'cliente'),
];
