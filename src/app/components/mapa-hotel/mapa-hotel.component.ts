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

  private mapasPorHotel: { [key: number]: string } = {
    1: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3784.250369474774!2d-70.3188671541723!3d-18.472315011106208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2scl!4v1763348487234!5m2!1ses-419!2scl',
    2: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3810.8!2d-70.1520!3d-20.2141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDEyJzUwLjgiUyA3MMKwMDknMDcuMiJX!5e0!3m2!1ses!2scl!4v1234567890',
    3: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3784.250369474774!2d-70.3188671541723!3d-18.472315011106208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2scl!4v1763348487234!5m2!1ses-419!2scl'
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
  }

  getStarsArray(categoria: number): number[] {
    return Array(categoria).fill(0);
  }
}