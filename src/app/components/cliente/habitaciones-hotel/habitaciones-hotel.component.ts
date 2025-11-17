import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from 'src/app/services/room.service';
import { HotelesService } from 'src/app/services/hoteles.service';
import { PromocionesService } from 'src/app/services/promociones.service';
import { Promo } from 'src/app/models/promo.model';

@Component({
  selector: 'app-habitaciones-hotel',
  templateUrl: './habitaciones-hotel.component.html',
  styleUrls: ['./habitaciones-hotel.component.css']
})
export class HabitacionesHotelComponent implements OnInit {

  hotelId!: number;
  hotel: any;
  habitaciones: any[] = [];
  personas = 1;
  promoActiva: Promo | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomsService: RoomsService,
    private hotelesService: HotelesService,
    private promocionesService: PromocionesService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.hotelId = +params['hotelId'];
      this.cargarDatos();
    });
    this.promoActiva = this.promocionesService.getMejorPromo();
  }

  cargarDatos() {
    this.hotel = this.hotelesService.obtenerHoteles()
      .find(h => h.id === this.hotelId);

    this.roomsService.getRooms().subscribe(rooms => {
      this.habitaciones = rooms.filter(
        r => r.hotel === this.hotel.nombre && r.status === 'Disponible'
      );
    });
  }

  seleccionarHabitacion(hab: any) {
    this.router.navigate(['/cliente/reserva'], {
      queryParams: {
        hotel: this.hotel.nombre,
        habitacion: hab.id,
        personas: this.personas
      }
    });
  }

  calcularPrecioConPromo(hab: any): number {
    return this.promocionesService.calcularPrecioConPromo(hab.pricePerNight);
  }


}
