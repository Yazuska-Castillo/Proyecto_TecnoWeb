export const HABITACIONES = [
  {
    id: 1,
    nombre: 'Habitación Simple',
    descripcion: 'Cama individual, baño privado y TV.',
    precioPorNoche: 35000,
    servicios: ['Desayuno', 'Wifi'],
    imagen: 'assets/img/simple.jpg',
    hotel: 'Hilton Arica'   // 👈 CONECTADA AL HOTEL 1
  },
  {
    id: 2,
    nombre: 'Habitación Familiar',
    descripcion: 'Cama doble, sofá cama y vista al mar.',
    precioPorNoche: 55000,
    servicios: ['Desayuno', 'Wifi', 'Piscina'],
    imagen: 'assets/img/familiar.jpg',
    hotel: 'Hilton Arica'   // 👈 MISMO HOTEL (ejemplo)
  },
  {
    id: 3,
    nombre: 'Suite Ejecutiva',
    descripcion: 'Cama king, jacuzzi, minibar y terraza privada.',
    precioPorNoche: 95000,
    servicios: ['Desayuno', 'Wifi', 'Jacuzzi', 'Servicio a la habitación'],
    imagen: 'assets/img/suite.jpg',
    hotel: 'Costa Pacífico' // 👈 CONECTADA AL HOTEL 2
  },
];
