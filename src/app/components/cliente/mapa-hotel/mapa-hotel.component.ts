import { Component, OnInit } from '@angular/core';
import { HotelesService } from 'src/app/services/hoteles.service';
import { Hotel } from 'src/app/models/hotel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mapa-hotel',
  templateUrl: './mapa-hotel.component.html',
  styleUrls: ['./mapa-hotel.component.css'],
})
export class MapaHotelComponent implements OnInit {
  hoteles: Hotel[] = [];
  hotelSeleccionado: Hotel | null = null;

  mapaUrl: SafeResourceUrl | null = null;
  descripcionActual = '';
  imagenesActuales: string[] = [];

  constructor(
    private hotelesService: HotelesService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.hoteles = this.hotelesService.obtenerHoteles();

    if (this.hoteles.length > 0) {
      this.seleccionarHotel(this.hoteles[0]);
    }
  }

  seleccionarHotel(hotel: Hotel): void {
    this.hotelSeleccionado = hotel;

    // 🗺️ mapa desde el modelo
    this.mapaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(hotel.mapaUrl);

    // 📝 descripción desde el modelo
    this.descripcionActual = hotel.descripcion;

    // 🖼️ imágenes desde el modelo
    this.imagenesActuales = hotel.imagenes;
  }

  getStarsArray(categoria: number): number[] {
    return Array(categoria).fill(0);
  }

  verHabitaciones(hotelId: number): void {
    this.router.navigate(['/cliente/habitaciones'], {
      queryParams: { hotelId },
    });
  }
}
