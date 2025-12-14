import { Hotel } from 'src/app/models/hotel';

export const HOTELES_PREDEFINIDOS: Hotel[] = [
  {
    id: 1,
    nombre: 'Hilton Arica',
    ubicacion: 'Arica',
    categoria: 5,
    habitaciones: 80,
    descripcion:
      'Hotel de lujo ubicado en la ciudad de Arica, con vista al mar, servicios premium, piscina, restaurante de alta categoría y atención personalizada para turistas y viajeros de negocios.',
    imagenes: [
      'assets/img/HotelesFotos/hotelaricauno.jpg',
      'assets/img/HotelesFotos/hotelaricados.jpg',
      'assets/img/HotelesFotos/hotelaricatres.jpg',
      'assets/img/HotelesFotos/hotelaricacuatro.jpg',
    ],
    mapaUrl:
      'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3784.250369474774!2d-70.3188671541723!3d-18.472315011106208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2scl!4v1763348487234!5m2!1ses-419!2scl',
  },
  {
    id: 2,
    nombre: 'Costa Pacífico',
    ubicacion: 'Iquique',
    categoria: 4,
    habitaciones: 65,
    descripcion:
      'Hotel moderno cercano a la costa de Iquique, ideal para familias y turistas. Cuenta con habitaciones amplias, desayuno incluido y fácil acceso a zonas comerciales.',
    imagenes: [
      'assets/img/HotelesFotos/hoteliquiqueuno.jpg',
      'assets/img/HotelesFotos/hoteliquiquedos.jpg',
      'assets/img/HotelesFotos/hoteliquiquetres.jpg',
      'assets/img/HotelesFotos/hoteliquiquecuatro.jpg',
    ],
    mapaUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.3298948746897!2d-70.3941277!3d-23.6283539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96afd52e0ca1a807%3A0x3424bce731d163f8!2sHotel%20Costa%20Pac%C3%ADfico%20-%20Express!5e0!3m2!1ses-419!2scl!4v1763363614599!5m2!1ses-419!2scl',
  },
  {
    id: 3,
    nombre: 'Atacama Inn',
    ubicacion: 'Antofagasta',
    categoria: 3,
    habitaciones: 40,
    descripcion:
      'Hotel acogedor ubicado en Antofagasta, pensado para estadías cómodas y accesibles. Ofrece servicios básicos, buena ubicación y atención cercana al cliente.',
    imagenes: [
      'assets/img/HotelesFotos/hotelAntofagastauno.jpg',
      'assets/img/HotelesFotos/hotelAntofagastados.jpg',
      'assets/img/HotelesFotos/hotelAntofagastatres.jpg',
      'assets/img/HotelesFotos/hotelAntofagastacuatro.jpg',
    ],
    mapaUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3663.4750784339667!2d-69.84617402353201!3d-23.334796853309847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96ae99ff1fdd918f%3A0xed2a121aefd9d0e6!2sHotel%20Atacama%20Inn!5e0!3m2!1ses-419!2scl!4v1763363656249!5m2!1ses-419!2scl',
  },
];
