import { Component, OnInit } from '@angular/core';
import { HotelesService } from 'src/app/services/hoteles.service';
import { Hotel } from 'src/app/models/hotel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface HotelConMapa extends Hotel {
  mapaUrl?: string;
}

@Component({
  selector: 'app-mapa-hotel',
  templateUrl: './mapa-hotel.component.html',
  styleUrls: ['./mapa-hotel.component.css']
})
export class MapaHotelComponent implements OnInit {
  hoteles: HotelConMapa[] = [];
  hotelSeleccionado: HotelConMapa | null = null;
  mapaUrl: SafeResourceUrl | null = null;
  descripcionActual: string = '';
  imagenesActuales: string[] = [];

  private mapasPorHotel: { [key: number]: string } = {
    1: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3784.250369474774!2d-70.3188671541723!3d-18.472315011106208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2scl!4v1763348487234!5m2!1ses-419!2scl',
    2: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.3298948746897!2d-70.3941277!3d-23.6283539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96afd52e0ca1a807%3A0x3424bce731d163f8!2sHotel%20Costa%20Pac%C3%ADfico%20-%20Express!5e0!3m2!1ses-419!2scl!4v1763363614599!5m2!1ses-419!2scl',
    3: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3663.4750784339667!2d-69.84617402353201!3d-23.334796853309847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96ae99ff1fdd918f%3A0xed2a121aefd9d0e6!2sHotel%20Atacama%20Inn!5e0!3m2!1ses-419!2scl!4v1763363656249!5m2!1ses-419!2scl'
  };

  private infoHoteles: { [key: number]: any } = {
    1: {
      descripcion: 'Ubicado frente a las playas de Arica, nuestro hotel ofrece vistas espectaculares del océano Pacífico. A solo 3 kilómetros del centro de la ciudad, disfrute de nuestra piscina climatizada con vista al mar, servicio de transporte gratuito al Morro de Arica y restaurante con especialidades en pescados y mariscos frescos de la región. El wifi es gratuito en todas las instalaciones. Nuestras habitaciones cuentan con aire acondicionado, minibar y balcón privado. Ideal para turistas y viajeros de negocios que buscan comodidad y una ubicación privilegiada en la ciudad de la eterna primavera.',
      imagenes: [
        'assets/img/HotelesFotos/hotelaricados.jpg',
        'assets/img/HotelesFotos/hotelaricauno.jpg',
        'assets/img/HotelesFotos/hotelaricatres.jpg',
        'assets/img/HotelesFotos/hotelaricacuatro.jpg'
      ]
    },
    2: {
      descripcion: 'Situado a cinco minutos a pie de la playa Cavancha en el corazón de Iquique, ofrecemos una experiencia única con vistas panorámicas al océano desde nuestra piscina en la azotea. El casino Dreams está justo cruzando la calle y el centro comercial Mallplaza a menos de un kilómetro. Nuestro restaurante sirve cocina internacional con enfoque en platos locales y peruanos para desayuno, almuerzo y cena. Disfrute de actividades como surf, parapente y visitas a la zona franca. Todas las habitaciones incluyen wifi gratuito, TV por cable y baño privado con artículos de aseo de cortesía.',
      imagenes: [
        'assets/img/HotelesFotos/hoteliquiqueuno.jpg',
        'assets/img/HotelesFotos/hoteliquiquedos.jpg',
        'assets/img/HotelesFotos/hoteliquiquetres.jpg',
        'assets/img/HotelesFotos/hoteliquiquecuatro.jpg'
      ]
    },
    3: {
      descripcion: 'Estratégicamente ubicado en Antofagasta, entre el desierto de Atacama y el océano Pacífico, nuestro hotel es el punto de partida perfecto para explorar maravillas naturales como La Portada y las Ruinas de Huanchaca. A solo 15 minutos del Aeropuerto Cerro Moreno, ofrecemos habitaciones espaciosas con vista al mar o a la ciudad, piscina exterior, gimnasio completamente equipado y estacionamiento gratuito. Nuestro restaurante ofrece una selección de platos chilenos e internacionales, destacando los mariscos frescos del puerto local. Perfecto para viajeros de negocios y turistas que buscan explorar la región minera y sus atractivos naturales.',
      imagenes: [
        'assets/img/HotelesFotos/hotelAntofagastauno.jpg',
        'assets/img/HotelesFotos/hotelAntofagastados.jpg',
        'assets/img/HotelesFotos/hotelAntofagastatres.jpg',
        'assets/img/HotelesFotos/hotelAntofagastacuatro.jpg'
      ]
    }
  };

  constructor(
    private hotelesService: HotelesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const hotelesBase = this.hotelesService.obtenerHoteles();
    this.hoteles = hotelesBase.map(hotel => ({
      ...hotel,
      mapaUrl: this.mapasPorHotel[hotel.id]
    }));

    if (this.hoteles.length > 0) {
      this.seleccionarHotel(this.hoteles[0]);
    }
  }

  seleccionarHotel(hotel: HotelConMapa) {
    this.hotelSeleccionado = hotel;
    if (hotel.mapaUrl) {
      this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(hotel.mapaUrl);
    }
    
    this.descripcionActual = this.infoHoteles[hotel.id]?.descripcion || '';
    this.imagenesActuales = this.infoHoteles[hotel.id]?.imagenes || [];
  }

  getStarsArray(categoria: number): number[] {
    return Array(categoria).fill(0);
  }
}